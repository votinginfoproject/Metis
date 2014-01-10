/**
 * Created by rcartier13 on 1/6/14.
 */



var mockedData = {
  ballotXML: {
    $: {
      id: 1
    },

    referendum_id: 2,
    candidate_id: [{$text: 3, $: {sort_order: 4}}, {$text: 5, $: {sort_order: 6}}],
    custom_ballot_id: 7,
    write_in: 'yes',
    image_url: 'http://fakeUrl.com',
  }
};

module.exports = mockedData;