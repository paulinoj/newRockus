const request = require('request');
const models = require('../sequelize/models');

var soundcloudKey;
if (process.env.SOUNDCLOUDKEY) {
  soundcloudKey = process.env.SOUNDCLOUDKEY;
}
else
{
  soundcloudKey = require('../../soundcloud.config.js')["key"];
}

exports.genre = function(req, res, next) {
  // JOHN you need to handle errors, i.e.
  // if (err) { return next(err); }
  models.User.findById(req.user.id).then(function(user) {
    user.getSongLists().then(function(songLists) {
      var excludeList = songLists.map(function(songList) {
        return songList.id;
      });
      excludeList.push(0);
      models.SongList.findAll({ where: { id: { $notIn: excludeList }, genre: req.params.genre, active: true } }).then(function(songLists) {
        if (songLists[0]) {
          // user.addSongList(songLists[0]);
          console.log(songLists);
          songLists[0].getSongs().then(function(songs) {
            var responseList = songs.map(function(song) {
              return { genre: req.params.genre, songListId: songLists[0].id, title: song.dataValues.title, url: `/song/${song.id}`}
            });
            res.json(responseList);
          });          
        }
        else
        {
          res.json([]);
        }
      });
    });
  });
};

exports.reset_game = function(req, res, next) {
  // User has already had their email and password auth'd
  // We just need to give them a token

  models.User.findOne({where: { id: req.user.id }}).then(function(user) {
    var userSongListCounts = {}, totalSongListCounts = {};

    models.SongList.findAll({where: { active: true }}).then(function(songLists) {
      for (var i = 0; i < songLists.length; i++) {
        if (totalSongListCounts[songLists[i].genre]) {
          totalSongListCounts[songLists[i].genre]++;
        }
        else
        {
          totalSongListCounts[songLists[i].genre] = 1;
        }
      }
      for (var genre in totalSongListCounts) {
        userSongListCounts[genre] = 0;
      }
      user.getSongLists({where: { active: true }}).then(function(songLists) {
        for (var i = 0; i < songLists.length; i++) {
          userSongListCounts[songLists[i].genre]++;
        }
  console.log("DO WE GET HERE");
  console.log(userSongListCounts);
  console.log(totalSongListCounts);

        res.json({ userSongListCounts, totalSongListCounts });
      });
    });
  });
};

// var testCounter = 0;

exports.song = function(req, res, next) {
  models.Song.findById(Number(req.params.number)).then(function(song) {
    // Either make function for creating soundcloudURL or make method on song model
    // if (Number(req.params.number) === 5 && testCounter === 2) {
    //   song.soundcloudTrack = 25278226;
    // }
    // else
    // {
    //   if (Number(req.params.number) === 5)
    //     testCounter++;
    // }
    const soundcloudURL = `https://api.soundcloud.com/tracks/${song.soundcloudTrack}/stream?client_id=${soundcloudKey}`;
      request.get(soundcloudURL, {timeout: 10000}, function(err) {
        // If connection error, notify client
        if (err && err.connect) {
          res.status(504).send("Timeout error");
          return next(err);
        }}).on('response', function(response) {
          if (Number(response.statusCode) === 500) {
            song.getSongList().then(function(songList) {
              songList.update({active: false});
            });
          }
          console.log("Response status code for ", req.params.number, ":  ", response.statusCode);
        }).pipe(res);
  }).catch(function(err) {
      if (err) { return next(err); }
    });
};
