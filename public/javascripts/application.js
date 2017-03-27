var freeBusyTogglerTimerId;

$(window).load(function(){
  $(".noscriptmsg").hide();

  $('.nooklink.disabled').on('click', function(e) { e.preventDefault(); });

  logToWindow("Page visited, log started")

  setInterval(function(){
    updateRoomControls();
  },3000)

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

function updateRoomControls() {
  $.each($('.nooks'), function(index, nookBtn) {
    var nookBtnSpan = $(nookBtn).children("span");
    var nookName = $(nookBtnSpan).text();

    jQuery.get("/roomStatus.json", { room: nookName }, function( results ) {
      
    })
    .fail(function(data, sts) {
      logToWindow("ERROR: Received HTTP " + data.status + " " + data.statusText + " for " + nookName);
    });
  });
}

function allBusyNooksIntoFreeUpState() {
  $.each($('.nooks.busy'), function(index, nookBtn) {
    $(nookBtn).removeClass('disabled')
    $(nookBtn).prop("title", "");
    var nookBtnSpan = $(nookBtn).children("span");
    $(nookBtnSpan).text("Free up " + $(nookBtnSpan).text());
  })
};

function allFreeUpNooksIntoBusyState() {
  $.each($('.nooks.busy'), function(index, nookBtn) {
    var nookBtnSpan = $(nookBtn).children("span");
    var existing = $(nookBtnSpan).text();
    existing = existing.replace("Free up ", "");
    $(nookBtnSpan).text(existing);
    $(nookBtn).addClass('disabled')
    $(nookBtn).prop("title", "In-use");
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
