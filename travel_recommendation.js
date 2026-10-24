const btnSearch = document.getElementById("btnSearch");
const btnClear = document.getElementById("btnClear");
const searchInput = document.getElementById("searchInput");
const results = document.getElementById("results");

let travelData = null;

// Ambil data dari file JSON
fetch("travel_recommendation_api.json")
  .then((response) => response.json())
  .then((data) => {
    travelData = data;
    console.log(data);
  })
  .catch((error) => console.error("Error fetching data:", error));

function fallbackImage(img, name) {
  img.onerror = null;
  img.src = "https://picsum.photos/seed/" + encodeURIComponent(name) + "/600/400";
}

function createCard(place) {
  return `
    <div class="card">
      <img src="${place.imageUrl}" alt="${place.name}"
           onerror="fallbackImage(this, '${place.name.replace(/'/g, "")}')">
      <div class="card-body">
        <h3>${place.name}</h3>
        <p>${place.description}</p>
        <a href="#" class="visit">Visit</a>
      </div>
    </div>`;
}

function showResults(places) {
  if (places.length === 0) {
    results.innerHTML =
      '<p class="message">No recommendations found. Try "beach", "temple", or a country like "Japan".</p>';
    return;
  }
  results.innerHTML = places.map(createCard).join("");
}

function searchRecommendation() {
  const keyword = searchInput.value.trim().toLowerCase();

  if (!travelData) {
    results.innerHTML = '<p class="message">Data is still loading, please try again.</p>';
    return;
  }
  if (keyword === "") {
    results.innerHTML = '<p class="message">Please enter a keyword.</p>';
    return;
  }

  if (keyword === "beach" || keyword === "beaches") {
    showResults(travelData.beaches);
  } else if (keyword === "temple" || keyword === "temples") {
    showResults(travelData.temples);
  } else if (keyword === "country" || keyword === "countries") {
    const allCities = travelData.countries.flatMap((country) => country.cities);
    showResults(allCities);
  } else {
    const country = travelData.countries.find(
      (c) => c.name.toLowerCase() === keyword
    );
    showResults(country ? country.cities : []);
  }
}

function clearResults() {
  searchInput.value = "";
  results.innerHTML = "";
}

btnSearch.addEventListener("click", searchRecommendation);
btnClear.addEventListener("click", clearResults);
searchInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") searchRecommendation();
});
