const apiUrl = { weather: "https://api.open-meteo.com/v1/forecast?&current_weather=true&hourly=temperature_2m,relativehumidity_2m,windspeed_10m", geocoding: "https://nominatim.openstreetmap.org/reverse?" };

async function getWeather(location) {
    const res = await fetch(apiUrl.weather + `&latitude=${location.latitude}&longitude=${location.longitude}`);
    const data = await res.json();
    return data;
}

async function getCity(location) {
    const res = await fetch(apiUrl.geocoding + `&lat=${location.latitude}&lon=${location.longitude}&format=json`);
    const data = await res.json();
    return data.address.city;
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
    const locationData = await getCity(location);
    console.log(locationData);
}

const showData = (data) => {
    const body = document.querySelector("body");
    const div = document.createElement("div");

}


window.onload = main;