// @TODO: YOUR CODE HERE!
// store width & height parameters
var svgWidth = 900;
var svgHeight = 600;

// set svg margins 
var margin = {
  top: 40,
  right: 40,
  bottom: 90,
  left: 90
};

// create the width/height-based svg margins and parameters to fit chart
var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// create space to append SVG group that contains state data
// call pre-defined width/height vars
var svg = d3.select("#scatter")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

// create chartGroup to contain data
// use transform attr to fit 
var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

// import data
var file = "assets/data/data.csv"

// call function to pass csv data
d3.csv(file).then(successHandle, errorHandle);

// use error handling function to append data and SVG objects
// throw error in console if one exists 
function errorHandle(error) {
  throw err;
}

// function to handle state data
function successHandle(statesData) {

  // loop through csv data to pass the following arguments 
  statesData.map(function (data) {
    data.poverty = +data.poverty;
    data.obesity = +data.obesity;
  });

  // create scale functions
  var xLinearScale = d3.scaleLinear()
    .domain([8.1, d3.max(statesData, d => d.poverty)])
    .range([0, width]);

  var yLinearScale = d3.scaleLinear()
    .domain([20, d3.max(statesData, d => d.obesity)])
    .range([height, 0]);

  // create axis functions by calling the scale functions

  var bottomAxis = d3.axisBottom(xLinearScale)
    // Adjust the number of ticks for the bottom axis  
    .ticks(7);
  var leftAxis = d3.axisLeft(yLinearScale);




  // append axes to chart group  
  chartGroup.append("g")
    .attr("transform", `translate(0, ${height})`)
    .call(bottomAxis);
  // Left axis is already at 0,0
  // Only append the left axis 
  chartGroup.append("g")
    .call(leftAxis);


  // create circles for scatter plot
  var circlesGroup = chartGroup.selectAll("circle")
    .data(statesData)
    .enter()
    .append("circle")
    .attr("cx", d => xLinearScale(d.poverty))
    .attr("cy", d => yLinearScale(d.obesity))
    .attr("r", "12")
    .attr("fill", "#788dc2")
    .attr("opacity", ".65")


  //append text to circles 
  var circlesGroup = chartGroup.selectAll()
    .data(statesData)
    .enter()
    .append("text")
    .attr("x", d => xLinearScale(d.poverty))
    .attr("y", d => yLinearScale(d.obesity))
    .style("font-size", "13px")
    .style("text-anchor", "middle")
    .style('fill', 'white')
    .text(d => (d.abbr));

  // initialize tooltip
  var toolTip = d3.tip()
    .attr("class", "tooltip")
    .offset([80, -60])
    .html(function (d) {
      return (`${d.state}<br>Poverty: ${d.poverty}%<br>Obesity: ${d.obesity}% `);
    });

  //create tooltip in chart
  chartGroup.call(toolTip);

  //create event listeners to display and hide the tooltip
  circlesGroup.on("mouseover", function (data) {
    toolTip.show(data, this);
  })
    // onmouseout event
    .on("mouseout", function (data) {
      toolTip.hide(data);
    });

  // create axes labels
  chartGroup.append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 0 - margin.left + 40)
    .attr("x", 0 - (height / 2))
    .attr("dy", "1em")
    .attr("class", "axisText")
    .text("Obese (%)");

  chartGroup.append("text")
    .attr("transform", `translate(${width / 2}, ${height + margin.top + 30})`)
    .attr("class", "axisText")
    .text("In Poverty (%)");
}
