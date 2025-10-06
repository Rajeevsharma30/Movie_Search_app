const apiKey = "8435cdf2"; // Get free API key from http://www.omdbapi.com/apikey.aspx
const searchInput = document.getElementById("searchInput");
const searchBtn = document.getElementById("searchBtn");
const moviesDiv = document.getElementById("movies");

const modal = document.getElementById("modal");
const modalBody = document.getElementById("modalBody");
const closeModal = document.querySelector(".close");

// Search button click
searchBtn.addEventListener("click", () => {
  const query = searchInput.value.trim();
  if (query) fetchMovies(query);
});

// Fetch movies from OMDb API
async function fetchMovies(query) {
  moviesDiv.innerHTML = "<p>Loading...</p>";
  try {
    const res = await fetch(`https://www.omdbapi.com/?s=${query}&apikey=${apiKey}`);
    const data = await res.json();
    if(data.Response === "True") {
      displayMovies(data.Search);
    } else {
      moviesDiv.innerHTML = `<p style="color:red;">${data.Error}</p>`;
    }
  } catch (err) {
    moviesDiv.innerHTML = "<p style='color:red;'>Error fetching data</p>";
    console.error(err);
  }
}

// Display movies in cards
function displayMovies(movies) {
  moviesDiv.innerHTML = "";
  movies.forEach(movie => {
    const card = document.createElement("div");
    card.className = "movie-card";
    card.innerHTML = `
      <img src="${movie.Poster !== "N/A" ? movie.Poster : "https://via.placeholder.com/180x270?text=No+Image"}" alt="${movie.Title}">
      <div class="info">
        <h3>${movie.Title}</h3>
        <p>${movie.Year} | ${movie.Type}</p>
      </div>
    `;
    card.addEventListener("click", () => showMovieDetails(movie.imdbID));
    moviesDiv.appendChild(card);
  });
}

// Show movie details in modal
async function showMovieDetails(id) {
  try {
    const res = await fetch(`https://www.omdbapi.com/?i=${id}&apikey=${apiKey}`);
    const data = await res.json();
    modalBody.innerHTML = `
      <img src="${data.Poster !== "N/A" ? data.Poster : "https://via.placeholder.com/400x600?text=No+Image"}">
      <h2>${data.Title} (${data.Year})</h2>
      <p><strong>Genre:</strong> ${data.Genre}</p>
      <p><strong>Director:</strong> ${data.Director}</p>
      <p><strong>Actors:</strong> ${data.Actors}</p>
      <p><strong>Plot:</strong> ${data.Plot}</p>
    `;
    modal.style.display = "block";
  } catch (err) {
    console.error(err);
  }
}

// Close modal
closeModal.addEventListener("click", () => {
  modal.style.display = "none";
});

window.addEventListener("click", e => {
  if(e.target === modal) modal.style.display = "none";
});
