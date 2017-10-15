# liribot
Command Line app that displays answers to a user's query. This was built using Node.js.
*********
### To Install:
1. clone this repo
2. cd into liribot `cd liribot`
3. Install the packages `npm install`
  * If you don't have NPM installed follow this instructions [here](https://www.npmjs.com/get-npm)
4. You are all set 

#### You can run the app either by:
1. node liri.js `node liri.js` (this will present a list of options to choose from)
OR
2. node liri.js **command  user-input** 

  
#### Available Commands:
* my-tweets `node liri.js my-tweets kingjames`
* spotify-this-song `node liri.js spotify-this-song "bohemian rhapsody"`
* movie-this `node liri.js movie-this inception`
* do-what-it-says 
  * (This command reads a text file in the liribot directory and performs the command based on what is in the file. See random.txt)

#### This app uses these NPM packages:
1. inquirer (simplifies asking questions and receiving user input)
2. twitter
3. node-spotify-api
4. request 


