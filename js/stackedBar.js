function renderStacked(filter) {
	var margin = {top: 20, right: 100, bottom: 100, left: 40},
    width = 730 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

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
    .tickFormat(d3.format(".2s"));

   var sort_val=false;

  	var div =  d3.select("#dashboard")
	.append("div")
	.attr("id","stackedChart")
	.style("float","left")
	.style("max-width","748px")
	.style("margin-right","10px")
	.style("margin-bottom","1%");
	
		div
		.append("button")
		.attr("id","hideshow2")
		.style("width","748px")
		.text("Verberg - Stacked chart");
		
	
	var svg2 = div.append("svg")
		.attr("class","svg2")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

	
	svg2.append("text")      // text label for the x axis
        .attr("x", 300 )
        .attr("y", 450 )
        .style("text-anchor", "middle")
        .text("Gebieden")
		.style("font-size","18px")
		.style("font-weight","bold");

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

  var tip = d3.tip()
  .attr('class', 'd3-tip')
  .offset([-10, 0])
  .html(function(d) {
    var x =d.y1-d.y0
    return "<strong>Aantal studenten:</strong> <span style='color:green;font-size:1.4em;'>" + d3.round(x,2) + "</span>";
  })

	svg2.call(tip);

 // data.sort(function(a, b) { return b.total - a.total; });


  x.domain(data.map(function(d) { return d.Gebieden; }));
  y.domain([0, d3.max(data, function(d) { return d.total; })]);

  svg2.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis)
	  .style("font-weight","bold")
	  .selectAll(".tick text")
      .call(wrap, x.rangeBand());
      

  svg2.append("g")
      .attr("class", "y axis")
      .call(yAxis);
	  
	  	  /*svg2.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y",-70)
        .attr("x",0 - (height / 2))
        .attr("dy", "1em")
        .style("text-anchor", "middle")
		.style("font-weight", "bold")
		.style("position","relative")
        .style("font-size", "18px")
        .text("Aantal studenten");*/

  var gebieden = svg2.selectAll(".gebieden")
      .data(data)
    .enter().append("g")
      .attr("class", ".gebieden")
      .attr("transform", function(d) { return "translate(" + x(d.Gebieden) + ",0)"; })
      .attr("id", function (d) {
          return d.Gebieden;
      })
	  .attr("class", "group");
	  
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
      .attr("height", function(d) { 
         //storing the height inside the states object for sorting
            d.parent.height += y(d.y0) - y(d.y1);
        return y(d.y0) - y(d.y1); })
      .style("fill", function(d) { return color(d.name); });
        
	
function sortData2() {
    sort_val = !sort_val;
    var x0 = x.domain(data.sort(sort_val ? function (a, b) {
        return b.height - a.height;
    } : function (a, b) {
        return d3.ascending(a.Gebieden, b.Gebieden);
    })
        .map(function (d) {
        return d.Gebieden;
    }))
        .copy();
    
    svg2.selectAll(".group")
        .sort(function (a, b) {
        return x0(a.Gebieden) - x0(b.Gebieden);
    });

    var transition = svg2.transition().duration(750),
        delay = function (d, i) {
            return i * 50;
        };
    //translate the group post sorting.
    transition.selectAll(".group")
        .delay(delay)
        .attr("transform", function (d) {

        return "translate(" + x0(d.Gebieden) + ",0)";
    });

    transition.select(".x.axis")
        .call(xAxis)
        .selectAll("g")
        .delay(delay)
		.selectAll(".tick text")
       .call(wrap, x.rangeBand());
}
	jQuery(document).ready(function(){
		jQuery('#sort').change(function(){sortData2();
		});
	});

  })
  
  }
 