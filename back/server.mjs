import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import MoviesService from './movies-service.mjs';

dotenv.config();

// const mdp bdd
const passwordBDD = process.env['MDP_BDD'];

// Connexion bdd
const { MongoClient, ServerApiVersion } = await import('mongodb');
const uri = `mongodb+srv://dbFilm:${passwordBDD}@cluster0.44yksnh.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;
// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});
async function run() {
    try {
        // Connect the client to the server	(optional starting in v4.7)
        await client.connect();
        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");

        const database = client.db("FilmSansEffortDB");
        const movies = database.collection("FilmCollect");

        // Exemple de données à insérer
        const movie = {
            _id: 299536,
            title: "Avengers: Infinity War",
            image: "/mDfJG3LC3Dqb67AZ52x3Z0jU0uB.jpg",
            staffs: ["Bruce Banner", "Tony Stark", "Steve Rogers", "Natasha Romanoff"]
        };

        // Insérer un document dans la collection
        //const result = await movies.insertOne(movie);
        //console.log(`A document was inserted with the _id: ${result.insertedId}`);
    } finally {
        // Ensures that the client will close when you finish/error
        await client.close();
    }
}
run().catch(console.dir);

const app = express();
const port = 3080;
const api = new MoviesService();

app.use(cors());

app.get("/movie/find/:query/:page?", async (req, res) => {
    res.json(await api.findMovies(req.params.query, req.params.page));
});

app.get("/movie/genre/:genre", async (req, res) => {
    res.json(await api.getMoviesByGenre(req.params.genre));
});

app.get("/movie/staff/:name/:page?", async (req, res) => {
    res.json(await api.getMovieByStaff(req.params.name, req.params.page));
});


app.listen(port, () => {
    console.log('Server is running on port http://localhost:' + port);
})