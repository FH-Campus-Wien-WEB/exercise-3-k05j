const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const { parseMovies } = require('./movie-model.js');
const fs = require('fs/promises')

const app = express();

app.use(bodyParser.json()); 
app.use(express.static(path.join(__dirname, 'files')));

app.get('/movies', async function (req, res) {
  try {
    const genreFilter = req.query.genre

    if (genreFilter) {
      const movies = await parseMovies()
      const filteredMovies = movies.filter(movie => movie.genres && movie.genres.includes(genreFilter))
      res.status(200).send(filteredMovies)
      return
    }

    const movies = await parseMovies()
    res.status(200).send(movies)
  } catch (err) {
    console.error(err)
    res.status(500).send("Error retrieving movies")
  }
})

app.get('/genres', async function (req, res) {
  try {
    const movies = await parseMovies()
    const genres = new Set()
    movies.forEach(movie => {
      if (movie.genres) {
        movie.genres.forEach(g => genres.add(g.trim()))
      }
    })
    res.status(200).send(Array.from(genres).sort())
  } catch (err) {
    console.error(err)
    res.status(500).send('Error retrieving genres');
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

