require('dotenv').config();

const express = require('express');
const hbs = require('hbs');
const SpotifyWebApi = require('spotify-web-api-node')

// We are requiring Spotify API
const app = express();

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));

// Setting the spotify-api
const spotifyApi = new SpotifyWebApi({
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET
  });
  
  // Retrieving an access token
  spotifyApi
    .clientCredentialsGrant()
    .then(data => spotifyApi.setAccessToken(data.body['access_token']))
    .catch(error => console.log('Something went wrong when retrieving an access token', error));



// Setting the routes
app.get("/", (req, res) => {
    res.render("home")
})

app.get("/artistSearch", (req, res) => {
    
    const artist = req.query.artist
    spotifyApi
        .searchArtists(artist)
        .then(data => {
        const artists = data.body.artists.items
        res.render("artistSearch", {artists})
        })
        .catch(err => console.log('The error while searching artists occurred: ', err));
    
})

app.get('/albums/:artistId', (req, res, next) => {
    const artistId = req.params.artistId;
  
  spotifyApi.getArtistAlbums(artistId)
    .then(data => {
      const albums = data.body.items;
      res.render('albums', {albums});
    })
    .catch(err => console.log('The error while searching albums occurred: ', err));
  });

app.get("/tracks/:albumId", (req, res) => {
    const albumId = req.params.albumId;
  
  spotifyApi.getAlbumTracks(albumId)
    .then(data => {
      const tracks = data.body.items;
      res.render('tracks', {tracks});
      console.log(tracks)
    })
    .catch(err => console.log('The error while searching tracks occurred: ', err));
})


app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));
