console.log("== Here I am!");

var latBox = document.getElementById('latitude-text-input');
var lonBox = document.getElementById('longitude-text-input');
var SubmitButton = document.getElementsByClassName('search-button');
for (var i = 0; i < SubmitButton.length; i++) {
    SubmitButton[i].addEventListener('click', handleButtonClick);
}
var CancelButton = document.getElementsByClassName('cancel-button');
for (var i = 0; i < CancelButton.length; i++) {
    CancelButton[i].addEventListener('click', handleCancelClick);
}

function handleCancelClick(event) {
  console.log("cancelled");
  if ('click') {
    lonBox.value = lonBox.value - lonBox.value;
    latBox.value = latBox.value - latBox.value;
  }
}

function handleButtonClick(event) {
  if (lonBox.value == '' || latBox.value == '') {
    alert("latitude and logintude must be specified");
  }
  else if ((lonBox.value > 180 || lonBox.value < -180) || (latBox.value > 90 || latBox.value < -90)) {
    alert("latitude must be between -90 and 90 and logintude must be between -180 and 180");
  }
  else {
    //alert("Thank you for sending a report. We will get back to you shortly.");
    //

    var postRequest = new XMLHttpRequest();
    var requestURL = '/search_query';
    postRequest.open('POST', requestURL);

    var requestBody = JSON.stringify({
      longitude: lonBox.value,
      latitude: latBox.value,
      max: 1
    });

    console.log('requestBody:', requestBody);
    postRequest.setRequestHeader('Content-Type', 'application/json');

    postRequest.addEventListener('load', function (event) {
      if (event.target.status !== 200) {
        var responseBody = event.target.response;
        alert("Error in search: " + responseBody);
      }
    });
    postRequest.send(requestBody);
    
    //
    lonBox.value = 0;
    latBox.value = 0;
    window.location.href = "/search_query";
  }
}

