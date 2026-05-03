// src/data/boothData.js
// Mock polling booth data for 10 major Indian cities
// Uses real constituency names and approximate coordinates

export const MOCK_BOOTHS = [
  // ── Delhi ──────────────────────────────────────────────────────────
  {
    id: 'del-001',
    name: 'Chandni Chowk Booth 1',
    constituency: 'Chandni Chowk',
    city: 'Delhi',
    state: 'Delhi',
    address: 'Town Hall, Chandni Chowk, Delhi 110006',
    boothNumber: 'CC/001',
    lat: 28.6580,
    lng: 77.2301,
    totalVoters: 1247,
  },
  {
    id: 'del-002',
    name: 'Connaught Place Booth 3',
    constituency: 'New Delhi',
    city: 'Delhi',
    state: 'Delhi',
    address: 'Community Centre, Connaught Place, New Delhi 110001',
    boothNumber: 'ND/003',
    lat: 28.6328,
    lng: 77.2197,
    totalVoters: 892,
  },
  {
    id: 'del-003',
    name: 'Paharganj Primary School Booth',
    constituency: 'New Delhi',
    city: 'Delhi',
    state: 'Delhi',
    address: 'Government Senior Secondary School, Paharganj, Delhi 110055',
    boothNumber: 'ND/007',
    lat: 28.6443,
    lng: 77.2122,
    totalVoters: 1103,
  },

  // ── Mumbai ─────────────────────────────────────────────────────────
  {
    id: 'mum-001',
    name: 'Andheri East Booth 12',
    constituency: 'Andheri East',
    city: 'Mumbai',
    state: 'Maharashtra',
    address: 'MIDC Community Hall, Chakala, Andheri East, Mumbai 400093',
    boothNumber: 'AE/012',
    lat: 19.1197,
    lng: 72.8709,
    totalVoters: 1456,
  },
  {
    id: 'mum-002',
    name: 'Bandra West Booth 5',
    constituency: 'Bandra West',
    city: 'Mumbai',
    state: 'Maharashtra',
    address: 'St. Andrew\'s School, Hill Road, Bandra West, Mumbai 400050',
    boothNumber: 'BW/005',
    lat: 19.0596,
    lng: 72.8295,
    totalVoters: 987,
  },
  {
    id: 'mum-003',
    name: 'Dharavi Booth 8',
    constituency: 'Dharavi',
    city: 'Mumbai',
    state: 'Maharashtra',
    address: 'Municipal School No. 4, Dharavi, Mumbai 400017',
    boothNumber: 'DH/008',
    lat: 19.0416,
    lng: 72.8516,
    totalVoters: 2103,
  },

  // ── Bangalore ──────────────────────────────────────────────────────
  {
    id: 'blr-001',
    name: 'Koramangala Booth 7',
    constituency: 'BTM Layout',
    city: 'Bangalore',
    state: 'Karnataka',
    address: 'Government Higher Primary School, 5th Block, Koramangala, Bangalore 560095',
    boothNumber: 'BTM/007',
    lat: 12.9352,
    lng: 77.6245,
    totalVoters: 1678,
  },
  {
    id: 'blr-002',
    name: 'Indiranagar Booth 2',
    constituency: 'Shivajinagar',
    city: 'Bangalore',
    state: 'Karnataka',
    address: 'BBMP Ward Office, 100 Feet Road, Indiranagar, Bangalore 560038',
    boothNumber: 'SJ/002',
    lat: 12.9784,
    lng: 77.6408,
    totalVoters: 1234,
  },

  // ── Chennai ────────────────────────────────────────────────────────
  {
    id: 'che-001',
    name: 'T. Nagar Booth 4',
    constituency: 'Thousand Lights',
    city: 'Chennai',
    state: 'Tamil Nadu',
    address: 'GHM Higher Secondary School, T. Nagar, Chennai 600017',
    boothNumber: 'TL/004',
    lat: 13.0418,
    lng: 80.2341,
    totalVoters: 1567,
  },
  {
    id: 'che-002',
    name: 'Anna Nagar Booth 9',
    constituency: 'Anna Nagar',
    city: 'Chennai',
    state: 'Tamil Nadu',
    address: 'Corporation School, Block H, Anna Nagar, Chennai 600040',
    boothNumber: 'AN/009',
    lat: 13.0878,
    lng: 80.2101,
    totalVoters: 1345,
  },

  // ── Kolkata ────────────────────────────────────────────────────────
  {
    id: 'kol-001',
    name: 'Park Street Booth 1',
    constituency: 'Kolkata Dakshin',
    city: 'Kolkata',
    state: 'West Bengal',
    address: 'St. Xavier\'s College Community Room, Park Street, Kolkata 700016',
    boothNumber: 'KD/001',
    lat: 22.5514,
    lng: 88.3517,
    totalVoters: 876,
  },
  {
    id: 'kol-002',
    name: 'Gariahat Booth 6',
    constituency: 'Rashbehari',
    city: 'Kolkata',
    state: 'West Bengal',
    address: 'Vidyasagar School, Gariahat Road, Kolkata 700029',
    boothNumber: 'RB/006',
    lat: 22.5143,
    lng: 88.3649,
    totalVoters: 1432,
  },

  // ── Hyderabad ──────────────────────────────────────────────────────
  {
    id: 'hyd-001',
    name: 'Banjara Hills Booth 3',
    constituency: 'Jubilee Hills',
    city: 'Hyderabad',
    state: 'Telangana',
    address: 'Government Primary School, Road No. 12, Banjara Hills, Hyderabad 500034',
    boothNumber: 'JH/003',
    lat: 17.4156,
    lng: 78.4304,
    totalVoters: 1123,
  },
  {
    id: 'hyd-002',
    name: 'Secunderabad Booth 11',
    constituency: 'Secunderabad',
    city: 'Hyderabad',
    state: 'Telangana',
    address: 'Municipal High School, MG Road, Secunderabad 500003',
    boothNumber: 'SC/011',
    lat: 17.4399,
    lng: 78.4983,
    totalVoters: 1789,
  },

  // ── Ahmedabad ──────────────────────────────────────────────────────
  {
    id: 'ahm-001',
    name: 'Maninagar Booth 5',
    constituency: 'Maninagar',
    city: 'Ahmedabad',
    state: 'Gujarat',
    address: 'Gujarat University Community Hall, Maninagar, Ahmedabad 380008',
    boothNumber: 'MN/005',
    lat: 23.0003,
    lng: 72.6024,
    totalVoters: 1654,
  },

  // ── Pune ───────────────────────────────────────────────────────────
  {
    id: 'pun-001',
    name: 'Shivajinagar Booth 2',
    constituency: 'Shivajinagar',
    city: 'Pune',
    state: 'Maharashtra',
    address: 'Pune Municipal Corporation Hall, Shivajinagar, Pune 411005',
    boothNumber: 'SN/002',
    lat: 18.5308,
    lng: 73.8475,
    totalVoters: 1098,
  },

  // ── Jaipur ─────────────────────────────────────────────────────────
  {
    id: 'jai-001',
    name: 'Civil Lines Booth 4',
    constituency: 'Jaipur City',
    city: 'Jaipur',
    state: 'Rajasthan',
    address: 'Rajasthan Government School, Civil Lines, Jaipur 302006',
    boothNumber: 'JC/004',
    lat: 26.9124,
    lng: 75.7873,
    totalVoters: 1321,
  },

  // ── Lucknow ────────────────────────────────────────────────────────
  {
    id: 'lko-001',
    name: 'Hazratganj Booth 7',
    constituency: 'Lucknow',
    city: 'Lucknow',
    state: 'Uttar Pradesh',
    address: 'Lucknow University Community Hall, Hazratganj, Lucknow 226001',
    boothNumber: 'LK/007',
    lat: 26.8463,
    lng: 80.9461,
    totalVoters: 1567,
  },
];

// Get booths near a coordinate (simple distance calculation)
export function getNearbyBooths(lat, lng, radiusKm = 5) {
  return MOCK_BOOTHS.filter(booth => {
    const distance = getDistanceKm(lat, lng, booth.lat, booth.lng);
    return distance <= radiusKm;
  }).sort((a, b) => {
    const da = getDistanceKm(lat, lng, a.lat, a.lng);
    const db = getDistanceKm(lat, lng, b.lat, b.lng);
    return da - db;
  });
}

// Haversine distance formula
function getDistanceKm(lat1, lon1, lat2, lon2) {
  const R    = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a    =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
    Math.cos((lat2 * Math.PI) / 180) *
    Math.sin(dLon / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

// Search booths by city name
export function searchBoothsByCity(cityName) {
  const lower = cityName.toLowerCase();
  return MOCK_BOOTHS.filter(
    b => b.city.toLowerCase().includes(lower) ||
         b.constituency.toLowerCase().includes(lower) ||
         b.state.toLowerCase().includes(lower) ||
         b.address.toLowerCase().includes(lower)
  );
}

export default MOCK_BOOTHS;
