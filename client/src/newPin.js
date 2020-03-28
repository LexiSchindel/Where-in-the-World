document.getElementById('postSubmit').addEventListener('click', function(event){

    var req = new XMLHttpRequest();
    var payload = {email: null, address: null};
    var postResponse;
    var url = '/';

    payload.email = document.getElementById('inputEmail4').value;

    payload.address = document.getElementById('inputAddress').value;
    payload.address += ' ' + document.getElementById('inputCity').value;
    payload.address += ' ' + document.getElementById('inputState').value;
    payload.address += ' ' + document.getElementById('inputZip').value;

    req.open('POST', url, true);
    req.setRequestHeader('Content-Type', 'application/json');
    req.addEventListener('load',function(){
        if(req.status >= 200 && req.status < 400){
            postResponse = JSON.parse(req.responseText);
        } else {
            console.log("Error in network request: " + req.statusText);
        }});
    console.log(JSON.stringify(payload));
    req.send(JSON.stringify(payload));
    event.preventDefault();
});