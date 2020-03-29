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

var TimeAgo = (function() {
    var self = {};
    
    // Public Methods
    self.locales = {
      prefix: '',
      sufix:  'ago',
      
      seconds: 'less than a minute',
      minute:  'about a minute',
      minutes: '%d minutes',
      hour:    'about an hour',
      hours:   'about %d hours',
      day:     'a day',
      days:    '%d days',
      month:   'about a month',
      months:  '%d months',
      year:    'about a year',
      years:   '%d years'
    };
    
    self.inWords = function(timeAgo) {
      var seconds = Math.floor((new Date() - parseInt(timeAgo)) / 1000),
          separator = this.locales.separator || ' ',
          words = this.locales.prefix + separator,
          interval = 0,
          intervals = {
            year:   seconds / 31536000,
            month:  seconds / 2592000,
            day:    seconds / 86400,
            hour:   seconds / 3600,
            minute: seconds / 60
          };
      
      var distance = this.locales.seconds;
      
      for (var key in intervals) {
        interval = Math.floor(intervals[key]);
        
        if (interval > 1) {
          distance = this.locales[key + 's'];
          break;
        } else if (interval === 1) {
          distance = this.locales[key];
          break;
        }
      }
      
      distance = distance.replace(/%d/i, interval);
      words += distance + separator + this.locales.sufix;
  
      return words.trim();
    };
    
    return self;
  }());
  
  
  // USAGE
  var timeElement = document.querySelector('time'),
      time = new Date(timeElement.getAttribute('datetime'));
  
  timeElement.innerText = TimeAgo.inWords(time.getTime());


//Hiding and showing comments

$(document).ready(function() {
    $('.show-comments').on('click', function() {
       
        $('.postcomments').toggle();
        $('.postcomments').hide();
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

