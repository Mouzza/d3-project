function renderStacked2(filter){
	var margin3 = {top: 20, right: 20, bottom: 100, left: 70},
    width = 730 - margin3.left - margin3.right,
    height = 500 - margin3.top - margin3.bottom;

	var x = d3.scale.ordinal()
    .rangeRoundBands([0, width], .1);

	var y = d3.scale.linear()
    .rangeRound([height, 0]);

	var color = d3.scale.ordinal()
    .range(["#98abc5", "#B4DC2B", "#1E00DE", "#6b486b", "#000000", "#d0743c", "#ff8c00", "#A20A0A","#12D0C3","#F4FF00"]);

	var xAxis = d3.svg.axis()
    .scale(x)
    .orient("bottom");

	var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left")
    .tickFormat(d3.format(".0%"));
	
  	var div =  d3.select("#dashboard")
	.append("div")
	.attr("id","stackedChart2")
	.style("float","left")
	.style("max-width","748px")
	.style("margin-right","10px")
	.style("margin-bottom","1%");
	
		div
		.append("button")
		.style("width","748px")
		.attr("id","hideshow3")
		.text("Verberg - Stacked chart 2");
		

	var svg3 = div.append("svg")
	.attr("class","svg3")
    .attr("width", width + margin3.left + margin3.right)
    .attr("height", height + margin3.top + margin3.bottom)
    .append("g")
    .attr("transform", "translate(" + margin3.left + "," + margin3.top + ")");

	
	svg3.append("text")      // text label for the x axis
        .attr("x", 300 )
        .attr("y", 450 )
        .style("text-anchor", "middle")
        .text("Gebieden")
		.style("font-size","18px")
		.style("font-weight","bold");
		
		
		svg3.append("text")   // text label for the y axis
        .attr("transform", "rotate(-90)")
        .attr("y",-70)
        .attr("x",0 - (height / 2))
        .attr("dy", "1em")
        .style("text-anchor", "middle")
		.style("font-weight", "bold")
		.style("position","relative")
        .style("font-size", "18px")
        .text("Aantal studenten");
		
d3.csv("/data/alldata.csv", function(error, data) {
  if (error) throw error;
	 data = data.filter(function(row) {
			 if(filter==""){
			   return row['onderwerpen'] == 'Aantal leerlingen basisonderwijs';
			 }else{
			 return row['onderwerpen'] == filter;
			 }
	   });

  color.domain(d3.keys(data[0]).filter(function(key) { return key !== "Gebieden" &&  key !== "onderwerpen";}));

  data.forEach(function(d) {
    var y0 = 0;
    d.ages = color.domain().map(function(name) { return {name: name, y0: y0, y1: y0 += +d[name]}; });
    d.ages.forEach(function(d) { d.y0 /= y0; d.y1 /= y0; });
  });

   var tip = d3.tip()
  .attr('class', 'd3-tip')
  .offset([-10, 0])
  .html(function(d) {
    var x =d.y1-d.y0
    return "<strong>Aantal studenten:</strong> <span style='color:green;font-size:1.4em;'>" + d3.round(x*100,2) + "%</span>";
  })

	svg3.call(tip);

  data.sort(function(a, b) { return b.ages[0].y1 - a.ages[0].y1; });

  x.domain(data.map(function(d) { return d.Gebieden; }));

  svg3.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis)
	  .style("font-weight","bold")
	  .selectAll(".tick text")
      .call(wrap, x.rangeBand());

  svg3.append("g")
      .attr("class", "y axis")
      .call(yAxis);

  var gebieden = svg3.selectAll(".gebieden")
      .data(data)
    .enter().append("g")
      .attr("class", "gebieden")
      .attr("transform", function(d) { return "translate(" + x(d.Gebieden) + ",0)"; });

  gebieden.selectAll("rect")
      .data(function(d) { return d.ages; })
    .enter().append("rect")
	  .on('mouseover', tip.show)
      .on('mouseout', tip.hide)
	  .transition()
      .delay(function(d, i) { return i * 100 })
      .duration(100)    
      .attr("width", x.rangeBand())
      .attr("y", function(d) { return y(d.y1); })
      .attr("height", function(d) { return y(d.y0) - y(d.y1); })
      .style("fill", function(d) { return color(d.name); });

  var legend = svg3.select(".gebieden:last-child").selectAll(".legend")
      .data(function(d) { return d.ages; })
    .enter().append("g")
      .attr("class", "legend")
      .attr("transform", function(d) { return "translate(" + x.rangeBand() / 2 + "," + y((d.y0 + d.y1) / 2) + ")"; });

  legend.append("line")
      .attr("x2", 10);

  legend.append("text")
      .attr("x", 30)
      .attr("dy", ".35em")
	  .style("fill","black")
	  .style("font-weight","bold")
      .text(function(d) { return "-"+d.name; });
});

}
