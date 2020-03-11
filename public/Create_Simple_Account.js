// JavaScript source code

//console.log("hello world");

document.getElementById('MyForm').addEventListener('submit', (event) => {
    event.preventDefault();
    // TODO do something here to show user that form is being submitted
    //fetch(event.target.action, {
    //    method: 'POST',
    //    body: new URLSearchParams(new FormData(event.target)) // event.target is the form
    //}).then((resp) => {
    //    console.log(resp.text().toString());
    //    //console.log(resp.text().PromiseValue());
    //    return resp.text(); // or resp.text() or whatever the server sends
    //}).then (console.log(resp))
    //.then((body) => {
    //    console.log("hi");
    //    console.log(resp.text());
    //}).catch((error) => {
    //    // TODO handle error
    //});
    //console.log(resp);

    var fechdata = fetch(event.target.action, {
        method: 'POST',
        body: new URLSearchParams(new FormData(event.target)) // event.target is the form
    })

    fechdata.then(function (val) {
        if (val.status == 200) {
            window.location.href = '/';
        }
        else if (val.status == 460) {
            alert("name already used");
        }
        else if (val.status == 461) {
            alert("passwords do not match");
        }
        else if (val.status == 462) {
            alert("a field(s) is empty");
        }
        else if (val.status == 463) {
            alert("body is empty");
        }
    });
});
