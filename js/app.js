$(function () {
  // Fill in your firebase project's information below:

  const firebaseConfig = {
     apiKey: "AIzaSyCmvvHS6Mh3qCtQ7scCikmBcJmKOOXbVHE",
     authDomain: "playlist-js-ayt.firebaseapp.com",
     databaseURL: "https://playlist-js-ayt.firebaseio.com",
     projectId: "playlist-js-ayt",
     storageBucket: "playlist-js-ayt.appspot.com",
     messagingSenderId: "1066943058238",
     appId: "1:1066943058238:web:6caa479a0010fcbd3d9c6f"
   };

  // Initialize firebase application with
  // config object above

  firebase.initializeApp(firebaseConfig)

const dbSongs = firebase.firestore().collection('songs')
console.log(dbSongs)


  // -------- **CREATE** ---------

  // listen for submit event on Add New Song form
  $('#song-form').submit((event) => {
    event.preventDefault()
    console.log($('#song-name').val())
    console.log($('#artist-name').val())

    const songName = $('#song-name').val()
    const artistName = $('#artist-name').val()

    // Firebase API - call .add() <- this is a firebase method
    // to add document to songs
    dbSongs.add({
      artistName: artistName,
      songName: songName,
    })
    .then(function(docRef) {
    console.log("Document written with ID: ", docRef.id);
})
.catch(function(error) {
    console.error("Error adding document: ", error);
});


    clearAddFormFields()
  })

  // -------- **READ** ---------

  // -------- **UPDATE** ---------

  // listen for click event on the "edit" button
  $('body').on('click', 'button.edit-song', (event) => {
    const selectedSongId = $(event.currentTarget).parent().parent().attr('id')
    const selectedSongName = $(event.currentTarget).parent().parent().find('.song-name').text()
    const selectedArtistName = $(event.currentTarget).parent().parent().find('.artist-name').text()

    console.log(selectedSongId)
    console.log(selectedSongName)
    console.log(selectedArtistName)

    const formHtml = buildEditFormHtml(selectedSongId, selectedSongName, selectedArtistName)

    $(event.currentTarget).parent().parent().html(formHtml)
  })

  // listen for click event on the "cancel" (edit) link
  $('body').on('click', '.song .cancel-edit', (event) => {
    const songId = $(event.currentTarget).parent().find('#song-id').val()
    const songName = $(event.currentTarget).parent().find('#update-song-name').val()
    const artistName = $(event.currentTarget).parent().find('#update-artist-name').val()

    console.log(songId)
    console.log(songName)
    console.log(artistName)

    const playlistItemHtml = buildSongItemHtml(songName, artistName)

    $(event.currentTarget).parent().parent().html(playlistItemHtml)
  })

  // listen for the submit event for update song form
  $('body').on('submit', '#update-song-form', (event) => {
    event.preventDefault()

    const songId = $(event.currentTarget).parent().find('#song-id').val()
    const updatedSongName = $(event.currentTarget).parent().find('#update-song-name').val()
    const updatedArtistName = $(event.currentTarget).parent().find('#update-artist-name').val()

    console.log(songId)
    console.log(updatedSongName)
    console.log(updatedArtistName)

    const playlistItemHtml = buildSongItemHtml(updatedSongName, updatedArtistName)

    $(event.currentTarget).parent().html(playlistItemHtml)
  })

  // -------- **DELETE** ---------

  // listen for click event on the "delete" button
  $('body').on('click', 'button.delete-song', (event) => {
    const songId = $(event.currentTarget).parent().parent().attr('id')
    console.log(songId)

    $(event.currentTarget).parent().parent().remove()
  })

  // -------- Utility Functions ---------

  // html template for Edit Song Form
  function buildEditFormHtml (songId, songName, artistName) {
    return (
      `
        <form id="update-song-form">
          <p>Update Song</p>
          <input type="text" id="update-song-name" value="${songName}"/>
          <input type="text" id="update-artist-name" value="${artistName}"/>
          <input type="hidden" id="song-id" value="${songId}"/>
          <button>Update Song</button>
          <a href="#" class="cancel-edit"> cancel </a>
        </form>
      `
    )
  }

  // html template for a Song Item
  function buildSongItemHtml (songName, artistName) {
    return (
      `<div class="song-name">${songName}</div>
        <div class="artist-name">${artistName}</div>

        <div class="actions">
          <button class="edit-song">edit</a>
          <button class="delete-song">delete</a>
        </div>`
    )
  }

  // Clear text fields on Add New Song form
  function clearAddFormFields () {
    $('#song-name').val('')
    $('#artist-name').val('')
  }
})
