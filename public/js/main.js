$(document).ready(function(){
  $('.delete-event').on('click', function(e){
    $target = $(e.target);
    const id = $target.attr('data-id');
    $.ajax({
      type:'DELETE',
      url: '/users/eventList/'+id,
      success: function(response){
        alert('Deleting Event');
        window.location.href="/frontend";

      },
      error: function(err){
        console.log(err);
      }
    });


  });

  $('.delete-contact').on('click', function(e){
    $target = $(e.target);
    const id = $target.attr('data-id');
    $.ajax({
      type: 'DELETE',
      url: '/users/contacts/'+id,
      success: function(response){
        alert('Deleting Contact');
        window.location.href="/frontend";
      },
      error: function(err){
        console.log(err);
      }
    });
  });
});
