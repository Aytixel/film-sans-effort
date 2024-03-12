import dotenv from "dotenv";
import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import { MongoClient, ServerApiVersion, ObjectId } from "mongodb";
import MoviesService from "./movies-service.mjs";
import { getFavoritePipeline } from "./pipeline.mjs";
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
                genre: movie.genre_ids,
                favorite: true,
            })));
        } catch {
            res.json({ error: "Erreur interne : erreur de la requête à la base de données." });
        }
    } catch {
        res.json({ error: "Id utilisateur non conforme." });
    }
});

// recherche des film par le genre id ( avec un numéro de page random )
app.get("/movie/genre/:genreId", async (req, res) => {
    const genreId = req.params.genreId;
    // Générer un numéro de page aléatoire entre 1 et 500
    const page = Math.floor(Math.random() * 500) + 1;

    if (!genreId) {
        res.status(400).json({ error: "ID du genre non fourni." });
        return;
    }

    try {
        const movies = await api.findMovieByGenreId(genreId, page);

        if (!movies || movies.results.length === 0) {
            res.status(404).json({ error: "Aucun film trouvé pour ce genre." });
            return;
        }

        // Logique pour marquer les films comme favoris si un user_id est fourni
        let favorites = [];
        if (req.query.user_id) {
            try {
                const user = await user_collection.findOne({ _id: new ObjectId(req.query.user_id) });
                favorites = user.favorite || [];
            } catch {
                // Gérer l'erreur ou ignorer si l'utilisateur n'est pas trouvé
            }
        }

        res.json(movies.results.map(movie => ({
            id: movie.id,
            title: movie.title,
            poster: movie.poster_path,
            genre: movie.genre_ids,
            favorite: favorites.includes(movie.id), // Marque le film comme favori si son ID est dans la liste des favoris
        })));
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Erreur interne lors de la recherche des films par genre." });
    }
});


// recherche un film par l'id
app.get("/movie/:id", async (req, res) => {
    const movieId = req.params.id;

    if (!movieId) {
        res.json({ error: "ID du film non fourni." });
        return;
    }

    try {
        const movie = await api.findMovieById(movieId);

        if (!movie) {
            res.json({ error: "Film non trouvé." });
            return;
        }

        // Vérifie si le film est en favori
        let isFavorite = false;
        if (req.query.user_id) {
            try {
                const user = await user_collection.findOne({ _id: new ObjectId(req.query.user_id) });
                isFavorite = user.favorite.includes(parseInt(movieId));
            } catch {
                // Si l'utilisateur n'est pas trouvé ou une autre erreur se produit, isFavorite reste false
            }
        }

        const movieResponse = {
            id: movie.id,
            title: movie.title,
            poster: movie.poster_path,
            genre: movie.genres,
            favorite: isFavorite,
        };

        res.json(movieResponse);
    } catch (error) {
        res.json({ error: "Erreur interne lors de la recherche du film." });
    }
});

// recherche film populaire
app.get("/movie/popular/:page?", async (req, res) => {
    const page = req.params.page || 1;

    try {
        const movies = await api.findPopularMovie();

        if (!movies || movies.results.length === 0) {
            res.json({ error: "Aucun film populaire trouvé." });
            return;
        }

        // Logique pour marquer les films comme favoris si un user_id est fourni
        let favorites = [];
        if (req.query.user_id) {
            try {
                const user = await user_collection.findOne({ _id: new ObjectId(req.query.user_id) });
                favorites = user.favorite || [];
            } catch {
                // Gérer l'erreur ou ignorer si l'utilisateur n'est pas trouvé
            }
        }

        res.json(movies.results.map(movie => ({
            id: movie.id,
            title: movie.title,
            poster: movie.poster_path,
            genre: movie.genre_ids,
            favorite: favorites.includes(movie.id), // Marque le film comme favori si son ID est dans la liste des favoris
        })));
    } catch (error) {
        console.error(error);
        res.json({ error: "Erreur interne lors de la recherche des films populaires." });
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