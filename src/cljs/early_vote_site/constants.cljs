(ns early-vote-site.constants)

(def states
  [{:fips-code "01" :state-name "Alabama" :abbreviation "AL"},
   {:fips-code "02" :state-name "Alaska" :abbreviation "AK"}
   {:fips-code "04" :state-name "Arizona" :abbreviation "AZ"}
   {:fips-code "05" :state-name "Arkansas" :abbreviation "AR"},
   {:fips-code "06" :state-name "California" :abbreviation "CA"},
   {:fips-code "08" :state-name "Colorado" :abbreviation "CO"},
   {:fips-code "09" :state-name "Connecticut" :abbreviation "CT"},
   {:fips-code "10" :state-name "Delaware" :abbreviation "DE"},
   {:fips-code "11" :state-name "District of Columbia" :abbreviation "DC"},
   {:fips-code "12" :state-name "Florida" :abbreviation "FL"},
   {:fips-code "13" :state-name "Georgia" :abbreviation "GA"},
   {:fips-code "15" :state-name "Hawaii" :abbreviation "HI"},
   {:fips-code "16" :state-name "Idaho" :abbreviation "ID"},
   {:fips-code "17" :state-name "Illinois" :abbreviation "IL"},
   {:fips-code "18" :state-name "Indiana" :abbreviation "IN"},
   {:fips-code "19" :state-name "Iowa" :abbreviation "IA"},
   {:fips-code "20" :state-name "Kansas" :abbreviation "KS"},
   {:fips-code "21" :state-name "Kentucky" :abbreviation "KY"},
   {:fips-code "22" :state-name "Louisiana" :abbreviation "LA"},
   {:fips-code "23" :state-name "Maine" :abbreviation "ME"},
   {:fips-code "24" :state-name "Maryland" :abbreviation "MD"},
   {:fips-code "25" :state-name "Massachusetts" :abbreviation "MA"},
   {:fips-code "26" :state-name "Michigan" :abbreviation "MI"},
   {:fips-code "27" :state-name "Minnesota" :abbreviation "MN"},
   {:fips-code "28" :state-name "Mississippi" :abbreviation "MS"},
   {:fips-code "29" :state-name "Missouri" :abbreviation "MO"},
   {:fips-code "30" :state-name "Montana" :abbreviation "MT"},
   {:fips-code "31" :state-name "Nebraska" :abbreviation "NE"},
   {:fips-code "32" :state-name "Nevada" :abbreviation "NV"},
   {:fips-code "33" :state-name "New Hampshire" :abbreviation "NH"},
   {:fips-code "34" :state-name "New Jersey" :abbreviation "NJ"},
   {:fips-code "35" :state-name "New Mexico" :abbreviation "NM"},
   {:fips-code "36" :state-name "New York" :abbreviation "NY"},
   {:fips-code "37" :state-name "North Carolina" :abbreviation "NC"},
   {:fips-code "38" :state-name "North Dakota" :abbreviation "ND"},
   {:fips-code "39" :state-name "Ohio" :abbreviation "OH"},
   {:fips-code "40" :state-name "Oklahoma" :abbreviation "OK"},
   {:fips-code "41" :state-name "Oregon" :abbreviation "OR"},
   {:fips-code "42" :state-name "Pennsylvania" :abbreviation "PA"},
   {:fips-code "44" :state-name "Rhode Island" :abbreviation "RI"},
   {:fips-code "45" :state-name "South Carolina" :abbreviation "SC"},
   {:fips-code "46" :state-name "South Dakota" :abbreviation "SD"},
   {:fips-code "47" :state-name "Tennessee" :abbreviation "TN"},
   {:fips-code "48" :state-name "Texas" :abbreviation "TX"},
   {:fips-code "49" :state-name "Utah" :abbreviation "UT"},
   {:fips-code "50" :state-name "Vermont" :abbreviation "VT"},
   {:fips-code "51" :state-name "Virginia" :abbreviation "VA"},
   {:fips-code "53" :state-name "Washington" :abbreviation "WA"},
   {:fips-code "54" :state-name "West Virginia" :abbreviation "WV"},
   {:fips-code "55" :state-name "Wisconsin" :abbreviation "WI"},
   {:fips-code "56" :state-name "Wyoming" :abbreviation "WY"}])

(def state-names-by-fips
  (into {} (map #(vector (get % :fips-code) (get % :state-name)) states)))

(def state-abbreviations-by-fips
  (into {} (map #(vector (get % :fips-code) (get % :abbreviation)) states)))
