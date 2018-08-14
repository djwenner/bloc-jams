var setSong = function(songNumber) {
    if (currentSoundFile) {
        currentSoundFile.stop();
    }

    currentlyPlayingSongNumber = parseInt(songNumber);
    currentSongFromAlbum = currentAlbum.songs[songNumber - 1];

    currentSoundFile = new buzz.sound(currentSongFromAlbum.audioUrl, {
        formats: [ 'mp3' ],
        preload: true
    });

    setVolume(currentVolume);
};

var seek = function(time) {
    if (currentSoundFile) {
        currentSoundFile.setTime(time);
    }
};

var setVolume = function(volume) {
    if (currentSoundFile) {
        currentSoundFile.setVolume(volume);
    }
};

var getSongNumberCell = function(number) {
    return $('.song-item-number[data-song-number="' + number + '"]');
};

// This function generates song row content.
var createSongRow = function(songNumber, songName, songLength) {
    var template =
        '<tr class="album-view-song-item">' +
        '<td class="song-item-number" data-song-number="' + songNumber + '">' + songNumber + '</td>' +
        '<td class="song-item-title">' + songName +
        '</td>' + '  <td class="song-item-duration">' + filterTimeCode(songLength) + '</td>' + '</tr>'
     ;

    var $row = $(template);

    var clickHandler = function() {

        var songNumber = parseInt($(this).attr('data-song-number'));

    	  if (currentlyPlayingSongNumber !== null) {
    		// Revert to song number for currently playing song because user started playing new song.
    		var currentlyPlayingCell = getSongNumberCell(currentlyPlayingSongNumber);
    		currentlyPlayingCell.html(currentlyPlayingSongNumber);
    	}

    	if (currentlyPlayingSongNumber !== songNumber) {
    		  // Switch from Play -> Pause button to indicate new song is playing.
          setSong(songNumber);
          currentSoundFile.play();
          updateSeekBarWhileSongPlays();
          currentSongFromAlbum = currentAlbum.songs[songNumber - 1];

          var $volumeFill = $('.volume .fill');
          var $volumeThumb = $('.volume .thumb');
          $volumeFill.width(currentVolume + '%');
          $volumeThumb.css({left: currentVolume + '%'});

          $(this).html(pauseButtonTemplate);
          updatePlayerBarSong();
    	} else if (currentlyPlayingSongNumber === songNumber) {
          if (currentSoundFile.isPaused()) {
          $(this).html(pauseButtonTemplate);
          $('.main-controls .play-pause').html(playerBarPauseButton);
          currentSoundFile.play();
      } else {
          $(this).html(playButtonTemplate);
          $('.main-controls .play-pause').html(playerBarPlayButton);
          currentSoundFile.pause();
      }

    }
};

    var onHover = function(event) {
        var songNumberCell = $(this).find('.song-item-number');
        var songNumber = parseInt(songNumberCell.attr('data-song-number'));

        if (songNumber !== currentlyPlayingSongNumber) {
            songNumberCell.html(playButtonTemplate);
        }
    };

    var offHover = function(event) {
        var songNumberCell = $(this).find('.song-item-number');
        var songNumber = parseInt(songNumberCell.attr('data-song-number'));

        if (songNumber !== currentlyPlayingSongNumber) {
            songNumberCell.html(songNumber);
        }
// console.log("songNumber type is " + typeof songNumber + "\n and currentlyPlayingSongNumber type is " + typeof currentlyPlayingSongNumber);
    };

     $row.find('.song-item-number').click(clickHandler);
     // #2
     $row.hover(onHover, offHover);
     // #3
     return $row;
};

// This function injects the album object's stored info into the template.
var setCurrentAlbum = function(album) {
  // assigns the variable to album
    currentAlbum = album;

    // #1 HTML elements populated and then moved to global scope to be accessed
    // by event listener.
    var $albumTitle = $('.album-view-title');
    var $albumArtist = $('.album-view-artist');
    var $albumReleaseInfo = $('.album-view-release-info');
    var $albumImage = $('.album-cover-art');
    var $albumSongList = $('.album-view-song-list');

    // #2 nodeValue sets value of the first child node.
    $albumTitle.text(album.title);
    $albumArtist.text(album.artist);
    $albumReleaseInfo.text(album.year + ' ' + album.label);
    $albumImage.attr('src', album.albumArtUrl);

    // #3 Clearing album song list HTML to ensure working with a "clean slate."
    $albumSongList.empty();

    // #4 Going through all the songs from the specified album object
    for (var i = 0; i < album.songs.length; i++) {
      var $newRow = createSongRow(i + 1, album.songs[i].title, album.songs[i].duration);
      $albumSongList.append($newRow);
    }
};

// Function to set the text of the element with .total-time class to the length of the song
var setTotalTimeInPlayerBar = function(totalTime) {
  $('.total-time').text(filterTimeCode(totalTime));
};

// New function to handle calculations
var filterTimeCode = function(timeInSeconds) {
  // Get seconds in number form
  var parsedSeconds = parseFloat(timeInSeconds);
  // Get number of minutes (math function to round down)
  var getMinutes = Math.floor(parsedSeconds / 60);
  // Get number of seconds
  var getSeconds = Math.floor(parsedSeconds % 60);
  // Formatting time output
  getSeconds = getSeconds < 10 ? "0" + getSeconds : getSeconds;
  return getMinutes + ":" + getSeconds;

  setTotalTimeInPlayerBar();
};

// Function that sets element text w/ .current-time class to current time in song
var setCurrentTimeInPlayerBar = function(currentTime) {
   $('.current-time').text(filterTimeCode(currentTime));
};

var updateSeekBarWhileSongPlays = function() {
    if (currentSoundFile) {

        currentSoundFile.bind('timeupdate', function(event) {

            var seekBarFillRatio = this.getTime() / this.getDuration();
            var $seekBar = $('.seek-control .seek-bar');

            updateSeekPercentage($seekBar, seekBarFillRatio);
            setCurrentTimeInPlayerBar(this.getTime());
            setTotalTimeInPlayerBar(this.getDuration());
        });
    }
};

var updateSeekPercentage = function($seekBar, seekBarFillRatio) {
   var offsetXPercent = seekBarFillRatio * 100;
   // #1
   offsetXPercent = Math.max(0, offsetXPercent);
   offsetXPercent = Math.min(100, offsetXPercent);

   // #2
   var percentageString = offsetXPercent + '%';
   $seekBar.find('.fill').width(percentageString);
   $seekBar.find('.thumb').css({left: percentageString});
};

var setupSeekBars = function() {
    var $seekBars = $('.player-bar .seek-bar');

    $seekBars.click(function(event) {
        var offsetX = event.pageX - $(this).offset().left;
        var barWidth = $(this).width();
        var seekBarFillRatio = offsetX / barWidth;

        if ($(this).parent().attr('class') == 'seek-control') {
            seek(seekBarFillRatio * currentSoundFile.getDuration());
        } else {
            setVolume(seekBarFillRatio * 100);
        }

        updateSeekPercentage($(this), seekBarFillRatio);
    });

    $seekBars.find('.thumb').mousedown(function(event) {

        var $seekBar = $(this).parent();

        $(document).bind('mousemove.thumb', function(event){
            var offsetX = event.pageX - $seekBar.offset().left;
            var barWidth = $seekBar.width();
            var seekBarFillRatio = offsetX / barWidth;

            if ($seekBar.parent().attr('class') == 'seek-control') {
                seek(seekBarFillRatio * currentSoundFile.getDuration());
            } else {
                setVolume(seekBarFillRatio);
            }

            updateSeekPercentage($seekBar, seekBarFillRatio);
        });

        // #10
        $(document).bind('mouseup.thumb', function() {
            $(document).unbind('mousemove.thumb');
            $(document).unbind('mouseup.thumb');
        });
    });
};

var trackIndex = function(album, song) {
    return album.songs.indexOf(song);
};

var nextSong = function() {
    var currentSongIndex = trackIndex( currentAlbum, currentSongFromAlbum );
    currentSongIndex++;

    if ( currentSongIndex >= currentAlbum.songs.length ) {
        currentSongIndex = 0;
    }

    var lastSongNumber = currentlyPlayingSongNumber;

    setSong(currentSongIndex + 1);
    currentSoundFile.play();
    updateSeekBarWhileSongPlays();
    updatePlayerBarSong();

    var $nextSongNumberCell = getSongNumberCell(currentlyPlayingSongNumber);
    var $lastSongNumberCell = getSongNumberCell(lastSongNumber);

    $nextSongNumberCell.html(pauseButtonTemplate);
    $lastSongNumberCell.html(lastSongNumber);

};

var previousSong = function() {
    var currentSongIndex = trackIndex(currentAlbum, currentSongFromAlbum);
    currentSongIndex--;

    if (currentSongIndex < 0) {
        currentSongIndex = currentAlbum.songs.length - 1;
    }

    var lastSongNumber = currentlyPlayingSongNumber;

    setSong(currentSongIndex + 1);
    currentSoundFile.play();
    updateSeekBarWhileSongPlays();

    updatePlayerBarSong();

    $('.main-controls .play-pause').html(playerBarPauseButton);

    var $previousSongNumberCell = getSongNumberCell(currentlyPlayingSongNumber);
    var $lastSongNumberCell = getSongNumberCell(lastSongNumber);

    $previousSongNumberCell.html(pauseButtonTemplate);
    $lastSongNumberCell.html(lastSongNumber);
};

var togglePlayFromPlayerBar = function() {
    var currentlyPlayingCell = getSongNumberCell(currentlyPlayingSongNumber);

// Conditional statement to check if song is paused and the play button is clicked in the player bar
  if (currentSoundFile.isPaused() && $playBarSelector.data("clicked", true)){

    // Change the song number cell from a play button to a pause button
    currentlyPlayingCell.html(pauseButtonTemplate);

    // Change the HTML of the player bar's play button to a pause button
    $('.main-controls .play-pause').html(playerBarPauseButton);

    // Play the song
    currentSoundFile.play();
  }else{

    // Change the song number cell from a pause button to a play button
    currentlyPlayingCell.html(playButtonTemplate);

    // Change the HTML of the player bar's pause button to a play button
    $('.main-controls .play-pause').html(playerBarPlayButton);

    // Pause the song
    currentSoundFile.pause();
  }

};

var updatePlayerBarSong = function() {
    $( ".currently-playing .song-name" ).text( currentSongFromAlbum.title );
    $( ".currently-playing .artist-name" ).text( currentAlbum.artist );
    $( ".currently-playing .artist-song-mobile" ).text( currentSongFromAlbum.title + " - " + currentAlbum.artist );
    $( ".main-controls .play-pause" ).html( playerBarPauseButton );
};

// Album button templates
var playButtonTemplate
    = '<a class="album-song-button"><span class="ion-play"></span></a>';
var pauseButtonTemplate
    = '<a class="album-song-button"><span class="ion-pause"></span></a>';
var playerBarPlayButton = '<span class="ion-play"></span>';
var playerBarPauseButton = '<span class="ion-pause"></span>';

// stores currentAlbum info
var currentAlbum = null;
// Renamed from currentlyPlayingSong to be more explicit
var currentlyPlayingSongNumber = null;
var currentSongFromAlbum = null;
var currentSoundFile = null;
var currentVolume = 80;

var $previousButton = $('.main-controls .previous');
var $nextButton = $('.main-controls .next');
// Variable to hold $('.main-controls .play-pause') selector
var $playPause = $('.main-controls .play-pause');

 $(document).ready(function() {
    setCurrentAlbum(albumPicasso);
    setupSeekBars();
    $previousButton.click(previousSong);
    $nextButton.click(nextSong);
    // Corresponding click event
    $playPause.click(togglePlayFromPlayerBar);
});
