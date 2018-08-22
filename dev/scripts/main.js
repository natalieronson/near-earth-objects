let url = "https://ssd-api.jpl.nasa.gov/cad.api";

let correspondingMonths = {
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

let ringColour = "#303F42";

let date = new Date();
let currentMonth = date.getMonth() +1;
let currentYear = date.getFullYear();


let monthTitle = document.getElementById("month-title");
monthTitle.innerHTML = correspondingMonths[transformMonth(currentMonth)];

let yearTitle = document.getElementById("year-title");
yearTitle.innerHTML = currentYear;

let width = window.innerWidth;
let circleWidth = width / 2;

let scale = 4000;


let month = document.getElementById("monthSlider");
// month.value(currentMonth);
let year = document.getElementById("yearSlider");
// year.value(currentYear);
let monthValue = "01";
let yearValue = "2018";



month.addEventListener("change", function () {
    monthValue = document.getElementById("monthSlider").value;
    // if (monthValue < 10) {
    //     monthValue = "0" + monthValue;
    // }
    monthValue = transformMonth(monthValue);
    console.log(correspondingMonths[monthValue]);
    monthTitle.innerHTML = correspondingMonths[monthValue];
    neoAPICall(monthValue, yearValue);
})

year.addEventListener("change", function () {
    yearValue = `${document.getElementById("yearSlider").value}`;
    if (yearValue < 100) {
        yearValue = "19" + yearValue;
    }
    else {
        yearValue = "20" + yearValue[1] + yearValue[2];
    }
    console.log(yearValue);
    yearTitle.innerHTML = yearValue;
    neoAPICall(monthValue, yearValue);
})

let timePeriods = [month, year];

timePeriods.forEach(function (item) {
    item.addEventListener("mouseup", function () {
        console.log("remove me!!")
        svgBackground.selectAll("*").remove();
        console.log("added array item")
    })
    neoAPICall(monthValue, yearValue);
})

function typeWords(word) {
    let page = document.getElementsByClassName("about-page-text")[0];
    
    let i = 0;
    let timer = setInterval(function () {
        let wordLength = word.length;
        if (i < wordLength) {
            console.log(word[i]);
            page.innerHTML += word[i];
        }
        else {
            clearInterval(timer)
        }
        i++;

    }, 100)
}




typeWords("Every day comets and asteroids pass near our planet. How close were they?");


function transformMonth (month) {
    if (month < 10) {
        month= "0" + month;
        return month;
    }
    else {
        return month;
    }
}


function neoAPICall(month, year) {
    

    console.log ("inside")
    console.log(month);
    console.log(year);

    $.ajax({
        url: url,
        dataType: "json",
        method: "GET",
        data: {
            // "date-min": `${yearValue}-${monthValue}-01`,
            // "date-max": `${yearValue}-${monthValue}-31`
            "date-min": `${year}-${month}-01`,
            "date-max": `${year}-${month}-31`,
            "fullname": true
            
        }
    }).then(function (res) {
        parseAPIdata(res.data);
        console.log(res)
    });

}

function parseAPIdata(items) {
    let objectDistance;

    if (items) {
            objectDistance = items.map(item => {
            return item[4];
        });
    
        objectDistance = objectDistance.map(item => {
            // return item * 1496;
            return item * scale;
        });
    }
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
            .on("mouseover", function (d) { console.log(d);
                let distance = d / scale; 

                d3.selectAll("circle.neo")
                .style("stroke", ringColour);

                d3.select(this)
                    .style("stroke", "#F2583E");

                d3.select("div#container")
                .selectAll("p")
                .remove();

                d3.select("div#container")
                .append("p")
                .text(distance + " au")
                .attr("class", "data-display")
               })
           
    
        let circleAttributes = circles
            .attr("cx", circleWidth)
            .attr("cy", 250)
            .attr("r", function (d) { return d })
            .style("stroke", ringColour)
            .style("fill", "none")

        

      
        
    }

    generateStars(1, 20);
    generateStars(0.5, 100);
    svgBackground.append("circle").attr("cx", circleWidth).attr("cy", 250).attr("r", 5).style("fill", "#0077be");
}





let svgBackground = d3.select("div#container")
    .append("svg")
    .attr("preserveAspectRatio", "xMinYMin meet")
    .attr("viewBox", `0 0 ${width} 500`)
    .classed("svg-content", true)
    .on("mouseleave", function () {
        d3.selectAll("circle.neo")
            .style("stroke", ringColour);

        d3.select("div#container")
            .selectAll("p")
            .remove();

    })


function generateStars (size, number) {
    let starCoords = [];
    let maxX = window.innerWidth;
    let maxY = 500;
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
}

setUpSVG();















