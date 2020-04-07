//deleting post with Ajax
$(document).ready(function() {
    $('.delete-article').on('click', function(e) {
       const $target = $(e.target);
        const id = $target.attr('data-id');
        $.ajax({
            type: 'DELETE',
            url: '/posts/'+id,
            success: function(response) {
                window.location.href='/posts';
            },
            error: function(err){
                console.log(err);
            }
        });
    }); 
});

//deleting comment with Ajax
$(document).ready(function() {
    $('.delete-comment').on('click', function(e) {
       const $target = $(e.target);
        const id = $target.attr('data-id');
        $.ajax({
            type: 'DELETE',
            url: '/posts/comments/'+id,
            success: function(response) {
                window.location.href='/posts';
            },
            error: function(err){
                console.log(err);
            }
        });
    }); 
});

//deleting program with Ajax
$(document).ready(function() {
    $('.delete-program').on('click', function(e) {
       const $target = $(e.target);
        const id = $target.attr('data-id');
        $.ajax({
            type: 'DELETE',
            url: '/programs/'+id,
            success: function(response) {
                window.location.href='/programs';
            },
            error: function(err){
                console.log(err);
            }
        });
    }); 
});

//for program selection of programtype
$(window).on('load', function() {
    var select = document.getElementById("selectNumber");
    var options = ["Youths", "Children", "YouthsHomeCell"];
    for(var i = 0; i < options.length; i++) {
        var opt = options[i];
        var el = document.createElement("option");
        el.textContent = opt;
        select.appendChild(el);
    }
   
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



$(function () {                
    $('#datetimepicker1').datetimepicker();
    
    $('#datetimepicker2').datetimepicker({
      useCurrent: false //Important! See issue #1075
    });
    
    $("#datetimepicker1").on("dp.change", function (e) {
      $('#datetimepicker2').data("DateTimePicker").minDate(e.date);
    });      
    
    $("#datetimepicker2").on("dp.change", function (e) {
        $('#datetimepicker1').data("DateTimePicker").maxDate(e.date);
    });
});
