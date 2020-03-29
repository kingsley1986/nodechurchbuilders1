//deleting post with Ajax
$(document).ready(function() {
    $('.delete-article').on('click', function(e) {
       const $target = $(e.target);
        const id = $target.attr('data-id');
        $.ajax({
            type: 'DELETE',
            url: '/post/'+id,
            success: function(response) {
                window.location.href='/posts';
            },
            error: function(err){
                console.log(err);
            }
        });
    }); 
});


//Hiding and showing comments

$(document).ready(function() {
    $('.show-comments').on('click', function() {
       
        $('.postcomments').toggle();
    })
  
});

// let menuBtn = document.querySelector(".show-comments");
// let menu = document.querySelector(".postcomments");

// let menuStatus = false;

// menu.style.display = "none";

// function menuToggle() {
//     if (menuStatus == false) {
//         menu.style.display = "block";
//         menuStatus = true;
//     }
//     else if (menuStatus == true) {
//         menu.style.display = "none";
//         menuStatus = false;
//     }
// }

// menuBtn.onclick = menuToggle;

