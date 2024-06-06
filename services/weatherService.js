const _weatherKeyAPI = '3487b89eba934e32e9b00bc6eae433bb';

function formatTime(date) {
  let hours = date.getHours();
  let minutes = date.getMinutes();
  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
}

function getDuration(start, end) {
  const durationMs = end - start;
  const hours = Math.floor(durationMs / 3600000);
  const minutes = Math.floor((durationMs % 3600000) / 60000);
  return `${hours}:${minutes}`;
}

export function GetWeatherInfo(location) {
  return new Promise((resolve, reject) => {
    let url;
    if (typeof location === 'object') {
      const { latitude, longitude } = location;
      url = new URL(
        `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=${_weatherKeyAPI}`,
      );
    } else if (typeof location === 'string') {
      url = new URL(
        `https://api.openweathermap.org/data/2.5/weather?q=${location}&units=metric&appid=${_weatherKeyAPI}`,
      );
    } else {
      reject('Invalid location');
    }

    fetch(url)
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then((weatherInfo) => {
        const city = weatherInfo.name;
        const countryCode = weatherInfo.sys.country;
        const date = new Date(weatherInfo.dt * 1000);
        const weatherDescription = weatherInfo.weather[0].main;
        const weatherIcon = weatherInfo.weather[0].icon;
        const currentTemperature = weatherInfo.main.temp;
        const feelsLikeTemperature = weatherInfo.main.feels_like;
        const sunrise = new Date(weatherInfo.sys.sunrise * 1000);
        const sunset = new Date(weatherInfo.sys.sunset * 1000);
        const dayDuration = getDuration(sunrise, sunset);

        resolve({
          city,
          countryCode,
          date: date.toLocaleDateString(),
          weatherDescription,
          weatherIcon,
          currentTemperature,
          feelsLikeTemperature,
          sunrise: formatTime(sunrise),
          sunset: formatTime(sunset),
          dayDuration,
          coordinates: {
            latitude: weatherInfo.coord.lat,
            longitude: weatherInfo.coord.lon,
          },
        });
      })
      .catch((error) => {
        reject('Error when receiving data: ' + error.message);
      });
  });
}

export function Get5DayForecast(location) {
  return new Promise((resolve, reject) => {
    let url;
    if (typeof location === 'object') {
      const { latitude, longitude } = location;
      url = new URL(
        `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&units=metric&appid=${_weatherKeyAPI}`,
      );
    } else if (typeof location === 'string') {
      url = new URL(
        `https://api.openweathermap.org/data/2.5/forecast?q=${location}&units=metric&appid=${_weatherKeyAPI}`,
      );
    } else {
      reject('Invalid location');
    }

    fetch(url)
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then((forecastData) => {
        let forecastByDay = {};
        forecastData.list.forEach((entry) => {
          const date = new Date(entry.dt * 1000);
          const day = date.toDateString();
          if (!forecastByDay[day]) {
            forecastByDay[day] = [];
          }

          forecastByDay[day].push({
            time: formatTime(date),
            weatherIcon: entry.weather[0].icon,
            weatherDescription: entry.weather[0].main,
            temperature: Math.floor(entry.main.temp),
            feelsLikeTemperature: Math.floor(entry.main.feels_like),
            windSpeed: entry.wind.speed,
          });
        });

        resolve(forecastByDay);
      })
      .catch((error) => {
        reject('Error when receiving data: ' + error.message);
      });
  });
}

export function GetNearbyCitiesWeather(location, count = 5) {
  return new Promise((resolve, reject) => {
    let url;
    if (typeof location === 'object') {
      const { latitude, longitude } = location;
      url = new URL(
        `http://api.openweathermap.org/data/2.5/find?lat=${latitude}&lon=${longitude}&cnt=${count}&units=metric&appid=${_weatherKeyAPI}`,
      );
    } else {
      reject('Invalid location');
    }

    fetch(url)
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then((data) => {
        const nearbyCitiesWeather = data.list.map((city) => ({
          name: city.name,
          countryCode: city.sys.country,
          weatherDescription: city.weather[0].main,
          weatherIcon: city.weather[0].icon,
          currentTemperature: city.main.temp,
          feelsLikeTemperature: city.main.feels_like,
          windSpeed: city.wind.speed,
        }));
        resolve(nearbyCitiesWeather);
      })
      .catch((error) => {
        reject('Error when receiving data: ' + error.message);
      });
  });
}
