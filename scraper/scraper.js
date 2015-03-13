var phantom = require('phantom');
var path = require('path');
var fs = require('fs');

console.log("Args:" + process.argv);

var crosswordUrl = process.argv[2];
var dumpFolder = path.join(__dirname, process.argv[3]);

//  Windows specific:

    //  The node process isn't finding phantom!
    var dir = path.join(__dirname, '../node_modules/.bin');
    process.env.PATH += ";" + dir;

    //  Define options. weak should be false for windows., 
    var options = {
      dnodeOpts: {weak: false}
    };

//  End windows specific.

phantom.create(function(ph) {
  return ph.createPage(function(page) {
    return page.open(crosswordUrl, function(status) {
      console.log("Loaded Page: ", status);
      return page.evaluate((function() {

        //  Returns f(node) where node is found by xpath or 'or' of no node is found.  
        function mapNode(xpath, f, or) {
          var node = document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
          return node ? f(node) : or;
        }

        //  Returns a list of f(node) for each node found by xpath.
        function mapNodes(xpath, f) {
          console.log("Evaluating: " + xpath);
          var iterator = document.evaluate(xpath, document, null, XPathResult.ORDERED_NODE_ITERATOR_TYPE, null);
          var node = iterator.iterateNext();
          var results = [];
          while(node) {
            results.push(f(node));
            node = iterator.iterateNext();
          }
          return results;
        }

        var crossword = {};
        
        crossword.title = mapNode("//div[@id = 'main-article-info']/h1", function(node) { return node.innerText; });

        var setterDetails = mapNode("//li[@class = 'byline']/a", function(node) { 
          return {
            name: node.innerText,
            link: node.href
          };
        });
        crossword.setter = setterDetails.name;
        crossword.setterUrl = setterDetails.link;

        var crosswordPixelDimensions = mapNode("//form[@id='crossword']//div[@id='grid']", function(n) {
          return {
            width: n.offsetWidth,
            height: n.offsetHeight
          };
        });

        var cellPixelDimensions = mapNode("(//div[@id='grid']//li)[1]", function(n) {
          return {width: n.offsetWidth, height: n.offsetHeight};
        });

        crossword.width = Math.floor(crosswordPixelDimensions.width / cellPixelDimensions.width);
        crossword.height = Math.floor(crosswordPixelDimensions.height / cellPixelDimensions.height);

        function clueDetails(node) {

          var clueId = node.getAttribute('for');
          var cluePosInGrid = mapNode("//div[@id='" + clueId + "']", function(n) {
            return {
              left: n.offsetLeft, 
              top: n.offsetTop,
              x: Math.floor(n.offsetLeft / cellPixelDimensions.width),
              y: Math.floor(n.offsetTop / cellPixelDimensions.height)
            };
          });

          var clueRaw = node.innerText;
          var re = /^(\d+) (.+) \(([\d\-\,]+)\)$/; 
          var match = re.exec(clueRaw);
          var clueNumberRaw = match[1];
          var clueText = match[2];
          var clueLengthRaw = match[3];
          var lengthParts = clueLengthRaw.split(/[\-\,]/);
          var lengths = [];
          for(var i=0;i<lengthParts.length;i++) {
            lengths.push(parseInt(lengthParts[i], 10));
          }
          var clueNumber = parseInt(clueNumberRaw);

          return {
            number: clueNumber,
            clue: clueText,
            length: lengths,
            x: cluePosInGrid.x + 1, //  crossword indexes are one based!
            y: cluePosInGrid.y + 1
          };
        }

        crossword.acrossClues = mapNodes("//label[contains(@id, 'across-clue')]", clueDetails);
        crossword.downClues = mapNodes("//label[contains(@id, 'down-clue')]", clueDetails);

        return crossword;

      }), function(result) {

        var title = result.title;
        var destination = path.join(dumpFolder, title + ".json");

        console.log("Preparing to write '" + title + "' to: " + destination);
        fs.writeFile(destination, JSON.stringify(result, null, 2), function(err) {
            if(err) {
                console.log(err);
            } else {
                console.log("The file was saved!");
            }

            return ph.exit();
        }); 

      });
    });
  });
}, options);