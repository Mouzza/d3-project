function renderPieChart(filter){
	var width = 730,
    height = 500,
    radius = Math.min(width, height) / 2;

	var color = d3.scale.ordinal()
    .range(["#98abc5", "#B4DC2B", "#1E00DE", "#6b486b", "#000000", "#d0743c", "#ff8c00", "#A20A0A","#12D0C3","#F4FF00"]);
	
	var arc = d3.svg.arc()
    .outerRadius(radius - 5)
    .innerRadius(radius - 100);
	
	var labelArc = d3.svg.arc()
    .outerRadius(radius - 60)
    .innerRadius(radius - 60);
	
	var pie = d3.layout.pie()
    .sort(null)
    .value(function(d) { return d.total; });
	
  	var div =  d3.select("#dashboard")
	.append("div")
	.attr("id","pieChart")
	.style("float","left")
	.style("max-width","748px")
	.style("margin-right","10px")
	.style("margin-bottom","1%");
	
	div
		.append("button")
		.attr("id","hideshow4")
		.style("width","748px")
		.text("Verberg - Pie chart");
	
	var svg4 = div.append("svg")
	.attr("class","svg4")
    .attr("width", width)
    .attr("height", height)
   .append("g")
    .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");
	
	svg4.append("g")
	.attr("class", "labels");
	svg4.append("g")
	.attr("class", "lines");
	
	
d3.csv("/data/alldata.csv", function(error, data) {
  if (error) throw error;
  
data=data.filter(function(element) {
	 if(filter == ""){
	  return element.onderwerpen == 'Aantal leerlingen basisonderwijs';
	  filter='Aantal leerlingen basisonderwijs';
		 }else{
		  return element.onderwerpen == filter;
		 }
});

//d3.select("body").style("background-color","black")
	 
    var data=[
	    {"year": "2003","total": d3.sum(data, function(d){return parseFloat(d["2003"]);})},
		{"year": "2004","total": d3.sum(data, function(d){return parseFloat(d["2004"]);})},
        {"year": "2005","total": d3.sum(data, function(d){return parseFloat(d["2005"]);})},
        {"year": "2006","total": d3.sum(data, function(d){return parseFloat(d["2006"]);})},
		{"year": "2007","total": d3.sum(data, function(d){return parseFloat(d["2007"]);})},
        {"year": "2008","total": d3.sum(data, function(d){return parseFloat(d["2008"]);})},
        {"year": "2009","total": d3.sum(data, function(d){return parseFloat(d["2009"]);})},
		{"year": "2010","total": d3.sum(data, function(d){return parseFloat(d["2010"]);})},
        {"year": "2011","total": d3.sum(data, function(d){return parseFloat(d["2011"]);})},
        {"year": "2012","total": d3.sum(data, function(d){return parseFloat(d["2012"]);})}
    ];

	var sumData = d3.sum(data, function(d) { return d.total; });
 

  var g = svg4.selectAll(".arc")
      .data(pie(data))
    .enter().append("g")
      .attr("class", "arc");
  g.append("path")
  	   .transition()
      .delay(function(d,i) { return i * 100 })
      .duration(100)
      .attr("d", arc)
      .style("fill", function(d) { return color(d.data.year); });
  g.append("text")
      .attr("transform", function(d) { return "translate(" + labelArc.centroid(d) + ")"; })
      .attr("dy", ".35em")
      .text(function(d) { return d3.round(d.data.total,2); })
	  .attr("class","sliceName")
	  .style("fill","white");
	  
	svg4.append("text")
      .attr("dy", "0em")
      .style("text-anchor", "middle")
      .attr("class", "insideTitel")
      .text(function(d) { return 'Totaal per jaar'; });
	 
	 svg4.append("text")
       .attr("dy", "1.5em")
      .style("text-anchor", "middle")
      .attr("class", "insideSumData")
      .text(function(d) { return d3.round(sumData,2); });
	  
	  
	svg4.append("text")
      .attr("dy", "3em")
      .style("text-anchor", "middle")
      .attr("class", "insideCategory")
      .text(function(d) { return filter; })
      .call(wrap, 300);
	  
});
}