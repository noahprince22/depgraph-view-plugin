    var currentZoom = 1.0;
    var flag = 0;

    var $ = jQuery;
   $(document).ready(function () {
    
        $("#use_slider").click(function(){
      if (flag ==0) {
       $("div#slider").show();
       $("#ZoomIn").hide();
       $("#ZoomOut").hide();
       $("#ZoomReset").hide();
       $("#use_slider").text("Use buttons");
       flag = 1;
       return;
     }
      if (flag == 1) {
       $("div#slider").hide();
       $("#ZoomIn").show();
       $("#ZoomOut").show();
       $("#ZoomReset").show();
       $("#use_slider").text("Use Slider");
       flag = 0;
      }

    });

        $('#ZoomIn').click(
            function () {
                console.log('zoom in');
                //$('#paper').animate({ 'zoom': currentZoom += .1 }, 'slow');
                  currentZoom += 0.1;
                $('#paper > .window').each(function(){
			jQuery(this).animate({'zoom': currentZoom}, 'slow');
		});
            });
        $('#ZoomOut').click(
            function () {
                console.log('zoom out');
               // $('#paper').animate({ 'zoom': currentZoom -= .1 }, 'slow');
               currentZoom -=0.1;
          $('#paper > .window').each(function(){
                        jQuery(this).animate({'zoom': currentZoom}, 'slow');
                });
  
          });
      
      $('#ZoomReset').click(
            function () {
                currentZoom = 1.0;
                console.log('zoom reset');
               // $('#paper').animate({ 'zoom': currentZoom }, 'slow');
                 $('#paper > .window').each(function(){
                        jQuery(this).animate({'zoom': currentZoom}, 'slow');
                });
       });

	$( "#slider" ).slider({
  value: 100,
  step: 30,
  min: 100,
  max: 600,
   slide: function(event,ui) {
      
       var width = ui.value + "px";
       var height = ui.value+ "px";
       //  currentZoom = ui.value;       
       //  $("#paper > .window").css("width",width);       
	 $('#paper > .window').each(function(){
          // jQuery(this).animate({'zoom': currentZoom}, 'fast');
         jQuery(this).css("width",width);
  	 jQuery(this).css("height",height);  
      });
    }
    });

  });
       

