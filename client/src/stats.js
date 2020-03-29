document.addEventListener('DOMContentLoaded', initPage()); 

function initPage(){
    cityTable();
    stateTable();
}

//get the data from url provided; return the parsed text
function getData(url, dataType){
    let req = new XMLHttpRequest();
    let getResponse;
    
    req.open('GET', url+'?type='+dataType, true);
    req.setRequestHeader('Content-Type', 'application/json');
    req.addEventListener('load',function(){
        if(req.status >= 200 && req.status < 400){
            getResponse = JSON.parse(req.responseText);
            console.log("response: ", getResponse);

            //use data to init proper table
            if (dataType === 'city'){
                initCityTable(getResponse);
            }
            else if (dataType === 'state'){
                initStateTable(getResponse);
            }

        } else {
            console.log("Error in network request: " + req.statusText);
        }});
    req.send(null);
}

function cityTable(){
    getData('/dataTable', 'city');
}

function stateTable(){
    getData('/dataTable', 'state');
}

//creates a city table based on data provided
function initCityTable(data){

    console.log("data", JSON.parse(data.results));
    data = JSON.parse(data.results);
    const tBody = document.getElementById('cityBody');

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

//creates a city table based on data provided
function initStateTable(data){

    console.log("data", JSON.parse(data.results));
    data = JSON.parse(data.results);
    const tBody = document.getElementById('stateBody');

    let row;
    let state;
    let total;

    for (let i = 0; i < data.length; i++)
    {
        row = document.createElement('tr');
        state = document.createElement('td');
        total = document.createElement('td');

        state.textContent = data[i].state;
        total.textContent = data[i].total;

        row.appendChild(state);
        row.appendChild(total);
        tBody.appendChild(row);
    }
}