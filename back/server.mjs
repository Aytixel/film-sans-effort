import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import MoviesService from './movies-service.mjs';

dotenv.config();

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