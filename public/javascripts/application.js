var freeBusyTogglerTimerId;

$(window).load(function(){
$('#disco').change(function() {
  if($(this).prop('checked')){
      toggleBusyNooksIntoFreeUpState();

    freeBusyTogglerTimerId = setTimeout(function myFunction() {
      $('#disco').bootstrapToggle('off');
      toggleFreeUpNooksIntoBusyState();
      }, 5000);
  } else {
    clearTimeout(freeBusyTogglerTimerId);
    toggleFreeUpNooksIntoBusyState();
  }
  });
});

function toggleBusyNooksIntoFreeUpState() {
  $('.nooks.busy').removeClass('disabled');
  $('.nooks.busy').prop("title", "");
  var existing = $('.nooks.busy span').text();
  $('.nooks.busy span').text("Free up " + existing);
};

function toggleFreeUpNooksIntoBusyState() {
  var existing = $('.nooks.busy span').text();
  existing = existing.replace("Free up ", "");
  $('.nooks.busy span').text(existing);
  $('.nooks.busy').addClass('disabled')
  $('.nooks.busy').prop("title", "In-use");
};
