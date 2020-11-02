var svgWidth = 800;
var svgHeight = 800;

var margin = {
  top: 20,
  right: 40,
  bottom: 80,
  left: 100
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Create an SVG wrapper, append an SVG group that will hold our chart,
// and shift the latter by left and top margins.
var svg = d3
  .select("#scatter")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

// Append an SVG group
var chartGroup = svg.append("g")
.attr("transform", `translate(${margin.left}, ${margin.top})`);

// Initial Params
var chosenXAxis = "poverty";
var chosenYAxis="healthcareLow"

// function used for updating x-scale var upon click on axis label
function xScale(healthData, chosenXAxis) {
    // create scales
    var xLinearScale = d3.scaleLinear()
      .domain([d3.min(healthData, d => d[chosenXAxis]) * 0.8,
        d3.max(healthData, d => d[chosenXAxis]) * 1.2
      ])
      .range([0, width]);
  
    return xLinearScale;
  
  }

  // function used for updating y-scale var upon click on axis label
  function yScale(healthData, chosenYAxis){
    var yLinearScale=d3.scaleLinear()
        .domain([d3.min(healthData, d=> d[chosenYAxis]), 
        d3.max(healthData, d=> d[chosenYAxis])])
        .range([height,0])

    return yLinearScale
}

// function used for updating xAxis var upon click on axis label
function renderAxes(newXScale, xAxis) {
    var bottomAxis = d3.axisBottom(newXScale);
  
    xAxis.transition()
      .duration(1000)
      .call(bottomAxis);
  
    return xAxis;
  }

// function used for updating yAxis var upon click on axis label
  function renderYAxes(newYScale, yAxis){
    var leftAxis = d3.axisLeft(newYScale)
    yAxis.transition()
        .duration(1000)
        .call(leftAxis)
    return yAxis
}

// function used for updating circles group with a transition to
// new circles
function renderCircles(circlesGroup, newXScale, newYScale, chosenXAxis, chosenYAxis) {

    circlesGroup.transition()
      .duration(1000)
      .attr("cx", d => newXScale(d[chosenXAxis]))
      .attr("cy", d=> newYScale(d[chosenYAxis]));
  
    return circlesGroup;
  }

function renderText(abbrG,newXScale, newYScale,chosenXAxis, chosenYAxis ){
    abbrG.transition()
    .duration(1000)
    .text(d=>d.abbr)
    .attr("x", d=> newXScale(d[chosenXAxis]))
    .attr("y", d=>newYScale(d[chosenYAxis]) )

    return abbrG
}

// function used for updating circles group with new tooltip
function updateToolTip(chosenXAxis, chosenYAxis,circlesGroup){
    var xLabel;
    
    if(chosenXAxis=="poverty") {
    xLabel="In Poverty(%):"
    }
    else if (chosenXAxis=="age"){
    xLabel="Age (Median):"
    }
    else{
    xLabel="Household Income (Median):"
    }

    var yLabel;
    if(chosenYAxis=="healthcareLow") {
        yLabel="Lacks Healthcare(%):"
    }
    else if (chosenYAxis=="obesityHigh"){
        yLabel="Obese (%):"
    }
    else{
        yLabel="Smokes (%):"
    }

    var toolTip =d3.tip()
    .attr("class", "d3-tip")
    .offset([80,-60])
    .html(d=>{return `${d.state}<br> ${xLabel} ${d[chosenXAxis]} <br> ${yLabel} ${d[chosenYAxis]}`})

    circlesGroup.call(toolTip)
    circlesGroup.on("mouseover", d=>{
        toolTip.show(d, this)
    })
    .on("mouseout", d=> {
     toolTip.hide(d)
    })
    return circlesGroup

}

// Retrieve data from the CSV file and execute everything below
d3.csv("assets/data/data.csv").then(function(healthData, err){
    if (err) throw err;
    healthData.forEach(function(d){
        d.poverty=+d.poverty
        d.povertyMoe=+d.povertyMoe
        d.age=+d.age
        d.ageMoe=+d.ageMoe
        d.income=+d.income
        d.incomeMoe=+d.incomeMoe
        d.healthcare=+d.healthcare
        d.healthcareLow=+d.healthcareLow
        d.healthcareHigh=+d.healthcareHigh
        d.obesity=+d.obesity
        d.obesityLow=+d.obesityLow
        d.obesityHigh=+d.obesityHigh
        d.smokes=+d.smokes
        d.smokesLow=+d.smokesLow
        d.smokesHigh=+d.smokesHigh

    })

var xLinearScale=xScale(healthData, chosenXAxis)
var yLinearScale=yScale(healthData, chosenYAxis)

// Create initial axis functions
var bottomAxis=d3.axisBottom(xLinearScale)
var leftAxis=d3.axisLeft(yLinearScale)

var yAxis =chartGroup.append("g")
    .call(leftAxis);

var xAxis=chartGroup.append("g")
    .attr("transform", `translate(0,${height})`)
    .classed("x-axis", true)
    .call(bottomAxis);

 // append initial circles
 var circle = chartGroup.selectAll("circle")
    .data(healthData)
    .enter()
    .append("g")

var radius = 15
var circlesGroup = dot.append("circle")
    .attr("cx", d=> xLinearScale(d[chosenXAxis]) )
    .attr("cy", d=> yLinearScale(d[chosenYAxis]))
    .attr("r", radius)
    .classed("stateCircle", true)

var abbrG =dot
    .append("text")
    .text(d=>d.abbr)
    .classed("stateText", true)
    .attr("font-size","3px")
    .attr("x", d=> xLinearScale(d[chosenXAxis]))
    .attr("y", d=> yLinearScale(d[chosenYAxis]) )

var labelsXGroup=chartGroup.append("g")
    .attr("transform", `translate(${chartWidth/2},${chartHeight+20})`);
    
var labelsYGroup =chartGroup.append("g")
    .attr("transform", `translate(${chartWidth-margin.left/4},${chartHeight/2}) rotate(90)`)

//Labels 
var povertyLabel = labelsXGroup.append("text")
    .attr("x",0)
    .attr("y",20)
    .attr("value", "poverty")
    .classed("active", true)
    .text("In Poverty (%)")

var ageLabel = labelsXGroup.append("text")
    .attr("x",0)
    .attr("y",40)
    .attr("value", "age")
    .classed("active", true)
    .text("Age (Median)")

var incomeLabel = labelsXGroup.append("text")
    .attr("x",0)
    .attr("y",60)
    .attr("value", "income")
    .classed("active", true)
    .text("Household Income (Median)")

var labelsYGroup =chartGroup.append("g")
    

var healthcareLabel = labelsYGroup.append("text")
    .attr("x",0)
    .attr("y",0)
    .attr("transform", `translate(${0-margin.left/2.8},${chartHeight/2}) rotate(90)`)
    .attr("value", "healthcareLow")
    .classed("active", true)
    .text("Lacks Healthcare(%)")

var smokesLabel = labelsYGroup.append("text")
  .attr("transform", `translate(${0-margin.left/1.5},${chartHeight/2}) rotate(90)`)
    .attr("x",0)
    .attr("y",0)
    .attr("value", "smokesHigh")
    .classed("active", true)
    .text("Smokes(%)")

var obesityLabel = labelsYGroup.append("text")
    .attr("transform", `translate(${0-margin.left},${chartHeight/2}) rotate(90)`)
    .attr("x",0)
    .attr("y",0)
    .attr("value", "obesityHigh")
    .classed("active", true)
    .text("Obesity rate(%)")

var circlesGroup=updateToolTip(chosenXAxis,chosenYAxis, circlesGroup)

labelsXGroup.selectAll("text")
    .on("click", function(){
       var  value = d3.select(this).attr("value")
console.log(value)
       if(value!=chosenXAxis){
           chosenXAxis=value
       
        xLinearScale=xScale(healthData, chosenXAxis)
        xAxis=renderXAxes(xLinearScale,xAxis)
        
        circlesGroup=renderCircles(circlesGroup,xLinearScale,yLinearScale,chosenXAxis,chosenYAxis)
        abbrG =renderText(abbrG,xLinearScale,yLinearScale,chosenXAxis, chosenYAxis )
        
        circlesGroup=updateToolTip(chosenXAxis, chosenYAxis,circlesGroup)

        if (chosenXAxis=="poverty"){
            povertyLabel.classed("active", true)
                .classed("inactive", false)
            ageLabel.classed("active", false)
                .classed("inactive", true)
            incomeLabel.classed("active", false)
                .classed("inactive", true)
        }
        if (chosenXAxis=="age"){
            povertyLabel.classed("active", false)
                .classed("inactive", true)
            ageLabel.classed("active", true)
                .classed("inactive", false)
            incomeLabel.classed("active", false)
                .classed("inactive", true)
        }
        if (chosenXAxis=="income"){
            povertyLabel.classed("active", false)
                .classed("inactive", true)
            ageLabel.classed("active", false)
                .classed("inactive", true)
            incomeLabel.classed("active", true)
                .classed("inactive", false)
        }

       }
    })


labelsYGroup.selectAll("text")
    .on("click", function(){
       var  yvalue = d3.select(this).attr("value")
console.log(yvalue)
       if(yvalue!=chosenYAxis){
           chosenYAxis=yvalue
       
        yLinearScale=yScale(cityData, chosenYAxis)
        yAxis=renderYAxes(yLinearScale,yAxis)
        console.log(chosenYAxis)
        console.log(chosenXAxis)
        console.log(xLinearScale)
        console.log(yLinearScale)
        console.log(circlesGroup)
        circlesGroup=renderCircles(circlesGroup,xLinearScale,yLinearScale,chosenXAxis,chosenYAxis)
        abbrG =renderText(abbrG,xLinearScale,yLinearScale,chosenXAxis, chosenYAxis )
        
        circlesGroup=updateToolTip(chosenXAxis, chosenYAxis,circlesGroup)

        if (chosenYAxis=="healthcareLow"){
            healthcareLabel.classed("active", true)
                .classed("inactive", false)
            obesityLabel.classed("active", false)
                .classed("inactive", true)
            smokesLabel.classed("active", false)
                .classed("inactive", true)
        }
        if (chosenYAxis=="obesityHigh"){
            healthcareLabel.classed("active", false)
                .classed("inactive", true)
            obesityLabel.classed("active", true)
                .classed("inactive", false)
            smokesLabel.classed("active", false)
                .classed("inactive", true)
        }
        if (chosenYAxis=="smokesHigh"){
            healthcareLabel.classed("active", false)
                .classed("inactive", true)
            obesityLabel.classed("active", false)
                .classed("inactive", true)
            smokesLabel.classed("active", true)
                .classed("inactive", false)
        }

       }
    })
      


}).catch(function(error) {
    console.log(error);})
  