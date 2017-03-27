var freeBusyTogglerTimerId;

$(window).load(function(){
  $(".noscriptmsg").hide();
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

  $('.nooklink.disabled').on('click', function(e) { e.preventDefault(); });
});

function toggleBusyNooksIntoFreeUpState() {
  $.each($('.nooks.busy'), function(index, nook_btn) {
    $(nook_btn).removeClass('disabled')
    $(nook_btn).prop("title", "");
    var nook_btn_span = $(nook_btn).children("span");
    $(nook_btn_span).text("Free up " + $(nook_btn_span).text());
  })
};

function toggleFreeUpNooksIntoBusyState() {
  $.each($('.nooks.busy'), function(index, nook_btn) {
    var nook_btn_span = $(nook_btn).children("span");
    var existing = $(nook_btn_span).text();
    existing = existing.replace("Free up ", "");
    $(nook_btn_span).text(existing);
    $(nook_btn).addClass('disabled')
    $(nook_btn).prop("title", "In-use");
  })
};
