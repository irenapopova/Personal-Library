$( document ).ready(function() {

  let url = '/api/books';
  
  displayBooks();
  
  function displayBooks() {
    //clear the list
    $("#bookList").empty();

    $.ajax({
      type: "GET",
      url: url
    })
      .done(function(data) {
        data.forEach( ele => {
          let doc = 
            '<tr>' + 
              '<td align="left" class="title">' + 
                '<a class="bookLink" href="#" id="' + ele._id + '">' + ele.title + '</a>' +
              '</td>' + 
              '<td align="center">' +
                '<a href="#" class="comment" title="Add Comments" id="' + ele._id + '"><i class="fa fa-comments icons"></i></a>&nbsp;&nbsp;' +  
                '<a href="#" class="delete" title="Delete" id="' + ele._id + '"><i class="fa fa-trash icons"></i></a>' +     
              '</td>' + 
            '</tr>';

          $('#bookList').append(doc);
        })
      })

      .fail (function(xhr) { 
        Alert.render('Error', xhr.responseJSON.error);
      })
  };

  //Add new book       
  $('#newBook').submit(function(e){
    e.preventDefault();

    $.ajax({
      type: "POST",
      url: url,
      data: $(this).serialize()
    })
      .done (function(data) {
        Alert.render('Success - Book Added', JSON.stringify(data, null, 1));
        displayBooks();
      })
      .fail (function(xhr) { 
        Alert.render('Error', xhr.responseJSON.error);
      })
    
    $('#newBook')[0].reset();  // Reset form data
  });

  //Delete All books
  $('#deleteBooks').on('click', function(e) {
    e.preventDefault();
      Confirm.render('Are you sure you want to delete all books in the library?', deleteBooks);
  });

  function deleteBooks() {
    $.ajax({
        type: "DELETE",
        url: url
      })
        .done (function(data) { 
          Alert.render('All Books Deleted', JSON.stringify(data)); 
          displayBooks();
        })
        .fail (function(xhr) { 
          Alert.render('Error', xhr.responseJSON.error);
        })
  }

  //Delete book
  $('#bookList').on('click','.delete', function(e) {
    e.preventDefault();
    Confirm.render('Are you sure you want to delete this book?', deleteBook, $(this).attr('id'));
  });

  function deleteBook(id) {
    $.ajax({
        type: "DELETE",
        url: url + '/' + id
      })
        .done (function(data) { 
          Alert.render('Issue Deleted', JSON.stringify(data)); 
          displayBooks();
        })
        .fail (function(xhr) { 
          Alert.render('Error', xhr.responseJSON.error);
        })
  }

  // Display comments for the selected book
  $(document).on('click','.bookLink', function(e) {
      resetCommentForm(); //display new pop up
      $(".view").hide();  //hide input fields
      populateBook($(this).attr('id')); //get information for the book
      // Stop normal link behavior
      return false;
  });        
  
  //Add comment
  $('#bookList').on('click','.comment', function(e) {
    e.stopPropagation();
    resetCommentForm(); //display new pop up
    $(".view").show();
    populateBook($(this).attr('id')); //get information for the book
    e.preventDefault();
  });

  function resetCommentForm() {
    // Reset all pop up form data
    $('#newComment')[0].reset();
    $("input[type='hidden']").remove();
    $("#commentList").empty();

    $("#dialogOverlay").show();
    $("#dialogOverlay").height($(window).height());
    $("#commentBox").show();
  }

  function populateBook(id) {
    $.ajax({
      type: "GET",
      url: url + '/' + id
    })
      .done (function(data) { 
        $("#book_id").text(data._id);
        $("#newComment").append('<input type="hidden" name="id" value="' + data._id + '">');
        $("#newComment").append('<input type="hidden" name="commentcount" value="' + data.comments.length + '">');
        $("#title").text(data.title);
        if (data.comments.length < 1)
          $("#commentHeader").text('No Comments');
        else 
          $("#commentHeader").text(data.comments.length + ' Comment' + ((data.comments.length > 1) ? 's' : ''));
        data.comments.forEach( ele => {
          $('#commentList').append('<li>' + ele + '</li>');
        })
      })
      .fail (function(xhr) { 
        Alert.render('Error', xhr.responseJSON.error);
      })
  }

  // When the user clicks on <span> (x), close the popup
  $(".close").on('click', function(e) {
    e.preventDefault();
    $("#commentBox").hide();
    $("#dialogOverlay").hide();
  });

  // When the user clicks anywhere outside of the popup, close it
  $(window).on('click', e => {
    if($(e.target).closest('#commentBox').length == 0 && $('#commentBox').is(':visible') && $('#dialogBox').is(':hidden')) {
       $("#commentBox").hide();
       $("#dialogOverlay").hide();
    }
  });
  
  //Add new comment
  $('#newComment').submit( function(e) {
    e.preventDefault();

    $.ajax({
      type: "POST",
      url: url + '/' + $('#newComment input[name="id"]').val(),
      data: $(this).serialize()
    })
      .done (function(data) { 
        let commentcount = $('#newComment input[name="commentcount"]').val() //get stored count
        commentcount++;    //increment count
        $('#newComment input[name="commentcount"]').val(commentcount); //update stored count
        if (commentcount < 1)
          $("#commentHeader").text('No Comments');
        else 
          $("#commentHeader").text(commentcount + ' Comment' + ((commentcount > 1) ? 's' : ''));
        $('#commentList').append('<li>' + $('#newComment input[name="comment"]').val() + '</li>');
        $('#newComment')[0].reset();
        //Alert.render('Success - Comment Added', JSON.stringify(data, null, 1));
      })
      .fail (function(xhr) {
        Alert.render('Error', xhr.responseJSON.error);
      })
  });

});