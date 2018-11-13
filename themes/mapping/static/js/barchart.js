// Setup

var width = 900;
var height = 600;

var margin = {top: 20, right: 160, bottom: 35, left: 30};

var width = 960 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

var svg = d3.select("#barchart-container")
  .append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .append("g")
  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");


d3.json("../barchart.json", function(error, data) {
  if (error) throw error;

  var owners = ["ACMILabs", "ACMTX", "AdlerPlanetarium", "AucklandMuseum", "BNHM", "BarnesFoundation", "Beit-Hatfutsot", "BritishMuseum", "CMP-Studio", "ClevelandMuseumArt", "ColbyMuseum", "CurrentMuseum", "DenverArtMuseum", "DenverBotanicGardens", "FWMSH", "FreerSackler", "Guggenheim", "IMAmuseum", "IUAM", "MILEVMUS", "MKGHamburg", "MfN-Berlin", "MortonArb-ForestEcology", "Museum-of-Art-and-Digital-Entertainment", "MuseumOfContemporaryArtAUSTRALIA", "MuseumofModernArt", "NMAAHC", "NYSMuseum", "NationalGalleryOfArt", "NationalMuseumAustralia", "NationalMuseumofDenmark", "NationalmuseumSWE", "NaturalHistoryMuseum", "NordicMuseum", "PortlandArtMuseum", "Princeton-University-Art-Museum", "RBGKew", "SheddAquarium", "SlovakNationalGallery", "Smithsonian", "Statens-maritima-museer", "StatensMuseumforKunst", "TheScienceMuseum", "VizcayaMuseum", "WaltersArtMuseum", "american-art", "amnh", "art-institute-of-chicago", "artsbma", "artsmia", "blamcollective", "brooklynmuseum", "bsns-feedback", "camla", "cmhouston", "cmnh", "cmoa", "cooperhewitt", "cpmab", "digitalgamemuseum", "fieldmuseum", "gettypubs", "harvardartmuseums", "humanrights", "kalmarlansmuseum", "knreise", "lbmaorg", "lifeandscience", "lshSWE", "marinersmuseum", "metmuseum-medialab", "mfahouston", "mjh-nyc", "monticello-railway-museum", "mosboston", "mplusmuseum", "mus-nature-ca", "museum-of-vertebrate-zoology", "museumofappliedartsandsciences", "museumofoldandnewart", "museumsvictoria", "nasjonalmuseet", "nationalmuseum", "ngv", "philamuseum", "pittsburghkids", "pmns", "rbgvictoria", "riksantikvarieambetet", "rubinmusuem", "scimusmn", "sfmoma", "tategallery", "te-papa", "thegetty", "thewarholmuseum", "uamz-vertnet", "usnationalarchives", "vanda", "walkerart", "wamuseum", "wcmaart", "wellcometrust", "whitneymuseum", "ycba-cia"]

  var parse = d3.time.format("%Y").parse;

  // Transpose the data into layers
  var dataset = d3.layout.stack()(owners.map(function(owner) {
    return data.map(function(d) {
      return {x: parse(d.year), y: +d[owner], class: owner};
    });
  }));

  // Set x, y and colors
  var x = d3.scale.ordinal()
    .domain(dataset[0].map(function(d) { return d.x; }))
    .rangeRoundBands([10, width-10], 0.02);

  var y = d3.scale.linear()
    .domain([0, d3.max(dataset, function(d) {  return d3.max(d, function(d) { return d.y0 + d.y; });  })])
    .range([height, 0]);

  // Define and draw axes
  var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left")
    .ticks(10)
    .tickSize(-width, 0, 0)
    .tickFormat( function(d) { return d } );

  var xAxis = d3.svg.axis()
    .scale(x)
    .orient("bottom")
    .tickFormat(d3.time.format("%Y"));

  svg.append("g")
    .attr("class", "y axis")
    .call(yAxis);

  svg.append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(0," + height + ")")
    .call(xAxis);

  var ownerCount = owners.length

  var colors = randomColor({
     count: ownerCount,
     hue: '#8ADDEA'

  });

  // Create groups for each series, rects for each segment
  var groups = svg.selectAll("g.owner")
    .data(dataset)
    .enter()
    .append("g")
    .attr("class", "owner")
    .style("fill", function(d, i) { return colors[i]; } );

  var rect = groups.selectAll("rect")
    .data(function(d) { return d; })
    .enter()
    .append("rect")
    .attr("x", function(d) { return x(d.x); })
    .attr("y", function(d) { return y(d.y0 + d.y); })
    .attr("height", function(d) { return y(d.y0) - y(d.y0 + d.y); })
    .attr("width", x.rangeBand())
    .attr("class", function(d) { return d.class; })
    .on("mouseover", function() {
      var owner = this.className.baseVal;
      var ownerBlocks = document.getElementsByClassName(owner);
      var ownerLength = ownerBlocks.length;
      for (var i = 0; i < ownerLength; i++) {
        ownerBlocks[i].style.fill = "yellow";
      };
      tooltip.style("display", null);
    })
    .on("mouseout", function() {
      var owner = this.className.baseVal;
      var ownerBlocks = document.getElementsByClassName(owner);
      var ownerLength = ownerBlocks.length;
      for (var i = 0; i < ownerLength; i++) {
        ownerBlocks[i].style.fill = "";
      };
      tooltip.style("display", "none");
    })
    .on("mousemove", function(d) {
      var xPosition = d3.mouse(this)[0] - 15;
      var yPosition = d3.mouse(this)[1] - 25;
      tooltip.attr("transform", "translate(" + xPosition + "," + yPosition + ")");
      tooltip.select("text").text(d.class + " (" + d.y + ")");
    });

  // Prep the tooltip
  var tooltip = svg.append("g")
    .attr("class", "tooltip")
    .style("display", "none");

  tooltip.append("rect")
    .attr("x", -75)
    .attr("width", 150)
    .attr("height", 20)
    .attr("fill", "white")
    .style("opacity", 0.8);

  tooltip.append("text")
    .attr("dy", "1.2em")
    .style("text-anchor", "middle")
    .attr("font-size", "12px")
    .attr("font-weight", "bold");

})

// set up the dropdown select with Selectr
// https://github.com/Mobius1/Selectr
var selector = new Selectr("#owners", {
  defaultSelected: false,
  clearable: true,
  placeholder: "Organization ...",
});

selector.clear();

selector.on('selectr.clear', function() {
  // clearHighlights();
  // closeBox();
});

function highlightOwner() {

  var highlights = document.querySelectorAll(".highlighted");
  if (highlights) {
    var highlightsLength = highlights.length;
    for (var i = 0; i < highlightsLength; i++) {
      highlights[i].classList.remove("highlighted");
    };
  };

  // get entered username
  var select = document.getElementById("owners");
  var selection = select.options[select.selectedIndex];
  if ( selection ) {
    var ownerName = selection.text;
  }
  var ownerBlocks = document.getElementsByClassName(ownerName);
  var ownerLength = ownerBlocks.length;
  for (var i = 0; i < ownerLength; i++) {
    ownerBlocks[i].classList.add("highlighted");
  };
}
