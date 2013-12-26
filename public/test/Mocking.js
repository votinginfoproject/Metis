/**
 * Created by rcartier13 on 12/23/13.
 */

var globalVars = {
  isTesting: false,
};

function InterceptorSetup($httpBackend, $appProperties) {

  if(!globalVars.isTesting)
    return;

  globalVars.httpBackend = $httpBackend;
  globalVars.appProperties= $appProperties;

  // Intercepts AJAX calls and either lets the pass through or responds with different known data.
  $httpBackend.whenGET($appProperties.mockServicesPath + "/adminMockService.html").passThrough();
  $httpBackend.whenGET($appProperties.servicesPath + "/getUser").passThrough();
  $httpBackend.whenGET($appProperties.mockServicesPath + "/referenceDataMockService.html").passThrough();
  $httpBackend.whenGET($appProperties.mockServicesPath + "/homeMockService.html").passThrough();
  $httpBackend.whenGET($appProperties.mockServicesPath + "/profileMockService.html").passThrough();
  $httpBackend.whenGET($appProperties.servicesPath + "/feeds").passThrough();
  $httpBackend.whenGET(/.*\/feeds\/.*/).passThrough();
  $httpBackend.whenGET(/partials\/.*/).passThrough();
};
