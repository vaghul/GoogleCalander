var autocomplete;
function initialize() {
  autocomplete = new google.maps.places.Autocomplete(
      /** @type {HTMLInputElement} */(document.getElementById('autocomplete')),
      { types: ['geocode'] });
  google.maps.event.addListener(autocomplete, 'place_changed', function() {
  });
}



$(document).ready(function() {

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
