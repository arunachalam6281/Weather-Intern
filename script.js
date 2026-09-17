const cityInput = document.getElementById("cityInput");
const searchButton = document.getElementById("searchButton");
const loading = document.getElementById("loading");
const error = document.getElementById("error");
const weatherResult = document.getElementById("weatherResult");

async function getWeather() {

    try {

        const city = cityInput.value.trim();

        if (city === "") {
            error.textContent = "Please enter a city.";
            return;
        }

        if(!/^[a-zA-Z\s]+$/.test(city)) {
            error.textContent = "City not found. Please enter a valid city.";
            return;
        }

        loading.textContent = "Loading...";
        error.textContent = "";
        weatherResult.innerHTML = "";

        // Find the city
        const locationResponse = await fetch(
            `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1`
        );

        if (!locationResponse.ok) {
            throw new Error("Could not find city.");
        }

        const locationData = await locationResponse.json();

        if (!locationData.results) {
            throw new Error("City not found.");
        }

        const location = locationData.results[0];

        // Get weather
        const weatherResponse = await fetch(
            `https://api.open-meteo.com/v1/forecast?latitude=${location.latitude}&longitude=${location.longitude}&current=temperature_2m,relative_humidity_2m,weather_code`
        );

        console.log(location.latitude, location.longitude);

        if (!weatherResponse.ok) {
            throw new Error("Could not fetch weather.");
        }

        const weatherData = await weatherResponse.json();

        const temperature = weatherData.current.temperature_2m;
        const humidity = weatherData.current.relative_humidity_2m;

        weatherResult.innerHTML = `
            <h2>${location.name}</h2>
            <p>Temperature: ${temperature}°C</p>
            <p>Humidity: ${humidity}%</p>
        `;

    } catch (err) {

        weatherResult.innerHTML = "";
        error.textContent = "Sorry, we couldn't load the weather.";

        console.log(err.message);

    } finally {

        loading.textContent = "";

    }
}

searchButton.addEventListener("click", function() {
    getWeather();
});