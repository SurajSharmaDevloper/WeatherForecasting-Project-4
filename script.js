import  countries from './countryCode.js';

const cityInput = document.getElementById('searchInput');
const Temp = document.getElementById('temp-data');
const SearchBtn = document.getElementById('SearchBtn');
const ApiKey = '4e8c41c9ceb6ba8b85c2c9328ccc27ab';
const press = document.getElementById('pressure');
const wind_Speed = document.getElementById('WindSpeed')
const visible = document.getElementById('visible');
const Humidity = document.getElementById('humidity');
const Min = document.getElementById('Min');
const Max = document.getElementById('Max');
const tempDet = document.getElementById('tempDet');
const weatherIcon = document.getElementById('weatherIcon');
const AirData = document.getElementById('AirData')
const head = document.getElementById('head');
const Time = document.getElementById('Time');
const SunriseSunset = document.getElementById('SunriseSunset');
const headofHiglight = document.getElementById('headofHiglight');
const cardFooter = document.getElementById('card-footer');
const card = document.getElementById('card')



let AqiIndex = ['Good', 'Fair', 'Moderate', 'Poor', 'Very Poor'];


function DateAndTime( countrydata , citydata , countriesData ) {
    let days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thrusday', 'Friday', 'Saturday'];
    let Months = ['January', 'February ', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'Decmber'];
    let date = new Date();
    let months = Months[date.getMonth()];
    let Year = date.getFullYear();
    let day = days[date.getDay()];


    // Dom Element display current time

        headofHiglight.innerHTML = `<h2>Today's Highlights</h2>
                                     <h3 class="Time">${date.getHours()}:${date.getMinutes()}</h3>`;


    // dom element display date and location 

        cardFooter.innerHTML = `<p><i class='bx  bx-calendar-week'></i> <a href="#"><span id="day">${days[date.getDay()]}</span>,<span
                                        id="date"> ${date.getDate()} ${Months[date.getMonth()]} ${date.getFullYear()}</span></a> </p>
                            <p><i class='bx  bx-location'></i> <a href="#"><span id="citi">${countriesData[countrydata]}</span>, <span
                                        id="contry">${citydata}</span></a> </p>`

}

SearchBtn.addEventListener('click' , checkWhether);


function checkWhether() {
    let cityName = cityInput.value.trim();
    cityInput.value = '';
    if (!cityName) return;
    let ApiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${ApiKey}`;
    fetch(ApiUrl).then(response => response.json()).then(data => {
        console.log(data)
        var { feels_like, temp, temp_max, temp_min, pressure, humidity } = data.main;
        var WindSpees = data.wind.speed;
        var { timezone, visibility } = data;
        var city = data.name;
        var { country, sunrise, sunset } = data.sys;
        var tempvalue = temp - 273.15
        Temp.innerText = parseFloat(tempvalue.toFixed(2));
        press.innerText = pressure;
        wind_Speed.innerText = WindSpees;
        visible.innerText = visibility / 1000;
        Humidity.innerText = humidity;
        Min.innerText = parseFloat((temp_min - 273.15).toFixed(2));
        Max.innerText = parseFloat((temp_max - 273.15).toFixed(2));
        tempDet.innerText = data.weather[0].description;
        weatherIcon.innerHTML = `<img id="weatherIcon" src="https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png" alt="">`
        let Lat = data.coord.lat;
        let Long = data.coord.lon;

        let sRiseTime = moment.utc(sunrise, 'X').add(timezone, 'seconds').format('hh:mm A');
        let sSetTime = moment.utc(sunset, 'X').add(timezone, 'seconds').format('hh:mm A');

        SunriseSunset.innerHTML = `
        <h3>Sunrise & Sunset <i class='bx bx-sun'></i> </h3>
                        <div class="sunrise">
                            <i class='bx  bx-sun-rise'></i>
                            <div>
                                <p>sunrise</p>
                                <h4>${sRiseTime}</h4>
                            </div>
                        </div>
                        <div class="sunset">
                            <i class='bx  bx-sun-set'></i>
                            <div>
                                <p>sunset</p>
                                <h4>${sSetTime}</h4>
                            </div>
                        </div>
        
        `


        AirQualityIndex(Lat, Long);

        DateAndTime(country , city , countries);

        WeatherForecating(Lat , Long)

    })
        .catch(error => console.error('Error:', error));
}

function AirQualityIndex(latitude, longitude) {
    fetch(`http://api.openweathermap.org/data/2.5/air_pollution?lat=${latitude}&lon=${longitude}&appid=${ApiKey}`)
        .then(res => res.json()).then(data => {
            let { co, no, no2, o3, so2, pm2_5, pm10, nh3 } = data.list[0].components;

            AirData.innerHTML = `
                <div class="icon">
                               <i class='bx  bx-wind'  ></i> 
                            </div>
                            <div class="air">
                                <p>CO</p>
                                <h3 id="Co">${co}</h3>
                            </div>
                            <div class="air">
                                <p>NH3</p>
                                <h3 id="nh3">${nh3}</h3>
                            </div>
                            <div class="air">
                                <p>NO</p>
                                <h3 id="no">${no}</h3>
                            </div>
                            <div class="air">
                                <p>NO2</p>
                                <h3 id="n02">${no2}</h3>
                            </div>
                            <div class="air">
                                <p>O3</p>
                                <h3 id="o3">${o3}</h3>
                            </div>
                            <div class="air">
                                <p>PM2.5</p>
                                <h3 id="pm2.5">${pm2_5}</h3>
                            </div>
                            <div class="air">
                                <p>PM10</p>
                                <h3 id="pm10">${pm10}</h3>
                            </div>
                            <div class="air">
                                <p>SO2</p>
                                <h3 id="SO2">${so2}</h3>
                            </div>`;

            head.innerHTML = `<p>Air quality index <i class='bx  bx-wind'></i> </p>
            <a class="air-index aqi-3" href="#"><span id="Aqi-data">${AqiIndex[data.list[0].main.aqi - 1]}</span></a>`
        })
        .catch(error => console.error('Error:', error))
}


function WeatherForecating(lat , lon) {
    fetch(`https://api.openweathermap.org/data/2.5/forecast/?lat=${lat}&lon=${lon}&appid=${ApiKey}`)
        .then(res => res.json()).then(data => {
            console.log(data)

            card.innerHTML = `<h2>5 Days Forecast</h2>
                        <div class="day-forecast">
                            <div class="forecast-item">
                                <div class="icon-wrapper">
                                    <img src="https://openweathermap.org/img/wn/02d.png" alt="">
                                    <span>28.67&deg;C</span>
                                </div>
                                <p>1 Sep</p>
                                <p>Friday</p>
                            </div>
                            <div class="forecast-item">
                                <div class="icon-wrapper">
                                    <img src="https://openweathermap.org/img/wn/02d.png" alt="">
                                    <span>28.67&deg;C</span>
                                </div>
                                <p>1 Sep</p>
                                <p>Friday</p>
                            </div>
                            <div class="forecast-item">
                                <div class="icon-wrapper">
                                    <img src="https://openweathermap.org/img/wn/02d.png" alt="">
                                    <span>28.67&deg;C</span>
                                </div>
                                <p>1 Sep</p>
                                <p>Friday</p>
                            </div>
                            <div class="forecast-item">
                                <div class="icon-wrapper">
                                    <img src="https://openweathermap.org/img/wn/02d.png" alt="">
                                    <span>28.67&deg;C</span>
                                </div>
                                <p>1 Sep</p>
                                <p>Friday</p>
                            </div>
                            <div class="forecast-item">
                                <div class="icon-wrapper">
                                    <img src="https://openweathermap.org/img/wn/02d.png" alt="">
                                    <span>28.67&deg;C</span>
                                </div>
                                <p>1 Sep</p>
                                <p>Friday</p>
                            </div>
                        </div> `

        });
}