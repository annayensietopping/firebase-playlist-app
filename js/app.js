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

dbSongs.onSnapshot((snapshot) => {
  console.log(snapshot)

// clear songs list
$('.songs').html('')

  snapshot.forEach((doc) => {
    console.log(doc.id)
    console.log(doc.data())

    const id = doc.id

    const playlistItemHtml = buildSongItemHtml(
      doc.data().artistName,
      doc.data().songName)

$('.songs')
  .append(`
    <div class="song" id="${doc.id}">
    ${playlistItemHtml}
    </div>
    `)

  })
})

  // -------- **UPDATE** ---------

  // listen for click event on the "edit" button
  $('body').on('click', 'button.edit-song', (event) => {
    const selectedSongId = $(event.currentTarget).parent().parent().attr('id')
    const selectedSongName =
    // using .find() to search top down, get ID first, then use same path to top down search for other elements
    // traversing the DOM
     $(event.currentTarget).parent().parent().find('.song-name').text()
    const selectedArtistName = $(event.currentTarget).parent().parent().find('.artist-name').text()

    console.log(selectedSongId)
    console.log(selectedSongName)
    console.log(selectedArtistName)

// calls function to generate the edit form in the DOM
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

    dbSongs.doc(songId).update({
      songName: updatedSongName,
      artistName: updatedArtistName
    })
    .then(() => {
      console.log('document removed, post delete code can be added here')
    })
    .catch(() => {
      console.log('errror')
    })


    // const playlistItemHtml = buildSongItemHtml(updatedSongName, updatedArtistName)

    // $(event.currentTarget).parent().html(playlistItemHtml)
  })

  // -------- **DELETE** ---------

  // listen for click event on the "delete" button
  // listen for a click in the body, there is always a body but not always songs -- body is a proxy
  // specify what on the body you are listening for in parens
  // calling parent twice bc the ID of that entry is in the parent of the parent
  //
  $('body').on('click', 'button.delete-song', (event) => {
    const songId = $(event.currentTarget).parent().parent().attr('id')
    console.log(songId)

    dbSongs.doc(songId).delete()
      .then(() => {
        console.log('document removed, post delete code can be added here')
      })
      .catch(() => {
        console.log('errror')
      })

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
