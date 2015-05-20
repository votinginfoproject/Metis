describe('Feed Overview Test', function () {

  describe('Log in', function () {

    // Successful attempt
    //    currently only with local client, need to modify later for crowd
    it('Accepts a proper username + password', function () {
      e2eLogIn('testuser', 'test');
    });
  });

  /* ----------------------------------------
   Feed Overview page
   ------------------------------------------*/
  describe('Check Feed Overview page', function () {
    // check the the number of feeds
    it('Should go to the Feed Overview page after selecting a feed', function () {

      // expect to start out on the feed index page

      // click the first feed
      element('#date0 a').click();

      sleep(testGlobals.sleepTime);

      // should be on the feed overview page
      expect(element('#feed-overview-content').count()).toBe(1);
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
   Feed Overview Localities
   ------------------------------------------*/
  describe('Check Feed Overview localities', function () {
    // check the the number of items
    it('Should have localities', function () {

      expect(element('#LocalTable').count()).toBe(1);
      expect(element('#locality0').count()).toBe(1);
    });

  });

  /* ----------------------------------------
   Feed Overview Contests
   ------------------------------------------*/
  describe('Check Feed Contests', function () {
    // check the the number of items
    it('Should have contests', function () {

      expect(element('#feedContests0').count()).toBe(1);
    });

  });

  /* ----------------------------------------
   Feed Sidebar
   ------------------------------------------*/
  describe('Check Feed Sidebar', function () {
    // check the the number of items
    it('Should have results', function () {

      // feed due date
      expect(element('#feedDueDate').count()).toBe(1);

      // feed contact
      expect(element('#feed_contact_name').html()).not().toBe("");
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