/*******************************************************************************
 * 
 * File:	googleMaps.js
 * Author:	Team Divided by 0
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
            // console.log("response: ", getResponse);

                initStateProgressBar(getResponse);

        } else {
            console.log("Error in network request: " + req.statusText);
        }});
    req.send(null);
}

/**
 * 
 * function initStateProgressBar(data)
 * 
 * Summary: 
 * 		Creates the progress bar
 * 
 * Parameters:	
 * 		data from the database
 * 
 * Returns:	
 * 		nothing
 * 
 * Description:
 * 		Loops through the data results and creates the progress bars.
 * 
 **/

function initStateProgressBar(data){
    
    data = JSON.parse(data.results);
    const div = document.getElementById('progressDiv');

    let colors = ["bg-primary","bg-secondary","bg-success","bg-danger","bg-warning","bg-info","bg-dark"];
    let colorsCount = 7;

    // Total entries
    let totalCount = 0;
    for (let i=0; i < data.length; i++)
    {
        totalCount += parseInt(data[i].total);
    }

    let row;
    let caption;
    let progressDivider;
    let progress;
	let progressBar;
	


	// ALTERNATE DISPLAY
    // Single bar for all states
    progress= document.createElement('div');
    progress.className = "progress";

    for (let i=0; i < data.length; i++)
    {
        progressBar = document.createElement('div');
        // progressBar.className = "progress-bar";
        progressBar.setAttribute("class", "progress-bar " + colors[i%colorsCount]);
        progressBar.setAttribute("role", "progressbar");
        progressBar.setAttribute("style", "width:"+ data[i].total / totalCount * 100 +"%");
        progressBar.setAttribute("aria-valuenow", data[i].total / totalCount * 100);
        progressBar.setAttribute("aria-valuemin", 0);
        progressBar.setAttribute("aria-valuemax", 100);
        // progressBar.textContent = data[i].state;
        // progressBar.textContent = parseInt(data[i].total / totalCount * 100) +"%";

        progress.appendChild(progressBar);
    }
    div.appendChild(progress);


	// Line break
    div.appendChild(document.createElement('br'));



    // One bar per state
    for (let i=0; i < data.length; i++)
    {
        row = document.createElement('div');
        row.className = "row";

        caption = document.createElement('div');
		// caption.className = "col-2 offset-sm-2";
        caption.className = "col-xl-3";
        // caption.textContent = data[i].state + " (" + data[i].total + ")";
        caption.textContent = data[i].state;

        progressDivider = document.createElement('div');
        progressDivider.className = 'col-xl-9';

        progress = document.createElement('div');
        progress.className = "progress";

        progressBar = document.createElement('div');
        // progressBar.className = "progress-bar ";
        progressBar.setAttribute("class", "progress-bar " + colors[i%colorsCount]);
        progressBar.setAttribute("role", "progressbar");
        progressBar.setAttribute("style", "width:"+ data[i].total / totalCount * 100 +"%");
        progressBar.setAttribute("aria-valuenow", data[i].total / totalCount * 100);
        progressBar.setAttribute("aria-valuemin", 0);
        progressBar.setAttribute("aria-valuemax", 100);
        // progressBar.textContent = data[i].state;
        progressBar.textContent = parseInt(data[i].total / totalCount * 100) +"%";

        progress.appendChild(progressBar);
        progressDivider.appendChild(progress);
        row.appendChild(caption);
        row.appendChild(progressDivider);
        div.appendChild(row);
    }


    

    
}