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