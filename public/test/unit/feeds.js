/**
 * Created by rcartier13 on 12/11/13.
 */

describe('Feed Unit Tests', function() {

  describe('Feed Controller Test', function() {
    var $rootScope = null;
    var $httpBackend = null;
    var myResponse;

    beforeEach(inject(function($injector) {
      var mockService = {
        getFeeds: karmaUtil.setupServiceFunc($injector)
      }

      $httpBackend = $injector.get('$httpBackend');
      $rootScope = $injector.get('$rootScope');
      myResponse = [ {date: '2011-11-01', state: 'Ohio', type: 'Federal', status: 'Undetermined'} ];
      karmaUtil.setupControllerTest($injector, myResponse, $httpBackend, $rootScope, 'FeedsCtrl', mockService);
    }));

    afterEach(function() {
      $httpBackend.verifyNoOutstandingExpectation();
      $httpBackend.verifyNoOutstandingRequest();
    })

    xit('should set the feeds properly', function() {
      $httpBackend.flush();
      expect($rootScope.feeds).toEqual(myResponse);
    });
  });

//  describe('Feeds Service Test', function() {
//    var feedsService, httpBackend;
//    beforeEach(angular.mock.module('vipApp'));
//
//    beforeEach(inject(function($feedsService, $httpBackend) {
//      feedsService = $feedsService;
//      httpBackend = $httpBackend;
//    }));
//  });
});