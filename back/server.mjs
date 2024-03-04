import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import { MongoClient, ServerApiVersion } from "mongodb";
import MoviesService from "./movies-service.mjs";

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
let movies_in_db = []

app.use(cors());

app.listen(port, () => {
    console.log('Server is running on port http://localhost:' + port);
})

// ajoute un film en favori
app.post("/movie/favorite/:movie_id", (req, res) => {
    // pas fini
    res.status(200);
});

// recherche des films
app.get("/movie/find/:query/:page?", async (req, res) => {
    const movies = await api.findMovies(req.params.query, req.params.page);

    res.json(movies);

    // récupère les films déjà dans la base de données
    movies_in_db = movies_in_db.concat(
        (await movie_collection
            .find({ _id: { $in: movies.results.map(movie => movie.id) } })
            .project({_id: 1})
            .toArray())
            .map(movie => movie._id)
            .filter(id => !movies_in_db.includes(id))
    );

    const date = Date.now();
    const movies_to_insert = await Promise.all(
        movies.results
            // filtre si les films ont déjà été ajouter et si ils sont sortient au cinéma
            .filter(movie => !movies_in_db.includes(movie.id) && new Date(movie.release_date) < date)
            // récupère la liste de l'équipe pour le film
            .map(movie => (async () => ({
                _id: movie.id,
                title: movie.title,
                poster: movie.poster_path,
                staff: (await api.getMovieStaff(movie.id)).map(staff => staff.id)
            }))())
    );

    if (movies_to_insert.length) {
        try {
            await movie_collection.insertMany(movies_to_insert);
        } catch (error) {
            console.error(error);
        }
    }
});