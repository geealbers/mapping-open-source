function drawPie(chart) {

var radius = 250;
var legend = 200;
var width = radius * 2;
var donutWidth = radius * .8;
var legendRectSize = 18;
var legendSpacing = 8;

var colores = randomColor({
   count: 20,
   hue: '#8ADDEA'
});

var color = d3.scaleOrdinal()
  .range(colores);

d3.select("#pie").remove();
d3.select("#legend").remove();

var piechart = d3.select('#pie-container')
  .append('svg')
  .attr('width', width)
  .attr('height', width)
  .attr('id', 'pie')
  .append('g')
  .attr('transform', 'translate(' + radius +
    ',' + radius + ')');

var legend = d3.select('#pie-container')
  .append('svg')
  .attr('id', 'legend')
  .attr('height', width * 6 )
  .attr('style', '; margin-top:' + (legendRectSize) + ';')
  .append('g');

var arc = d3.arc()
  .innerRadius(radius - donutWidth)
  .outerRadius(radius);

var pie = d3.pie()
  .value(function(d) { return d.count; })

d3.json("../piechart.json", function(error, dataset) {

  if (error) throw error;

  if ( chart ) {
    if ( chart == "types" ) {
      var dataset = dataset.types;
    } else if ( chart == "languages" ) {
      var dataset = dataset.languages;
    } else if ( chart == "licenses" ) {
      var dataset = dataset.licenses;
    } else if ( chart == "sizes" ) {
      var dataset = dataset.sizes;
    } else if ( chart == "owners" ) {
      var dataset = dataset.owners;
    }
  } else {
    var select = document.getElementById("chart-options");
    var selection = select.options[select.selectedIndex].value;
    if ( selection == "types" ) {
      var dataset = dataset.types;
    } else if ( selection == "languages" ) {
      var dataset = dataset.languages;
    } else if ( selection == "licenses" ) {
      var dataset = dataset.licenses;
    } else if ( selection == "sizes" ) {
      var dataset = dataset.sizes;
    } else if ( selection == "owners" ) {
      var dataset = dataset.owners;
    }
  }

  dataset.forEach(function(d) {
    d.count = +d.count;
  });

  var path = piechart.selectAll('path')
    .data(pie(dataset).sort(function(a,b) { return +a.label - +b.label; }))
    .enter()
    .append('path')
    .attr('d', arc)
    .attr('onmouseover', 'highlight(this)')
    .attr('onmouseout', 'clearHighlight()')
    .attr('id', function(d) { return "n" + d.data.label.toLowerCase().replace(/ |\.|\"|\+/g, "-") + '_pie';} )
    .attr('fill', function(d, i) {
      return color(d.data.label);
    });

  var entry = legend.selectAll('.entry')
  .data(color.domain())
  .enter()
  .append('g')
  .attr('class', 'entry')
  .attr('transform', function(d, i) {
    var height = legendRectSize + legendSpacing;
    var offset =  height * color.domain().length / 2;
    var horz = 0;
    var vert = i * height;
    return 'translate(' + horz + ',' + vert + ')';
  });

  entry.append('rect')
    .attr('width', legendRectSize)
    .attr('height', legendRectSize)
    .attr('class', 'entry__color')
    .attr('onmouseover', 'highlight(this)')
    .attr('onmouseout', 'clearHighlight()')
    .attr('id', function(d) { return "n" + d.toLowerCase().replace(/ |\.|\"|\+/g, "-") + '_legend';} )
    .style('fill', color);

  entry.append('text')
    .attr('x', legendRectSize + legendSpacing)
    .attr('y', legendRectSize - legendSpacing)
    .text(function(d) { return d; });

});

}

// set up the dropdown select with Selectr
// https://github.com/Mobius1/Selectr
var selector = new Selectr("#chart-options", {
  defaultSelected: false,
  clearable: true,
  placeholder: "Show ...",
});

selector.clear();

function highlight(obj) {
  label = obj.id.split('_')[0]
  legends = document.querySelectorAll('#' + label + '_legend, #' + label + '_pie' )
  var legendsLength = legends.length;
  for (var i = 0; i < legendsLength; i++) {
    legends[i].classList.add("highlighted");
  };
}

function clearHighlight() {
  highlights = document.querySelectorAll(".highlighted");
  var highlightsLength = highlights.length;
  for (var i = 0; i < highlightsLength; i++) {
    highlights[i].classList.remove("highlighted");
  };
}
