/*******************************************************************************
 * 
 * File:	googleMaps.js
 * Author:	Team Divided by 0, Lexi Chasney
 * Date:	3/27/2020
 * 
 * Description: 
 * This file contains the code used the generate the stats page of the website. 
 * It includes calls to the database to retrieve the most recent data and JS
 * to populate the relevant tables with said data.
 * 		
 ******************************************************************************/

document.addEventListener('DOMContentLoaded', initPage()); 

/**
 * 
 * function initPage()
 * 
 * Summary: 
 * 		Called upon DOM content loaded. Initializes cityTable and stateTable
 * 
 * Parameters:	
 * 		none
 * 
 * Returns:	
 * 		nothing
 * 
 * Description:
 * 		Initializes the page with all tables
 * 
 **/
function initPage(){
    getData('/dataTable', 'city');
    getData('/dataTable', 'state');
}

/**
 * 
 * function getData()
 * 
 * Summary: 
 * 		performs get request to retrieve data from database for tables
 * 
 * Parameters:	
 * 		url (which handle) and the type of data we want (state or city)
 * 
 * Returns:	
 * 		nothing
 * 
 * Description:
 * 		Will get the data from the database and then call the 
 *      proper nitTable function
 * 
 **/
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

/**
 * 
 * function initCityTable()
 * 
 * Summary: 
 * 		Creates the city table rows
 * 
 * Parameters:	
 * 		data from the database
 * 
 * Returns:	
 * 		nothing
 * 
 * Description:
 * 		Loops through the data results and creates the 
 *      city table
 * 
 **/
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

/**
 * 
 * function initStateTable()
 * 
 * Summary: 
 * 		Creates the state table rows
 * 
 * Parameters:	
 * 		data from the database
 * 
 * Returns:	
 * 		nothing
 * 
 * Description:
 * 		Loops through the data results and creates the 
 *      state table
 * 
 **/
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