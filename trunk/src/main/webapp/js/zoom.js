var currentZoom = 1.0;
var $ = jQuery;

$(document).ready(function () {

    $('#ZoomIn').click(
            function () {
                console.log('zoom in');
                  currentZoom += 0.1;
                $('#paper > .window').each(function(){
			jQuery(this).animate({'zoom': currentZoom}, 'slow');
		});
  });
    
    $('#ZoomOut').click(
        function () {
              console.log('zoom out');
             currentZoom -=0.1;
            $('#paper > .window').each(function(){
                  jQuery(this).animate({'zoom': currentZoom}, 'slow');
            });
        });
      
      $('#ZoomReset').click(
            function () {
                currentZoom = 1.0;
                console.log('zoom reset');
                 $('#paper > .window').each(function(){
                  jQuery(this).animate({'zoom': currentZoom}, 'slow');
          });
       });

  });
  
