/**
 * Created by rcartier13 on 1/6/14.
 */

var address = {
  location_name: 'awesome street',
  line1: 'APT#34',
  line2: '',
  line3: '',
  city: 'Denver',
  state: 'state',
  zip: '12345'
}

var mockedData = {
  ballotXML: {
    $: {
      id: '1'
    },

    referendum_id: [{$text: '3', $: {sort_order: 4}}, {$text: '5', $: {sort_order: 6}}],
    candidate_id: [{$text: '3', $: {sort_order: 4}}, {$text: '5', $: {sort_order: 6}}],
    custom_ballot_id: '7',
    write_in: 'yes',
    image_url: 'http://fakeUrl.com'
  },

  ballotLineResultXml: {
    $: {
      id: '1',
      certification: 'word'
    },

    contest_id: '3',
    jurisdiction_id: '4',
    entire_district: 'no',
    candidate_id: ['5'],
    ballot_response_id: ['6'],
    votes: 7,
    victorious: 'yes'
  },

  ballotResponseXml: {
    $: {
      id: '1'
    },

    text: 'word',
    sort_order: 2
  },

  candidateXml: {
    $: {
      id: '1'
    },

    name: 'ryan',
    party: 'republican',
    candidate_url: 'fakeUrl.com',
    biography: 'wakka wakka',
    phone: '555-555-5555',
    photo_url: 'otherFakeurl.com',
    filed_mailing_address: address,
    email: 'stilluses@Hotmail.com',
    sort_order: 2
  },

  contestXml: {
    $: {
      id: '1'
    },
    election_id: '2',
    electoral_district_id: ['3'],
    type: 'type',
    partisan: 'yes',
    primary_party: 'primary',
    electorate_specifications: 'elec spec',
    special: 'no',
    office: 'office',
    filing_closed_date: Date('2013-09-09'),
    number_elected: 4,
    number_voting_for: 5,
    ballot_id: '6',
    ballot_placement: 7
  },

  contestResultXml: {
    $: {
      id: '1',
      certification: 'cert'
    },
    contest_id: '2',
    jurisdiction_id: '3',
    entire_district: 'yes',
    total_votes: 5,
    total_valid_votes: 6,
    overvotes: 7,
    blank_votes: 8,
    accepted_provisional_votes: 9,
    rejected_votes: 10
  },

  customBallotXml: {
    $: {
      id: '1'
    },
    heading: 'heading',
    ballot_response_id: [ { $text: '3', $: {sort_order: 2} } ]
  },

  earlyVoteSiteXml: {
    $: {
      id: '1'
    },
    name: 'name',
    address: address,
    voter_services: 'voter',
    start_date: Date('2013-09-09'),
    end_date: Date('2013-10-09'),
    days_times_open: 'dto'
  },

  electionXml: {
    $: {
      id: '1'
    },
    date: Date('2013-09-09'),
    election_type: 'type',
    state_id: '2',
    statewide: 'yes',
    registration_info: 'registration info',
    absentee_ballot_info: 'absentee info',
    results_url: 'resultsUrl.com',
    polling_hours: '12',
    election_day_registration: 'no',
    registration_deadline: Date('2013-10-10'),
    absentee_request_deadline: Date('2013-10-05')
  },

  electionAdministrationXml: {
    $: {
      id: '1'
    },
    name: 'name',
    eo_id: '2',
    ovc_id: '3',
    physical_address: address,
    mailing_address: address,
    elections_url: 'electionUrl.com',
    am_i_registered_url: 'amIRegistered.com',
    where_do_i_vote_url: 'whereDoIVote.com',
    what_is_on_my_ballot_url: 'onMyBallot.com',
    rules_url: 'rules.com',
    hours: '4'
  },

  electionOfficialXml: {
    $: {
      id: '1'
    },
    name: 'name',
    title: 'title',
    phone: '555-555-5555',
    fax: '123-456-7890',
    email: 'email@emails.com'
  },

  electoralDistrictXml: {
    $: {
      id: '1'
    },
    name: 'name',
    type: 'type',
    number: 2
  },

  localityXml: {
    $: {
      id: '1'
    },
    name: 'name',
    state_id: '2',
    type: 'type',
    election_administration_id: '3',
    early_vote_site_id: [ '4' ]
  },

  pollingLocationXml: {
    $: {
      id: '1'
    },

    address: address,
    directions: 'dir',
    polling_hours: 'hours',
    photo_url: 'photoUrl.com'
  },

  precinctXml: {
    $: {
      id: '1'
    },
    name: 'name',
    number: '555-555-5555',
    locality_id: '2',
    electoral_district_id: ['3'],
    ward: 'ward',
    mail_only: 'yes',
    polling_location_id: ['4'],
    early_vote_site_id: ['5'],
    ballot_style_image_url: 'imgUrl.com'
  },

  precinctSplitXml: {
    $: {
      id: '1'
    },
    name: 'name',
    precinct_id: '2',
    electoral_district_id: ['3'],
    polling_location_id: ['4'],
    ballot_style_image_url: 'imgUrl.com'
  },

  referendumXml: {
    $: {
      id: '1'
    },
    title: 'title',
    subtitle: 'subtitle',
    brief: 'brief',
    text: 'text',
    pro_statement: 'pro',
    con_statement: 'con',
    passage_threshold: 'threshold',
    effect_of_abstain: 'abstain',
    ballot_response_id: [{ $text: '2', $: {sort_order:2} }]
  },

  sourceXml: {
    $: {
      id: '1'
    },
    vip_id: 2,
    datetime: Date('2013-10-05'),
    description: 'desc',
    name: 'name',
    organization_url: 'org.com',
    feed_contact_id: 3,
    tou_url: 'tou.com'
  },

  stateXml: {
    $: {
      id: '1'
    },
    name: 'name',
    election_administration_id: '2',
    early_vote_site_id: ['3']
  },

  streetSegmentXml: {
    $: {
      id: '1'
    },
    start_house_number: 2,
    end_house_number: 3,
    odd_even_both: 4,
    start_apartment_number: 5,
    end_apartment_number: 6,
    non_house_address: {
      house_number: 7,
      house_number_prefix: 'pre',
      house_number_suffix: 'suf',
      street_direction: 'dir',
      street_name: 'st name',
      street_suffix: 'st suf',
      address_direction: 'add dir',
      apartment: 'apt',
      city: 'city',
      state: 'state',
      zip: '12345'
    },
    precinct_id: '8',
    precinct_split_id: '9'
  }
};

module.exports = mockedData;