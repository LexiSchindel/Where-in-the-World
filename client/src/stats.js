document.addEventListener('DOMContentLoaded', cityTable()); 

const table = document.getElementById("cityTable")

//get the data from url provided; return the parsed text
function getData(url){
    let req = new XMLHttpRequest();
    let getResponse;

    req.open('GET', url, true);
    req.setRequestHeader('Content-Type', 'application/json');
    req.addEventListener('load',function(){
        if(req.status >= 200 && req.status < 400){
            getResponse = JSON.parse(req.responseText);
            console.log("response: ", getResponse);

            //use data to init table
            initTable(getResponse);
        } else {
            console.log("Error in network request: " + req.statusText);
        }});
    req.send(null);
}

function cityTable(){
    cityData = getData('/data');
    console.log(cityData);


}

//creates a table based on data provided
function initTable(data){

    console.log("data", JSON.parse(data.results));
    data = JSON.parse(data.results);
    const tBody = document.getElementById('tbody');

    let row;
    let city;
    let total;

    for (let i = 0; i < data.length; i++)
    {
        row = document.createElement('tr');
        city = document.createElement('td');
        total = document.createElement('td');

        city.textContent = data[i].city;
        total.textContent = data[i].total;

        row.appendChild(city);
        row.appendChild(total);
        tBody.appendChild(row);
    }
}