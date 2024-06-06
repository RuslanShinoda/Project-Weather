import { GetWeatherInfo, Get5DayForecast, GetNearbyCitiesWeather } from '../../services/weatherService.js';
import { GetUserLocation } from '../../services/geolocationService.js';
import GetCountryName from '../../services/countryNameService.js';

let currentWeather = {};
let fiveDayForecast = {};
let nearbyCitiesWeather = {};

const cityInput = document.getElementById('searchCityInput');
const searchButton = document.querySelector('.search__button');
const currentIconElem = document.getElementById('currentWeatherInfoIcon');
const currentWeatherDescription = document.getElementById('currentWeatherInfoWeatherDescription');
const currentWeatherTemperature = document.getElementById('currentWeatherInfoWeatherTemperature');
const currentWeatherFeelsLikeTemperature = document.getElementById('currentWeatherInfoFeelsLikeTemperature');
const currentWeatherInfoSunTime = document.getElementById('currentWeatherInfoSunTime');
const currentDate = document.getElementById('currentDate');
const hourlyWeather = document.getElementById('hourlyWeatherInfoContainer');
const nearbyPlacesWeather = document.getElementById('nearbyPlacesWeatherInfoContainer');
const selectionForecastPeriod = document.getElementById('selectionForecastPeriod');
const nearbyPlacesWeatherContainer = document.getElementById('nearbyPlacesWeatherContainer');
const chooseWeatherDayContainer = document.getElementById('chooseWeatherDayContainer');
const errorNotifyContainer = document.getElementById('errorNotifyContainer');

const iconMap = {
  '01d': '../../assets/weatherIcons/01d.png',
  '01n': '../../assets/weatherIcons/01n.png',
  '02d': '../../assets/weatherIcons/02d.png',
  '02n': '../../assets/weatherIcons/02n.png',
  '03d': '../../assets/weatherIcons/03d.png',
  '03n': '../../assets/weatherIcons/03n.png',
  '04d': '../../assets/weatherIcons/04d.png',
  '04n': '../../assets/weatherIcons/04n.png',
  '09d': '../../assets/weatherIcons/09d.png',
  '09n': '../../assets/weatherIcons/09n.png',
  '10d': '../../assets/weatherIcons/10d.png',
  '10n': '../../assets/weatherIcons/10n.png',
  '11d': '../../assets/weatherIcons/11d.png',
  '11n': '../../assets/weatherIcons/11n.png',
  '13d': '../../assets/weatherIcons/13d.png',
  '13n': '../../assets/weatherIcons/13n.png',
  '50d': '../../assets/weatherIcons/50d.png',
  '50n': '../../assets/weatherIcons/50n.png',
};

document.addEventListener('DOMContentLoaded', async () => {
  try {
    const coords = await GetUserLocation();
    currentWeather = await GetWeatherInfo(coords);
    fiveDayForecast = await Get5DayForecast(coords);
    nearbyCitiesWeather = await GetNearbyCitiesWeather(coords);
    updatePageContent();
  } catch (error) {
    console.error(error);
  }

  cityInput.addEventListener('keypress', async (event) => {
    if (event.key === 'Enter') {
      let cityName = event.target.value.trim();
      try {
        await getWeatherByCity(cityName);
        updatePageContent();
        cityInput.value = '';
        errorNotifyContainer.style.display = 'none';

      } catch (error) {
        errorNotifyContainer.style.display = 'block';
        errorNotifyContainer.innerHTML = `"${cityName}" city not found.<br> please enter the correct city name`;
      }
    }
  });

  searchButton.addEventListener('click', async () => {
    let cityName = cityInput.value.trim();
    try {
      await getWeatherByCity(cityName);
      updatePageContent();
      cityInput.value = '';
      errorNotifyContainer.style.display = 'none';
    } catch (error) {
      errorNotifyContainer.style.display = 'block';
      errorNotifyContainer.innerHTML = `"${cityName}" city not found. <br> Please enter the correct city name`;
    }
  });

  async function getWeatherByCity(cityName) {
    try {
      currentWeather = await GetWeatherInfo(cityName);
      fiveDayForecast = await Get5DayForecast(cityName);
      nearbyCitiesWeather = await GetNearbyCitiesWeather(currentWeather.coordinates);
    } catch (error) {
      throw new Error('City not found');
    }
  }
});

let userSelected = 'today';

selectionForecastPeriod.addEventListener('click', (event) => {
  let elemText = event.target.textContent;
  let allDivInForecastPeriod = document.querySelectorAll('#selectionForecastPeriod > div');

  allDivInForecastPeriod.forEach((div) => {
    div.classList.remove('selectionForecastPeriodUserFocus');
  });

  currentWeatherContainer.style.display = 'none';
  chooseWeatherDayContainer.style.display = 'none';
  fiveDayForecastContainer.style.display = 'none';
  hourlyWeatherContainer.style.display = 'none';
  nearbyPlacesWeatherContainer.style.display = 'none';

  if (elemText.toLowerCase() === 'today') {
    userSelected = 'today';
    event.target.classList.add('selectionForecastPeriodUserFocus');
    currentWeatherContainer.style.display = 'block';
    hourlyWeatherContainer.style.display = 'block';
    nearbyPlacesWeatherContainer.style.display = 'block';
  } else if (elemText.toLowerCase() === '5-day') {
    userSelected = '5-day';
    event.target.classList.add('selectionForecastPeriodUserFocus');
    chooseWeatherDayContainer.style.display = 'grid';
    fiveDayForecastContainer.style.display = 'block';
    nearbyPlacesWeatherContainer.style.display = 'none';
  }
});

document.querySelector('#selectionForecastPeriod > div').click();

async function updatePageContent() {
  try {
    let countryName = await GetCountryName(currentWeather.countryCode);
    cityInput.placeholder = `${currentWeather.city}, ${countryName}`;
    currentDate.innerHTML = currentWeather.date;
    currentIconElem.innerHTML = '';
    let img = document.createElement('img');
    img.classList.add('weatherIcons');
    img.src =
      iconMap[currentWeather.weatherIcon] || `https://openweathermap.org/img/wn/${currentWeather.weatherIcon}.png`;
    currentIconElem.append(img);
    currentWeatherDescription.innerHTML = currentWeather.weatherDescription;
    currentWeatherTemperature.innerHTML = Math.floor(currentWeather.currentTemperature) + '°C';
    currentWeatherFeelsLikeTemperature.innerHTML = 'Real feel ' + Math.floor(currentWeather.feelsLikeTemperature) + '°';
    let tableSunTime = document.createElement('tableSunTime');
    let sunriseRow = document.createElement('tr');
    let sunriseHeader = document.createElement('td');
    sunriseHeader.innerHTML = 'Sunrise:';
    let sunriseValue = document.createElement('td');
    sunriseValue.innerHTML = currentWeather.sunrise;
    sunriseRow.appendChild(sunriseHeader);
    sunriseRow.appendChild(sunriseValue);
    let sunsetRow = document.createElement('tr');
    let sunsetHeader = document.createElement('td');
    sunsetHeader.innerHTML = 'Sunset:';
    let sunsetValue = document.createElement('td');
    sunsetValue.innerHTML = currentWeather.sunset;
    sunsetRow.appendChild(sunsetHeader);
    sunsetRow.appendChild(sunsetValue);
    let durationRow = document.createElement('tr');
    let durationHeader = document.createElement('td');
    durationHeader.innerHTML = 'Duration:';
    let durationValue = document.createElement('td');
    durationValue.innerHTML = currentWeather.dayDuration;
    durationRow.appendChild(durationHeader);
    durationRow.appendChild(durationValue);
    tableSunTime.appendChild(sunriseRow);
    tableSunTime.appendChild(sunsetRow);
    tableSunTime.appendChild(durationRow);
    currentWeatherInfoSunTime.innerHTML = '';
    currentWeatherInfoSunTime.appendChild(tableSunTime);
    const resultArray = [];
    for (const key in fiveDayForecast) {
      if (Object.hasOwnProperty.call(fiveDayForecast, key)) {
        const objectsArray = fiveDayForecast[key];
        resultArray.push(...objectsArray);
      }
    }
    resultArray.slice(0, 6);
    const titleForHourlyWeather = ['TODAY', '', 'Forecast', 'Temp (C°)', 'RealFeel', 'Wind (km/h)'];
    let tableHourlyWeather = document.createElement('table');
    for (let i = 0; i < 6; i++) {
      let tr = document.createElement('tr');
      for (let j = 0; j < 7; j++) {
        let td = document.createElement('td');
        if (j === 0) {
          td.innerHTML = titleForHourlyWeather[i];
        } else if (i === 1) {
          let img = document.createElement('img');
          img.classList.add('weatherIcons');
          img.src =
            iconMap[resultArray[j - 1][Object.keys(resultArray[j])[i]]] ||
            `http://openweathermap.org/img/wn/${resultArray[j - 1][Object.keys(resultArray[j])[i]]}.png`;
          td.append(img);
        } else {
          td.innerHTML = resultArray[j - 1][Object.keys(resultArray[j])[i]];
        }
        tr.append(td);
      }
      tableHourlyWeather.append(tr);
    }
    hourlyWeather.innerHTML = '';
    hourlyWeather.append(tableHourlyWeather);
    nearbyPlacesWeather.innerHTML = '';
    nearbyCitiesWeather.slice(1).forEach((city) => {
      let cityContainer = document.createElement('div');
      cityContainer.classList.add('cityContainer');
      let cityNameContainer = document.createElement('div');
      cityNameContainer.classList.add('cityNameContainer');
      let cityName = document.createElement('h3');
      cityName.textContent = `${city.name}, ${city.countryCode}`;
      cityNameContainer.appendChild(cityName);
      cityContainer.appendChild(cityNameContainer);
      let weatherInfoContainer = document.createElement('div');
      weatherInfoContainer.classList.add('weatherInfoContainer');
      let cityWeatherIcon = document.createElement('div');
      let weatherIconImg = document.createElement('img');
      weatherIconImg.src = iconMap[city.weatherIcon] || `https://openweathermap.org/img/wn/${city.weatherIcon}.png`;
      weatherIconImg.classList.add('weatherIcons');
      cityWeatherIcon.appendChild(weatherIconImg);
      let cityTemperature = document.createElement('div');
      cityTemperature.textContent = `Temp: ${Math.floor(city.currentTemperature)}°C`;
      weatherInfoContainer.appendChild(cityWeatherIcon);
      weatherInfoContainer.appendChild(cityTemperature);
      cityContainer.appendChild(weatherInfoContainer);
      nearbyPlacesWeather.appendChild(cityContainer);
    });
    chooseWeatherDayContainer.innerHTML = '';
    Object.entries(fiveDayForecast).forEach(([key, elem], index) => {
      if (index == 0) return;
      let dayContainer = document.createElement('div');
      dayContainer.id = `${index}dayContainer`;
      const arrayData = key.split(' ');
      let dayWeekElement = document.createElement('h4');
      dayWeekElement.innerHTML = arrayData[0];
      dayContainer.append(dayWeekElement);
      let dateElement = document.createElement('p');
      dateElement.textContent = `${arrayData[1]} ${arrayData[2]}`;
      dayContainer.append(dateElement);
      let iconElement = document.createElement('img');
      let weatherInMiddleDay = elem[4] || elem[3] || elem[2] || elem[1] || elem[0];
      iconElement.src =
        iconMap[weatherInMiddleDay.weatherIcon] || `https://openweathermap.org/img/wn/${elem[index].weatherIcon}.png`;
      iconElement.classList.add('weatherIcons');
      dayContainer.append(iconElement);
      let tempElem = document.createElement('p');
      tempElem.innerHTML = weatherInMiddleDay.temperature + '°C';
      tempElem.style.fontSize = 'xx-large';
      tempElem.style.fontWeight = 700;
      dayContainer.append(tempElem);
      let weatherDescriptionElem = document.createElement('p');
      weatherDescriptionElem.innerHTML = weatherInMiddleDay.weatherDescription;
      dayContainer.append(weatherDescriptionElem);
      chooseWeatherDayContainer.append(dayContainer);
    });
    const dayContainers = document.querySelectorAll('#chooseWeatherDayContainer > div');
    dayContainers.forEach((dayContainer) => {
      dayContainer.addEventListener('click', () => {
        dayContainers.forEach((container) => {
          if (container === dayContainer) {
            container.style.opacity = '1';
          } else {
            container.style.opacity = '0.5';
          }
        });
        const selectedDayData = Object.values(fiveDayForecast)[parseInt(dayContainer.id)];
        updateFiveDayForecast(selectedDayData);
      });
    });
    dayContainers[0].click();
    function updateFiveDayForecast(selectedDayData) {
      const forecastContainer = document.getElementById('fiveDayForecastInfoContainer');
      forecastContainer.innerHTML = '';
      if (Array.isArray(selectedDayData)) {
        const table = document.createElement('table');
        const headerRow = document.createElement('tr');
        const timeCells = document.createElement('td');
        timeCells.textContent = 'Time';
        headerRow.appendChild(timeCells);
        selectedDayData.forEach((data) => {
          const timeCell = document.createElement('td');
          timeCell.textContent = data.time;
          headerRow.appendChild(timeCell);
        });
        table.appendChild(headerRow);
        const titles = ['Forecast', 'Temp (C°)', 'RealFeel', 'Wind (km/h)'];
        titles.forEach((title) => {
          const row = document.createElement('tr');
          const titleCell = document.createElement('td');
          titleCell.textContent = title;
          row.appendChild(titleCell);
          selectedDayData.forEach((data) => {
            const cell = document.createElement('td');
            switch (title) {
              case 'Forecast':
                const icon = document.createElement('img');
                icon.src = iconMap[data.weatherIcon] || `https://openweathermap.org/img/wn/${data.weatherIcon}.png`;
                icon.alt = data.weatherDescription;
                icon.classList.add('weatherIcons');
                cell.appendChild(icon);
                break;
              case 'Temp (C°)':
                cell.textContent = `${data.temperature}°C`;
                break;
              case 'RealFeel':
                cell.textContent = `${data.feelsLikeTemperature}°C`;
                break;
              case 'Wind (km/h)':
                cell.textContent = data.windSpeed;
                break;
              default:
                break;
            }
            row.appendChild(cell);
          });
          table.appendChild(row);
        });
        forecastContainer.appendChild(table);
      } else {
        console.error('Selected day data is not an array.');
      }
    }
  } catch (error) {
    console.error(error);
  }
}
