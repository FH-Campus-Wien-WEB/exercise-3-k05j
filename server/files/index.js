let movies = []
window.onload = function () {
    const xhr = new XMLHttpRequest()
    xhr.onload = function () {
        const moviesElement = document.querySelector(".moviesList")
        moviesElement.innerHTML = ""    // as soon as the request is done, remove the spinner
        if (xhr.status == 200) {
            movies = JSON.parse(xhr.responseText)
            movies.forEach(movie => {
                const movieElement = document.createElement("article")
                movieElement.classList.add("movie")

                movieElement.innerHTML = `
                      <img src="${movie.poster}" alt="Poster of '${movie.title}'" class="movie-poster">
                      <hr />
                      <p class="movie-title">${movie.title}</p>
                      <p class="movie-plot">${movie.plot}</p>
                      <button class="button show-details-button" onclick="showDetails(${movies.indexOf(movie)})">Show details</button>
                  `
                moviesElement.append(movieElement)
            })
        } else {
            moviesElement.append("Daten konnten nicht geladen werden, Status " + xhr.status + " - " + xhr.statusText)
        }
    }
    xhr.open("GET", "/movies")
    xhr.send()
}

function showDetails(index) {
    const detailsElement = document.querySelector("#movieDetails")
    const movieList = document.querySelector("#movieList")

    const movie = movies[index]
    const releasedDate = new Date(movie.released).toLocaleDateString("de-AT", { year: "numeric", month: "long", day: "numeric" })
    const genreTags = movie.genres.map(g => `<span class="genre">${g.trim()}</span>`).join(" ")

    // dl is a description list, dt is the title and dd is the description, it is used here to display the movie details in a structured way
    detailsElement.innerHTML = `
          <article class="detail-container" id="${movie.imdbID}">
              <img src="${movie.poster}" alt="Poster of '${movie.title}'" class="detail-poster">
              <div class="detail-info">
                  <h2>${movie.title}</h2>
                  <dl>
                      <dt>Released</dt>
                      <dd>${releasedDate}</dd>
                      <dt>Runtime</dt>
                      <dd>${movie.runtime} min</dd>
                      <dt>Genres</dt>
                      <dd>${genreTags}</dd>
                      <dt>Directors</dt>
                      <dd>${movie.directors.join(", ")}</dd>
                      <dt>Writers</dt>
                      <dd>${movie.writers.join(", ")}</dd>
                      <dt>Actors</dt>
                      <dd>${movie.actors.join(", ")}</dd>
                      <dt>Metascore</dt>
                      <dd>${movie.metascore}</dd>
                      <dt>IMDb Rating</dt>
                      <dd>${movie.imdbRating}</dd>
                      <dt>Plot</dt>
                      <dd>${movie.plot}</dd>
                  </dl>
                  <div class="button-group">
                    <button class="button edit-button" onclick="edit('${movie.imdbID}')">Edit!</button>
                    <button class="button" onclick="hideDetails()">Back to list</button>
                  </div>
              </div>
          </article>
      `
    detailsElement.classList.remove("hidden")
    movieList.classList.add("hidden")
}

function hideDetails() {
    const detailsElement = document.querySelector("#movieDetails")
    const movieList = document.querySelector("#movieList")
    movieList.classList.remove("hidden")
    detailsElement.classList.add("hidden")
}

function edit(imdbID) {
    window.location.href = `/edit.html?imdbID=${imdbID}`
}
