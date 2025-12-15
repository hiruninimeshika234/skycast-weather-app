const apiKey = "962e962d0aa74b396162c9ccfe444b29";

document.getElementById("btn").addEventListener("click", getWeather);

async function getWeather() {
  const city = document.getElementById("cityInput").value.trim();
  if (!city) return alert("Enter a city");

  const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${apiKey}&units=metric`;

  try {
    const res = await fetch(url);
    const data = await res.json();
    if (res.status !== 200) {
      document.getElementById("weatherInfo").innerText = data.message;
      return;
    }

    // Weather icon
    const icon = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;

    document.getElementById("weatherInfo").innerHTML = `
      <img src="${icon}">
      <h3>${data.name}, ${data.sys.country}</h3>
      <p>${data.weather[0].description}</p>
      <p>${Math.round(data.main.temp)} °C</p>
    `;

    const main = data.weather[0].main.toLowerCase();

    // Background images
    if (main.includes("rain") || main.includes("drizzle")) {
      document.body.style.backgroundImage = "url('images/rain.jpg')";
    } else if (main.includes("cloud")) {
      document.body.style.backgroundImage = "url('images/cloud.jpg')";
    } else {
      document.body.style.backgroundImage = "url('images/sunny.jpg')";
    }

    // Animations
    const layer = document.getElementById("animation-layer");
    layer.innerHTML = "";

    if (main.includes("rain") || main.includes("drizzle")) {
      for (let i = 0; i < 90; i++) {
        const drop = document.createElement("div");
        drop.className = "rain-drop";
        drop.style.left = Math.random() * 100 + "vw";
        drop.style.animationDuration = 0.5 + Math.random() + "s";
        drop.style.animationDelay = Math.random() + "s";
        layer.appendChild(drop);
      }
    }
    else if (main.includes("cloud")) {
      for (let i = 0; i < 4; i++) {
        const cloud = document.createElement("div");
        cloud.className = "cloud";
        cloud.style.top = 60 + i * 80 + "px";
        cloud.style.animationDuration = 25 + i * 10 + "s";
        layer.appendChild(cloud);
      }
    }
    else {
      const sun = document.createElement("div");
      sun.className = "sun";
      layer.appendChild(sun);
    }

    getForecast(city);

  } catch (err) {
    console.error(err);
    document.getElementById("weatherInfo").innerText = "Network error";
  }
}

/* ============ 5 DAY FORECAST ============ */
async function getForecast(city) {
  const url = `https://api.openweathermap.org/data/2.5/forecast?q=${encodeURIComponent(city)}&appid=${apiKey}&units=metric`;
  const res = await fetch(url);
  const data = await res.json();

  const forecast = document.getElementById("forecast");
  forecast.innerHTML = "";

  const daily = data.list.filter(item => item.dt_txt.includes("12:00:00"));

  daily.slice(0,5).forEach(day => {
    const date = new Date(day.dt_txt).toLocaleDateString("en-US",{weekday:"short"});
    const icon = `https://openweathermap.org/img/wn/${day.weather[0].icon}.png`;

    forecast.innerHTML += `
      <div class="forecast-card">
        <p>${date}</p>
        <img src="${icon}">
        <p>${Math.round(day.main.temp)}°C</p>
      </div>
    `;
  });
}

