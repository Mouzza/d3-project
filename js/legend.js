function renderLegend(){
	var margin = {top: 20, right: 100, bottom: 100, left: 40},
    width = 730 - margin.left - margin.right,
    height = 50 - margin.top - margin.bottom;

	var x = d3.scale.ordinal()
    .rangeRoundBands([0, width], .1);

	var y = d3.scale.linear()
    .rangeRound([height, 0]);

	var color = d3.scale.ordinal()
    .range(["#98abc5", "#B4DC2B", "#1E00DE", "#6b486b", "#000000", "#d0743c", "#ff8c00", "#A20A0A","#12D0C3","#F4FF00"]);
	
  	var div =  d3.select("#dashboard")
	.append("div")
	.attr("id","legend")
	.style("max-width","748px")
	.style("margin","1% auto");
	
	var svg0 = div.append("svg")
	.attr("class","svg0")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");


d3.csv("/data/alldata.csv", function(error, data) {
  if (error) throw error;

	 data = data.filter(function(row) {
			 if(filter==""){
			   return row['onderwerpen'] == 'Aantal leerlingen basisonderwijs';
			 }else{
			 return row['onderwerpen'] == filter;
			 }
	   });
  color.domain(d3.keys(data[0]).filter(function(key) { return key !== "Gebieden" && key !=="onderwerpen"; }));


  data.forEach(function(d) {
    var y0 = 0;
  //also storing state with the ages array
    d.ages = color.domain().map(function (name) {
        d.height = 0;
        return {
            name: name,
            y0: y0,
            y1: y0 += +d[name],
            parent: d
        };
    });
    d.total = d.ages[d.ages.length - 1].y1;
  });

  x.domain(data.map(function(d) { return d.Gebieden; }));
  y.domain([0, d3.max(data, function(d) { return d.total; })]);
  
        var xx=30;
		var xx2=65;
		
  var legend = svg0.selectAll(".legend")
      .data(color.domain().slice().reverse())
    .enter().append("g")
      .attr("class", "legend")
	  .style("font-weight","bold")
      .attr("transform", function(d, i) { return "translate(0," + i * 0 + ")"; });

  legend.append("rect")
      .attr("x", function(){return xx+=50})
      .attr("width", 40)
      .attr("height", 18)
      .style("fill", color);
	  
  legend.append("text")
      .attr("x", function(){return xx2+=50})
      .attr("y", -10)
      .attr("dy", ".35em")
      .style("text-anchor", "end")
      .text(function(d) { return d });
})

}