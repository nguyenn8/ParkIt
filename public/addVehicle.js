console.log("== Here I am!");


//var userBox = document.getElementById('post-username-input');
var makeBox = document.getElementById('post-make-input');
var modelBox = document.getElementById('post-model-input');
var yearBox = document.getElementById('post-year-input');
var plateBox = document.getElementById('post-plate-input');

var SubmitButton = document.getElementsByClassName('submit-report');
for (var i = 0; i < SubmitButton.length; i++) {
  SubmitButton[i].addEventListener('click', handleButtonClick);
}
var CancelButton = document.getElementsByClassName('cancel-button');
for (var i = 0; i < CancelButton.length; i++) {
  CancelButton[i].addEventListener('click', handleCancelClick);
}

function handleCancelClick (event) {
  console.log("cancelled");
  if('click'){
      userBox.value = "";
      makeBox.value = "";
      modelBox.value = "";
      yearBox.value = 0;
      plateBox.value = "";

  }
}

function handleButtonClick (event) {

  if (makeBox.value == "" || modelBox.value == ""
       || yearBox.value <= 0 || plateBox.value == ""){
    alert("Report is missing at least 1 entry. Please fill all boxes before submitting.")
  }
  else {
    alert("Thank you for adding a Vehicle.");

    var postRequest = new XMLHttpRequest();
    var requestURL = '/add_Vehicle/saveVehicle';
    postRequest.open('POST', requestURL);

    var requestBody = JSON.stringify({
      Make: makeBox.value,
      Model: modelBox.value,
      Year: yearBox.value,
      Plate: plateBox.value
    });

    console.log('requestBody:', requestBody);
    postRequest.setRequestHeader('Content-Type', 'application/json');

    postRequest.addEventListener('load', function (event) {
      if (event.target.status !== 200) {
        var responseBody = event.target.response;
        alert("Error saving post on server side: " + responseBody);
      } else {
        alert("Vehicle Successfully Saved!");
        var homePath = getHomePathFromURL() + '/';
        window.location.href = homePath;
      }
    });
    postRequest.send(requestBody);

    //
    userBox.value = "";
    makeBox.value = "";
    modelBox.value = "";
    yearBox.value = 0;
    plateBox.value = "";
  }
}
