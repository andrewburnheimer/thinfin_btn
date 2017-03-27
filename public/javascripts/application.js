var freeBusyTogglerTimerId;

$(window).load(function(){
  $(".noscriptmsg").hide();

  $('.nooklink.disabled').on('click', function(e) { e.preventDefault(); });

  logToWindow("Page visited, log started")

  $('#disco').change(function() {
    if($(this).prop('checked')){
      allBusyNooksIntoFreeUpState();

      freeBusyTogglerTimerId = setTimeout(function myFunction() {
        $('#disco').bootstrapToggle('off');
        allFreeUpNooksIntoBusyState();
        }, 5000);
    } else {
      clearTimeout(freeBusyTogglerTimerId);
      allFreeUpNooksIntoBusyState();
    }
    });

  $("#copy-btn").click(function(event) {
    var copyTextarea = $("#log-window");  
    copyTextarea.select();

    try {  
      var successful = document.execCommand('copy');  
    } catch(err) {  
      console.log('Oops, unable to copy'); 
    }
  });

});

function allBusyNooksIntoFreeUpState() {
  $.each($('.nooks.busy'), function(index, nook_btn) {
    $(nook_btn).removeClass('disabled')
    $(nook_btn).prop("title", "");
    var nook_btn_span = $(nook_btn).children("span");
    $(nook_btn_span).text("Free up " + $(nook_btn_span).text());
  })
};

function allFreeUpNooksIntoBusyState() {
  $.each($('.nooks.busy'), function(index, nook_btn) {
    var nook_btn_span = $(nook_btn).children("span");
    var existing = $(nook_btn_span).text();
    existing = existing.replace("Free up ", "");
    $(nook_btn_span).text(existing);
    $(nook_btn).addClass('disabled')
    $(nook_btn).prop("title", "In-use");
  })
};

function logToWindow(msg){
  var d = new Date()
  var offset = timezoneOffsetToHoursMinutes(d.getTimezoneOffset())
  $('#log-window').append(d.toLocaleString() + ' ' + offset + ' - ' + msg + '\n')
  scrollToBottom();
}

function timezoneOffsetToHoursMinutes(offset){
  var hours = offset / 60;
  var minutes = offset % 60;

  return '-' + pad(hours, 2) + ':' + pad(minutes, 2)
}

/* http://stackoverflow.com/questions/10073699/pad-a-number-with-leading-zeros-in-javascript#answer-10073788 */
function pad(n, width, z) {
  z = z || '0';
  n = n + '';
  return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
}

function scrollToBottom() {
  $('#log-window').scrollTop($('#log-window')[0].scrollHeight);
}
