//deleting post with Ajax
$(document).ready(function() {
    $('.delete-article').on('click', function(e) {
        e.preventDefault();

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

//deleting event comment with Ajax
$(document).ready(function() {
    $('.delete-event-comment').on('click', function(e) {
       const $target = $(e.target);
        const id = $target.attr('data-id');
        const splitted_id = id.slice(0, id.indexOf('/'));

        $.ajax({
            type: 'DELETE',
            url: '/events/'+id,
            success: function(response) {
                window.location.href='/events/' + splitted_id + '/eventcomments';
            },
            error: function(err){
                console.log(err);
            }
        });
    }); 
});


//deleting program comment with Ajax
$(document).ready(function() {
    $('.delete-program-comment').on('click', function(e) {
       const $target = $(e.target);
        const id = $target.attr('data-id');
        const splitted_id = id.slice(0, id.indexOf('/'));
        $.ajax({
            type: 'DELETE',
            url: '/programs/'+id,
            success: function(response) {
                window.location.href='/programs/' + splitted_id + '/programcomments';
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

//deleting program with Ajax
$(document).ready(function() {
    $('.delete-event').on('click', function(e) {
       const $target = $(e.target);
        const id = $target.attr('data-id');
        $.ajax({
            type: 'DELETE',
            url: '/events/'+id,
            success: function(response) {
                window.location.href='/events';
            },
            error: function(err){
                console.log(err);
            }
        });
    }); 
});



// for program selection of programtype
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







$(document).ready(function() {
    $('.click-me').on('click', function(e) {
       const $target = $(e.target);
        const id = $target.attr('data-id');
        $.ajax({
            type: 'GET',
            url: '/events/'+id+'/going',
            success: function(response) {
                window.location.href='/events/'+id+'/show';
            },
            error: function(err){
                console.log(err);
            }
        });
    }); 
});




// $(document).ready(function() {
//     $('#mycoming_with').on('click', function(e) {
//        const $target = $(e.target);
//         const id = $target.attr('action');
//         alert(id)
//         $.ajax({
//             type: 'POST',
//             url: '/events/'+id+'/coming_with',
//             success: function(response) {
//                 window.location.href='/events/'+id+'/show';
//             },
//             error: function(err){
//                 console.log(err);
//             }
//         });
//     }); 
// });




//for event attendance
$(document).ready(function() {
    $('.click-me').on('click', function() {
        menu.style.display = "block";
        menu6.style.display = "block";
        menu7.style.display = "block";
        menu5.style.display = "none";
    }) 
});

$(document).ready(function() {
    $('#yes').on('click', function() {
        if(document.getElementById("yes").innerHTML === "Yes") {  
            menu.style.display = "none";
            menu2.style.display = "block";
            menu3.style.display = "block"
            menu4.style.display = "block";
            menu6.style.display = "none";
            menu7.style.display = "none";

            var myArray = new Array("1", "2", "3", "4", "5");
            // Get dropdown element from DOM
            var dropdown = document.getElementById("chooseNumber");

            // Loop through the array
            for (var i = 0; i < myArray.length; ++i) {
                // Append the element to the end of Array list
                dropdown[dropdown.length] = new Option(myArray[i], myArray[i]);
            }
        }
        
    }) 
    
});


$(document).ready(function() {
    $('#no').on('click', function() {
        if(document.getElementById("no").innerHTML === "No") {

            menu.style.display = "none";
            menu2.style.display = "none";
            menu3.style.display = "none";
            menu4.style.display = "none";
            menu7.style.display = "none";
            // clickMe.style.display = "none"
            location.reload();

        }
    }) 
});


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

//for event attendance
let menu = document.querySelector("#thankyou");
let menu2 = document.querySelector("#coming_with");
let menu3 = document.querySelector("#chooseNumber");
let menu4 = document.querySelector("#send_coming_with");
let menu5 = document.querySelector(".click-me");
let menu6 = document.querySelector("#yes");
let menu7 = document.querySelector("#no");
let clickMe = document.querySelector(".click-me");

menu.style.display = "none";
menu2.style.display = "none";
menu3.style.display = "none";
menu4.style.display = "none";