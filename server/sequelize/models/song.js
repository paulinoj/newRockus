'use strict';
module.exports = function(sequelize, DataTypes) {
  var Song = sequelize.define('Song', {
    genre: DataTypes.STRING,
    title: DataTypes.STRING,
    soundcloudTrack: DataTypes.STRING,
    soundcloudUser: DataTypes.STRING,    
    SongListId: DataTypes.INTEGER,
    permalink_url: DataTypes.STRING,
    volume: DataTypes.DECIMAL
  }, {
    classMethods: {
      associate: function(models) {
        Song.belongsTo(models.SongList);
      }
    }
  });
  return Song;
};