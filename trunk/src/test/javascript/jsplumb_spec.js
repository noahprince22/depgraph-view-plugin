describe("graph view", function() {
  var success;
  var testElement;
  var basicGraph = {
    "status": 200,
    "edges":[
      {
        "to": "test",
        "from": "test2",
        "type": "dep"
      }
    ],
    "clusters":[
      {
        "vSize": 100,
        "nodes": [
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

  afterEach(function() {
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
      jQuery(document.body).prepend("<div id='paper'></div>")

      // Init the window, which gets depview on it
      initWindow();

      // init depview
      window.depview.init();

      testElement = window.depview.paper.children("#test");
    });

    it ("adds the test nodes via jquery", function() {
      expect(testElement.size()).toExist();
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
    expect(testElement).toHaveCss({background: "blue"});
  });
});

describe('Escape id function', function(){
  it('replaces all characters except numbers and letters',function() {
     expect(escapeId('123456')).toEqual('123456');
   });
});
