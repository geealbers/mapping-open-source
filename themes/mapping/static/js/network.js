// set base size and scale
var w = 3600;
var h = 3600;
var scale = .8;

var force = d3.layout.force()
  .charge(-100)
  .linkDistance(50)
  .size([w, h]);

var svg = d3.select("#graph-container")
  .append("svg")
  .attr("id", "network-graph")
  .attr("width", w)
  .attr("height", h)
  .append("g")
  .attr("transform", "scale(" + scale + ")")

d3.json("../network.json", function(error, dataset) {
  if (error) throw error;

  // Pull stats from data and display in page banner
  function search(nameKey, myArray) {
    x = 0;
    for (var i = 0; i < myArray.length; i++) {
      if (myArray[i].type === nameKey) {
        x++
      }
    }
    return x;
  }
  var nodesArray = dataset.nodes;
  var contributorNumber = search("contributor", nodesArray);
  var organizationNumber = search("organization", nodesArray);
  var edgesArray = dataset.edges;
  var contributionsNumber = search("contribution", edgesArray);
  var forksNumber = search("fork", edgesArray);

  document.getElementById("number-of-contributors").innerHTML = contributorNumber;
  document.getElementById("number-of-organizations").innerHTML = organizationNumber;
  document.getElementById("number-of-contributions").innerHTML = contributionsNumber;
  document.getElementById("number-of-forks").innerHTML = forksNumber;

  // D3 expects edge source and target to be node array positions,
  // not node IDs. The following bit processes the JSON to switch
  // IDs to array positions.
  var processededges = [];
  dataset.edges.forEach(function(e) {

    var sourceNode = dataset.nodes.filter(function(n) {
        return n.id === e.source;
      })[0],
      targetNode = dataset.nodes.filter(function(n) {
        return n.id === e.target;
      })[0],
      contributorTo = e.contributor_to,
      edgeType = e.type
    sourceName = e.source
    targetName = e.target;

    processededges.push({
      source: sourceNode,
      target: targetNode,
      contributor_to: contributorTo,
      type: edgeType,
      source_name: sourceName,
      target_name: targetName
    });
  });

  force.nodes(dataset.nodes)
    .links(processededges)
    .start();
  for (var i = 0; i < 150; ++i) force.tick();
  force.stop();

  // setup edges
  var edges = svg.selectAll("line")
    .data(processededges)
    .enter()
    .append("line")

    // if edge is connected to a contributor that did not
    // contribute elsewhere, mark with .single class
    .attr("class", function(d) {
      if (d.contributor_to <= 1) {
        return d.type + "-edge single";
      } else {
        return d.type + "-edge";
      }
    })
    .attr("x1", function(d) { return d.source.x; })
    .attr("y1", function(d) { return d.source.y; })
    .attr("x2", function(d) { return d.target.x; })
    .attr("y2", function(d) { return d.target.y; })
    .attr("data-source", function(d) { return d.source_name; })
    .attr("data-target", function(d) { return d.target_name; });

  // setup nodes
  var node = svg.selectAll(".node")
    .data(dataset.nodes)
    .enter()
    .append("g")
    .attr("id", function(d) { return d.id })
    .attr("class", "node")
    .attr("class", function(d) { return d.type })
    .call(force.drag);

  // size nodes based on number of contributions or repos
  node.append("circle")
    .attr("r", function(d) {
      if (d.contributions > 1000 || d.repos > 100) {
        return 7;
      } else if (d.contributions >= 500 || d.repos >= 50) {
        return 6;
      } else if (d.contributions >= 200 || d.repos >= 20) {
        return 5;
      } else if (d.contributions >= 50 || d.repos >= 50) {
        return 4;
      } else if (d.contributions >= 10 || d.repos >= 1) {
        return 3;
      } else if (d.contributions < 10 || d.repos < 1) {
        return 2;
      }
    })

    // if node is a contributor that only contributed to one
    // organization, mark with .single class
    .attr("class", function(d) {
      if (d.contributor_to <= 1) {
        return "node-marker single";
      } else {
        return "node-marker";
      }
    })
    .attr("cx", function(d) { return d.x; })
    .attr("cy", function(d) { return d.y; });

  // link to user/org GitHub page
  node.append("a")
    .attr("xlink:href", function(d) {
      return "https://github.com/" + d.id
    })
    .attr("target", "_blank");

  // adjust label position based on type height
  // and node circle radius
  var typeHeight = 4;

  svg.selectAll("a")
    .append("text")
    .attr("class", "node-text")
    .attr("text-anchor", "middle")
    .attr("dy", function(d) {
      if (d.contributions > 1000 || d.repos > 100) {
        return typeHeight + 7;
      } else if (d.contributions >= 500 || d.repos >= 50) {
        return typeHeight + 6;
      } else if (d.contributions >= 200 || d.repos >= 20) {
        return typeHeight + 5;
      } else if (d.contributions >= 50 || d.repos >= 50) {
        return typeHeight + 4;
      } else if (d.contributions >= 10 || d.repos >= 1) {
        return typeHeight + 3;
      } else if (d.contributions < 10 || d.repos < 1) {
        return typeHeight + 2;
      }
    })
    .text(function(d) { return d.id })
    .attr("x", function(d) { return d.x })
    .attr("y", function(d) { return d.y; });

});

// wait enough time for SVG to be created and ...
setTimeout(function() {

  // scroll to center point
  window.scrollTo(((w * .5) - (window.innerWidth * .5)), ((h * .5) - (window.innerHeight * .5)));

  // add event listeners to all node circles for highlighting on mousedown
  var nodeMarkers = document.querySelectorAll(".node-marker");
  var markersLength = nodeMarkers.length;
  for (var i = 0; i < markersLength; i++) {
    nodeMarkers[i].addEventListener("mousedown", addHighlights);
    // add attribute to make it easier to find this element later
    nodeMarkers[i].setAttribute("data-listener", "addHighlights");
  };

}, 1000);

function addHighlights(c) {

  clearHighlights();
  var circle;
  if ( c.currentTarget ) {
    var circle = c.currentTarget;
  } else {
    var circle = c;
  };

  // get user's node and highlight it
  circle.classList.add("highlighted");
  circle.classList.remove("hidden");

  // get user's edgelines and highlight them
  var userName = circle.closest("g").id;
  var edgeLines = document.querySelectorAll("[data-target='" + userName + "'], [data-source='" + userName + "']");
  var linesLength = edgeLines.length;
  for (var i = 0; i < linesLength; i++) {
    edgeLines[i].classList.add("highlighted");
    edgeLines[i].classList.remove("hidden");
  }
  // swap event listenter and data attributes to
  // prepare to clear highlights on next mousedown
  circle.removeEventListener("mousedown", addHighlights);
  circle.addEventListener("mousedown", clearHighlights);
  circle.setAttribute("data-listener", "clearHighlights");
}

function clearHighlights() {
  var previous = document.querySelectorAll(".highlighted");
  if (previous) {
    var previousLength = previous.length;
    for (var i = 0; i < previousLength; i++) {
      previous[i].classList.remove("highlighted");
      state = previous[i].getAttribute("data-listener");
      if (state == "clearHighlights") {
        previous[i].removeEventListener("mousedown", clearHighlights);
        previous[i].addEventListener("mousedown", addHighlights);
      }
    };
  };
}

function toggleSingle() {
  console.log("toggled");
  var singles = document.querySelectorAll(".single");
  var singlesLength = singles.length;
  if (document.getElementById("toggle-single").checked) {
    for (var i = 0; i < singlesLength; i++) {
      singles[i].classList.add("hidden");
    };
  } else {
    for (var i = 0; i < singlesLength; i++) {
      singles[i].classList.remove("hidden");
    };
  }
}

// set variables for page navigation controls: find & zoom
var graph = document.getElementById("network-graph");
var g = graph.getElementsByTagName("g")[0];
var w = graph.getAttribute("width");
var h = graph.getAttribute("height");

// check and return the current SVG scale,
// activate and deactivate zoom buttons accordingly
// to control the maximum levels of zoom in and out
function checkScale() {
  var s = g.getAttribute("transform").match(/[0]?\.?[0-9]+/)[0];
  var currentScale = parseFloat(s);
  if (currentScale == 7) {
    document.getElementById("zoom-in").disabled = true;
  } else {
    document.getElementById("zoom-in").disabled = false;
  };
  if (currentScale < 0.5) {
    document.getElementById("zoom-out").disabled = true;
  } else {
    document.getElementById("zoom-out").disabled = false;
  };
  return currentScale;
}

// adjust margin if SVG gets smaller than window width
function checkMargin(newScale) {
  if ((w * newScale) < window.innerWidth) {
    var margin = (window.innerWidth - (w * newScale)) / 2;
    graph.style.marginLeft = margin;
    graph.style.marginRight = margin;
  } else {
    graph.style.marginLeft = "";
    graph.style.marginRight = "";
  }
}

function zoomIn(n) {
  var currentScale = checkScale();
  var windowCenterX = window.innerWidth * .5;
  var windowCenterY = window.innerHeight * .5;
  var currentX = window.scrollX;
  var currentY = window.scrollY;

  // if a number is fed in, zoom to that level
  // otherwise increment
  if (n === parseInt(n, 10)) {
    var newScale = n
  } else if (currentScale < 1) {
    var newScale = currentScale + .2;
  } else {
    var newScale = currentScale + 1;
  };

  // scale the graph
  g.setAttribute("transform", "scale(" + newScale + ")");
  graph.setAttribute("width", w * newScale);
  graph.setAttribute("height", h * newScale);

  // calculate position to scroll to after scaling graph
  // in order to keep the same view centered
  var newX = ((((currentX + windowCenterX) / currentScale) * newScale) - windowCenterX);
  var newY = ((((currentY + windowCenterY) / currentScale) * newScale) - windowCenterY);
  window.scrollTo(newX, newY);
  checkMargin(newScale);
}

function zoomOut(n) {
  var currentScale = checkScale();
  var windowCenterX = window.innerWidth * .5;
  var windowCenterY = window.innerHeight * .5;
  var currentX = window.scrollX;
  var currentY = window.scrollY;

  // if a number is fed in, zoom to that level
  // otherwise increment
  if (n === parseInt(n, 10)) {
    var newScale = n
  } else if (currentScale <= 1) {
    var newScale = currentScale - .2;
  } else {
    var newScale = currentScale - 1;
  };

  // scale the graph
  g.setAttribute("transform", "scale(" + newScale + ")");
  graph.setAttribute("width", w * newScale);
  graph.setAttribute("height", h * newScale);

  // calculate position to scroll to after scaling graph
  // in order to keep the same view centered
  var newX = ((((currentX + windowCenterX) / currentScale) * newScale) - windowCenterX);
  var newY = ((((currentY + windowCenterY) / currentScale) * newScale) - windowCenterY);
  window.scrollTo(newX, newY);
  checkMargin(newScale);
}


var selector = new Selectr("#username", {
  defaultSelected: false,
  clearable: true,
  placeholder: "GitHub username ...",
});

selector.on('selectr.clear', function() {
  clearHighlights();
});

// based on user input, find a user or organization node,
// highlight it, scroll to it so it’s centered in the window
// and zoom to scale level 3.
function scrollToUser() {

  // get entered username
  var select = document.getElementById("username");
  var selection = select.options[select.selectedIndex];
  if ( selection ) {
    var userName = selection.text;
  }
  var node = document.getElementById(userName);

  // if the username is in the graph ...
  if (node) {

    // check for previously highlighted lines and nodes and unhighlight
    clearHighlights();

    // highlight user’s node and edges
    var nodeCircle = node.getElementsByTagName("circle")[0];
    addHighlights(nodeCircle);

    // set scale and scroll window to node position
    var scale = 3;
    var circleX = nodeCircle.getAttribute("cx");
    var circleY = nodeCircle.getAttribute("cy");
    var windowCenterX = window.innerWidth * .5;
    var windowCenterY = window.innerHeight * .5;
    zoomIn(scale);
    checkScale();
    window.scrollTo({
      top: ((circleY * scale) - windowCenterY),
      left: ((circleX * scale) - windowCenterX),
      behavior: "smooth"
    })

  }
}

// select input placeholder text and clear alert if any
function prepInput() {
  document.getElementById("username").select();
  document.getElementById("username-warning").innerHTML = ""
}
