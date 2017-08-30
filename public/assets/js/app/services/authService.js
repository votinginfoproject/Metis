'use strict';

vipApp.factory('$authService', function ($rootScope, $location, $timeout, $http, $appService, $appProperties, angularAuth0) {

  function login() {
    angularAuth0.authorize();
  }

  function handleAuthentication() {
    console.log("handling Authentication");
    if (isAuthenticated()) {
      setupAuthentication();
    } else {
      angularAuth0.parseHash(function(err, authResult) {
        if (authResult && authResult.accessToken && authResult.idToken) {
          console.log("handleAuthentication: success");
          setSession(authResult);
          setupAuthentication();
        } else if (err) {
          $timeout(function() {
            $location.url('/');
          });
          console.log(err);
        }
      });
    }
  }

  function createLogoutUrl() {
    var returnTo = encodeURIComponent($location.absUrl().split('#')[0] + "#/logout");
    return "https://" + config.auth0.domain +"/v2/logout?returnTo=" + returnTo +
     "&client_id=" + config.auth0.clientID;
  }

  function setupAuthentication() {
    console.log("beginning of setupAuthentication");
    $http.defaults.headers.common['Authorization'] = 'Bearer ' + getAccessToken();
    getUser($appService.setUserSuccess, $appService.setUserFailure);
    $rootScope.logoutUrl = createLogoutUrl();
    if($location.url() === "/" || $location.url() === "" ||
       $location.url() === "/login-callback") {
      $location.url("/feeds");
    }
  }

  function setSession(authResult) {
    // Set the time that the access token will expire at
    let expiresAt = JSON.stringify((authResult.expiresIn * 1000) + new Date().getTime());
    localStorage.setItem('auth0_access_token', authResult.accessToken);
    localStorage.setItem('auth0_id_token', authResult.idToken);
    localStorage.setItem('auth0_id_token_payload', JSON.stringify(authResult.idTokenPayload));
    localStorage.setItem('auth0_expires_at', expiresAt);
  }

  function logout() {
    // Remove tokens and expiry time from localStorage
    localStorage.removeItem('auth0_access_token');
    localStorage.removeItem('auth0_id_token');
    localStorage.removeItem('auth0_id_token_payload');
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

  function getLocalUser(){
    var storedUser = localStorage.getItem('auth0_user');
    if (storedUser) {
      return JSON.parse(storedUser);
    } else {
      return null;
    }
  };

  function getUser(successCallback, failureCallback) {
    var storedUser = localStorage.getItem('auth0_user');
    if (storedUser) {
      successCallback(JSON.parse(storedUser));
    } else {
      $http.post($appProperties.servicesPath + "/getMetadata")
                .success(function(metadata) {
                  var user = createUser(JSON.parse(localStorage.getItem("auth0_id_token_payload")),
                                        metadata);
                  console.log("Storing and returning user: " + JSON.stringify(user));
                  localStorage.setItem('auth0_user', JSON.stringify(user));
                  successCallback(user);
                })
                .error(failureCallback);
      }
  }

  function createUser(profile, metadata) {
    return {
            isAuthenticated: true,
            givenName: userToGivenName(metadata.user_metadata, profile),
            userName: profile["name"],
            email: profile["email"],
            fipsCodes: userToFips(metadata.app_metadata),
            roles: userToRoles(metadata.app_metadata)
    }
  };

  function userToFips(metadata) {
    if (metadata && metadata.fipsCodes) {
      return Object.keys(metadata.fipsCodes);
    } else {
      return [];
    }
  };

  function userToRoles(metadata) {
    if (metadata && metadata.roles) {
      return metadata.roles;
    } else {
      console.log("no roles in metadata");
      return [];
    }
  };

  function userToGivenName(metadata, profile) {
    if (metadata && metadata.givenName) {
      return metadata.givenName;
    } else if (profile && profile.name) {
      return profile.name;
    } else if (profile && profile.nickname) {
      return profile.nickname;
    } else if (profile && profile.email) {
      return profile.email;
    } else {
      return "User";
    }
  }

  function hasRole (roleName) {
    var user = getLocalUser();
    if (user) {
      var roles = user.roles;
      if (roles.indexOf(roleName) >= 0) {
        return true;
      }
    }
    return false;
  };

  return {
    login: login,
    handleAuthentication: handleAuthentication,
    setSession: setSession,
    logout: logout,
    isAuthenticated: isAuthenticated,
    getAccessToken: getAccessToken,
    getIdToken: getIdToken,
    getUser: getUser,
    hasRole: hasRole
  }
});
