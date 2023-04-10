//var inputArea = document.querySelector("#");

var imdbAPIKey = "k_erq5m755"

// This function finds the season information from a series and logs each episode's release date
function imdb(){
    //---var search = id of selected series after search -- requires another function
    var search = "tt8111088"
    var showSeasons = " "
    fetch ("https://imdb-api.com/en/API/Title/"+imdbAPIKey+"/"+search)
    .then(function (response) {
        return response.json();
      })
      .then(function (data){
        console.log(data);
        var season = data.tvSeriesInfo.seasons.length;
        showSeasons = "https://imdb-api.com/en/API/SeasonEpisodes/"+imdbAPIKey+"/"+search+"/"+season
        })
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