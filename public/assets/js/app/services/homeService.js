'use strict';
/*
 * Home Service
 *
 * Returning promises, allowing the Controller to handle success and error responses appropriately
 *
 */
vipApp.factory('$homeService', function ($http, $appProperties) {

    return {
      // no services for the "home" page as it simply redirects to the "feeds" page
    };
});