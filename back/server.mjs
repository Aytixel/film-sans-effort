import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import { MongoClient, ServerApiVersion, ObjectId } from "mongodb";
import MoviesService from "./movies-service.mjs";
import { getFavoritePipeline } from "./pipeline.mjs";

// .env setup
dotenv.config();

// mongodb setup
const db_user = process.env['DB_USER'];
const db_password = process.env['DB_PWD'];
const db_host = process.env['DB_HOST'];
const db_url = `mongodb+srv://${db_user}:${db_password}@${db_host}/?retryWrites=true&w=majority&appName=Cluster0`;
const client = new MongoClient(db_url, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

await client.connect();
await client.db("admin").command({ ping: 1 });

console.log("MongoDB connected !");

const database = client.db("FilmSansEffortDB");
const movie_collection = database.collection("movie");
const user_collection = database.collection("user");

// express setup
const app = express();
const port = 3080;

// application setup
const api = new MoviesService();
const movies_in_db = new Set();

app.use(cors());

app.listen(port, () => {
    console.log('Server is running on port http://localhost:' + port);
})

async function setFavorite(req, res, action) {
    if (req.query.user_id == null) {
        res.status(400).json({ error: "User id not provided" });
        return;
    }

    try {
        const _id = new ObjectId(req.query.user_id);
        const update = {};

        update[action] = { favorite: +req.params.movie_id };

        try {
            await user_collection.updateOne({ _id }, update);

            res.status(200).end();
        } catch {
            res.status(500).json({ error: "User might not exist" });
        }
    } catch {
        res.status(400).json({ error: "Malformed user id" });
    }
}

// ajoute un film en favori
app.post("/movie/favorite/:movie_id", (req, res) => setFavorite(req, res, "$addToSet"));

// supprime un film des favoris
app.delete("/movie/favorite/:movie_id", (req, res) => setFavorite(req, res, "$pull"));

// récupère les favoris
app.get("/movie/favorite", async (req, res) => {
    if (req.query.user_id == null) {
        res.status(400).json({ error: "User id not provided" });
        return;
    }

    try {
        const pipeline = getFavoritePipeline(new ObjectId(req.query.user_id));

        try {
            const movies = await user_collection.aggregate(pipeline).toArray();

            res.json(movies.map(movie => ({
                id: movie._id,
                title: movie.title,
                poster: movie.poster,
                favorite: true,
            })));
        } catch {
            res.status(500).json({ error: "Internal error : query failed" });
        }
    } catch {
        res.status(400).json({ error: "Malformed user id" });
    }
});

// recherche un film
app.get("/movie/find/:query/:page?", async (req, res) => {
    const movies = await api.findMovies(req.params.query, req.params.page);
    const date = Date.now();

    // filtre les films sortient au cinéma
    movies.results = movies.results.filter(movie => new Date(movie.release_date) < date);

    const movies_results = movies.results;

    try {
        if (req.query.user_id == null)
            throw null;

        // récupère les favoris
        const favorite = (await user_collection.findOne({ _id: new ObjectId(req.query.user_id) })).favorite;

        movies.results = movies_results.map(movie => ({
            id: movie.id,
            title: movie.title,
            poster: movie.poster_path,
            favorite: favorite.includes(movie.id),
        }));
    } catch {
        movies.results = movies_results.map(movie => ({
            id: movie.id,
            title: movie.title,
            poster: movie.poster_path,
            favorite: false,
        }));
    }

    res.json(movies);

    try {
        // récupère les films déjà dans la base de données
        (await movie_collection
            .find({ _id: { $in: movies_results.map(movie => movie.id) } })
            .project({ _id: 1 })
            .toArray())
            .forEach(movie => movies_in_db.add(movie._id))

        const movies_to_insert = await Promise.all(
            movies_results
                // filtre les films déjà été ajouter
                .filter(movie => !movies_in_db.has(movie.id))
                // récupère la liste de l'équipe pour le film
                .map(movie => (async () => ({
                    _id: movie.id,
                    title: movie.title,
                    poster: movie.poster_path,
                    genre: movie.genre_ids,
                    staff: (await api.getMovieStaff(movie.id)).map(staff => staff.id)
                }))())
        );

        if (movies_to_insert.length)
            await movie_collection.insertMany(movies_to_insert);
    } catch (error) {
        console.error(error);
    }
});