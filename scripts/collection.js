var collectionItemTemplate =
    '<div class="collection-album-container column fourth">'
  + '  <img src="assets/images/album_covers/01.png"/>'
  + '  <div class="collection-album-info caption">'
  + '    <p>'
  + '      <a class="album-name" href="album.html"> The Colors </a>'
  + '      <br/>'
  + '      <a href="album.html"> Pablo Picasso </a>'
  + '      <br/>'
  + '      X songs'
  + '      <br/>'
  + '    </p>'
  + '  </div>'
  + '</div>'
  ;

  window.onload = function() {
    // #1 album-covers class name
    var collectionContainer = document.getElementsByClassName('album-covers')[0];
    // #2 empty string assigned to innerHTML property to clearn content
    collectionContainer.innerHTML = '';

    // #3 This for loop inserts 12 albums by using hte += operator, which
    //    appends content to strings.
    for (var i = 0; i < 12; i++) {
        collectionContainer.innerHTML += collectionItemTemplate;
    }
}
