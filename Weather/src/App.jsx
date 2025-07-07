import { useState } from 'react';
import axios from 'axios';

export default function WeatherApp() {
  const [city, setCity] = useState('');
  const [weather, setWeather] = useState(null);
  const [error, setError] = useState(null);

  const apiKey = 'd70a26ed88001c324b653a5c60375782'; // Replace with your valid OpenWeatherMap API key
  
  const fetchWeather = async () => {
    if (!city.trim()) {
      setError("Please enter a city name");
      return;
    }

    try {
      const res = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${apiKey}&units=metric`
      );
      setWeather(res.data);
      setError('');
    } catch (err) {
      setWeather(null);
      if (err.response && err.response.status === 404) {
        setError("City not found");
      } else if (err.response && err.response.status === 401) {
        setError("Invalid API key");
      } else {
        setError("Failed to fetch weather. Check your internet connection and API key.");
      }
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-blue-100 p-4">
      <h1 className="text-2xl font-bold mb-4">Weather App</h1>
      <input
        type="text"
        value={city}
        onChange={(e) => setCity(e.target.value)}
        onKeyDown={(e) => {
          if(e.key==='Enter') fetchWeather();
        }}
        placeholder="Enter city name"
        className="p-2 border rounded w-full max-w-sm"
      />
      <button
        onClick={fetchWeather}
        onkeyboard={fetchWeather}
        className="mt-2 px-4 py-2 bg-blue-600 text-white rounded"
      >
        Get Weather
      </button>

      {error && <p className="mt-4 text-red-500">{error}</p>}

      {weather && (
        <div className="mt-6 bg-white p-4 rounded shadow w-full max-w-sm text-center">
          <h2 className="text-xl font-bold">{weather.name}</h2>
          <p>{weather.weather[0].description}</p>
          <p className="text-3xl font-semibold">{weather.main.temp}°C</p>
          <p>Humidity: {weather.main.humidity}%</p>
          <p>Wind: {weather.wind.speed} m/s</p>
        </div>
      )}
    </div>
  );
}
