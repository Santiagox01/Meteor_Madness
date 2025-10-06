export const NEO_BROWSE_SAMPLE = {
  near_earth_objects: [
    {
      id: "99942",
      name: "(99942) Apophis",
      estimated_diameter: { meters: { estimated_diameter_min: 340, estimated_diameter_max: 370 } },
      is_potentially_hazardous_asteroid: true,
      close_approach_data: [
        { 
          close_approach_date: "2029-04-13",
          close_approach_date_full: "2029-Apr-13 21:46",
          epoch_date_close_approach: 1871071560000,
          relative_velocity: { kilometers_per_second: "7.42" }, 
          miss_distance: { 
            kilometers: "38400000", 
            lunar: "99.8",
            astronomical: "0.2567",
            miles: "23862000"
          }
        }
      ],
    },
    {
      id: "2010 TK7",
      name: "2010 TK7",
      estimated_diameter: { meters: { estimated_diameter_min: 300, estimated_diameter_max: 400 } },
      is_potentially_hazardous_asteroid: false,
      close_approach_data: [
        { 
          close_approach_date: "2025-06-15",
          close_approach_date_full: "2025-Jun-15 10:30",
          epoch_date_close_approach: 1750152600000,
          relative_velocity: { kilometers_per_second: "12.1" }, 
          miss_distance: { 
            kilometers: "15000000", 
            lunar: "39.0",
            astronomical: "0.1003",
            miles: "9320570"
          }
        }
      ],
    },
    {
      id: "433",
      name: "(433) Eros",
      estimated_diameter: { meters: { estimated_diameter_min: 16000, estimated_diameter_max: 17000 } },
      is_potentially_hazardous_asteroid: false,
      close_approach_data: [
        { 
          close_approach_date: "2025-01-30",
          close_approach_date_full: "2025-Jan-30 14:23",
          epoch_date_close_approach: 1738242180000,
          relative_velocity: { kilometers_per_second: "5.4" }, 
          miss_distance: { 
            kilometers: "29390429", 
            lunar: "76.4",
            astronomical: "0.1964",
            miles: "18265825"
          }
        }
      ],
    },
  ],
};
