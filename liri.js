require("dotenv").config();

const axios = require("axios");
const keys = require("./keys.js");
const moment = require("moment");
const Spotify = require("node-spotify-api");
const fs = require("fs");
moment().format();

var spotify = new Spotify(keys.spotify);

var arg1 = process.argv[2];
var arg2 = "";
for(var i = 3; i < process.argv.length; i++){
    arg2 = arg2 + process.argv[i] + " ";
}
console.log(arg2);

switch(arg1) {
    case "concert-this":
        concert(arg2);
        break;
    case "spotify-this-song":
        song(arg2);
        break;
    case "movie-this":
        movie(arg2);
        break;
    case "do-what-it-says":
        doWhatItSays();
        break;
    default:
        console.log("Please input a command");
}

function concert(arg) {
    var band = arg;
    band = band.split(" ").join("+");
    if(band.charAt(band.length - 1) === "+")
        band = band.slice(0, band.length - 1);
    if(band == undefined || band === "")
        band = "Weezer";
    axios.get("https://rest.bandsintown.com/artists/" + band + "/events?app_id=codingbootcamp").then(
        function(response){
            var data = response.data;
            for(var i = 0; i < data.length; i++) {
                var name = data[i].venue.name;
                if(data[i].venue.region === "" || data[i].venue.region === undefined)
                    var location = data[i].venue.city + ", " + data[i].venue.country;
                else
                    var location = data[i].venue.city + ", " + data[i].venue.region + ", " + data[i].venue.country;
                var date = data[i].datetime;
                date = moment(date).format("MM/DD/YYYY");
                console.log("Name: " + name + "\nLocation: " + location + "\nDate: " + date + "\n");
            }
        }
    )
}

function song(arg) {
    var song = arg;
    if(song === undefined || song === ""){
        song = "The Sign";
    }
    spotify.search({
        type: "track",
        query: song
    }).then(function(response){
        var data = response.tracks.items;
        for(var j = 0; j < data.length; j++){
            var artists = data[j].artists[0].name;
            var song = data[j].name;
            var link = data[j].external_urls.spotify;
            var album = data[j].album.name;
            console.log("\nArtists: " + artists + "\nSong: " + song + "\nPreview: " + link + "\nAlbum: " + album);
        }
    });
}

function movie(arg) {
    var movie = arg;
    movie = movie.split(" ").join("+");
    if(movie.charAt(movie.length - 1) === "+")
        movie = movie.slice(0, movie.length - 1);
    if(movie === undefined || movie === ""){
        movie = "Mr. Nobody";
    }
    axios.get("http://www.omdbapi.com/?t=" + movie + "&y=&plot=short&apikey=trilogy").then(
        function(response) {
            var data = response.data;
            var title = data.Title;
            var year = data.Year;
            var ratings = data.Ratings;
            var imdbRating = "N/A";
            var tomRating = "N/A";
            var country = data.Country;
            var lang = data.Language;
            var plot = data.Plot;
            var actors = data.Actors;
            for(var j = 0; j < ratings.length; j++){
                if(ratings[j].Source === "Internet Movie Database") {
                    imdbRating = ratings[j].Value;
                }
                else if(ratings[j].Source === "Rotten Tomatoes") {
                    tomRating = ratings[j].Value;
                }
            }
            console.log("Title: " + title + "\nYear: " + year + "\nIMDB Rating: " + imdbRating + "\nRotten Tomatoes Rating: " + tomRating
                + "\nCountry: " + country + "\nLanguage: " + lang + "\nPlot: " + plot + "\nActors: " + actors);
        }
    )
}

function doWhatItSays() {
    var filePath = "./random.txt";
    fs.readFile(filePath, "utf8", function(err, data){
        if(err){
            console.log("Error: " + err);
        }
        var args = data.split(",");
        switch(args[0]) {
            case "concert-this":
                concert(args[1]);
                break;
            case "spotify-this-song":
                song(args[1]);
                break;
            case "movie-this":
                movie(args[1]);
                break;
        }
    })
}