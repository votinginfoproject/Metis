/**
 * Created by nboseman on 12/26/13.
 */

var ruleDefinitions = {};

/*
 *  Rules are defined by the following elements:
 *  1) name - short name of the rule
 *  2) description -
 */

ruleDefinitions = {
  uniqueIDCheck : {
    name: "id must be unique",
    description: "All top-level metis elements must have a unique ID value",
    criticality: 1,
    order: 1,
    evaluation: function(topLevelElements, singleElement){
      isUnique = false;
      topLevelElements = []; //current: build from mongo query of all collections, returning only id, by feed id

      //Step 1: build hash of all topLevel elements
      topLevelElements.forEach(function(element){
        if(topLevelIDs[element.id] != null){
          isUnique = true;
        }
      });
      s
      return isUnique;
    }
  },
  validUrlCheck : {
    name: "Valid Url Check",
    description: "All metis url elements must be valid",
    criticality: 3,
    order: 1,
    evaluation:
      function(url){
        isValid = false;
        require('http').get(url, function(res) {
          if(res.statusCode == '200')
            isValid = true;
        })
          .on('error', function(e) {
            console.error("Handled error during url resolution: " + e.message);
          });
        //if there's a valid url, let's return true; otherwise return false
        return isValid;
      }
  },
  validUrlFormat : {
    name: "Valid Url Format",
    description: "All metis url elements cannot be malformed",
    criticality: 3,
    order: 1,
    evaluation:
      function(url){
        //TODO: refactor to switch statement for readability
        parsedUrl = require('url').parse(url);
        isValid = false;
        //Step 1: Does url conforms to a valid protocol (http or https only)?
        if(parsedUrl.protocol != null && parsedUrl.protocol === ('http:' || 'https:')){
          //Step 2: Verify basic URL structure
          if(parsedUrl.slashes != null || parsedUrl.slashes){
            //Step 3: Verify the domain (hostname is distinguishable)
            if (parsedUrl.hostname != null && parsedUrl.hostname != ""){
              isValid = true;  //all tests pass
            }else
              console.error("hostname check failed");
          }else
            console.error("slash check failed");
        }
        else
          console.error("protocol check failed");
        return isValid;
      }
  },
  validUrlSite : {
    name: "Valid Url Page",
    description: "All metis url elements must resolve to a valid internet address",
    criticality: 3,
    order: 1,
    evaluation:
      function(url){
        isValid = false;
        parsedUrl = require('url').parse(url);

        var options = {
          hostname: parsedUrl.hostname,
          port: parsedUrl.port,           //add null check
          path: parsedUrl.path,           //add null check
          method: parsedUrl.method
        };

        var req = http.request(options, function(res) {
          //do nothing with the response, but maybe handle the callback
          res.on('error', function(e){
            console.log('error in response', e);
          });
        });

        req.on('error', function(e) {
          console.log('error in response: ' + e.message);
        });

        isValid = req.end();
        return isValid;
      }
  }
};

exports.ruleDefinitions = ruleDefinitions;

