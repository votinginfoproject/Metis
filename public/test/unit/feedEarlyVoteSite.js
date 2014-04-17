/**
 * Created by rcartier13 on 1/31/14.
 */

describe('Feed Early Vote Site Unit Tests', function() {

  describe('Feed Early Vote Site Controller Test', function() {
    var $rootScope = null;
    var $httpBackend = null;
    var feedData;

    beforeEach(inject(function($injector) {
      var mockService = {
        getFeedData: karmaUtil.setupServiceFunc($injector),
        feedEarlyVoteSite: karmaUtil.setupServiceFunc($injector)
      }
      $httpBackend = $injector.get('$httpBackend');
      $rootScope = $injector.get('$rootScope');
      feedData = {something: 'something'};
      karmaUtil.setupControllerTest($injector, feedData, $httpBackend, $rootScope, 'FeedEarlyVoteSiteCtrl', mockService);
    }));

    afterEach(function() {
      $httpBackend.verifyNoOutstandingExpectation();
      $httpBackend.verifyNoOutstandingRequest();
    });

    xit('should have valid data', function() {
      $httpBackend.flush();
      expect($rootScope.feedData).toEqual(feedData);
      expect($rootScope.feedEarlyVoteSite).toEqual(feedData);
    });
  });
});