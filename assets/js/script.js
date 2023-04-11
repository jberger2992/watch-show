//var inputArea = document.querySelector("#");
var platformFreeDiv = document.getElementById("platformFree");
var platformSubDiv = document.getElementById("platformSub");
var imageArea = document.querySelector("#image");
var watchAPIKey = "kexqrRzfkp9L3pTm4GEx1pAlL0xl51BftYIYPNjC";
var imdbAPIKey = "k_erq5m755";
var showInfoDiv = document.getElementById("show-info");

//var showSearched = inputArea.value
var showSearched = "Bones"; // placeholder search

//var selectedTitle = "";
//var selectedID = "";
//var selectedImage = "";
//var selectedDescription = "";
var selectedTitle = "The Mandalorian"; //placeholder search "The Mandalorian"
var selectedID = "tt8111088"; // placeholder search "The Mandalorian"
// var selectedID = "tt0460627"; // placeholder search "Bones"
var selectedImage = "https://m.media-amazon.com/images/M/MV5BZjRlZDIyNDMtZjIwYi00YmJiLTg4NjMtODA2Mjc0YTBlNzIwXkEyXkFqcGdeQXVyMDM2NDM2MQ@@._V1_Ratio0.6757_AL_.jpg"; //placeholder search "The Mandalorian"
var selectedDescription = "2019- TV Series Pedro Pascal, Chris Bartlett"; //placeholder search "The Mandalorian"
var season = "3";

// This function finds the season information from a series and logs each episode's release date
function searchSeasons(){
    // var showSeasons = " "
    //fetches the selected title's ID to get the number of seasons in order to determin the current season
    fetch ("https://imdb-api.com/en/API/Title/"+imdbAPIKey+"/"+selectedID)
    .then(function (response) {
        return response.json();
      })
      .then(function (data){
        console.log(data); // --remove for deploy--
        season = data.tvSeriesInfo.seasons.length;
        searchNextDate();
        })
}

//fetches the season information to get the release dates of episodes
function searchNextDate(){
  fetch("https://imdb-api.com/en/API/SeasonEpisodes/"+imdbAPIKey+"/"+selectedID+"/"+season)
  .then(function (response) {
      return response.json();
    })
    .then(function (data){
        console.log(data); // --remove for deploy--
        for (let i = 0; i < data.episodes.length; i++) {
            console.log(data.episodes[i].released)
            var newDate = data.episodes[i].released.replace(".", "");
            var newUnix = dayjs(newDate).unix();
            var nowUnix = Date.now();
            var newUnixM = newUnix*1000
            if(newUnix >= nowUnix){
                console.log(newDate);
                return;
            }
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
        console.log(data); // --remove for deploy--
        // displays for each result from the search
        for (let i = 0; i < data.results.length; i++) {
            var titleBtn = document.createElement("button");
            titleBtn.innerText = data.results[i].title;
            titleBtn.classList.add("delete");
            document.body.appendChild(titleBtn);
            var descriptionP = document.createElement("p");
            descriptionP.innerText = data.results[i].description;
            descriptionP.classList.add("delete");
            document.body.appendChild(descriptionP);
            // on clicking a title it sets the values for that title and deletes the search results from the page
            titleBtn.addEventListener("click", function(){
                selectedTitle = data.results[i].title;
                selectedID = data.results[i].id;
                selectedImage = data.results[i].image;
                selectedDescription = data.results[i].description;
                document.querySelectorAll('.delete').forEach(e => e.remove());
                displayShow()
            })
        }
        })
}

//fetches where the selected show can be streamed
function findPlatforms(){
    fetch("https://api.watchmode.com/v1/title/"+selectedID+"/details/?apiKey="+watchAPIKey+"&append_to_response=sources")
    .then(function (response) {
        return response.json();
    })
      .then(function (data){
        console.log(data); // --remove for deploy--
        //TODO: Instead of text, display links to streaming site
        var streamFree = document.createElement("h6");
        streamFree.textContent = "Free: "
        streamFree.classList.add("delete");
        platformFreeDiv.appendChild(streamFree);
        var streamSub = document.createElement("h6");
        streamSub.textContent = "Sub: "
        platformSubDiv.appendChild(streamSub);
        for (let i = 0; i < data.sources.length; i++) {
            if(data.sources[i].type == "sub"){
                console.log("sub", data.sources[i].name);
                var platformSub = document.createElement("p");
                platformSub.textContent = data.sources[i].name;
                platformSubDiv.appendChild(platformSub); 
            }
            if(data.sources[i].type == "free"){
                console.log("free", data.sources[i].name)
                var platformFree = document.createElement("p");
                platformFree.textContent = data.sources[i].name;
                platformFreeDiv.appendChild(platformFree);
            }
        }
    })
}

function displayShow(){
    imageArea.src = selectedImage;
    var titleH3 = document.createElement("h3");
    var descriptionP = document.createElement("p");
    titleH3.innerText = selectedTitle;
    descriptionP.innerText = selectedDescription;
    showInfoDiv.appendChild(titleH3);
    showInfoDiv.appendChild(descriptionP);
    searchSeasons();
}