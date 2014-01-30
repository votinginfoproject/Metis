/**
 * Created by rcartier13 on 1/23/14.
 */


describe('Feed Candidates Unit Tests', function() {

  describe('Feed Candidates Controller Test', function() {
    var $rootScope = null;
    var $httpBackend = null;
    var feedData;

    beforeEach(inject(function($injector) {
      var mockService = {
        getFeedData: karmaUtil.setupServiceFunc($injector),
        getFeedContestCandidate: karmaUtil.setupServiceFunc($injector)
      }

      $httpBackend = $injector.get('$httpBackend');
      feedData = [ {date: '2011-11-01', state: 'Ohio', type: 'Federal', status: 'Undetermined'} ];
      $rootScope = $injector.get('$rootScope');
      karmaUtil.setupControllerTest($injector, feedData, $httpBackend, $rootScope, 'FeedCandidatesCtrl', mockService);
    }));

    afterEach(function() {
      $httpBackend.verifyNoOutstandingExpectation();
      $httpBackend.verifyNoOutstandingRequest();
    });

    it('should have valid data', function() {
      $httpBackend.flush();
      expect($rootScope.feedData).toEqual(feedData);
      expect($rootScope.feedCandidates).toEqual(feedData);
    });
  });
});