function escapeId(id) {
  // replace all characters except numbers and letters
  // As soon as someone opens a bug that they have a problem with a name conflict
  // rethink the strategy
  return id.replace(/[^a-zA-Z0-9]/g,'-');
}

function getJobDiv(jobName) {
  return jQuery('#' + escapeId(jobName));
}

function hideChildren(nodeName, data) {
  jQuery.each(data["edges"], function(i, edge) {
    if(edge.from == nodeName) {
      jQuery("#" + escapeId(edge.to)).hide();
      hideChildren(edge.to, data); // hide the children recursively
    }
  });

  jQuery("#" + escapeId(nodeName) + " .fa-plus-circle").css("visibility", "visible");
  $("#" + escapeId(nodeName) + " .fa-minus-circle").css("visibility", "hidden");
};

function showChildren(nodeName, data) {
  jQuery.each(data["edges"], function(i, edge) {
    if(edge.from == nodeName) {
      jQuery("#" + escapeId(edge.to)).show();
      showChildren(edge.to, data); // show the children recursively
    }
  });

  jQuery("#" + escapeId(nodeName) + " .fa-minus-circle").css("visibility", "visible");
  $("#" + escapeId(nodeName) + " .fa-plus-circle").css("visibility", "hidden");
}

function initWindow() {
  window.depview = {
    paper: jQuery("#paper"),
    colordep: '#FF0000', // red
    colorcopy: '#32CD32', // green
    init : function() {
      jsPlumb.importDefaults({
        Connector : ["StateMachine", { curviness: 10 }],// Straight, Flowchart, Straight, Bezier
        // default drag options
        DragOptions : {
          cursor : 'pointer',
          zIndex : 2000
        },
        // default to blue at one end and green at the other
        EndpointStyles : [ {
          fillStyle : '#225588'
        }, {
          fillStyle : '#558822'
        } ],
        // blue endpoints 7px; green endpoints 7px.
        Endpoints : [ [ "Blank", {
          radius : 0
        } ], [ "Blank", {
          radius : 0
        } ] ],

        // def for new connector (drag n' drop)
        // - line 2px
        PaintStyle : {
          lineWidth : 2,
          strokeStyle : window.depview.colordep,
          joinstyle:"round"},

        // the overlays to decorate each connection with. note that the
        // label overlay uses a function to generate the label text; in
        // this case it returns the 'labelText' member that we set on each
        // connection in the 'init' method below.
        ConnectionOverlays : [ [ "Arrow", {
          location : 1.0,
          foldback:0.5
        } ]
                             ]

      });
      var nodeList = [];
      jQuery.fn.center = function () {
        //Calculate the clicked node distance from the chosen center point
        var paperLeft = $('#paper').position().left;
        var paperTop = $('#paper').position().top;
        var centerLeft = ($('#paper').width()*.001)+paperLeft
        var centerTop =($('#paper').height()*.001)+paperTop
        var xDiff = centerLeft- $(this).position().left;
        var yDiff = centerTop-$(this).position().top;
        //loop through and change all nodes position relative to centerpoint
        var arrayLength = nodeList.length;
        for (var i = 0; i < arrayLength; i++) {
          $("#"+nodeList[i]).css("position","absolute");
          positionCurr = $("#"+nodeList[i]).position();
          leftCurr  = positionCurr.left;
          topCurr = positionCurr.top;
          newLeft = leftCurr + xDiff;
          newTop = topCurr + yDiff;
          $("#"+nodeList[i]).css("left", newLeft+"px");
          $("#"+nodeList[i]).css("top", newTop+"px");
        }

      }
      jQuery.getJSON('graph.json', function(data) {
        var top = 3;
        var space = 150;
        var xOverall = 0;

        var clusters = data["clusters"];
        // iterate clusters
        jQuery.each(clusters, function(i, cluster) {
          jQuery.each(cluster.nodes, function(i,node) {
            nodeList.push(escapeId(node.name));
            var nodeString = '<div>'
            var displayInfo = "test";
            if (window.depview.editEnabled) {
              nodeString = nodeString + '<div class="ep"/>';
            }
            nodeString = nodeString + '<a href="' + node.url + '">' + node.name + '</a></div>';
            var minusIcon = "<a class=\"fa fa-lg fa-minus-circle\" " +
                  "style=\"" +
                  "position: absolute; " +
                  "bottom: 0px; " +
                  "left: 40%;" +
                  "cursor: pointer\"" +
                  "></a>";
            var plusIcon = "<a class=\"fa fa-lg fa-plus-circle\" " +
                  "style=\"" +
                  "visibility: hidden;" +
                  "position: absolute; " +
                  "bottom: 0px; " +
                  "left: 40%;" +
                  "cursor: pointer\"" +
                  "></a>";


            jQuery(nodeString).
              addClass('window').
              attr('id', escapeId(node.name)).
              attr('data-jobname', node.fullName).
              css('top', node.y + top).
              css('left', node.x + xOverall).
              css('background', node.color).
              powerTip({followMouse: true}).
              data('powertip', node.metadata).
              append(minusIcon).
              append(plusIcon).
              appendTo(window.depview.paper);

            jQuery("#" + escapeId(node.name) + " .fa-minus-circle").click(function(event) {
              hideChildren(escapeId(node.name), data);
            });

            jQuery("#" + escapeId(node.name) + " .fa-plus-circle").click(function(event) {
              showChildren(escapeId(node.name), data);
            });

            jQuery.contextMenu({
              selector: "#"+escapeId(node.name),
              position: function(opt, x, y){
                opt.$menu.css({position: "absolute", top: y, left: x});
              },
              items:{
                buildopt: {name: "Build", callback: function buildfun(){
                  var url = node.url+"build?delay=0sec";
                  var method = "POST";
                  var async = true;
                  var request = new XMLHttpRequest();
                  request.onload = function(){
                    console.log("Building");
                  }
                  request.open(method, url, async);
                  request.send();
                  return "built";
                }},
                zoom: {name: "Zoom Out", callback: function() {$("#paper").animate({ 'zoom': 1 }, 'slow');}},
                jim: {name: "Center View", callback: function(){$("#"+escapeId(node.name)).center();}}
              }
            });
          })
          top = top + cluster.vSize + space
          // xOverall = xOverall + cluster.hSize + space
        });

        // definitions for drag/drop connections
        jQuery(".ep").each(function(idx, current) {
          var p = jQuery(current).parent()
          if(window.depview.editEnabled) {
	          jsPlumb.makeSource(current, {
	            anchor : "Continuous",
	            parent: p
	          });
          }
        })

        jsPlumb.makeTarget(jsPlumb.getSelector('.window'), {
          anchor : "Continuous"
        });

        var edges = data["edges"];
        jQuery.each(edges, function(i, edge) {
          from = getJobDiv(edge["from"]);
          to = getJobDiv(edge["to"]);
          // creates/defines the look and feel of the loaded connections: red="dep", green="copy"
          var connection;
          var connOptions = {
            source : from,
            target : to,
            scope: edge["type"],
            paintStyle:{lineWidth : 2}
          }
          if("copy" == edge["type"]){
            connOptions.paintStyle.strokeStyle = window.depview.colorcopy;
            connOptions.overlays = [[ "Label", { label: "copy", id: from+'.'+to } ]];
            connection = jsPlumb.connect(connOptions);
          } else {
            connOptions.paintStyle.strokeStyle = window.depview.colordep;
            connection = jsPlumb.connect(connOptions);
            // only allow deletion of "dep" connections
            if(window.depview.editEnabled) {
	            connection.bind("click", function(conn) {
	              var sourceJobName = conn.source.attr('data-jobname');
	              var targetJobName = conn.target.attr('data-jobname')
	              if(confirm('delete connection: '+ sourceJobName +" -> "+ targetJobName +'?')){
	                jQuery.ajax({
	                  url : encodeURI('edge/' + sourceJobName + '/'    + targetJobName),
	                  type : 'DELETE',
	                  success : function(response) {
	                    jsPlumb.detach(conn);
	                  },
	                  error: function (request, status, error) {
	                    alert(status+": "+error);
	                  }
	                });
	              }
	            });
            }
          }
        });

        if(window.depview.editEnabled) {
	        jsPlumb.bind("jsPlumbConnection", function(info) {
	          jQuery.ajax({
	            url: encodeURI('edge/'+info.source.attr('data-jobname') +'/'+info.target.attr('data-jobname')),
	            type: 'PUT',
	            success: function( response ) {
                //                                 alert('Load was performed.');
	            },
	            error: function (request, status, error) {
	              alert(request.responseText);
	            }
	          });
	          // allow deletion of newly created connection
	          info.connection.bind("click", function(conn) {
	            var sourceJobName = conn.source.attr('data-jobname');
	            var targetJobName = conn.target.attr('data-jobname');
	            if(confirm('delete connection: '+ sourceJobName +" -> "+ targetJobName +'?')){
	              jQuery.ajax({
	                url : encodeURI('edge/' + sourceJobName + '/'    + targetJobName),
	                type : 'DELETE',
	                success : function(response) {
	                  jsPlumb.detach(conn);
	                },
	                error: function (request, status, error) {
	                  alert(request.responseText);
	                }
	              });
	            }
	          });
	        });
        }

        // make all the window divs draggable
        jsPlumb.draggable(jsPlumb.getSelector(".window"));
      });
    }
  };
};

initWindow();

// start jsPlumb
jsPlumb.bind("ready", function() {
  // chrome fix.
  document.onselectstart = function () { return false; };

  jsPlumb.setRenderMode(jsPlumb.SVG);
  depview.init();
});
