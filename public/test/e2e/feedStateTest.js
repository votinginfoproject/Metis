describe('Feed State Test', function () {

  describe('Log in', function () {

    // Successful attempt
    //    currently only with local client, need to modify later for crowd
    it('Accepts a proper username + password', function () {
      e2eLogIn('testuser', 'test');
    });
  });

  /* ----------------------------------------
   Feed State page
   ------------------------------------------*/
  describe('Check Feed State page', function () {

    it('Should go to the Feed State page after selecting a feed and then Election and then State', function () {

      // expect to start out on the feed index page
      // click the first feed
      element('#date0 a').click();
      sleep(testGlobals.sleepTime);

      /*
       expect(element('#election-link').count()).toBe(1);

       // click the election link
       element('#election-link').click();
       sleep(testGlobals.sleepTime);
       */

      expect(element('#sidebar-contests').count()).toBe(1);

      // click the contests link
      element('#sidebar-contests').click();
      sleep(testGlobals.sleepTime);

      // should be on the feed contests page
      expect(element('#feed-contests-content').count()).toBe(1);

      // should have a link back to the election page in the breadcrumbs
      expect(element('#pageHeader-breadcrumb2').count()).toBe(1);
      element('#pageHeader-breadcrumb2').click();

      // should be on the feed election page

      // should have a state link
      expect(element('#state-id a').count()).toBe(1);

      // click the state link
      element('#state-id a').click();
      sleep(testGlobals.sleepTime);

      // should be on the feed state page
      expect(element('#feed-state-content').count()).toBe(1);

    });

  });

  /* ----------------------------------------
   Feed State data
   ------------------------------------------*/
  describe('Check Feed State data', function () {
    // if there is data
    it('Should have State data', function () {

      expect(element('#state-id').count()).toBe(1);
    });

    // if there is data
    it('Should have Polling Location data', function () {

      expect(element('#pollingLocation0').count()).toBe(1);
    });

    // if there is data
    it('Should have Election Administration data', function () {

      expect(element('#state-administration-id').count()).toBe(1);
    });

    // if there is data
    it('Should have State locality data', function () {

      expect(element('#locality0').count()).toBe(1);
      expect(element('#locality-name0').count()).toBe(1);
    });

    it('Error page link works', function() {
      element('#state-errors').click();

      expect(element('#feeds-election-state-errors-content').count()).toBe(1);

      element('#pageHeader-breadcrumb3 a').click();
      sleep(testGlobals.sleepTime);

      expect(element('#feed-state-content').count()).toBe(1);
    })
  });

  /* ----------------------------------------
   Feed Overview Polling Locations
   ------------------------------------------*/
  describe('Check Feed Overview polling locations', function () {
    // check the the number of items
    it('Should have polling locations', function () {

      // let's make sure we have the various sections available in the polling locations section
      expect(element('#pollingLocation0').count()).toBe(1);
      //...
      expect(element('#pollingLocation6').count()).toBe(1);


      expect(element('#pollingLocation-element-type0').html()).toBe("Early Vote Sites");
      expect(element('#pollingLocation-element-type1').html()).toBe("Election Administrations");
      expect(element('#pollingLocation-element-type2').html()).toBe("Election Officials");
      expect(element('#pollingLocation-element-type3').html()).toBe("Localities");
      expect(element('#pollingLocation-element-type4').html()).toBe("Polling Locations");
      expect(element('#pollingLocation-element-type5').html()).toBe("Precinct Splits");
      expect(element('#pollingLocation-element-type6').html()).toBe("Precincts");
      expect(element('#pollingLocation-element-type7').html()).toBe("Street Segments");
    });

  });

  /* ----------------------------------------
   Feed State Election Administration page
   ------------------------------------------*/
  describe('Check Feed State Election Administration page', function () {
    // check the the number of items
    it('Should go to the State Election Administration page', function () {

      expect(element('#state-administration-id').count()).toBe(1);
      // click the state link
      element('#state-administration-id a').click();
      sleep(testGlobals.sleepTime);

      // should be on the feed state election administration page
      expect(element('#feeds-election-state-electionadministration-content').count()).toBe(1);
    });

    // if there is data
    it('Should have an Election Admin data', function () {

      expect(element('#name').html()).not().toBe("");
    });

    // if there is data
    it('Should have an Election Admin - Election Official data', function () {

      expect(element('#eo-name').html()).not().toBe("");
    });

    // if there is data
    it('Should have an Election Admin - Overseas Voter Contact data', function () {

      expect(element('#ovc-name').html()).not().toBe("");
    });

    it('Error page link works', function() {
      element('#electionadmin-errors').click();
      sleep(testGlobals.sleepTime);
      expect(element('#feeds-election-state-electionadministration-errors-content').count()).toBe(1);
      element('#pageHeader-breadcrumb4 a').click();
      sleep(testGlobals.sleepTime);
      expect(element('#feeds-election-state-electionadministration-content').count()).toBe(1);
    });

    // go back to state page
    it('Should be able to go back to the State page via the breadcrumbs', function () {

      // now go back to the state page
      // click the state breadcrumb
      element('#pageHeader-breadcrumb3 a').click();
      sleep(testGlobals.sleepTime);

      // should be on the feed state page
      expect(element('#feed-state-content').count()).toBe(1);
    });

  });

  /* ----------------------------------------
   Feed State Localities page
   ------------------------------------------*/
  describe('Check Feed State Localities page', function () {
    // check the the number of items
    it('Should go to the Localities page', function () {

      expect(element('#locality-id0').count()).toBe(1);
      // click the state link
      element('#locality-id0 a').click();
      sleep(testGlobals.sleepTime);

      // should be on the feed state election administration page
      expect(element('#feed-locality-content').count()).toBe(1);
    });

    // go back to state page
    it('Should be able to go back to the State page via the breadcrumbs', function () {

      // now go back to the state page
      // click the state breadcrumb
      element('#pageHeader-breadcrumb3 a').click();
      sleep(testGlobals.sleepTime);

      // should be on the feed state page
      expect(element('#feed-state-content').count()).toBe(1);
    });

  });

  /* ----------------------------------------
   Feed State Polling Locations page
   ------------------------------------------*/
  describe('Check Feed State Polling Locations page', function () {
    // check the the number of items
    it('Should go to the Polling Locations error page', function () {

      expect(element('#pollingLocation-errors0').count()).toBe(1);
      // click the state link
      element('#pollingLocation-errors0 a').click();
      sleep(testGlobals.sleepTime);

      // should be on the feed state election administration page
      expect(element('#feeds-overview-earlyvotesites-errors-content').count()).toBe(1);
    });

  });

  /* ----------------------------------------
   Log Out
   ------------------------------------------*/
  describe('Logging out', function () {
    // Signs out of the application
    it('Sign out of the app', function () {
      e2eLogOut();
    });
  });
});
