//var inputArea = document.querySelector("#");
var platformFreeDiv = document.getElementById("platformFree");
var platformSubDiv = document.getElementById("platformSub");
var imageArea = document.querySelector("#image");
var watchAPIKey = "kexqrRzfkp9L3pTm4GEx1pAlL0xl51BftYIYPNjC";
var imdbAPIKey = "k_erq5m755";
// var imdbAPIKey = "k_6hswr9n7";
var showInfoDiv = document.getElementById("show-info");
var episodeDiv = document.getElementById("episode");


// var updates possible shows list font format
// var buttonFormat = document.querySelectorAll(".searchD .searchbtn");
// buttonFormat.forEach(button => {
//     button.style.fontWeight = "bold";
//     button.style.fontColor = "blue";
//     button.style.backgroundColor = "white";
//     button.style.border = "none";
//     buttonFormat.style.fontSize = "15px";
//     button.style.padding = "2.5px";
// });

//var showSearched = inputArea.value
var showSearched = "The Mandalorian"; // placeholder search

var favoriteShowsID = []
var favoriteShowsSea = []
// var favoriteShowsID = ["tt8111088", "tt3107288","tt0460627"] //placeholder shows
// var favoriteShowsSea = ["3","9","12"] //placeholder seasons

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
        //loops through episodes from the latest season
        for (let i = 0; i < data.episodes.length; i++) {
            console.log(data.episodes[i].released)
            var newDate = data.episodes[i].released.replace(".", "");
            var newUnix = dayjs(newDate).unix();
            var nowUnix = Date.now();
            var newUnixM = newUnix*1000
            //When the next coming episode is found, displays result to page
            if(newUnixM > nowUnix){
                var episodeTitle = document.createElement("p");
                episodeTitle.innerText = data.episodes[i].title;
                episodeTitle.classList.add("selectD");
                episodeDiv.appendChild(episodeTitle);
                var episodeDate = document.createElement("p");
                episodeDate.innerText = data.episodes[i].released;
                episodeDate.classList.add("selectD");
                episodeDiv.appendChild(episodeDate);
                    if(favoriteShowsID.length < 6){
                    var favoriteBtn = document.createElement("button");
                    favoriteBtn.innerText = "Favorite";
                    favoriteBtn.classList.add("selectD");
                    episodeDiv.appendChild(favoriteBtn);
                    favoriteBtn.addEventListener("click", function(){
                            favoriteShowsID.push(selectedID);
                            favoriteShowsSea.push(season);
                            localStorage.setItem("Favorite Shows", JSON.stringify(favoriteShowsID));
                            localStorage.setItem("Favorite Shows Seasons", JSON.stringify(favoriteShowsSea));
                        })
                    }
                return;
            }
        }
        var lastEp = data.episodes.length - 1;
        var oldEp = document.createElement("p");
        oldEp.innerText = "Last aired episode: "
        oldEp.classList.add("selectD");
        episodeDiv.appendChild(oldEp);
        var recent = document.createElement('p');
        recent.innerText = data.episodes[lastEp].released.replace(".", "");
        recent.classList.add("selectD");
        episodeDiv.appendChild(recent);
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
        var titleResults = data.results;
        console.log(titleResults);
        if(data.results.length > 10){
            titleResults = data.results.slice(0,5);
        }
        // displays for each result from the search
        for (let i = 0; i < titleResults.length; i++) {
            var searchCard = document.createElement("div");
            searchCard.classList.add("searchD","searchcard");
            showInfoDiv.appendChild(searchCard);
            var titleBtn = document.createElement("button");
            titleBtn.innerText = data.results[i].title;
            titleBtn.classList.add("searchD","searchbtn");
            searchCard.appendChild(titleBtn);
            var descriptionP = document.createElement("p");
            descriptionP.innerText = data.results[i].description;
            descriptionP.classList.add("searchD");
            searchCard.appendChild(descriptionP);
            // on clicking a title it sets the values for that title and deletes the search results from the page
            titleBtn.addEventListener("click", function(){
                selectedTitle = data.results[i].title;
                selectedID = data.results[i].id;
                selectedImage = data.results[i].image;
                selectedDescription = data.results[i].description;
                document.querySelectorAll('.searchD').forEach(e => e.remove());
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
        streamFree.classList.add("streamD");
        platformFreeDiv.appendChild(streamFree);
        var streamSub = document.createElement("h6");
        streamSub.textContent = "Sub: "
        streamFree.classList.add("streamD");
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

//Creates the elements to display the selected show
function displayShow(){
    imageArea.src = selectedImage;
    var titleH3 = document.createElement("h3");
    titleH3.innerText = selectedTitle;
    titleH3.classList.add("selectD")
    showInfoDiv.appendChild(titleH3);
    var descriptionP = document.createElement("p");
    descriptionP.innerText = selectedDescription;
    descriptionP.classList.add("selectD");
    showInfoDiv.appendChild(descriptionP);
    searchSeasons();
}

function loadFavorites(){
    favoriteShowsID = JSON.parse(localStorage.getItem("Favorite Shows"));
    favoriteShowsSea = JSON.parse(localStorage.getItem("Favorite Shows Seasons"));
    if(favoriteShowsID){
    for (let i = 0; i < favoriteShowsID.length; i++) {
                fetch("https://imdb-api.com/en/API/SeasonEpisodes/"+imdbAPIKey+"/"+favoriteShowsID[i]+"/"+favoriteShowsSea[i])
                .then(function (response) {
                    return response.json();
                  })
                  .then(function (data){
                      console.log(data); // --remove for deploy--
                      //loops through episodes from the latest season
                      var favoriteCard = document.createElement("div");
                      favoriteCard.classList.add("favoriteD","favoritecard");
                      showInfoDiv.appendChild(favoriteCard);
                      var titleH5 = document.createElement("h5");
                      titleH5.innerText = data.title;
                      favoriteCard.classList.add("favoriteD");
                      favoriteCard.appendChild(titleH5);
                      console.log(data); // --remove for deploy--
                      for (let i = 0; i < data.episodes.length; i++) {
                            console.log(data.episodes[i].released)
                            var newDate = data.episodes[i].released.replace(".", "");
                            var newUnix = dayjs(newDate).unix();
                            var nowUnix = Date.now();
                            var newUnixM = newUnix*1000
                            //When the next coming episode is found, displays result to page
                            if(newUnixM > nowUnix){
                                var episodeTitle = document.createElement("p");
                                episodeTitle.innerText = data.episodes[i].title;
                                episodeTitle.classList.add("favoriteD");
                                favoriteCard.appendChild(episodeTitle);
                                var episodeDate = document.createElement("p");
                                episodeDate.innerText = data.episodes[i].released;
                                episodeDate.classList.add("favoriteD");
                                favoriteCard.appendChild(episodeDate);
                                return;
                            }
                        }
                        var lastEp = data.episodes.length - 1;
                        var oldEp = document.createElement("p");
                        oldEp.innerText = "Last aired episode: "
                        oldEp.classList.add("favoriteD");
                        favoriteCard.appendChild(oldEp);
                        var recent = document.createElement('p');
                        recent.innerText = data.episodes[lastEp].released.replace(".", "");
                        recent.classList.add("favoriteD");
                        favoriteCard.appendChild(recent);
                })
            }
    }
}