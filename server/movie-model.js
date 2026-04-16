const fs = require('fs/promises')
const path = require('path');

class MovieModel {
   constructor(
      imdbID,
      title,
      released,
      runtime,
      genres,
      directors,
      writers,
      actors,
      plot,
      poster,
      metascore,
      imdbRating
   ) {
      this.imdbID = imdbID
      this.title = title
      this.released = released
      this.runtime = parseInt(runtime)
      this.genres = genres
      this.directors = directors
      this.writers = writers
      this.actors = actors
      this.plot = plot
      this.poster = poster
      this.metascore = parseInt(metascore)
      this.imdbRating = parseFloat(imdbRating)
   }
}

async function parseMovies() {
   const movieFiles = await fs.readdir(path.join(__dirname, 'movie-data'))
   const movies = []
   for (const file of movieFiles) {
      const movieData = await fs.readFile(path.join(__dirname, 'movie-data', file), 'utf-8', { flag: 'r' })
      const { imdbID, title, released, runtime, genres, directors, writers, actors, plot, poster, metascore, imdbRating } = JSON.parse(movieData)
      movies.push(new MovieModel(imdbID, title, released, runtime, genres, directors, writers, actors, plot, poster, metascore, imdbRating))
   }
   return movies.sort((a, b) => new Date(a.released).getTime() - new Date(b.released).getTime())   // I want oldest first
}

module.exports = { MovieModel, parseMovies }