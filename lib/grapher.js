(function() {

  var url = 'graph-result.json'
  var graphWidth = $(window).width();
  var graphHeight = $(window).height();
  var r = 10;
  var graph, layout, zoom, nodes, links
  var linkedByIndex = {};


  // Helpers
  function formatClassName(prefix, object) {
    return prefix + '-' + object.id.replace(/\./gi, '-');
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
      this.setAttribute('stroke-opacity', thisOpacity);
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
      .charge(-200)
      .linkDistance(200)
      .size([graphWidth, graphHeight]);


    // Setup graph
    graph = d3.select(".graph")
      .append("svg:svg")
      .attr("width", graphWidth)
      .attr("height", graphHeight)
      .attr("pointer-events", "all")
      .append('svg:g')
      .call(zoom)
      .append('svg:g');

    graph.append('svg:rect')
      .attr('width', graphWidth)
      .attr('height', graphHeight)
      .attr('fill', 'rgba(1,1,1,0)')




    // Load graph data
    d3.json(url, onDataLoaded);

    // Controlers
    $('.control-zoom a').on('click', onControlZoomClicked);
  }


  function onDataLoaded(json) {

    // Lines
    links = graph.selectAll("line")
      .data(json.links)
      .enter().append("line")
      .attr("stroke-opacity", function(d) {
        return '0.6';
      })
      .attr("stroke-width","6")
      .style("stroke", function(d) { return d.color; });

      links.append("title").text(function(d) { return d.label });


    // Nodes
    var nodeDrag = d3.behavior.drag()
      .on("dragstart", onNodeDragStart)
      .on("drag", onNodeDragMove)
      .on("dragend", onNodeDragEnd);


    nodes = graph.selectAll("g.node")
      .data(json.nodes)
      .enter().append("svg:g")
      .attr("class","node")
      .call(nodeDrag);

      // Circles
      nodes.attr("class", function(d) { return formatClassName('node', d) })
      nodes.append("svg:circle")
        .attr("class", function(d) { return formatClassName('circle', d) })
        .attr("r", function(d) {
          if (d.size > 0) {
            return 10 + (d.size*2);
          } else {
            return 10;
          }
        })
        .style("fill", 'white')
        .style("stroke", function(d) { return d.color; })
        .style("stroke-width", "4")
        .on("mouseover", _.bind(onNodeMouseOver, this, nodes, links))
        .on("mouseout", _.bind(onNodeMouseOut, this, nodes, links) );

      // Label
      nodes.append("svg:text")
        .attr("class", function(d) { return formatClassName('text', d) })
        .attr("text-anchor", "middle")
        .attr("fill","white")
        .style("pointer-events", "none")
        .attr("font-size", function(d) { return "10px"; })
        .attr("font-weight", function(d) {
          if (d.color == '#b94431') {
            return "bold";
          } else {
            return "100";
          }
        })
        .attr("dy", function() { return -20; })
        .text( function(d) { return d.id; });

    // Build linked index
    json.links.forEach(function(d) {
      linkedByIndex[d.source.index + "," + d.target.index] = 1;
    });


    // Draw the
    layout.nodes(json.nodes);
    layout.links(json.links);
    layout.on("tick", onTick);
    layout.start();

  }

  function onNodeMouseOver(nodes, links, d) {

    // Highlight circle
    var elm = findElementByNode('circle', d);
    elm.style("fill", '#b94431');

    // Highlight related nodes
    fadeRelatedNodes(d, .1, nodes, links);
  }

  function onNodeMouseOut(nodes, links, d) {

    // Highlight circle
    var elm = findElementByNode('circle', d);
    elm.style("fill", 'white');

    // Highlight related nodes
    fadeRelatedNodes(d, 1, nodes, links);
  }

  function onTick() {
    nodes.attr("cx", function(d) { return d.x; });
    nodes.attr("cy", function(d) { return d.y; });
    nodes.attr("transform", function(d) {
      return "translate(" + d.x + "," + d.y + ")";
    });

    links.attr("x1", function(d) { return d.source.x; });
    links.attr("y1", function(d) { return d.source.y; });
    links.attr("x2", function(d) { return d.target.x; });
    links.attr("y2", function(d) { return d.target.y; });
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

  function onNodeDragStart() {
    layout.stop();  // stops the force auto positioning before you start dragging
  }

  function onNodeDragEnd(d, i) {
    d.fixed = true; // of course set the node to fixed so the force doesn't include the node in its auto positioning stuff
    onTick();
    layout.resume();
  }

  function onNodeDragMove(d, i) {
    d.px += d3.event.dx;
    d.py += d3.event.dy;
    d.x += d3.event.dx;
    d.y += d3.event.dy;
    onTick(); // this is the key to make it work together with updating both px,py,x,y on d !
  }


  render();

})();
