const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const { parseMovies } = require('./movie-model.js');
const fs = require('fs/promises')

const app = express();

app.use(bodyParser.json()); 
app.use(express.static(path.join(__dirname, 'files')));

// Configure a 'get' endpoint for all movies..
app.get('/movies', async function (req, res) {
  try {
    const movies = await parseMovies()
    res.status(200).send(movies)
  } catch (err) {
    console.error(err)
    res.status(500).send("Error retrieving movies")
  }
})

app.get('/movies/:imdbID', async function (req, res) {
  const movies = await parseMovies()
  const movie = movies.find(m => m.imdbID === req.params.imdbID)
  if (movie) {
    res.status(200).send(movie)
  } else {
    res.sendStatus(404)
  }
})

app.put('/movies/:imdbID', async function (req, res) {
  const imdbID = req.params.imdbID
  const updatedMovie = req.body
  const movies = await parseMovies()
  const index = movies.findIndex(m => m.imdbID === imdbID)
  if (index !== -1) {
    movies[index] = updatedMovie
    await fs.writeFile(path.join(__dirname, 'movie-data', encodeURI(updatedMovie.imdbID) + '.json'), JSON.stringify(updatedMovie, null, 2), 'utf-8')
    res.sendStatus(204)
  } else {
    movies.push(updatedMovie)
    await fs.writeFile(path.join(__dirname, 'movie-data', encodeURI(updatedMovie.imdbID) + '.json'), JSON.stringify(updatedMovie, null, 2), 'utf-8')
    res.sendStatus(201)
  }
})

app.listen(3000)

console.log("Server now listening on http://localhost:3000/")

