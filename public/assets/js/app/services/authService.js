'use strict';

vipApp.factory('$authService', function ($location, $timeout, $http, $appService, $appProperties, angularAuth0) {

  function login() {
    angularAuth0.authorize();
  }

  function handleAuthentication() {
    console.log("handling Authentication");
    console.log(isAuthenticated());
    if (isAuthenticated()) {
      setupAuthentication();
    } else {
      angularAuth0.parseHash(function(err, authResult) {
        if (authResult && authResult.accessToken && authResult.idToken) {
          console.log("handleAuthentication: success");
          setSession(authResult);
          setupAuthentication();
          $location.url('/feeds');
        } else if (err) {
          $timeout(function() {
            $location.url('/');
          });
          console.log(err);
        }
      });
    }
  }

  function setupAuthentication() {
    $http.defaults.headers.common['Authorization'] = 'Bearer ' + getIdToken();
    getUser($appService.setUserSuccess, $appService.setUserFailure);
  }

  function setSession(authResult) {
    // Set the time that the access token will expire at
    let expiresAt = JSON.stringify((authResult.expiresIn * 1000) + new Date().getTime());
    localStorage.setItem('auth0_access_token', authResult.accessToken);
    localStorage.setItem('auth0_id_token', authResult.idToken);
    localStorage.setItem('auth0_expires_at', expiresAt);

  }

  function logout() {
    // Remove tokens and expiry time from localStorage
    localStorage.removeItem('auth0_access_token');
    localStorage.removeItem('auth0_id_token');
    localStorage.removeItem('auth0_expires_at');
    localStorage.removeItem('auth0_user');
    $http.defaults.headers.common['Authorization'] = null;
    $appService.clearUser();
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

  function getUser(successCallback, failureCallback) {
    var storedUser = localStorage.getItem('auth0_user');
    if (storedUser) {
      successCallback(JSON.parse(storedUser));
    } else {
      $http.post($appProperties.servicesPath + "/getUser",
                {accessToken: getAccessToken()})
                .success(function(data) {
                  var user = createUser(data);
                  localStorage.setItem('auth0_user', JSON.stringify(user));
                  successCallback(user);
                })
                .error(failureCallback);
      }
  }

  function createUser(data) {
    return {
            isAuthenticated: true,
            givenName: userToGivenName(data),
            userName: data["name"],
            email: data["email"],
            fipsCodes: userToFips(data)
    }
  };

  function userToFips(data) {
    if (data && data.app_metadata && data.app_metadata.fipsCodes) {
      return Object.keys(data.app_metadata.fipsCodes);
    } else {
      return [];
    }
  };

  function userToGivenName(data) {
    if (data && data.user_metadata && data.user_metadata.givenName) {
      return data.user_metadata.givenName;
    } else if (data && data.name) {
      return data.name;
    } else if (data && data.nickname) {
      return data.nickname;
    } else if (data && data.email) {
      return data.email;
    } else {
      return "User";
    }
  }


  return {
    login: login,
    handleAuthentication: handleAuthentication,
    setSession: setSession,
    logout: logout,
    isAuthenticated: isAuthenticated,
    getAccessToken: getAccessToken,
    getIdToken: getIdToken,
    getUser: getUser
  }
});
