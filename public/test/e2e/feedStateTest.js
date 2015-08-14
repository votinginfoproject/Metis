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

      expect(element('#sidebar-pollinglocations').count()).toBe(1);

      // click the contests link
      element('#sidebar-pollinglocations').click();
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


      expect(element('#pollingLocation-element-type0 span').html()).toBe("Early Vote Sites");
      expect(element('#pollingLocation-element-type1 span').html()).toBe("Election Administrations");
      expect(element('#pollingLocation-element-type2 span').html()).toBe("Election Officials");
      expect(element('#pollingLocation-element-type3 span').html()).toBe("Localities");
      expect(element('#pollingLocation-element-type4 span').html()).toBe("Polling Locations");
      expect(element('#pollingLocation-element-type5 span').html()).toBe("Precinct Splits");
      expect(element('#pollingLocation-element-type6 span').html()).toBe("Precincts");
      expect(element('#pollingLocation-element-type7 span').html()).toBe("Street Segments");
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

    it('Error page link works', function() {
      element('#electionadmin-errors').click();
      sleep(testGlobals.sleepTime);
      expect(element('#feeds-election-state-electionadministration-errors-content').count()).toBe(1);
      element('#pageHeader-breadcrumb3 a').click();
      sleep(testGlobals.sleepTime);
      expect(element('#feeds-election-state-electionadministration-content').count()).toBe(1);
    });

    // go back to state page
    it('Should be able to go back to the State page via the breadcrumbs', function () {

      // now go back to the state page
      // click the state breadcrumb
      element('#pageHeader-breadcrumb2 a').click();
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
      element('#pageHeader-breadcrumb2 a').click();
      sleep(testGlobals.sleepTime);

      // should be on the feed state page
      expect(element('#feed-state-content').count()).toBe(1);
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
