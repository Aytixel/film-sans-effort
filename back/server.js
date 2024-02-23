require("dotenv").config();

const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));

// const mdp bdd
const passwordBDD = process.env['MDP_BDD'];

// Connexion bdd
const { MongoClient, ServerApiVersion } = require('mongodb');
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
    } finally {
        // Ensures that the client will close when you finish/error
        await client.close();
    }
}
run().catch(console.dir);

// Suite du code

class MoviesService {

    constructor() {
        console.log('Charge MoviesService...');
        this.url = 'https://api.themoviedb.org/3/';
        this.apiKey = process.env['NG_APP_TMDB_API_KEY'];
        this.language = 'fr';
    }

    async searchMovies(searchStr) {
        //return this.http.get(`${this.url}search/movie?api_key=${this.apiKey}&query=${searchStr}&language=${this.language}`);
        const response = await fetch(`${this.url}search/movie?api_key=${this.apiKey}&query=${searchStr}&language=${this.language}`);
        return response.json();
    }

    async getMoviesByGenre(id) {
        //return this.http.get(`${this.url}genre/${id}/movies?api_key=${this.apiKey}&language=${this.language}`);
        const response = await fetch(this.http.get(`${this.url}genre/${id}/movies?api_key=${this.apiKey}&language=${this.language}`));
        return response.json();
    }

    async getMoviesByActors(id) {
        //return this.http.get(`${this.url}search/movie?query=${id}&api_key=${this.apiKey}&language=${this.language}`);
        const response = await fetch(`${this.url}search/movie?query=${id}&api_key=${this.apiKey}&language=${this.language}`);
        return response.json();
    }

    async getMoviesByRealisators(id) {
        //return this.http.get(`${this.url}search/movie?query=${id}&api_key=${this.apiKey}&language=${this.language}`);
        const response = await fetch(`${this.url}search/movie?query=${id}&api_key=${this.apiKey}&language=${this.language}`);
        return response.json();
    }
}

const api = new MoviesService();

const express = require('express');

const cors = require('cors');

const app = express(),
    port = 3080;

app.use(cors());

app.get("/searchmovie", (req, res) => {
    res.json(api.searchMovies());
});

app.get("/searchgenre", (req, res) => {
    res.json(api.getMoviesByGenre());
});

app.get("/searchactor", (req, res) => {
    res.json(api.getMoviesByActor());
});

app.get("/searchreal", (req, res) => {
    res.json(api.getMoviesByRealisators());
});


app.listen(port, () => {
    console.log('Server is running on port 3080');
})