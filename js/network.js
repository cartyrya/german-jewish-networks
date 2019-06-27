var tooltip = d3.select("body").append("div")
    .attr("class", "tooltip")
    .style("position", "absolute")
    .style("background", "white")
    .style("max-width", "300px")
    .style("height", "auto")
    .style("padding", "1px")
    .style("border-style", "solid")
    .style("border-radius", "4px")
    .style("border-width", "1px")
    .style("pointer-events", "none")
    .style("opacity", 0);

var color = d3.scaleOrdinal(d3.schemeCategory20);

d3.json("./data/dummy.json", function(error, graph) {

  if (error) throw error;

  const svg = d3.select("svg"),
    width = +svg.attr("width"),
    height = +svg.attr("height");

  const simulation = d3.forceSimulation()
    .nodes(graph.nodes)
    .force("link", d3.forceLink().id(d => d.id))
    .force("charge", d3.forceManyBody())
    .force("center", d3.forceCenter(width / 2, height / 2))
    .on("tick", ticked);

  var g = svg.append("g")
    .attr("class", "everything");

  g.append("defs").selectAll("marker")
      .data(["end"])
    .enter().append("svg:marker")
      .attr("id", String)
      .attr("viewBox", "0 -5 10 10")
      .attr("refX", 12)
      .attr("refY", -0.5)
      .attr("markerWidth", 6)
      .attr("markerHeight", 6)
      .attr("orient", "auto")
    .append("svg:path")
      .attr("d", "M0,-5L10,0L0,5");

  simulation.force("link")
    .links(graph.links);

  let path = g.selectAll("path")
      .data(graph.links)
    .enter().append("path")
      .attr("class", "link")
      .attr("marker-end", "url(#end)")
      .style("fill", "none")
      .style("stroke", "black")
      .style("stroke-width", "1.5px")
      .style("pointer-events", "stroke")
      .on("mouseover.tooltip", function(d) {
        tooltip.transition()
          .duration(300)
          .style("opacity", .8);
        tooltip.html("From: " + d.source.id + "<br>To: " + d.target.id + "<br>No. of letters: " + d.value)
          .style("left", (d3.event.pageX) + "px")
          .style("top", (d3.event.pageY + 10) + "px");
      })
      .on("mouseout.tooltip", function() {
        tooltip.transition()
          .duration(100)
          .style("opacity", 0);
      })
      .on("mousemove", function() {
        tooltip.style("left", (d3.event.pageX) + "px")
          .style("top", (d3.event.pageY + 10) + "px");
      });

  let node = g.selectAll(".node")
    .data(graph.nodes)
    .enter().append("g")
    .attr("class", "node");

  node.append("circle")
    .attr("r", 4)
    .style("fill", function(d) { return color(d.group); })
    .style("stroke", "black")
    .style("stroke-width", "1px")
    .style("pointer-events", "all")
    .on("mouseover.tooltip", function(d) {
      tooltip.transition()
        .duration(300)
        .style("opacity", .8);
      tooltip.html("Name: " + d.id + "<br>Group: " + d.group)
        .style("left", (d3.event.pageX) + "px")
        .style("top", (d3.event.pageY + 10) + "px");
    })
    .on("mouseout.tooltip", function() {
      tooltip.transition()
        .duration(100)
        .style("opacity", 0);
    })
    .on("mousemove", function() {
      tooltip.style("left", (d3.event.pageX) + "px")
        .style("top", (d3.event.pageY + 10) + "px");
    });

  node.append("text")
    .attr("x", 0)
    .attr("dy", ".35em")
    .text(d => d.name);

  var zoom_handler = d3.zoom()
    .on("zoom", zoom_actions);

  zoom_handler(svg);

  function zoom_actions() {
    g.attr("transform", d3.event.transform)
  }

  function ticked() {
    path.attr("d", function(d) {
      var dx = d.target.x - d.source.x,
          dy = d.target.y - d.source.y,
          dr = Math.sqrt(dx * dx + dy * dy);
      return "M" +
          d.source.x + "," +
          d.source.y + "A" +
          dr + "," + dr + " 0 0,1 " +
          d.target.x + "," +
          d.target.y;
    });

    node
        .attr("transform", function(d) {
          return "translate(" + d.x + "," + d.y + ")"; });
  }

});
