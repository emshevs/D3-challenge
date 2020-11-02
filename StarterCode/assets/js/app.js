var svgWidth = 960;
var svgHeight = 500;

var margin = {
  top: 20,
  right: 40,
  bottom: 60,
  left: 100
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Create an SVG wrapper, append an SVG group that will hold our chart, and shift the latter by left and top margins.
var svg = d3.select("#scatter")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

// Import Data
d3.csv("assets/data/data.csv").then(function(healthData) {

    // Step 1: Parse Data/Cast as numbers
    // ==============================
   healthData.forEach(function(data) {
      data.poverty = +data.poverty;
      data.obesity = +data.obesity;
    });

    // Step 2: Create scale functions
    // ==============================
    var xScale = d3.scaleLinear()
        .domain([d3.min(healthData, d => d.poverty)*0.8, d3.max(healthData, d=>d.poverty)])
        .range([0, width]);

    var yScale = d3.scaleLinear()
        .domain([d3.min(healthData, d=>d.obesity)*0.8, d3.max(healthData, d=>d.obesity)])
        .range([height, 0]);
    // Step 3: Create axis functions
    // ==============================
    var bottomAxis = d3.axisBottom(xScale);
    var leftAxis = d3.axisLeft(yScale);

    // Step 4: Append Axes to the chart
    // ==============================
    chartGroup.append("g")
      .attr("transform", `translate(0, ${height})`)
      .call(bottomAxis);

    chartGroup.append("g")
      .call(leftAxis);

    // Step 5: Create Circles
     var circlesGroup = chartGroup.selectAll("circle")
        .data(healthData)
        .enter().append('g')

        circlesGroup.append("circle")
        .attr("cx", d => xScale(d.poverty))
        .attr("cy", d => yScale(d.obesity))
        .attr("r", "15")
        .attr("fill", "blue")
        .attr("opacity", ".8")
        .classed("stateCircle", true)

    
        circlesGroup.append("text").text(d=>d.abbr)
        .classed("stateText", true)
        .attr("font-size","5px")
        .attr("x", d=> xScale(d.poverty))
        .attr("y", d=> yScale(d.obesity) );

    //Append axis labels 
    chartGroup.append("text")
        .attr("class", "x label")
        .attr("text-anchor", "center")
        .attr("x", width/2)
        .attr("y", height + 45)
        .attr("font-size", 20)
        .text("% in Poverty");

    chartGroup.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - margin.left)
        .attr("x", 0 - (height / 2))
        .attr("dy", "1em")
        .classed("axis-text", true)
        .text("Obesity Rate");
    

})
