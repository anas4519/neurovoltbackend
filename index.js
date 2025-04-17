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

                    return {
                        name: district,
                        weather: {
                            temperature: response.data.main.temp,
                            description: response.data.weather[0].description,
                            humidity: response.data.main.humidity,
                            windSpeed: response.data.wind.speed
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
