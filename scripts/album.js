// Example Album
var albumPicasso = {
    title: 'The Colors',
    artist: 'Pablo Picasso',
    label: 'Cubism',
    year: '1881',
    albumArtUrl: 'assets/images/album_covers/01.png',
    songs: [
        { title: 'Blue', duration: '4:26' },
        { title: 'Green', duration: '3:14' },
        { title: 'Red', duration: '5:01' },
        { title: 'Pink', duration: '3:21'},
        { title: 'Magenta', duration: '2:15'}
    ]
};

// Another Example Album
var albumMarconi = {
    title: 'The Telephone',
    artist: 'Guglielmo Marconi',
    label: 'EM',
    year: '1909',
    albumArtUrl: 'assets/images/album_covers/20.png',
    songs: [
        { title: 'Hello, Operator?', duration: '1:01' },
        { title: 'Ring, ring, ring', duration: '5:01' },
        { title: 'Fits in your pocket', duration: '3:21'},
        { title: 'Can you hear me now?', duration: '3:14' },
        { title: 'Wrong phone number', duration: '2:15'}
    ]
};

// My Own Example of an Album
  //var albumMoby = {
  //title: 'These Systems Are Failing',
  //artist: 'Moby',
  //label: 'Mute, Little Idiot',
  //  year: '2016',
  //  albumArtUrl: 'assets/images/album_covers/Moby_Systems.jpg',
  //  songs: [
  //      { title: 'Hey! Hey!', duration: '4:23' },
  //      { title: 'Break.Doubt', duration: '4:12' },
  //      { title: 'Don\'t Leave Me', duration: '4:38' },
  //      { title: 'Erupt and Matter', duration: '4:09' },
  //      { title: 'Are You Lost in the World Like Me?', duration: '4:26'}
  //  ]
//};

// This function generates song row content.
var createSongRow = function(songNumber, songName, songLength) {
    var template =
       '<tr class="album-view-song-item">'
     + '  <td class="song-item-number" data-song-number="' + songNumber + '">' + songNumber + '</td>'
     + '  <td class="song-item-title">' + songName + '</td>'
     + '  <td class="song-item-duration">' + songLength + '</td>'
     + '</tr>'
     ;

    return template;
};



// This function injects the album object's stored info into the template.
var setCurrentAlbum = function(album) {

    // #1 HTML elements populated and then moved to global scope to be accessed
    // by event listener.
    var albumTitle = document.getElementsByClassName('album-view-title')[0];
    var albumArtist = document.getElementsByClassName('album-view-artist')[0];
    var albumReleaseInfo = document.getElementsByClassName('album-view-release-info')[0];
    var albumImage = document.getElementsByClassName('album-cover-art')[0];
    var albumSongList = document.getElementsByClassName('album-view-song-list')[0];

    // #2 nodeValue sets value of the first child node.
    albumTitle.firstChild.nodeValue = album.title;
    albumArtist.firstChild.nodeValue = album.artist;
    albumReleaseInfo.firstChild.nodeValue = album.year + ' ' + album.label;
    albumImage.setAttribute('src', album.albumArtUrl);

    // #3 Clearing the album song list HTML to ensure working with a "clean slate."
    albumSongList.innerHTML = '';

    // #4 Going through all the songs from the specified album object
    for (var i = 0; i < album.songs.length; i++) {
        albumSongList.innerHTML += createSongRow(i + 1, album.songs[i].title, album.songs[i].duration);
    }
};

 // Elements we'll be adding listeners to
var songListContainer = document.getElementsByClassName('album-view-song-list')[0];
var songRows = document.getElementsByClassName('album-view-song-item');

// Album button templates
var playButtonTemplate = '<a class="album-song-button"><span class="ion-play"></span></a>';

window.onload = function() {
    setCurrentAlbum(albumPicasso);

    songListContainer.addEventListener('mouseover', function(event) {
      // Only target individual song rows during event delegation
      if (event.target.parentElement.className === 'album-view-song-item') {
          event.target.parentElement.querySelector('.song-item-number').innerHTML = playButtonTemplate;
      }
    });

    for (var i = 0; i < songRows.length; i++) {
        songRows[i].addEventListener('mouseleave', function(event) {
          // Selects first child element, which is the song-item-number element
          this.children[0].innerHTML = this.children[0].getAttribute('data-song-number');
        });
    }
}

//    var albums = [albumPicasso, albumMarconi, albumMoby];
//    var index = 1;
//    albumImage.addEventListener("click", function(event) {
//        setCurrentAlbum(albums[index]);
//    index++;
//      if (index == albums.length) {
//          index = 0;
//    }
//  });
//  };
