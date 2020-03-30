/*******************************************************************************
 * 
 * File:	newPin.js
 * Author:	Team Divided by 0
 * Date:	3/28/2020
 * 
 * Description: 
 * This function facilitates the addition of a new pin to the page via a post
 * submission. The post response contains a flag to relay whether this was an
 * insert or a update to the database. Based on the flag, a success message is
 * displayed. 
 * 
 * There is built in validation to ensure the submission contains an
 * oregon state email and has all necessary fields. 
 * 
 * Once the form is submitted, the success message is displayed, the modal closes,
 * and the map re-initializes with the new data.
 * 		
 ******************************************************************************/

//create these out of Post Submit function so we replace the current message each time we hit submit
const message = document.createElement('p'); //message for whether new insert or update
message.className = 'postSuccessMessage';
const modalCloseDelay = 500; //close modal after 0.5 seconds after submission received
const map = document.getElementById('submitDiv');

document.getElementById('postSubmit').addEventListener('click', function(event){

    let req = new XMLHttpRequest();
    let payload = {email: null, address: null};
    let postResponse;
    const url = '/';

    let email = document.getElementById('inputEmail4').value;
    let address = document.getElementById('inputAddress').value;
    let city = document.getElementById('inputCity').value;
    let state = document.getElementById('inputState').value;
    let zip = document.getElementById('inputZip').value;

    const constEmail = document.getElementById('inputEmail4').value;
    const constAddress = document.getElementById('inputAddress').value;
    const constCity = document.getElementById('inputCity').value;
    const constState = document.getElementById('inputState').value;
    const constZip = document.getElementById('inputZip').value;

    //validation
    let emailPatt = new RegExp("@oregonstate.edu");
    if(email.toString() === ""){
        return;
    }
    if(!emailPatt.test(email.toString())){
        alert("Please enter an oregonstate.edu email address.")
        event.preventDefault();
        return;
    }
    if(address.toString() === ""){
        return;
    }
    if(city.toString() === ""){
        return;
    }
    if(state.toString() === ""){
        return;
    }
    if(zip.toString() === ""){
        return;
    }
    if(isNaN(zip) || zip.length != 5){
        alert("Please enter a 5 digit zip code.");
        event.preventDefault();
        return;
    }

    payload.email = constEmail;
    payload.address = constAddress;
    payload.address += ' ' + constCity;
    payload.address += ' ' + constState;
    payload.address += ' ' + constZip;

    req.open('POST', url, true);
    req.setRequestHeader('Content-Type', 'application/json');

    req.addEventListener('load',function(){
        if(req.status >= 200 && req.status < 400){
            postResponse = JSON.parse(req.responseText);

            let noLocationFound = JSON.parse(postResponse.noResults);

            //if we couldn't find the location, print fail message
            if (noLocationFound[0].noResults === true)
            {
                message.textContent = "";
                let inputAddress = address + " " + city + ", " + state + " " + zip;
                message.textContent = "We could not find the a valid address using " + inputAddress + ".";
                map.appendChild(message); //append message to the map
            }
            else {
                //does db already have email, then we updated
                let dbHasEmail = JSON.parse(postResponse.dbHasEmail);
                let addressResults = JSON.parse(postResponse.results);

                let address = (addressResults[0].streetNumber || '') + ' ' + (addressResults[0].streetRoute || '') + ' ' + (addressResults[0].city || '') + ', ' 
                    + (addressResults[0].state || '' ) + ' ' + (addressResults[0].zipCode || '' );

                console.log(address);

                if (dbHasEmail[0].dbHasEmail == true)
                {
                    // initMap(postResponse);
                    message.textContent = "";
                    message.textContent = "We updated the address associated with " + email + " to " + address + ".";
                    initMap();
                    map.appendChild(message); //append message to the map
                }
                else
                {
                    // initMap(postResponse);
                    message.textContent = "";
                    message.textContent = "Welcome " + email + " to the OSU World family! New pin at " + address + ".";
                    initMap();
                    map.appendChild(message); //append message to the map
                }
            }

            //closes modal after 2 seconds following successful submission
            setTimeout(function() {
                $('#formModal').modal('toggle');
            }, modalCloseDelay);

        } else {
            console.log("Error in network request: " + req.statusText);
        }
        
    });

    req.send(JSON.stringify(payload));
    event.preventDefault();
    
});