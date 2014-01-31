/**
 * Created by rcartier13 on 1/31/14.
 */

describe('Feed Early Vote Sites Unit Tests', function() {

  describe('Feed Early Vote Sites Controller Test', function() {
    var $rootScope = null;
    var $httpBackend = null;
    var feedData;

    beforeEach(inject(function($injector) {
      var mockService = {
        getFeedData: karmaUtil.setupServiceFunc($injector),
        getFeedEarlyVoteSites: karmaUtil.setupServiceFunc($injector)
      }
      $httpBackend = $injector.get('$httpBackend');
      $rootScope = $injector.get('$rootScope');
      feedData = {something: 'something'};
      karmaUtil.setupControllerTest($injector, feedData, $httpBackend, $rootScope, 'FeedEarlyVoteSitesCtrl', mockService);
    }));

    afterEach(function() {
      $httpBackend.verifyNoOutstandingExpectation();
      $httpBackend.verifyNoOutstandingRequest();
    });

    xit('should have valid data', function() {
      $httpBackend.flush();
      expect($rootScope.feedData).toEqual(feedData);
      expect($rootScope.feedEarlyVoteSites).toEqual(feedData);
    });
  });
});