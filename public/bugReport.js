console.log("== Here I am!");

function createTicket(n) {
  var result = '';
  var chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  console.log(Math.random);
  for ( var i = 0; i < n; i++ ) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

var issueBox = document.getElementById('filter-bugReport-setting');
var TextMaterial = document.getElementById('post-text-input');
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
    TextMaterial.value = "";
    issueBox.selectedIndex = 0;
  }
}

function handleButtonClick (event) {
  console.log(TextMaterial.value);
  if (TextMaterial.value == '' || TextMaterial.value == 0){
    alert("Report is empty. Please write a report before submitting");
  } else {
    alert("Thank you for sending a report. We will get back to you shortly.");
    //
    
    var postRequest = new XMLHttpRequest();
    var requestURL = '/report_bug/sendReport';
    postRequest.open('POST', requestURL);
    
    var newTicket = createTicket(10);
    
    var requestBody = JSON.stringify({
      title: issueBox.selectedIndex,
      ticket: newTicket,
      summary: TextMaterial.value
    });
    
    console.log('requestBody:', requestBody);
    postRequest.setRequestHeader('Content-Type', 'application/json');
    
    postRequest.addEventListener('load', function (event) {
      if (event.target.status !== 200) {
        var responseBody = event.target.response;
        alert("Error saving post on server side: " + responseBody);
      } else {
        alert("New Report Successfully Created! NOTE: Your ticket is " + newTicket);
        var homePath = getHomePathFromURL() + '/';
        window.location.href = homePath;
      }
    });
    postRequest.send(requestBody);
  
    //
    TextMaterial.value = "";
    issueBox.selectedIndex = 0;
  }
}