//create these out of Post Submit function so we replace the current message each time we hit submit
const formBody = document.getElementById('formModalBody'); //we will attach message to formBody
const message = document.createElement('p'); //message for whether new insert or update
const modalCloseDelay = 2000; //close modal after 2 seconds after submission received

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
            //does db already have email, then we updated
            let dbHasEmail = JSON.parse(postResponse.dbHasEmail);
            console.log("isUpdate: ", dbHasEmail[0].dbHasEmail)

            //results back from db parsed
            postResponse = JSON.parse(postResponse.results);

            if (dbHasEmail[0].dbHasEmail == true)
            {
                console.log('post update');
                initMap(postResponse);
                message.textContent = "";
                message.textContent = "We updated your address associated with your email!";
                formBody.appendChild(message); //append message to the formBody 
            }
            else
            {
                console.log('post new insert map');
                initMap(postResponse);
                message.textContent = "";
                message.textContent = "Welcome to the OSU World family!";
                formBody.appendChild(message); //append message to the formBody 
            }

            //closes modal after 2 seconds following successful submission
            setTimeout(function() {
                $('#formModal').modal('toggle');
            }, modalCloseDelay);

        } else {
            console.log("Error in network request: " + req.statusText);
        }});

    

    req.send(JSON.stringify(payload));
    event.preventDefault();
    
});