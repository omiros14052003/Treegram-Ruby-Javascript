var SlideshowManager = {
  popupOpen: false,  // Global variable to track the popup state
  showFirst: true,   // Global variable for continuing or not the Slideshow after the popup window
  clickTimeout: null, // Timeout for click events

  showSlides: function(container) {
    var slideIndex = 0;
    var slides = container.getElementsByClassName('slide');
    var slideshowInterval;

    // Hide all slides initially and show the first one
    for (var i = 0; i < slides.length; i++) {
      slides[i].style.display = 'none';
    }
    slides[0].style.display = 'block';

    // Function that changes the slides
    function startSlideshow() {
      slides[slideIndex].style.display = 'none';
      slideIndex++;

      if (slideIndex == slides.length || showFirst) {
        slideIndex = 0;
      }

      slides[slideIndex].style.display = 'block';
    }

    // The slides start to change when mouse enters
    container.addEventListener('mouseenter', function() {
      showFirst = false;
      if (!SlideshowManager.popupOpen) {
        slideshowInterval = setInterval(startSlideshow, 3000);
      }
    });

    // Slideshow resets when the mouse leaves
    container.addEventListener('mouseleave', function() {
      showFirst = true;
      if (!SlideshowManager.popupOpen) {
        clearInterval(slideshowInterval);  // This stops the interval that runs the startSlideshow
        slides[slideIndex].style.display = 'none';
        slides[0].style.display = 'block';
        slideIndex = 0;
      }
    });

    // Single click event for pop up
    for (var i = 0; i < slides.length; i++) {
      slides[i].addEventListener('click', function() {
        clearTimeout(SlideshowManager.clickTimeout);  // Clear the previous click timeout
        var photo_id = this.dataset.photoId;
        var user_id = this.dataset.userId;
        var comment_path = this.dataset.commentPath;

        SlideshowManager.clickTimeout = setTimeout(function() {
          showPopup(photo_id,user_id,comment_path);
        }, 200);  // Delay for single click detection
      });
    }

    // Double click for photo deletion
    for (var i = 0; i < slides.length; i++) {
      slides[i].addEventListener('dblclick', function() {
        clearTimeout(SlideshowManager.clickTimeout);  // Prevent single click event
        console.log('Double-clicked on slide with photoId:', this.dataset.photoId);
        var photo_id = this.dataset.photoId;

        deletePhoto(photo_id);
      });
    }

    function showPopup(photo_id,user_id,comment_path) {
      var photoId = photo_id;
      var userId = user_id;
      var commentPath = comment_path;

      clearInterval(slideshowInterval);
      SlideshowManager.popupOpen = true;

      // Create and show popup
      var existingPopup = document.querySelector('.popup');
      if (existingPopup) existingPopup.remove();

      var popup = document.createElement('div');
      popup.classList.add('popup');
      popup.innerHTML = `
        <div class="popup-content">
          <h2>Comments for Photo #${photoId}</h2>
          <div id="comments-container"></div>
          <div class="add-comment">
            <textarea id="new-comment" placeholder="Write your comment..." rows="4" cols="40"></textarea>
            <button id="submit-comment">Add Comment</button>
            <button id="close-popup">Close Popup</button>
          </div>
        </div>
      `;
      document.body.appendChild(popup);

      // Fetch comments through AJAX
      $.ajax({
        url: commentPath,
        method: 'GET',
        dataType: 'json',
        success: function(data) {
          var commentsContainer = popup.querySelector('#comments-container');
          commentsContainer.innerHTML = ''; // Clear existing comments
          data.forEach(function(comment) {
            var commentElement = document.createElement('p');
            commentElement.innerText = `${comment.user_id}: ${comment.comment_text}`;
            commentsContainer.appendChild(commentElement);
          });
        },
        error: function() {
          console.error('Error fetching comments');
        }
      });

      // Button click for closing the pop up
      var closeBtn = popup.querySelector('#close-popup');
      closeBtn.addEventListener('click', function() {
        SlideshowManager.popupOpen = false;
        popup.remove();
        if(showFirst){
          startSlideshow();
        }
      });

      // Button click for submitting comment
      var submitButton = popup.querySelector('#submit-comment');
      submitButton.addEventListener('click', function() {
        var newCommentText = popup.querySelector('#new-comment').value.trim();
        if (newCommentText) {
          $.ajax({
            url: '/comments',  // default from routes
            method: 'POST',
            data: {
              comment: {
                photo_id: photoId,
                user_id: userId,
                comment_text: newCommentText
              }
            },
            success: function() {
              // Clear the textarea after submission
              popup.querySelector('#new-comment').value = '';
              // Re-fetch updated comments
              $.ajax({
                url: commentPath,
                method: 'GET',
                success: function(comments) {
                  var commentsContainer = popup.querySelector('#comments-container');
                  commentsContainer.innerHTML = ''; // Clear existing comments
                  comments.forEach(function(comment) {
                    var commentElement = document.createElement('p');
                    commentElement.innerText = `${comment.user_id}: ${comment.comment_text}`;
                    commentsContainer.appendChild(commentElement);
                  });
                },
                error: function() {
                  console.error('Error fetching updated comments');
                }
              });
            },
            error: function() {
              console.error('Error submitting comment');
            }
          });
        }
      });

      popup.style.display = 'block';
    }

    function deletePhoto(photo_id) {
      var photoId = photo_id;
      $.ajax({
        url: `/photos/${photoId}`,
        method: 'DELETE',
        success: function(data) {
          if (data.success) {
            console.log('Photo deleted successfully');
            window.location.reload(); // Reload the page after successful deletion
          } else {
            console.log('Error deleting photo:', data.message);
          }
        },
        error: function() {
          console.error('Error deleting photo');
        }
      });
    }
  },



  setup: function() {
    var slideshowContainers = document.getElementsByClassName('slideshow-container');
    for (var i = 0; i < slideshowContainers.length; i++) {
      SlideshowManager.showSlides(slideshowContainers[i]);
    }
  }
};
$(SlideshowManager.setup);
