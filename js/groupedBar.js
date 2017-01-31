function renderGrouped(filter){
	var margin2 = {top: 20, right: 20, bottom: 100, left: 70},
    width = 730 - margin2.left - margin2.right,
    height = 500 - margin2.top - margin2.bottom;

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
	var x1 = d3.scale.ordinal();
  
  	var div =  d3.select("#dashboard")
	.append("div")
	.attr("id","groupedChart")
	.style("float","left")
	.style("max-width","748px")
	.style("margin-right","10px")
	.style("margin-bottom","1%");
	
	div
		.append("button")
		.attr("id","hideshow")
		.style("width","748px")
		.text("Verberg - Grouped chart");

	var svg1=div
	.append("svg")
	.attr("class","svg1")
    .attr("width", width + margin2.left + margin2.right)
    .attr("height", height + margin2.top + margin2.bottom)
    .append("g")
    .attr("transform", "translate(" + margin2.left + "," + margin2.top + ")");
	
	
	var tip = d3.tip()
	  .attr('class', 'd3-tip')
	  .offset([-10, 0])
	  .html(function(d) {
		 return "<strong>Totaal studenten:</strong> <span style='color:green;font-size:1.4em;'>" + d3.round(d.value,2) + "</span>";
	 })

	svg1.append("text")      // text label for the x axis
		.attr("x", 300 )
        .attr("y", 450 )
        .style("text-anchor", "middle")
        .text("Gebieden")
		.style("font-size","18px")
		.style("font-weight","bold");

		svg1.call(tip);
  
  d3.csv("/data/alldata.csv", function(error, data) {
  if (error) throw error;

      var numberOfRows = data.length;
	 d3.select("#records").transition()
	 .duration(1500)
	 .tween("number", function() {
		  var i = d3.interpolateRound(0, numberOfRows);
		  var c = d3.interpolateRgb('#555', '#fa0');
		  return function(t) {
			this.textContent = i(t);
			d3.select(this).style({'color':c(t)});
		  };
	 });
 
	data=data.filter(function(element) {
		 if(filter == ""){
		  return element.onderwerpen == 'Aantal leerlingen basisonderwijs';
			 }else{
			  return element.onderwerpen == filter;
			 }
	});

//d3.select("body").style("background-color","black")
	 
    var totals=[
        d3.sum(data, function(d){return parseFloat(d["2003"]);}),
		d3.sum(data, function(d){return parseFloat(d["2004"]);}),
        d3.sum(data, function(d){return parseFloat(d["2005"]);}),
        d3.sum(data, function(d){return parseFloat(d["2006"]);}),
		d3.sum(data, function(d){return parseFloat(d["2007"]);}),
        d3.sum(data, function(d){return parseFloat(d["2008"]);}),
        d3.sum(data, function(d){return parseFloat(d["2009"]);}),
		d3.sum(data, function(d){return parseFloat(d["2010"]);}),
        d3.sum(data, function(d){return parseFloat(d["2011"]);}),
        d3.sum(data, function(d){return parseFloat(d["2012"]);})
    ];

	d3.select("#totals").selectAll("li").remove();
	var startJaar=2003;
	var startDelay=1000;
	
	d3.select("#totals").selectAll("div")
	.data(totals)
	.enter()
	.append("li")
	.attr("class","totalOfColumn")
	.append("span")
	.attr("class","yearColumn")
	.text(function(d){return startJaar++;});
	
	d3.selectAll(".totalOfColumn")
	.append("span")
	.attr("class","sumColumn")
	.transition()
	 .duration(function (d, i) {
	 return i * 200;})
	 .tween("number", function(d) {
		  var i = d3.interpolateRound(0, d);
		  var c = d3.interpolateRgb('#555', '#37AEBB');
		  return function(t) {
			this.textContent = i(t);
			d3.select(this).style({'color':c(t)});
		  };
	 });
	
 
  var ageNames = d3.keys(data[0]).filter(function(key) { return key !== "Gebieden" && key !=="onderwerpen"; });

  data.forEach(function(d) {
	       d.height = 0;
    d.ages = ageNames.map(function(name) { return {name: name, value: +d[name],parent: d}; });
  });
  
  x.domain(data.map(function(d) { return d.Gebieden; }));
  x1.domain(ageNames).rangeRoundBands([0, x.rangeBand()]);
  y.domain([0, d3.max(data, function(d) { return d3.max(d.ages, function(d) { return d.value; }); })]);

  svg1.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis)
	  .style("font-weight","bold")
	  .selectAll(".tick text")
      .call(wrap, x.rangeBand());

   svg1.append("g")
      .attr("class", "y axis")
      .call(yAxis);

	  
	  svg1.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y",-70)
        .attr("x",0 - (height / 2))
        .attr("dy", "1em")
        .style("text-anchor", "middle")
		.style("font-weight", "bold")
		.style("position","relative")
        .style("font-size", "18px")
        .text("Aantal studenten");
	  

  var gebieden = svg1.selectAll(".gebieden")
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
      .attr("width", x1.rangeBand())
      .attr("x", function(d) { return x1(d.name); })
      .attr("y", function(d) { return y(d.value); })
      .attr("height", function(d) { 
	     //storing the height inside the states object for sorting
	     d.parent.height +=height - y(d.value);
	  return height - y(d.value); })
      .style("fill", function(d) { return color(d.name); });

  /*var legend = svg.selectAll(".legend")
      .data(ageNames.slice().reverse())
    .enter().append("g")
      .attr("class", "legend")
      .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });

  legend.append("rect")
      .attr("x", width +80)
      .attr("width", 18)
      .attr("height", 18)
      .style("fill", color);

  legend.append("text")
      .attr("x", width +60)
      .attr("y", 9)
      .attr("dy", ".35em")
      .style("text-anchor", "end")
      .text(function(d) { return d; });
	  */
	  
	  
function sortData() {
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
    
    svg1.selectAll(".group")
        .sort(function (a, b) {
        return x0(a.Gebieden) - x0(b.Gebieden);
    });

    var transition = svg1.transition().duration(750),
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
		jQuery('#sort').change(function(){sortData();
		});
	});
		

  })
  
  };