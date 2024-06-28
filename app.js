import express from 'express';
import axios from 'axios';
import { weatherConditions } from './weatherConditions.js';
import 'dotenv/config';

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));


app.set('view engine', 'ejs');

const apiKey = process.env.API_KEY; 

function getWeatherCondition(code) {
    return weatherConditions[code] || "Code not found";
  }

app.get('/', (req, res) => {
    res.render('index.ejs', { weather: null, error: null, location: null });
});

app.post('/', async (req, res) => {
    const location = req.body.location;
    const url = `https://api.tomorrow.io/v4/timelines?location=${location}&fields=temperature&fields=weatherCode&timesteps=current&units=metric&apikey=${apiKey}`;

    try {
        const response = await axios.get(url);
        const weatherData = response.data.data.timelines[0].intervals[0].values;
        const weather = {
            temperature: weatherData.temperature,
            description: getWeatherCondition(weatherData.weatherCode),
        };
        res.render('index.ejs', { weather, error: null, location });
    } catch (error) {
        res.render('index.ejs', { weather: null, error: 'Error, please try again', location });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
