//var inputArea = document.querySelector("#");
var watchAPIKey = "kexqrRzfkp9L3pTm4GEx1pAlL0xl51BftYIYPNjC";
var imdbAPIKey = "k_erq5m755";

//var showSearched = inputArea.value
var showSearched = "Mandalorian"; // placeholder search

//var selectedID = id of selected series after search -- requires another function
// var selectedID = "tt8111088"; // placeholder search "The Mandalorian"
var selectedID = "tt0460627"; // placeholder search "Bones"

// This function finds the season information from a series and logs each episode's release date
function searchSeasons(){
    var showSeasons = " "
    //fetches the selected title's ID to get the number of seasons in order to determin the current season
    fetch ("https://imdb-api.com/en/API/Title/"+imdbAPIKey+"/"+selectedID)
    .then(function (response) {
        return response.json();
      })
      .then(function (data){
        console.log(data);
        var season = data.tvSeriesInfo.seasons.length;
        showSeasons = "https://imdb-api.com/en/API/SeasonEpisodes/"+imdbAPIKey+"/"+search+"/"+season
        })
    //fetches the season information to get the release dates of episodes
  fetch(showSeasons)
  .then(function (response) {
      return response.json();
    })
    .then(function (data){
        console.log(data);
        for (let i = 0; i < data.episodes.length; i++) {
            console.log(data.episodes[i].released)
        }
    })
}
//fetches results for the searched title
function searchShows(){
    fetch("https://imdb-api.com/en/API/SearchSeries/"+imdbAPIKey+"/"+showSearched)
    .then(function (response) {
        return response.json();
    })
      .then(function (data){
        console.log(data);
        //--data.results[i].title -- Title of the show
        //--data.results[i].id -- id used for further fetches
        //--data.results[i].image -- image for the show
        //--data.results[i].description -- description of the show
        })
}

function findPlatforms(){
    fetch("https://api.watchmode.com/v1/title/"+selectedID+"/details/?apiKey="+watchAPIKey+"&append_to_response=sources")
    .then(function (response) {
        return response.json();
    })
      .then(function (data){
        console.log(data);
        for (let i = 0; i < data.sources.length; i++) {
            if(data.sources[i].type == "sub"){
                console.log("sub", data.sources[i].name)
            }
            if(data.sources[i].type == "free"){
                console.log("free", data.sources[i].name)
            }
        }
    })
}