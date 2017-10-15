var keys = require('./keys.js')
var inquirer = require('inquirer');
var twitter = require('twitter');
var spotify = require('node-spotify-api');
var request = require('request');
var fs = require('fs');

var command = process.argv[2];
var userInput = process.argv[3];

writeCommand(command,userInput)

/**** Process.argv logic *****/
if (!command){
    inquirePrompts()
}
else if(command === 'my-tweets'){
    if(userInput === null){
        userInput = 'kingjames'
    } else {
        getTweet(userInput)
    }
}
else if(command === 'spotify-this-song'){
    if(userInput === null){
        userInput = 'Ace of Base The Sign'
    } else {
        getSpotify(userInput)
    }
}
else if(command === 'movie-this'){
    if(userInput === null){
        userInput = 'Inception'
    } else {
        getMovie(userInput)
    }
}
else if(command === 'do-what-it-says'){
    runFile()
} else {
    console.log('\n******Invalid Command******')
    console.log('Please try one of these commands:\n')
    inquirePrompts();
}
/* ****************** */


/***** INQUIRER PROMPTS *****/
// this is what will ask users the questions depending on what option is selected
function inquirePrompts(){
    inquirer.prompt([
        {
            type: 'list',
            message: 'Please select one of the follwing to start your request',
            choices: ['my-tweets', 'spotify-this-song', 'movie-this', 'do-what-it-says'],
            name: 'commandSelector'

        }
    ]).then(function(inquirerRequest){
        //TWITTER INQUIRER
        if(inquirerRequest.commandSelector === 'my-tweets'){
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
        } else if(inquirerRequest.commandSelector === 'spotify-this-song'){
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
        } else if (inquirerRequest.commandSelector === 'movie-this'){
            inquirer.prompt([
                {
                    type: 'input',
                    message: 'Enter title of movie:',
                    default: 'Inception',
                    name: 'movieHandler'
                }
            ]
        ).then(function(mHandle){
                getMovie(mHandle.movieHandler);
            })
        } else if (inquirerRequest.commandSelector === 'do-what-it-says'){
            runFile()
        }
    })
}
/* **********END INQUIRER************ */  


/* TWITTER FUNCTION */
//received input from user and returs either the default twitter handle or the inputed one
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
                console.log('===================\n')
            });
        }
    })
}

/* ****SPOTIFY FUNCTION**** */
//passes in user's input and returns the query
function getSpotify(spotifySong){
    var spotifySearch = new spotify(keys.spotifyKeys)
    var spotifyParams = {
        type: 'track',
        query: spotifySong //uses input from user and sets it to query
    }
    spotifySearch.request('https://api.spotify.com/v1/search?q='+spotifyParams.query+'&type=track')
        .then(function(data) {
            var artist = data.tracks.items[0].artists[0].name
            var songName = data.tracks.items[0].name
            var previewLink = data.tracks.items[0].preview_url
            var albumName = data.tracks.items[0].album.name
            console.log('====================')
            console.log('Artist: '+ artist)
            console.log('Song Name: '+songName)
            console.log('Preview URL: '+previewLink)
            console.log('Album Name: '+albumName) 
            console.log('====================')   
        })
        .catch(function(err) {
            console.error('Error occurred: ' + err); 
    });
};

/* ****GET MOVIE FUNCTION**** */
//passes in user's input and returns the query
function getMovie(movieTitle){
    var omdbURL = 'http://www.omdbapi.com/?apikey='+keys.omdbKeys.key+'&t='+movieTitle
    var request = require('request');
    request(omdbURL, function (error, response, body) { 
        var bodyParse = JSON.parse(body);
        console.log('====================\n')  
        console.log('Title: '+bodyParse.Title);
        console.log('Year Released: '+bodyParse.Year);
        console.log('IMDB Rating: '+bodyParse.imdbRating);
        console.log('Rotten Tomatoes Rating: '+bodyParse.Ratings[1].Value);
        console.log('Country(s) Produced : '+bodyParse.Country);
        console.log('Language: '+bodyParse.Language);
        console.log('Plot: '+bodyParse.Plot);
        console.log('Actor(s): '+bodyParse.Actors)
        console.log('\n====================')  
    });
}

function runFile(){
    fs.readFile('./random.txt', 'utf8', function(err, data){
        var splitData = data.split(',');
        var dataCommand = splitData[0];
        var dataInput = splitData[1];
        if(dataCommand === 'spotify-this-song'){
            getSpotify(dataInput)
        }
    })
}

function writeCommand(cmd, userInput){
    var writeString = cmd+','+'"'+userInput+'"\n';
    fs.appendFile("./log.txt", writeString, "utf8",function(err){
        if(err){
            return console.log("Error: "+err)
        }
    });

}

