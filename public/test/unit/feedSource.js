/**
 * Created by rcartier13 on 12/13/13.
 */

describe('Feed Source Unit Tests', function() {

  describe('Feed Source Controller Test', function () {
    var $rootScope = null;
    var $httpBackend = null;
    var response;

    beforeEach(inject(function($injector) {
      var mockService = {
        getFeedData: karmaUtil.setupServiceFunc($injector),
        getFeedSource: karmaUtil.setupServiceFunc($injector)
      }

      $httpBackend = $injector.get('$httpBackend');
      response = [ {date: '2011-11-01', state: 'Ohio', type: 'Federal', status: 'Undetermined'} ];
      $rootScope = $injector.get('$rootScope');
      karmaUtil.setupControllerTest($injector, response, $httpBackend, $rootScope, 'FeedSourceCtrl', mockService);
    }));

    afterEach(function() {
      $httpBackend.verifyNoOutstandingExpectation();
      $httpBackend.verifyNoOutstandingRequest();
    })

    it('should throw an error', function () {
      $httpBackend.flush();
      expect($rootScope.feedData).toEqual(response);
      expect($rootScope.feedSource).toEqual(response);
    });
  });
});