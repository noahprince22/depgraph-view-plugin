var currentZoom = 1.0;

$(document).ready(function () {
  $('#ZoomIn').click(
    function () {
      console.log('zoom in');
      $('#paper').animate({ 'zoom': currentZoom += .1 }, 'slow');
    })
  $('#ZoomOut').click(
    function () {
      console.log('zoom out');
      $('#paper').animate({ 'zoom': currentZoom -= .1 }, 'slow');
    })
  $('#ZoomReset').click(
    function () {
      currentZoom = 1.0
      console.log('zoom reset');
      $('#paper').animate({ 'zoom': 1 }, 'slow');
    })
});
