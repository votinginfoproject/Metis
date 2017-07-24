'use strict';

vipApp.factory('$authService', function ($location, $timeout, $http, angularAuth0) {
  
  function login() {
    angularAuth0.authorize();
  }

  function handleAuthentication() {
    console.log("handling Authentication");
    console.log(isAuthenticated());
    angularAuth0.parseHash(function(err, authResult) {
      if (authResult && authResult.accessToken && authResult.idToken) {
        console.log("handleAuthentication: success");
        setSession(authResult);
        $location.url('/feeds');
      } else if (err) {
        $timeout(function() {
          $location.url('/');
        });
        console.log(err);
      }
    });
  }

  function setSession(authResult) {
    // Set the time that the access token will expire at
    console.log("setSession called with " + authResult);
    let expiresAt = JSON.stringify((authResult.expiresIn * 1000) + new Date().getTime());
    localStorage.setItem('auth0_access_token', authResult.accessToken);
    localStorage.setItem('auth0_id_token', authResult.idToken);
    localStorage.setItem('auth0_expires_at', expiresAt);
    $http.defaults.headers.common['Authorization'] = 'Bearer ' + authResult.idToken;
  }

  function logout() {
    // Remove tokens and expiry time from localStorage
    localStorage.removeItem('auth0_access_token');
    localStorage.removeItem('auth0_id_token');
    localStorage.removeItem('auth0_expires_at');
    $http.defaults.headers.common['Authorization'] = null;
  }

  function isAuthenticated() {
    // Check whether the current time is past the 
    // access token's expiry time
    let expiresAt = JSON.parse(localStorage.getItem('auth0_expires_at'));
    let authenticated = new Date().getTime() < expiresAt;
    console.log("isAuthenticated: " + authenticated);
    return authenticated;
  }
  
  function getAccessToken() {
    return localStorage.getItem('auth0_access_token');
  }

  function getIdToken() {
    return localStorage.getItem('auth0_id_token');
  }

  return {
    login: login,
    handleAuthentication: handleAuthentication,
    setSession: setSession,
    logout: logout,
    isAuthenticated: isAuthenticated,
    getAccessToken: getAccessToken,
    getIdToken: getIdToken
  }
});
