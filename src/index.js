const apiUrl = { weather: "https://api.open-meteo.com/v1/forecast?&current_weather=true&hourly=temperature_2m,relativehumidity_2m,windspeed_10m", geocoding: "https://nominatim.openstreetmap.org/reverse?" };

/***
 * @param {Object} location
 * Returns the weather data for the given location.
 * @returns {Object} weatherData
 */
async function getWeather(location) {
    if (localStorage.getItem("weatherData") && Date.now() - localStorage.getItem("weatherDataTime") < 3600000) {
        return JSON.parse(localStorage.getItem("weatherData"));
    } else {
        const res = await fetch(apiUrl.weather + `&latitude=${location.latitude}&longitude=${location.longitude}`);
        const data = await res.json();
        localStorage.setItem("weatherData", JSON.stringify(data));
        localStorage.setItem("weatherDataTime", Date.now());
        return data;
    }
}

/**
 * @param {Object} location 
 * Returns the city name for the given location.
 * @returns {Object} locationData
 */
async function getLocationData(location) {
    if (localStorage.getItem("locationData") && Date.now() - localStorage.getItem("locationDataTime") < 3600000) {
        return JSON.parse(localStorage.getItem("locationData")).address;
    } else {
        const res = await fetch(apiUrl.geocoding + `&lat=${location.latitude}&lon=${location.longitude}&format=json`);
        const data = await res.json();
        localStorage.setItem("locationData", JSON.stringify(data));
        localStorage.setItem("locationDataTime", Date.now());
        return data.address;
    }
}

/***
 * Color Generator based on Time of Day, Temperature, Humidity, and Weather
 * @param {Date} timeOfDay
 * @param {Number} temperature
 * @param {Number} humidity
 * @param {Boolean} isSnowingOrRaining
 * @returns {String} color
 */
function generateColor(timeOfDay, temperature, humidity, isSnowingOrRaining) {
    console.log(`Parameters: ${timeOfDay}, ${temperature}, ${humidity}, ${isSnowingOrRaining}`);
    // Adjustments based on time of day
    let redAdjustment = 0;
    let greenAdjustment = 0;
    let blueAdjustment = 0;

    const hour = timeOfDay.getHours();

    if (hour >= 5 && hour < 12) {
        redAdjustment += 50;
        greenAdjustment += 25;
    } else if (hour >= 12 && hour < 18) {
        redAdjustment -= 25;
        greenAdjustment -= 50;
    } else if (hour >= 18 || hour < 5) {
        redAdjustment -= 50;
        greenAdjustment -= 25;
        blueAdjustment += 50;
    }

    // Adjustments based on temperature
    redAdjustment += temperature;
    greenAdjustment -= temperature;

    // Adjustments based on humidity
    greenAdjustment += humidity / 2;
    blueAdjustment += humidity / 2;

    // Adjustments based on snowing/raining
    if (isSnowingOrRaining) {
        blueAdjustment += 50;
    }

    console.log(`
    redAdjustment: ${redAdjustment}
    greenAdjustment: ${greenAdjustment}
    blueAdjustment: ${blueAdjustment}`)

    // Apply adjustments to base color (white)
    const red = Math.min(255, Math.max(0, 255 + redAdjustment));
    const green = Math.min(255, Math.max(0, 255 + greenAdjustment));
    const blue = Math.min(255, Math.max(0, 255 + blueAdjustment));

    return `rgb(${red}, ${green}, ${blue})`;
}

/**
 * Adds the data to the DOM.
 * @param {Object} weatherData
 * @param {Object} cityData
 * @returns {void}
 */
function addDataToDOM(weatherData, locationData) {
    const weather = document.getElementById("weather");
    const location = document.getElementById("location");
    const temperature = document.getElementById("temp");
    const humidity = document.getElementById("humidity");
    const wind = document.getElementById("wind");
    const city = document.getElementById("city");
    const date = document.getElementById("date");

    city.innerText = locationData.city;
    date.innerText = new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
    temperature.innerText = weatherData.current_weather.temperature + "°";
}

async function main() {
    const location = { latitude: 0, longitude: 0 };
    if (navigator.geolocation) {
        await new Promise((resolve, reject) => {
            navigator.geolocation.getCurrentPosition((position) => {
                location.latitude = position.coords.latitude;
                location.longitude = position.coords.longitude;
                resolve();
            }, reject);
        });
    }

    const weatherData = await getWeather(location);
    const locationData = await getLocationData(location);

    addDataToDOM(weatherData, locationData);
    const color = generateColor(new Date(), weatherData.current_weather.temperature, weatherData.current_weather.relativehumidity_2m, weatherData.current_weather.raining || weatherData.current_weather.snowing);
    console.log(color);
    document.body.style.backgroundColor = color;
}

window.onload = main;