// requires
const https = require('https');
const querystring = require('querystring');
const api = require('./api.json');
const http = require('http');


//PRINT WEATHER
function printWeather(weather) {
    const message = `The current temperature in ${weather.name} is ${weather.main.temp}\xB0\C`;
    console.log(message);
}

//PRINT ERROR
function printError(error) {
    console.error(error.message);
}

function get(query) {

    const parameters = {
        APPID: api.key,
        units: 'metric'
    }

    const zipCode = parseInt(query);
    if (!isNaN(zipCode)) {
        parameters.zip = `${zipCode},us`;
    } else {
        parameters.q = `${query},us`;
    }

    const url = `https://api.openweathermap.org/data/2.5/weather?${querystring.stringify(parameters)}`;
    console.log(url);
    try {
        const request = https.get(url, response => {
            if (response.statusCode === 200) {
                let body = '';
                response.on('data', chunk => {
                    body += chunk;
                });
                response.on('end', () => {
                    try {
                        const weather = JSON.parse(body);
                        if (weather.name) {
                            console.log(weather);
                            printWeather(weather);
                        } else {
                            const queryError = new Error(`The location "${query}" was not found.`);
                            printError(queryError);
                        }
                    } catch (error) {
                        printError(error);
                    }
                });
            } else {
                const statusCodeError = new Error(`There was an error getting the message for ${query}. (${http.STATUS_CODES[response.statusCode]})`);
                printError(statusCodeError);
            }
        });
    } catch (error) {
        printError(error);
    }
}

module.exports.get = get;