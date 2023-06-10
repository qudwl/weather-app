/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./src/index.js":
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
/***/ (() => {

eval("const apiUrl = { weather: \"https://api.open-meteo.com/v1/forecast?&current_weather=true&hourly=temperature_2m,relativehumidity_2m,windspeed_10m\", geocoding: \"https://nominatim.openstreetmap.org/reverse?\" };\n\n/***\n * @param {Object} location\n * Returns the weather data for the given location.\n * @returns {Object} weatherData\n */\nasync function getWeather(location) {\n    if (localStorage.getItem(\"weatherData\") && Date.now() - localStorage.getItem(\"weatherDataTime\") < 3600000) {\n        return JSON.parse(localStorage.getItem(\"weatherData\"));\n    } else {\n        const res = await fetch(apiUrl.weather + `&latitude=${location.latitude}&longitude=${location.longitude}`);\n        const data = await res.json();\n        localStorage.setItem(\"weatherData\", JSON.stringify(data));\n        localStorage.setItem(\"weatherDataTime\", Date.now());\n        return data;\n    }\n}\n\n/**\n * @param {Object} location \n * Returns the city name for the given location.\n * @returns {Object} locationData\n */\nasync function getLocationData(location) {\n    if (localStorage.getItem(\"locationData\") && Date.now() - localStorage.getItem(\"locationDataTime\") < 3600000) {\n        return JSON.parse(localStorage.getItem(\"locationData\")).address;\n    } else {\n        const res = await fetch(apiUrl.geocoding + `&lat=${location.latitude}&lon=${location.longitude}&format=json`);\n        const data = await res.json();\n        localStorage.setItem(\"locationData\", JSON.stringify(data));\n        localStorage.setItem(\"locationDataTime\", Date.now());\n        return data.address;\n    }\n}\n\n/***\n * Color Generator based on Time of Day, Temperature, Humidity, and Weather\n * @param {Date} timeOfDay\n * @param {Number} temperature\n * @param {Number} humidity\n * @param {Boolean} isSnowingOrRaining\n * @returns {String} color\n */\nfunction generateColor(timeOfDay, temperature, humidity, isSnowingOrRaining) {\n    console.log(`Parameters: ${timeOfDay}, ${temperature}, ${humidity}, ${isSnowingOrRaining}`);\n    // Adjustments based on time of day\n    let redAdjustment = 0;\n    let greenAdjustment = 0;\n    let blueAdjustment = 0;\n\n    const hour = timeOfDay.getHours();\n\n    if (hour >= 5 && hour < 12) {\n        redAdjustment += 50;\n        greenAdjustment += 25;\n    } else if (hour >= 12 && hour < 18) {\n        redAdjustment -= 25;\n        greenAdjustment -= 50;\n    } else if (hour >= 18 || hour < 5) {\n        redAdjustment -= 50;\n        greenAdjustment -= 25;\n        blueAdjustment += 50;\n    }\n\n    // Adjustments based on temperature\n    redAdjustment += temperature;\n    greenAdjustment -= temperature;\n\n    // Adjustments based on humidity\n    greenAdjustment += humidity / 2;\n    blueAdjustment += humidity / 2;\n\n    // Adjustments based on snowing/raining\n    if (isSnowingOrRaining) {\n        blueAdjustment += 50;\n    }\n\n    console.log(`\n    redAdjustment: ${redAdjustment}\n    greenAdjustment: ${greenAdjustment}\n    blueAdjustment: ${blueAdjustment}`)\n\n    // Apply adjustments to base color (white)\n    const red = Math.min(255, Math.max(0, 255 + redAdjustment));\n    const green = Math.min(255, Math.max(0, 255 + greenAdjustment));\n    const blue = Math.min(255, Math.max(0, 255 + blueAdjustment));\n\n    return `rgb(${red}, ${green}, ${blue})`;\n}\n\n/**\n * Adds the data to the DOM.\n * @param {Object} weatherData\n * @param {Object} cityData\n * @returns {void}\n */\nfunction addDataToDOM(weatherData, locationData) {\n    const weather = document.getElementById(\"weather\");\n    const location = document.getElementById(\"location\");\n    const temperature = document.getElementById(\"temp\");\n    const humidity = document.getElementById(\"humidity\");\n    const wind = document.getElementById(\"wind\");\n    const city = document.getElementById(\"city\");\n    const date = document.getElementById(\"date\");\n\n    city.innerText = locationData.city;\n    date.innerText = new Date().toLocaleDateString(\"en-US\", { year: \"numeric\", month: \"long\", day: \"numeric\" });\n    temperature.innerText = weatherData.current_weather.temperature + \"°\";\n}\n\nasync function main() {\n    const location = { latitude: 0, longitude: 0 };\n    if (navigator.geolocation) {\n        await new Promise((resolve, reject) => {\n            navigator.geolocation.getCurrentPosition((position) => {\n                location.latitude = position.coords.latitude;\n                location.longitude = position.coords.longitude;\n                resolve();\n            }, reject);\n        });\n    }\n\n    const weatherData = await getWeather(location);\n    const locationData = await getLocationData(location);\n\n    addDataToDOM(weatherData, locationData);\n    const color = generateColor(new Date(), weatherData.current_weather.temperature, weatherData.current_weather.relativehumidity_2m, weatherData.current_weather.raining || weatherData.current_weather.snowing);\n    console.log(color);\n    document.body.style.backgroundColor = color;\n}\n\nwindow.onload = main;\n\n//# sourceURL=webpack://weather-app/./src/index.js?");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module can't be inlined because the eval devtool is used.
/******/ 	var __webpack_exports__ = {};
/******/ 	__webpack_modules__["./src/index.js"]();
/******/ 	
/******/ })()
;