function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

document.getElementById("weatherSubmit").addEventListener("click", function(event) {
    event.preventDefault();
    const value = document.getElementById("weatherInput").value;
    if (value === "")
      return;
    console.log(value);

    //Current weather section
    const url = "http://api.openweathermap.org/data/2.5/weather?q=" + value + ",US&units=imperial" + "&APPID=568f6454aa07033ffb8c507107f0550e";
    fetch(url)
    .then(function(response) {
      if (response.ok){
        return response.json();
      }
      else if (response.status === 404){
          let results = "<h3>City Not Found</h3>";
          document.getElementById("weatherResults").innerHTML = results;
          return Promise.reject("error404");
      }
      else{
          return Promise.reject("other error " + response.status);
      }
    }).then(function(json) {
      console.log("Currenent Weather")
      console.log(json);

      let results = "";
    
      results += '<h2>Weather in ' + json.name + "</h2>";
      results += "<h4> " + json.coord.lat + ", " + json.coord.lon + "</h4>";

      for (let i=0; i < json.weather.length; i++) {
	      results += '<img src="http://openweathermap.org/img/w/' + json.weather[i].icon + '.png"/>';
      }
      results += '<h2>' + json.main.temp + "&deg;F</h2>";

      results += "<p>";
      results += "High: " + json.main.temp_max + "&deg;F ";
      results += "Low: " + json.main.temp_min + "&deg;F";
      results += "</p>";

      results += "<p>";
      for (let i=0; i < json.weather.length; i++) {
        let desc = json.weather[i].description
	      results += capitalizeFirstLetter(desc);
	      if (i !== json.weather.length - 1){
	        results += ", ";
        }
      }
      results += "</p>";

      document.getElementById("weatherResults").innerHTML = results;
      document.getElementById("weatherResults").style.border = "2px ridge white";
    })

    //Weather forecast section
    const url2 = "http://api.openweathermap.org/data/2.5/forecast?q=" + value + ", US&units=imperial" + "&APPID=568f6454aa07033ffb8c507107f0550e";
    fetch(url2)
    .then(function(response) {
      if (response.ok){
        return response.json();
      }
      else if (response.status === 404){
          document.getElementById("forecastResults").innerHTML = "";
          document.getElementById("forecastResults").style.border = "none";
          return Promise.reject("error404");
      }
      else{
          return Promise.reject("other error " + response.status);
      }
    }).then(function(json) {
      console.log("Forecast")
      console.log(json);

      let forecast = "";

      for (let i=0; i < json.list.length; i++) {
        forecast += "<div id=\"forecastDay\">";
	      forecast += "<h2>" + moment(json.list[i].dt_txt).format('MMMM Do, h:mm a') + "</h2>";

	      forecast += "<p>High: " + json.list[i].main.temp_max + "&deg;F Low: " + json.list[i].main.temp_min + "&deg;F" + "</p>";

	      forecast += '<img src="http://openweathermap.org/img/w/' + json.list[i].weather[0].icon + '.png"/>';

        forecast += "<p>";
        for (let j=0; j < json.list[i].weather.length; j++) {
          let desc = json.list[i].weather[j].description
          forecast += capitalizeFirstLetter(desc);
          if (j !== json.list[i].weather.length - 1){
            forecast += ", ";
          }
        }
        forecast += "</p>";
        forecast += "</div>";
      }

      document.getElementById("forecastResults").innerHTML = forecast;
      document.getElementById("forecastResults").style.border = "2px ridge white";
    });
  });