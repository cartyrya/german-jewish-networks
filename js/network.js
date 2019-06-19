var tooltip = d3.select("body").append("div")
    .attr("class", "tooltip")
    .style("position", "absolute")
    .style("background", "white")
    .style("max-width", "200px")
    .style("height", "auto")
    .style("padding", "1px")
    .style("border-style", "solid")
    .style("border-radius", "4px")
    .style("border-width", "1px")
    .style("pointer-events", "none")
    .style("opacity", 0);

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

  simulation.force("link")
    .links(graph.links);

  let link = g.selectAll("line")
    .data(graph.links)
    .enter().append("line");

  link
    .attr("class", "link")
    .style("stroke", "black")
    .style("stroke-width", "1px")
    .style("pointer-events", "all")
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
    .attr("fill", "black")
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
    link
        .attr("x1", d => d.source.x)
        .attr("y1", d => d.source.y)
        .attr("x2", d => d.target.x)
        .attr("y2", d => d.target.y);

    node
        .attr("transform", d => `translate(${d.x},${d.y})`);
  }

});
