import dotenv from "dotenv";
import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import { MongoClient, ServerApiVersion, ObjectId } from "mongodb";
import MoviesService from "./movies-service.mjs";
import { getFavoritePipeline, getRecommendationPipeline } from "./pipeline.mjs";
import Password from "./password.mjs";

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
app.use(bodyParser.json())

app.listen(port, () => {
    console.log('Server is running on port http://localhost:' + port);
})

async function addUnknownMoviesToDB(movies_results) {
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
}

async function addFavoriteMovies(user_id, movies_results) {
    try {
        if (user_id == null)
            throw null;

        // récupère les favoris
        const favorite = (await user_collection.findOne({ _id: new ObjectId(user_id) })).favorite;

        return movies_results.map(movie => ({
            id: movie.id,
            title: movie.title,
            poster: movie.poster_path,
            favorite: favorite.includes(movie.id),
        }));
    } catch {
        return movies_results.map(movie => ({
            id: movie.id,
            title: movie.title,
            poster: movie.poster_path,
            favorite: false,
        }));
    }
}

// recherche film populaire
app.get("/movie/popular", async (req, res) => {
    const movies = await api.findPopularMovies();
    const date = Date.now();

    // filtre les films sortient au cinéma
    movies.results = movies.results.filter(movie => new Date(movie.release_date) < date);
    
    const movies_results = movies.results;

    res.json(await addFavoriteMovies(req.query.user_id, movies_results));

    addUnknownMoviesToDB(movies_results);
});

// recherche film récent
app.get("/movie/recent", async (req, res) => {
    const movies = await api.findRecentMovies();
    const date = Date.now();

    // filtre les films sortient au cinéma
    movies.results = movies.results.filter(movie => new Date(movie.release_date) < date);
    
    const movies_results = movies.results;

    res.json(await addFavoriteMovies(req.query.user_id, movies_results));

    addUnknownMoviesToDB(movies_results);
});

// recherche un film
app.get("/movie/find/:query/:page?", async (req, res) => {
    const movies = await api.findMovies(req.params.query, req.params.page);
    const date = Date.now();

    // filtre les films sortient au cinéma
    movies.results = movies.results.filter(movie => new Date(movie.release_date) < date);

    const movies_results = movies.results;

    movies.results = await addFavoriteMovies(req.query.user_id, movies_results);

    res.json(movies);

    addUnknownMoviesToDB(movies_results);
});

app.get("/movie/recommendation/:page", async (req, res) => {
    if (req.query.user_id == null) {
        res.json({ error: "Id utilisateur non fournit" });
        return;
    }

    if (+req.params.page < 1)
        req.params.page = 1;

    try {
        const pipeline = getRecommendationPipeline(new ObjectId(req.query.user_id));

        try {
            const movies = await user_collection.aggregate(pipeline).skip((req.params.page - 1) * 20).limit(20).toArray();

            res.json(movies.map(movie => ({
                id: movie._id,
                title: movie.title,
                poster: movie.poster,
                favorite: movie.favorite,
            })));
        } catch {
            res.json({ error: "Erreur interne : utilisateur inexistant." });
        }
    } catch {
        res.json({ error: "Id utilisateur non conforme." });
    }
});

async function setFavorite(req, res, action) {
    if (req.query.user_id == null) {
        res.json({ error: "Id utilisateur non fournit." });
        return;
    }

    try {
        const _id = new ObjectId(req.query.user_id);
        const update = {};

        update[action] = { favorite: +req.params.movie_id };

        try {
            await user_collection.updateOne({ _id }, update);

            res.end();
        } catch {
            res.json({ error: "Erreur interne : utilisateur inexistant." });
        }
    } catch {
        res.json({ error: "Id utilisateur non conforme." });
    }
}

// ajoute un film en favori
app.post("/movie/favorite/:movie_id", (req, res) => setFavorite(req, res, "$addToSet"));

// supprime un film des favoris
app.delete("/movie/favorite/:movie_id", (req, res) => setFavorite(req, res, "$pull"));

// récupère les favoris
app.get("/movie/favorite", async (req, res) => {
    if (req.query.user_id == null) {
        res.json({ error: "Id utilisateur non fournit" });
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
            res.json({ error: "Erreur interne : erreur de la requête à la base de données." });
        }
    } catch {
        res.json({ error: "Id utilisateur non conforme." });
    }
});

app.post("/auth/signin", async (req, res) => {
    try {
        const errors = {};
        let user_id;

        if (typeof req.body?.username === "string" && req.body.username.length) {
            try {
                if (await user_collection.countDocuments({ username: req.body.username }) == 0)
                    errors.username = "Impossible de trouver le nom d''utilisateur.";
            } catch {
                errors.username = "Impossible de trouver le nom d''utilisateur.";
            }
        } else {
            errors.username = "Entrez un nom d'utilisateur.";
        }

        if (typeof req.body?.password === "string" && req.body.password.length > 6) {
            try {
                const user = await user_collection.findOne({ username: req.body.username });

                user_id = user._id;

                if (!await Password.compare(req.body.password, user.password))
                    errors.password = "Mot de passe incorrect.";
            } catch {
                errors.password = "Impossible vérifier le mot de passe.";
            }
        } else {
            errors.password = "Entrez un mot de passe valide.";
        }

        if (errors.username || errors.password) {
            res.json({ errors });
            return;
        }

        res.json({ user_id });
    } catch {
        res.json({ error: "Impossible de trouver l'utilisateur." });
    }
});

app.post("/auth/signup", async (req, res) => {
    try {
        const errors = {};

        if (typeof req.body?.username === "string" && req.body.username.length) {
            try {
                if (await user_collection.countDocuments({ username: req.body.username }) >= 1)
                    errors.username = "Nom d'utilisateur déjà utiliser.";
            } catch {
                errors.username = "Impossible de vérifier si le nom d'utilisateur est déjà utiliser.";
            }
        } else {
            errors.username = "Entrez un nom d'utilisateur.";
        }

        if (typeof req.body?.password === "string" && req.body.password.length > 6) {
            if (!(typeof req.body?.confirmation === "string" && req.body.confirmation == req.body.password))
                errors.confirmation = "Confirmation du mot de passe incorrect.";
        } else {
            errors.password = "Entrez un mot de passe valide.";
        }

        if (errors.username || errors.password || errors.confirmation) {
            res.json({ errors });
            return;
        }

        const result = await user_collection.insertOne({
            username: req.body.username,
            password: await Password.hash(req.body.password),
            favorite: []
        });

        res.json({ user_id: result.insertedId });
    } catch {
        res.json({ error: "Impossible de créer l'utilisateur." });
    }
});

app.post("/auth/delete", async (req, res) => {
    if (typeof req.body?.password === "string" && req.body.password.length > 6) {
        try {
            if (typeof req.body?.user_id !== "string")
                throw undefined;

            const _id = new ObjectId(req.body.user_id);
            const user = await user_collection.findOne({ _id });

            if (await Password.compare(req.body.password, user.password)) {
                try {
                    await user_collection.deleteOne({ _id });
                } catch {
                    res.json({ error: "Impossible de supprimer l'utilisateur." });
                }

                res.json({});
            } else {
                res.json({ error: "Mot de passe incorrect." });
            }
        } catch {
            res.json({ error: "Impossible de trouver l'utilisateur." });
        }
    } else {
        res.json({ error: "Entrez un mot de passe valide." });
    }
});

app.post("/auth/ping", async (req, res) => {
    try {
        if (typeof req.body?.user_id !== "string")
            throw undefined;

        if (await user_collection.countDocuments({ _id: new ObjectId(req.body.user_id) }) == 0)
            throw undefined;

        res.json({});
    } catch {
        res.json({ error: "Itilisateur inexistant." });
    }
});