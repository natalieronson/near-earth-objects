const url = "https://ssd-api.jpl.nasa.gov/cad.api";

const correspondingMonths = {
    "01": "January",
    "02": "February",
    "03": "March",
    "04": "April",
    "05": "May",
    "06": "June",
    "07": "July",
    "08": "August",
    "09": "September",
    "10": "October",
    "11": "November",
    "12": "December"
}


const ringColour = "#303F42";
const width = window.innerWidth;
const circleWidth = width / 2;
const height = 700;
const halfHeight = height / 2;

const svgBackground = d3.select("#container")
    .append("svg")
    .attr("preserveAspectRatio", "xMinYMin meet")
    .attr("viewBox", `0 0 ${width} ${height}`)
    .classed("svg-content", true)
    .on("mouseleave", function () {
        d3.selectAll("circle.neo")
            .style("stroke", ringColour);

        d3.select("div#container")
            .selectAll("p")
            .remove();
    })

//getting the current date
const date = new Date();
const currentMonth = date.getMonth() +1;
const currentYear = date.getFullYear();

//setting the initial month title based on the current month
let monthTitle = document.getElementById("month-title");
monthTitle.innerHTML = correspondingMonths[transformMonth(currentMonth)];

//setting the initial year title based on the current year
let yearTitle = document.getElementById("year-title");
yearTitle.innerHTML = currentYear;

let scale = 4000;

//attaching the sliders to a variable
let month = document.getElementById("monthSlider");
let year = document.getElementById("yearSlider");

//setting the values for the initial API call
let monthValue = transformMonth(currentMonth);
let yearValue = currentYear;


//setting title and API call when month slider is changed
month.addEventListener("change", function () {
    monthValue = document.getElementById("monthSlider").value;
    monthValue = transformMonth(monthValue);
    monthTitle.innerHTML = correspondingMonths[monthValue];
    neoAPICall(monthValue, yearValue);
})

//setting title and API call when year slider is changed
year.addEventListener("change", function () {
    yearValue = `${document.getElementById("yearSlider").value}`;
    yearValue = transformYear(yearValue);
    yearTitle.innerHTML = yearValue;
    neoAPICall(monthValue, yearValue);
})


let timePeriods = [month, year];

//when the slider is released, remove all items from the SVG
//API call with new values
timePeriods.forEach(function (item) {
    item.addEventListener("mouseup", function () {
        svgBackground.selectAll("circle.neo").remove();
    })
    neoAPICall(monthValue, yearValue);
})

//type words across the screen
function typeWords(word) {
    let page = document.getElementsByClassName("about-page-text")[0];
    
    let i = 0;
    let timer = setInterval(function () {
        let wordLength = word.length;
        if (i < wordLength) {
            page.innerHTML += word[i];
        }
        else {
            clearInterval(timer)
        }
        i++;

    }, 100)
}


//change the month format for API call
function transformMonth (month) {
    if (month < 10) {
        month= "0" + month;
        return month;
    }
    else {
        return month;
    }
}

//change the year format for API call
function transformYear (year) {
    if (year < 10) {
        year = "190" + year;
    }
    else if (year > 10 && year < 100) {
        year = "19" + year;
    }
    else {
        year = "20" + year[1] + year[2];
    }

    return year; 
}

//API call
function neoAPICall(month, year) {
    $.ajax({
        url: url,
        dataType: "json",
        method: "GET",
        data: {
            "date-min": `${year}-${month}-01`,
            "date-max": `${year}-${month}-31`,
            "fullname": true
        }
    }).then(function (res) {
        parseAPIdata(res.data);
    });
}

//parsing through API data
function parseAPIdata(items) {
    let objectDistance;

    //getting distance from response
    if (items) {
            objectDistance = items.map(item => {
            return item[4];
        });
    
    //changing scale
        objectDistance = objectDistance.map(item => {
            return item * scale;
        });
    }
    //if there's no response, set as an empty array
    else {
        objectDistance = [];
    }
    
    addCirclesToSVG(objectDistance);

}



function addCirclesToSVG(radius) {

    if (radius) {
        let circles = svgBackground.selectAll("circle.neo")
            //selecting the data we want to use
            .data(radius)
            //connecting the data to the elements by creating placeholder elements for every data point
            .enter()
            .append("circle")
            .attr("class", "neo")
            //actions when you mouseover a ring
            .on("mouseover", function (d) { 
                let distance = d / scale; 
                distance = distance * 149598000;
                distance = distance.toFixed(2);

                //remove the highlight from the previous circle
                d3.selectAll("circle.neo")
                .style("stroke", ringColour);

                //add highlight to selected circle
                d3.select(this)
                    .style("stroke", "#F2583E");

                //remove the distance from the previous circle
                d3.select("#container")
                .selectAll("p")
                .remove();

                //display distance of selected circle
                d3.select("#container")
                .append("p")
                .text(distance + " km")
                .attr("class", "data-display")
               })
           
    
        let circleAttributes = circles
            .attr("cx", circleWidth)
            .attr("cy", halfHeight)
            .attr("r", function (d) { return d })
            .style("stroke", ringColour)
            .style("fill", "none")
  
    }

    svgBackground.append("circle").attr("cx", circleWidth).attr("cy", halfHeight).attr("r", 5).style("fill", "#0077be");
}


function generateStars (size, number) {
    let starCoords = [];
    let maxX = window.innerWidth;
    let maxY = height;
    let min = 0;

    for (let i = 0; i < number; i++) {

        let numX = Math.floor(Math.random() * (maxX - min) + min);
        let numY = Math.floor(Math.random() * (maxY - min) + min);
        let num = { X: numX, Y: numY }
        starCoords.push(num);
    }

    let stars = svgBackground.selectAll("circle.star")
        .data(starCoords)
        .enter()
        .append("circle")
        .attr("cx", function (d) { return d.X })
        .attr("cy", function (d) { return d.Y })
        .attr("r", size)
        .attr("class", "star")
        .style("fill", "white")
        .style("stroke", "white")
}

function setUpSVG () {
    generateStars(1, 20);
    generateStars(0.5, 100);
    neoAPICall(monthValue, yearValue);
    typeWords("Every day comets and asteroids pass near our planet. How close were they?");
}

setUpSVG();















