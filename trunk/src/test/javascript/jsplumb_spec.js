describe("graph view", function() {
  var success;
  var testElement;
  var testElement2;

  // test2 -> test -> test3
  var basicGraph = {
    "status": 200,
    "edges":[
      {
        "to": "test",
        "from": "test2",
        "type": "dep"
      },
      {
        "to": "test3",
        "from": "test",
        "type": "dep"
      },
    ],
    "clusters":[
      {
        "vSize": 100,
        "nodes": [
          {"name": "test3",
           "fullName": "test3",
           "url": "http://localhost:8080/jenkins/job/test3/",
           "metadata": "Some stuff",
           "color": "Red",
           "x": 0,
           "y": 0},
          {"name": "test2",
           "fullName": "test2",
           "url": "http://localhost:8080/jenkins/job/test2/",
           "metadata": "Some stuff",
           "color": "blue",
           "x": 0,
           "y": 0},
          {"name": "test",
           "fullName": "test",
           "url": "http://localhost:8080/jenkins/job/test/",
           "metadata": "Some stuff",
           "color": "blue",
           "x": 0,
           "y": 100}
        ],
        "hSize": 0
      },
      {
        "vSize": 90,
        "nodes": [],
        "hSize": 700
      }
    ]
  };
  beforeEach(function() {
    spyOn(jQuery, "getJSON").and.callFake(function(loc, succ) {
      if (loc === "graph.json") {
        succ(basicGraph);
      }
    });
  });

  it ("test returns a mocked out graph for getJSON of graph.json" , function(){
    success = jasmine.createSpy('success');
    
    jQuery.getJSON('graph.json', function(data) {
      success(data);
    });

    expect(success).toHaveBeenCalledWith(basicGraph);
  });

  describe ("correctly creates tests divs",function() {
    beforeEach(function() {
      spyOn(jsPlumb, "importDefaults").and.callFake(function(params) {
        // do nothing, we're not testing jsPlumb right now
      });
      spyOn(jsPlumb, "makeSource").and.callFake(function(one, two) {
        // do nothing, we're not testing jsPlumb right now
      });
      spyOn(jsPlumb, "makeTarget").and.callFake(function(one, two) {
        // do nothing, we're not testing jsPlumb right now
      });
      spyOn(jsPlumb, "connect").and.callFake(function(one) {
        // do nothing, we're not testing jsPlumb right now
      });
      spyOn(jsPlumb, "detach").and.callFake(function(one) {
        // do nothing, we're not testing jsPlumb right now
      });
      spyOn(jsPlumb, "bind").and.callFake(function(one, two) {
        // do nothing, we're not testing jsPlumb right now
      });
      spyOn(jsPlumb, "draggable").and.callFake(function(one) {
        // do nothing, we're not testing jsPlumb right now
      });
      spyOn(jsPlumb, "setRenderMode").and.callFake(function(one) {
        // do nothing, we're not testing jsPlumb right now
      });

      // We need to have a paper to work with for the tests
      jQuery(document.body).prepend("<div id='paper'></div>");

      // Init the window, which gets depview on it
      initWindow();

      // init depview
      window.depview.init();

      testElement = window.depview.paper.children("#test");
      testElement2 = window.depview.paper.children("#test2");
      testElement3 = window.depview.paper.children("#test3");
    });
    
    it ("adds the test nodes via jquery", function() {
      expect(testElement.size()).toExist();
    });
  });

  describe ("context menu", function() {
    beforeEach(function() {
      jQuery(document.getElementById("test")).contextMenu();
      
    });

    it("displays a context menu on right click", function(){
      expect($(".context-menu-root")).toBeVisible();
    });

    it("builds on clicking build", function(){
      expect($(".context-menu-root")).toBeVisible();
      spyOn(XMLHttpRequest.prototype, 'send');
      $('.context-menu-item').eq(3).trigger('mouseup');
      expect(XMLHttpRequest.prototype.send).toHaveBeenCalled();
    });

    it("moves the node clicked to the picked center", function(){
    	//debugger;
      var clickedNodeName = basicGraph['clusters'][0]['nodes'][0]['name']
      var paperLeft = $('#paper').position().left;
      var centerLeft = ($('#paper').width()*.001)+paperLeft;
      $("#"+clickedNodeName).center();
      //debugger;
      $("#"+clickedNodeName).center();
      expect(parseFloat(($("#"+clickedNodeName)).position().left).toFixed(0)).
      	toEqual(parseFloat(($('#paper').width()*.001)+paperLeft).toFixed(0));
    });

    it("Sets zoom to 1 on zoom out menu click", function(){
      $("#paper").animate({ 'zoom': 1 }, 'slow');
      //debugger;
      expect($("#paper").css('zoom')).toEqual('1');
    });

  });

  describe ("tooltip on node hover", function() {
    it ("displays the powertip on hover with the correct data", function() {
      // There is currently no good way to test what happens when you 'hover'
      //   mouseover does not seem to work for this
      expect(testElement.data().powertip).toEqual("Some stuff");
    });
  });

  it("displays the color of the node", function() {
    expect(testElement.attr("style")).toContain("blue");
  });

  describe ("collapse expand nodes", function() {
    it("displays the font awesome minus by default nodes", function() {
      expect(testElement.children(".fa-minus-circle")).toExist();
    });

    it("hides all children when the minus is clicked", function() {
      testElement2.children(".fa-minus-circle").trigger( "click" );
      expect(testElement).not.toBeVisible();

      expect(testElement2.children(".fa-plus-circle").css("visibility")).toEqual("visible");
      expect(testElement2.children(".fa-minus-circle").css("visibility")).toEqual("hidden");

      expect(testElement3.children(".fa-plus-circle").css("visibility")).toEqual("visible");
      expect(testElement3.children(".fa-minus-circle").css("visibility")).toEqual("hidden");
    });

    it("unhides all children when the plus is clicked", function() {
      testElement2.children(".fa-plus-circle").trigger( "click" );
      expect(testElement).toBeVisible();

      expect(testElement2.children(".fa-plus-circle").css("visibility")).toEqual("hidden");
      expect(testElement2.children(".fa-minus-circle").css("visibility")).toEqual("visible");

      expect(testElement3.children(".fa-plus-circle").css("visibility")).toEqual("hidden");
      expect(testElement3.children(".fa-minus-circle").css("visibility")).toEqual("visible");
    });
  });
});

describe('Escape id function', function(){
  it('replaces all characters except numbers and letters',function() {
     expect(escapeId('123456')).toEqual('123456');
   });
});
