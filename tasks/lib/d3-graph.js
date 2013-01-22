(function() {

  var url = 'data.json'
  var r = 10;
  var graph, layout, zoom, nodes, links, data;
  var linkedByIndex = {};
  var graphWidth, graphHeight;

  // Helpers
  function formatClassName(prefix, object) {
    return prefix + '-' + object.id.replace(/(\.|\/)/gi, '-');
  }

  function findElementByNode(prefix, node) {
    var selector = '.'+formatClassName(prefix, node);
    return graph.select(selector);
  }

  function isConnected(a, b) {
    return linkedByIndex[a.index + "," + b.index] || linkedByIndex[b.index + "," + a.index] || a.index == b.index;
  }

  function fadeRelatedNodes(d, opacity, nodes, links) {
    nodes.style("stroke-opacity", function(o) {

      if (isConnected(d, o)) {
        thisOpacity = 1;
      } else {
        thisOpacity = opacity;
      }

      this.setAttribute('fill-opacity', thisOpacity);

      return thisOpacity;
    });

    links.style("stroke-opacity", function(o) {

      if (o.source === d || o.target === d) {

        // Highlight target/sources of the link
        var selector = '.'+formatClassName('node', o.source) + ', .' + formatClassName('node', o.target);
        var nodes = graph.selectAll(selector);

        nodes.attr('fill-opacity', 1);
        nodes.attr('stroke-opacity', 1);

        return 1;
      } else {


        return opacity;
      }

    });
  }


  function render() {

    zoom = d3.behavior.zoom();
    zoom.on("zoom", onZoomChanged);


    // Setup layout
    layout = d3.layout.force()
      .gravity(.05)
      .charge(-300)
      .linkDistance(200);


    // Setup graph
    graph = d3.select(".graph")
      .append("svg:svg")
      .attr("pointer-events", "all")
      .call(zoom)
      .append('svg:g');

    graph.append('svg:rect')
      .attr('width', graphWidth)
      .attr('height', graphHeight)
      .attr('fill', 'rgba(1,1,1,0)')

    d3.select(window).on("resize", resize);

    // Load graph data
    var graphData = window.getGraphData();
    renderGraph(graphData);

    // Resize
    resize();

    // Controlers
    $('.control-zoom a').on('click', onControlZoomClicked);
  }

  function resize() {
    graphWidth = window.innerWidth,
    graphHeight = window.innerHeight;
    graph.attr("width", graphWidth)
         .attr("height", graphHeight);

    layout.size([graphWidth, graphHeight])
          .resume();
  }


  function renderGraph(data) {

    // Lines
    links = graph.selectAll("line")
      .data(data.links)
      .enter().append("line")
      .attr("stroke-width","1.5")
      .style("stroke", '#ccc');

      links.append("title").text(function(d) { return d.label });

    // Nodes
    nodes = graph.selectAll("g.node")
      .data(data.nodes)
      .enter().append("svg:g")
      .attr("class","node")
      .call(layout.drag)
      .on("mousedown", onNodeMouseDown);

      // Circles
      nodes.attr("class", function(d) { return formatClassName('node', d) })
      nodes.append("svg:circle")
        .attr("class", function(d) { return formatClassName('circle', d) })
        .attr("r", 10)
        .on("mouseover", _.bind(onNodeMouseOver, this, nodes, links))
        .on("mouseout", _.bind(onNodeMouseOut, this, nodes, links) );

      // Label
      nodes.append("svg:text")
        .attr("class", function(d) { return formatClassName('text', d) })
        .attr("text-anchor", "middle")
        .attr("fill","#000")
        .style("pointer-events", "none")
        .attr("font-size", '10px')
        .attr("dy", function() { return -20; })
        .text( function(d) { return d.id; });

    // Build linked index
    data.links.forEach(function(d) {
      linkedByIndex[d.source.index + "," + d.target.index] = 1;
    });


    // Draw the
    layout.nodes(data.nodes);
    layout.links(data.links);
    layout.on("tick", onTick);
    layout.start();



    var centerTranslate = [
      (graphWidth / 2) - (graphWidth * 0.2 / 2),
      (graphHeight / 2) - (graphHeight * 0.2 / 2),
    ];

    zoom
      .translate(centerTranslate)
      .scale(0.2);

    // Render transition
    graph.transition()
      .duration(500)
      .attr("transform", "translate(" + zoom.translate() + ")" + " scale(" + zoom.scale() + ")");

  }

  function onNodeMouseOver(nodes, links, d) {

    // Highlight circle
    var elm = findElementByNode('circle', d);
    elm.style("fill", '#b94431');

    // Highlight related nodes
    fadeRelatedNodes(d, .05, nodes, links);
  }

  function onNodeMouseOut(nodes, links, d) {

    // Highlight circle
    var elm = findElementByNode('circle', d);
    elm.style("fill", '#ccc');

    // Highlight related nodes
    fadeRelatedNodes(d, 1, nodes, links);
  }

  function onTick(e) {

    // // Push sources up and targets down to form a weak tree.
    // var k = 6 * e.alpha;
    // data.links.forEach(function(d, i) {
    //   d.source.y -= k;
    //   d.target.y -= k;
    // });

    nodes.attr("cx", function(d) { return d.x; })
         .attr("cy", function(d) { return d.y; })
         .attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });

    links.attr("x1", function(d) { return d.source.x; })
         .attr("y1", function(d) { return d.source.y; })
         .attr("x2", function(d) { return d.target.x; })
         .attr("y2", function(d) { return d.target.y; });
  }

  function onControlZoomClicked(e) {
    var elmTarget = $(this)

    var scaleProcentile = 0.20;

    // Scale
    var currentScale = zoom.scale();
    var newScale;
    if(elmTarget.hasClass('control-zoom-in')) {
      newScale = currentScale * (1 + scaleProcentile);
    } else {
      newScale = currentScale * (1 - scaleProcentile);
    }
    newScale = Math.max(newScale, 0);

    // Translate
    var centerTranslate = [
      (graphWidth / 2) - (graphWidth * newScale / 2),
      (graphHeight / 2) - (graphHeight * newScale / 2)
    ];

    // Store values
    zoom
      .translate(centerTranslate)
      .scale(newScale);

    // Render transition
    graph.transition()
      .duration(500)
      .attr("transform", "translate(" + zoom.translate() + ")" + " scale(" + zoom.scale() + ")");

  }

  function onZoomChanged() {
    graph.attr("transform", "translate(" + d3.event.translate + ")" + " scale(" + d3.event.scale + ")");
  }

  function onNodeMouseDown(d) {
     d.fixed = true;
     d3.select(this).classed("sticky", true);
   }

  render();

})();
