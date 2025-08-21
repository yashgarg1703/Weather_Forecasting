const express = require("express");
const https = require("https");
const bodyParser = require("body-parser");
const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.set("view engine", "ejs");

// custom string function ek hi baar define karo
String.prototype.replaceAt = function(index, replacement) {
  return this.substring(0, index) + replacement + this.substring(index + replacement.length);
};

app.get("/", function(req, res) {
  res.sendFile(__dirname + "/forecast.html");
});

app.post("/", function(req, res) {
  const city = req.body.city_name;
  const url="https://api.openweathermap.org/data/2.5/forecast?q="+city+"&units=metric&appid=3c8e163cc72f70e1ddf841b1169eb943";

  https.get(url, function(response) {
    let dataChunks = "";

    response.on("data", function(chunk) {
      dataChunks += chunk;
    });

    response.on("end", function() {
      try {
        const weatherData = JSON.parse(dataChunks);

        if (weatherData.cod === "404") {
          res.sendFile(__dirname + "/error_404.html");
        } else {
          const today = new Date();
          const year = today.getFullYear();
          const mes = today.getMonth() + 1;
          const dia = today.getDate();
          const dt = dia + "-" + mes + "-" + year;

          let lists = [];

          // pehle 7 entries hi uthai ja rahi hain (3-3 hr interval)
          for (let i = 0; i < 7; i++) {
            const ic = weatherData.list[i].weather[0].icon;
            const ico = ic.replaceAt(2, "d");
            const icon = "http://openweathermap.org/img/wn/" + ico + "@2x.png";
            const desc = weatherData.list[i].weather[0].description;
            const cityname = weatherData.city.name;
            const temp = weatherData.list[i].main.temp;
            const humidity = weatherData.list[i].main.humidity;
            const windspeed = weatherData.list[i].wind.speed;
            const pressure = weatherData.list[i].main.pressure;

            const date = new Date(weatherData.list[i].dt * 1000); // API se aayi hui timestamp
            const weekdays = date.toLocaleDateString("en-US", { weekday: "long" });

            const list = {
              cityname,
              description: desc,
              temp,
              icon,
              humidity,
              windspeed,
              pressure,
              weekdays,
            };

            lists.push(list);
          }

          res.render("forecast", { lists: lists, dt: dt });
        }
      } catch (err) {
        console.error("Error parsing JSON:", err.message);
        res.sendFile(__dirname + "/error_404.html");
      }
    });
  });
});

app.listen(5000, function() {
  console.log("Server started on port 5000");
});
