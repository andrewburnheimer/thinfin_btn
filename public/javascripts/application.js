var freeBusyTogglerTimerId;

$(window).load(function(){
  $(".noscriptmsg").hide();

  $('.nooklink.disabled').on('click', function(e) { e.preventDefault(); });

  logToWindow("Page visited, log started")

  updateRoomControls();
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
    var nookBtn = $(nookBtn);
    var nookName = $(nookBtn).attr("name");

    if(!nookBtn.hasClass("free-up")){
      jQuery.get("/roomStatus.json", { room: nookName }, function( results ) {
        if(results.status == "busy"){
          roomIntoBusyState(nookName);
        } else if (results.status == "available") {
          roomIntoAvailableState(nookName);
        } else {
          roomIntoUnknownState(nookName);
        }
      })
      .fail(function(data, sts) {
        logToWindow("ERROR: Received HTTP " + data.status + " " + data.statusText + " for " + nookName);
      });
    }
  });
}

function allBusyNooksIntoFreeUpState() {
  $.each($('.nooks.busy'), function(index, nookBtn) {
    var nookAnchor = $(nookBtn).parent();
    nookAnchor.removeClass('disabled');
    nookAnchor.attr("aria-disabled", "false");
    nookAnchor.removeAttr('tabindex');
    nookAnchor.unbind('click');

    $(nookBtn).removeClass('disabled')
    $(nookBtn).removeClass('busy');
    $(nookBtn).addClass('free-up');
    $(nookBtn).prop("title", "Force a disconnect of the RemoteApp user in this facility");
    $(nookBtn).prop('disabled', false);
    var nookBtnSpan = $(nookBtn).children("span");
    $(nookBtnSpan).text("Free up " + $(nookBtnSpan).text());
  })
};

function allFreeUpNooksIntoBusyState() {
  $.each($('.nooks.free-up'), function(index, nookBtn) {
    var nookAnchor = $(nookBtn).parent();
    nookAnchor.on('click', function(e) { e.preventDefault(); });
    nookAnchor.addClass('disabled');
    nookAnchor.attr("aria-disabled", "true");
    nookAnchor.removeAttr('tabindex');

    var nookBtnSpan = $(nookBtn).children("span");
    var existing = $(nookBtnSpan).text();
    existing = existing.replace("Free up ", "");
    $(nookBtnSpan).text(existing);
    $(nookBtn).removeClass('free-up');
    $(nookBtn).addClass('disabled')
    $(nookBtn).addClass('busy');
    $(nookBtn).prop("disabled", "disabled");
    $(nookBtn).prop("title", "In-use");
  })
};

function roomIntoBusyState(name) {
  var roomAnchor = $("#facility-list li :contains(" + name + ")").first()
  roomAnchor.on('click', function(e) { e.preventDefault(); });
  roomAnchor.addClass('disabled');
  roomAnchor.attr('aria-disabled', 'true');
  roomAnchor.attr('tabindex', '-1');

  roomButton = roomAnchor.children("button");
  if(!roomButton.hasClass("busy")){
    logToWindow(name + " is now busy");

    roomButton.removeClass('unknown');
    roomButton.removeClass('available');
    roomButton.addClass('disabled');
    roomButton.addClass('busy');
    roomButton.prop('disabled', 'disabled');
    roomButton.removeClass('btn-warning');
    roomButton.removeClass('btn-success');
    roomButton.addClass('btn-danger');
    roomButton.prop("title", "In-use");
  }
};


function roomIntoAvailableState(name) {
  var roomAnchor = $("#facility-list li :contains(" + name + ")").first()
  roomAnchor.removeClass('disabled');
  roomAnchor.attr("aria-disabled", "false");
  roomAnchor.removeAttr('tabindex');
  roomAnchor.unbind('click');

  roomButton = roomAnchor.children("button");
  if(!roomButton.hasClass("available")){
    logToWindow(name + " is now available");

    roomButton.removeClass('disabled');
    roomButton.removeClass('unknown');
    roomButton.removeClass('busy');
    roomButton.prop('disabled', false);
    roomButton.addClass('available');
    roomButton.removeClass('btn-warning');
    roomButton.removeClass('btn-danger');
    roomButton.addClass('btn-success');
    roomButton.prop("title", "Available");
  }
};

function roomIntoUnknownState(name) {
  var roomAnchor = $("#facility-list li :contains(" + name + ")").first()
  roomAnchor.on('click', function(e) { e.preventDefault(); });
  roomAnchor.addClass('disabled');
  roomAnchor.attr('aria-disabled', 'true');
  roomAnchor.attr('tabindex', '-1');

  roomButton = roomAnchor.children("button");
  if(!roomButton.hasClass("unknown")){
    logToWindow(name + " is now unreachable");

    roomButton.removeClass('busy');
    roomButton.removeClass('available');
    roomButton.addClass('disabled');
    roomButton.addClass('unknown');
    roomButton.prop('disabled', 'disabled');
    roomButton.removeClass('btn-success');
    roomButton.removeClass('btn-danger');
    roomButton.addClass('btn-warning');
    roomButton.prop("title", "Unable to reach StudioSentry");
  }
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
