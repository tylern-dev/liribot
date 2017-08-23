var keys = require('./keys.js')
var inquirer = require('inquirer');
var twitter = require('twitter');
var spotify = require('node-spotify-api');
var request = require('request');
var fs = require('fs');

/***** INQUIRER PROMPTS *****/
inquirer.prompt([
    {
        type: 'list',
        message: 'Please select one of the follwing to start your request',
        choices: ['Tweets', 'Spotify this song', 'movie-this', 'do what it says'],
        name: 'selector'

    }
]).then(function(inquirerRequest){
    //TWITTER INQUIRER
    if(inquirerRequest.selector === 'Tweets'){
        inquirer.prompt([
            {
                type: 'input',
                message: 'Please enter a Twitter Handle:',
                name: 'twitterHandler'
            }
        ]).then(function(tHandle){
            getTweet(tHandle.twitterHandler)
        })
        //SPOTIFY INQUIRER
    } else if(inquirerRequest.selector === 'Spotify this song'){
        inquirer.prompt([
            {
                type: 'input',
                message: 'Plese enter the name of a song:',
                default: 'Ace of Base The Sign',
                name: 'spotifyHandler'
            }
        ]).then(function(sHandle){
            getSpotify(sHandle.spotifyHandler);
        })
        //MOVIE INQUIRER
    } else if (inquirerRequest.selector === 'movie-this'){
        inquirer.prompt([
            {
                type: 'input',
                message: 'Enter title of movie',
                name: 'movieHandler'
            }
        ]).then(function(mHandle){
            getMovie(mHandle.movieHandler);
        })
    } else if (inquirerRequest.selector === 'do what it says'){
        
    }
})
/* ************************ */ //END INQUIRER 


function getTweet(tHandle){
    var twitterKeys = new twitter(keys.twitterKeys)
    
    //Twitter search parameters
    var twitterParams = {
        screen_name: tHandle,
        count:10,
    }
    twitterKeys.get('statuses/user_timeline', twitterParams, function(error, tweets, response){
        if(!error){
            tweets.forEach(function(element) {
                console.log(element.text)
                console.log('=================== \n')
            });
        }
    })
}

function getSpotify(spotifySong){
    var spotifySearch = new spotify(keys.spotifyKeys)
    var spotifyParams = {
        type: 'track',
        query: spotifySong
    }
    spotifySearch.request('https://api.spotify.com/v1/search?q='+spotifyParams.query+'&type=track')
        .then(function(data) {
            var artist = data.tracks.items[0].artists[0].name
            var songName = data.tracks.items[0].name
            var previewLink = data.tracks.items[0].preview_url
            var albumName = data.tracks.items[0].album.name
            console.log('Artist: '+ artist)
            console.log('Song Name: '+songName)
            console.log('Preview URL: '+previewLink)
            console.log('Album Name: '+albumName)    
        })
        .catch(function(err) {
            console.error('Error occurred: ' + err); 
    });
};


function getMovie(movieTitle){
    var omdbURL = 'http://www.omdbapi.com/?apikey='+keys.omdbKeys.key+'&t='+movieTitle
    var request = require('request');
    request(omdbURL, function (error, response, body) { 
        var bodyParse = JSON.parse(body);
        console.log('Title: '+bodyParse.Title);
        console.log('Year Released: '+bodyParse.Year);
        console.log('IMDB Rating: '+bodyParse.imdbRating);
        console.log('Rotten Tomatoes Rating: '+bodyParse.Ratings[1].Value);
        console.log('Country(s) Produced : '+bodyParse.Country);
        console.log('Language: '+bodyParse.Language);
        console.log('Plot: '+bodyParse.Plot);
        console.log('Actor(s): '+bodyParse.Actors)
    });
}