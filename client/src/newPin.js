


// document.addEventListener('DOMContentLoaded', renderPage());
// function renderPage(){
//     var req = new XMLHttpRequest();
//     var url = '/';
//     req.open('GET', url, true);
//     req.setRequestHeader('Content-Type', 'applicatoin/x-www-form-urlencoded');
//     req.addEventListener('load', function()
//     {
//         if(req.status>=200 && req.status<400){
//             getResponse = JSON.parse(req.responseText);
//             console.log(getResponse);
//             // initMap(getResponse.results);
//         }
//         else{
//             console.log("Error in network request: " + req.statusText);
//         }
//     });
//     req.send(null);
// }

//create these out of Post Submit function so we replace the current message each time we hit submit
const formBody = document.getElementById('formModalBody'); //we will attach message to formBody
const message = document.createElement('p'); //message for whether new insert or update

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

        } else {
            console.log("Error in network request: " + req.statusText);
        }});
    // console.log(JSON.stringify(payload));
    req.send(JSON.stringify(payload));
    event.preventDefault();
    
});

// document.getElementById('postSubmit').addEventListener('click', function(event){

//     let req = new XMLHttpRequest();
//     let payload = {email: null, address: null};
//     let postResponse;
//     let url = '/';

//     const email = document.getElementById('inputEmail4').value;
//     const address = document.getElementById('inputAddress').value;
//     const city = document.getElementById('inputCity').value;
//     const state = document.getElementById('inputState').value;
//     const zip = document.getElementById('inputZip').value;


//     // input validation first.
//     if(email.validity.typeMismatch || address.validity.typeMismatch || city.validity.typeMismatch || state.validity.typeMismatch || zip.validity.typeMismatch){
//         if(email.validity.typeMismatch) {
//             email.setCustomValidity("Invalid email.");
//         }
//         if(address.validity.typeMismatch){
//             address.setCustomValidity("Invalid address.");
//         }
//         if(city.validity.typeMismatch){
//             city.setCustomValidity("Invalid city.");
//         }
//         if(state.validity.typeMismatch){
//             state.setCustomValidity("Invalid state.");
//         }
//         if(zip.validity.typeMismatch){
//             zip.setCustomValidity("Invalid zip code.");
//         }
//     }else {
//         email.setCustomValidity("");
//         address.setCustomValidity("");
//         city.setCustomValidity("");
//         state.setCustomValidity("");
//         zip.setCustomValidity("");

//         payload.email = email;

//         payload.address = address;
//         payload.address += ' ' + city;
//         payload.address += ' ' + state;
//         payload.address += ' ' + zip;


//         req.open('POST', url, true);
//         req.setRequestHeader('Content-Type', 'application/json');
//         req.addEventListener('load', function () {
//             if (req.status >= 200 && req.status < 400) {
//                 postResponse = JSON.parse(req.responseText);
//                 initMap(postResponse.results);
//             } else {
//                 console.log("Error in network request: " + req.statusText);
//             }
//         });
//         console.log(JSON.stringify(payload));
//         req.send(JSON.stringify(payload));
//         event.preventDefault();
//     }
// });

