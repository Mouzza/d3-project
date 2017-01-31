var onderwerpen =["Aantal leerlingen basisonderwijs", 
"Aandeel inwoners dat basisonderwijs volgt",
"Aantal leerlingen basisonderwijs - jongens",
"Aantal leerlingen basisonderwijs - meisjes",
"Aantal leerlingen basisonderwijs - school buiten Antwerpen",
"Aantal leerlingen basisonderwijs - school binnen Antwerpen",
"Leerlingen basisonderwijs - percentage jongens",
"Leerlingen basisonderwijs - percentage meisjes",
"Leerlingen basisonderwijs - percentage school buiten Antwerpen",
"Leerlingen basisonderwijs - percentage school binnen Antwerpen",
"Aantal leerlingen gewoon kleuteronderwijs",
"Aantal leerlingen buitengewoon kleuteronderwijs",
"Aantal leerlingen kleuteronderwijs totaal",
"Leerlingen basisonderwijs - percentage gewoon kleuteronderwijs",
"Leerlingen basisonderwijs - percentage buitengewoon kleuteronderwijs",
"Leerlingen basisonderwijs - percentage kleuteronderwijs totaal",
"Aantal leerlingen gewoon lager onderwijs",
"Aantal leerlingen buitengewoon lager onderwijs",
"Aantal leerlingen lager onderwijs totaal",
"Leerlingen basisonderwijs - percentage gewoon lager onderwijs",
"Leerlingen basisonderwijs - percentage buitengewoon lager onderwijs",
"Leerlingen basisonderwijs - percentage lager onderwijs totaal",
"Aantal leerlingen gewoon lager onderwijs zonder schoolse vertraging",
"Aantal leerlingen gewoon lager onderwijs met 1 jaar schoolse vertraging",
"Aantal leerlingen gewoon lager onderwijs met meer dan 1 jaar schoolse vertraging",
"Aantal leerlingen gewoon lager onderwijs met schoolse vertraging",
"Percentage leerlingen gewoon lager onderwijs zonder schoolse vertraging",
"Percentage leerlingen gewoon lager onderwijs met 1 jaar schoolse vertraging",
"Percentage leerlingen gewoon lager onderwijs met meer dan 1 jaar schoolse vertraging",
"Percentage leerlingen gewoon lager onderwijs met schoolse vertraging",
"Aandeel GOK-leerlingen basisonderwijs",
"Aandeel indicator-leerlingen",
"Aandeel met thuistaal niet Nederlands",
"Aandeel met laag opgeleide moeder",
"Aandeel thuisloze leerlingen",
"Aandeel leerlingen trekkende bevolking",
"Aandeel leerlingen met schooltoelage",
"Aantal GOK-leerlingen basisonderwijs",
"Aantal indicator-leerlingen basisonderwijs",
"Aantal leerlingen met thuistaal niet Nederlands",
"Aantal leerlingen met laag opgeleide moeder",
"Aantal thuisloze leerlingen",
"Aantal leerlingen uit trekkende bevolking",
"Aantal leerlingen met schooltoelage",
"Aantal leerlingen basisonderwijs (GOK-telling)"]

	//drop down onderwerpen lijst
	
	var dropDown = d3.selectAll(".ui-field-contain").append("select")
                    .attr("name", "select-custom-20")
					.attr("id","select-custom-20")
					.attr("data-native-menu","false")
					.attr("onChange","listChanged()");
					

    var options = dropDown.selectAll("#select-custom-20")
           .data(onderwerpen)
           .enter()
           .append("option");


    options.text(function (d) { return d; })
       .attr("value", function (d) { return d; });


	var filter = localStorage.listSelected;
	var titel=$('h1');
 titel.text(filter);
 
 $('#select-custom-20').val(filter);
    // Get the data again
	
		  renderLegend()
		  renderGrouped(filter) 
		  renderStacked(filter) 
		  renderStacked2(filter) 
		  renderPieChart(filter) 
  
		  bindEvents();
  
function listChanged(){
 var selected = $('#select-custom-20').val();
 localStorage.listSelected = selected;
  window.location.reload(false); 	
}
	
function bindEvents(){
	
	//registeer events met jquery
	jQuery(document).ready(function(){

        jQuery('#hideshow').on('click', function(event) {        
             jQuery('.svg1').toggle('show');
			  $(this).text(function(i, text){
				  return text === "Verberg - Grouped chart" ? "Toon - Grouped chart" : "Verberg - Grouped chart";
			  })
        });
	
        jQuery('#hideshow2').on('click', function(event) {        
             jQuery('.svg2').toggle('show');
			   $(this).text(function(i, text){
				  return text === "Verberg - Stacked chart" ? "Toon - Stacked chart" : "Verberg - Stacked chart";
			  })
        });

        jQuery('#hideshow3').on('click', function(event) {        
             jQuery('.svg3').toggle('show');
			   $(this).text(function(i, text){
				  return text === "Verberg - Stacked chart 2" ? "Toon - Stacked chart 2" : "Verberg - Stacked chart 2";
			  })
        });
		
		jQuery('#hideshow4').on('click', function(event) {        
             jQuery('.svg4').toggle('show');
			   $(this).text(function(i, text){
				  return text === "Verberg - Pie chart" ? "Toon - Pie chart" : "Verberg - Pie chart";
			  })
        });
    });
	
	$('.sort').attr('checked', false);
	}

	//wrap de x-as tekst indien overlapping
function wrap(text, width) {
  text.each(function() {
    var text = d3.select(this),
        words = text.text().split(/\s+/).reverse(),
        word,
        line = [],
        lineNumber = 0,
        lineHeight = 1.1, // ems
        y = text.attr("y"),
        dy = parseFloat(text.attr("dy")),
        tspan = text.text(null).append("tspan").attr("x", 0).attr("y", y).attr("dy", dy + "em");
    while (word = words.pop()) {
      line.push(word);
      tspan.text(line.join(" "));
      if (tspan.node().getComputedTextLength() > width) {
        line.pop();
        tspan.text(line.join(" "));
        line = [word];
        tspan = text.append("tspan").attr("x", 0).attr("y", y).attr("dy", ++lineNumber * lineHeight + dy + "em").text(word);
      }
    }
  });
}	