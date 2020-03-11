// JavaScript source code

document.getElementById('loginForm').addEventListener('submit', (event) => {
    event.preventDefault();


    var fetchdata = fetch(event.target.action, {
        method: 'POST',
        body: new URLSearchParams(new FormData(event.target)) // event.target is the form
    })

    fetchdata.then(function (val) {
        if (val.status == 200) {
            window.location.href = '/';
        }
        else if (val.status == 460) {
            alert("Incorrect Username and/or Password");
        }
        else if (val.status == 461) {
            alert("Please enter a username and password");
        }
    });
});
