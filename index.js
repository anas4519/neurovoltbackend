const express = require('express');
const axios = require('axios');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Major districts/areas of Delhi
const delhiDistricts = [
    'dwarka',
    'rohini',
    'pitampura',
    'vasant vihar',
    'saket',
    'greater kailash',
    'lajpat nagar',
    'defence colony',
    'karol bagh',
    'connaught place',
    'janakpuri',
    'rajouri garden',
    'paschim vihar',
    'patel nagar',
    'hauz khas',
    'malviya nagar',
    'south extension',
    'preet vihar',
    'mayur vihar',
    'vasant kunj',
    'mehrauli',
    'nehru place',
    'kalkaji',
    'govindpuri',
    'okhla'
];

// Population data for Delhi districts (approximate)
const districtPopulation = {
    'dwarka': 1200000,
    'rohini': 1000000,
    'pitampura': 800000,
    'vasant vihar': 50000,
    'saket': 200000,
    'greater kailash': 150000,
    'lajpat nagar': 300000,
    'defence colony': 100000,
    'karol bagh': 400000,
    'connaught place': 50000,
    'janakpuri': 600000,
    'rajouri garden': 400000,
    'paschim vihar': 500000,
    'patel nagar': 300000,
    'hauz khas': 200000,
    'malviya nagar': 250000,
    'south extension': 150000,
    'preet vihar': 300000,
    'mayur vihar': 400000,
    'vasant kunj': 100000,
    'mehrauli': 200000,
    'nehru place': 50000,
    'kalkaji': 300000,
    'govindpuri': 400000,
    'okhla': 300000
};

// Function to map OpenWeather condition codes to 1-5 scale
function getWeatherConditionLevel(code) {
    // 1: Clear/Sunny
    if (code === 800) return 1;
    
    // 2: Partly Cloudy
    if (code >= 801 && code <= 802) return 2;
    
    // 3: Cloudy
    if (code >= 803 && code <= 804) return 3;
    
    // 4: Light Rain/Precipitation
    if ((code >= 300 && code <= 321) || (code >= 500 && code <= 531) || 
        (code >= 600 && code <= 622) || (code >= 700 && code <= 781)) return 4;
    
    // 5: Heavy Rain/Thunderstorm
    if (code >= 200 && code <= 232) return 5;
    
    return 3; // Default to cloudy if code doesn't match any category
}

// OpenWeather API configuration
const OPENWEATHER_API_KEY = process.env.OPENWEATHER_API_KEY;
const OPENWEATHER_BASE_URL = 'https://api.openweathermap.org/data/2.5/weather';

app.get('/delhi-districts', async (req, res) => {
    try {
        const districtsWithWeather = await Promise.all(
            delhiDistricts.map(async (district) => {
                try {
                    const response = await axios.get(OPENWEATHER_BASE_URL, {
                        params: {
                            q: `${district},delhi,india`,
                            appid: OPENWEATHER_API_KEY,
                            units: 'metric'
                        }
                    });
                    
                    console.log(`Weather data for ${district}:`, response.data);

                    return {
                        name: district,
                        population: districtPopulation[district],
                        weather: {
                            temperature: response.data.main.temp,
                            peakTemperature: response.data.main.temp_max,
                            dewPoint: response.data.main.dew_point,
                            relativeHumidity: response.data.main.humidity,
                            peakHumidity: response.data.main.humidity,
                            precipitation: response.data.rain ? response.data.rain['1h'] || 0 : 0,
                            windDirection: response.data.wind.deg,
                            windSpeed: response.data.wind.speed,
                            pressure: response.data.main.pressure,
                            weatherCondition: getWeatherConditionLevel(response.data.weather[0].id),
                            weatherDescription: response.data.weather[0].description
                        }
                    };
                } catch (error) {
                    return {
                        name: district,
                        weather: null,
                        error: 'Weather data not available'
                    };
                }
            })
        );

        res.json({
            state: 'delhi',
            districts: districtsWithWeather
        });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
