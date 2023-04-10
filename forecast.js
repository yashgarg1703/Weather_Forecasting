const express=require("express");
const https=require("https");
const bodyParser=require("body-parser");
const app=express();
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));
// app.use(express.static("forecast.html"));
app.set('view engine', 'ejs');
var lists=[];
app.get("/",function(req,res){
  res.sendFile(__dirname+"/forecast.html");
});
app.post("/",function(req,res){
  const city=req.body.city_name;
 const url="https://api.openweathermap.org/data/2.5/forecast?q="+city+"&units=metric&appid=3c8e163cc72f70e1ddf841b1169eb943";
 https.get(url,function(response)
{
    response.on("data",function(data){
    const weatherData=JSON.parse(data);
    // console.log(weatherData);
    // console.log(weatherData.cod);
    if(weatherData.cod==='404')
    {
      res.sendFile(__dirname+"/error_404.html");
    }
    else{
    const date=new Date();
    const today = new Date();
    const year = today.getFullYear();
    const mes = today.getMonth()+1;
    const dia = today.getDate();
    const dt =dia+"-"+mes+"-"+year; 
    for(var i=0;i<7;i++)
{
    const ic=weatherData.list[i].weather[0].icon;
    String.prototype.replaceAt = function(index, replacement) {
        return this.substring(0, index) + replacement + this.substring(index + replacement.length);
    }
    const ico=ic.replaceAt(2,'d');
    // console.log(ico);
    const icon="http://openweathermap.org/img/wn/"+ico+"@2x.png";
    const desc=weatherData.list[i].weather[0].description;
    const cityname=weatherData.city.name;
    const temp=weatherData.list[i].main.temp;
    const humidity=weatherData.list[i].main.humidity;
    const windspeed=weatherData.list[i].wind.speed;
    const pressure=weatherData.list[i].main.pressure;
    const weekdays=date.toLocaleDateString("en-US",{weekday:"long"});
    date.setDate(date.getDate()+1);
    const list={
      cityname:cityname,
      description:desc,
      temp:temp,
      icon:icon,
      humidity:humidity,
      windspeed:windspeed,
      pressure:pressure,
      weekdays:weekdays
  };
  lists.push(list);
}
res.render("forecast",{lists:lists,dt:dt});
lists=[];
    }
});

  });

});
  // res.write("<p>THE WEATHER DESCRIPTION IS: "+weatherData.weather[0].description+"</p>");
  // res.write("<h1>THE TEMPERATURE IN "+weatherData.name+" IS "+weatherData.main.temp+" DEGREE CELCIUS</h1>");
  // res.write("<img src="+icon+"></img>");
  // res.send();
 
app.listen(5000,function(){
  console.log("7895");
});
