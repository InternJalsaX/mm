/* ==========================================================================
   MM MOTORS — VEHICLE DATA
   Single source of truth. Add a manufacturer or model here; no page changes.

   TRUST RULES (Brand Bible §34):
   - Every performance / efficiency figure carries a `q` qualifier which the UI
     renders as a visible tag. Claimed, IDC and real-world figures can never be
     confused for one another.
   - Prices are INDICATIVE EX-SHOWROOM only. No on-road price is stated anywhere,
     because on-road cost is registration-, insurance- and location-dependent and
     has not been supplied by the dealership.
   - `_verify` marks how confident this dataset is in a model's figures.
     See VERIFY.md. Everything marked 'medium' or 'low' must be checked against
     the manufacturer's current brochure before this site goes live.
   ========================================================================== */

export const DEALER = {
  name: 'MM Motors',
  city: 'Bengaluru',
  phone: '+91 00000 00000',
  whatsapp: '910000000000',
  email: 'hello@mmmotors.example',
  hours: 'Mon–Sat 09:30–19:30 · Sun 10:00–17:00',
  address: 'Service Road, Bengaluru — update with the real showroom address',
};

export const BRANDS = {
  tvs: {
    id: 'tvs',
    name: 'TVS',
    legal: 'TVS Motor Company',
    statement: 'Engineered for the everyday, tuned for the enthusiast.',
    blurb:
      'The broadest range on the MM Motors floor — from the 100 cc workhorse to a connected electric scooter and a 300 cc adventure tourer. If you want choice, start here.',
    accentNote: 'Petrol and electric',
  },
  honda: {
    id: 'honda',
    name: 'Honda',
    legal: 'Honda Motorcycle & Scooter India',
    statement: 'Refinement first. Then everything else.',
    blurb:
      'Quiet engines, low vibration and predictable running costs. Honda is what most MM Motors customers buy when the vehicle has to simply work, every single day, for years.',
    accentNote: 'Petrol and 350 cc roadsters',
  },
  bajaj: {
    id: 'bajaj',
    name: 'Bajaj',
    legal: 'Bajaj Auto',
    statement: 'The commuter, and the one that is not.',
    blurb:
      'Two very different halves. Chetak is a retro electric scooter with pressed-steel panels; Pulsar is the bike that taught a generation what a naked streetfighter feels like. Very little in between, and that is rather the point.',
    accentNote: 'Petrol and electric',
  },
  royalenfield: {
    id: 'royalenfield',
    name: 'Royal Enfield',
    legal: 'Royal Enfield (Eicher Motors)',
    statement: 'Heavier, slower, and the one people keep.',
    blurb:
      'Bought for how it feels rather than for what it scores. Expect real weight, a long thump and a riding position built for distance, not for filtering through traffic. Sit on one at MM Motors before you commit to it.',
    accentNote: 'Petrol',
  },
  river: {
    id: 'river',
    name: 'River',
    legal: 'River Mobility',
    statement: 'An electric scooter built like a utility vehicle.',
    blurb:
      'One model, designed around carrying things: the largest boot on this floor by a wide margin, bolt-on accessory mounts front and rear, and a deliberately over-built feel. Start here if an EV has to replace a small vehicle rather than a second scooter.',
    accentNote: 'Electric',
  },
};

/* --------------------------------------------------------------------------
   Qualifier labels rendered next to figures
   -------------------------------------------------------------------------- */
export const QUALIFIERS = {
  claimed: 'Claimed',
  idc: 'IDC',
  real: 'Real-world',
  arai: 'ARAI',
};

/* --------------------------------------------------------------------------
   Vehicles
   -------------------------------------------------------------------------- */
export const VEHICLES = [
  /* ===================== TVS ===================== */
  {
    id: 'tvs-jupiter',
    brand: 'tvs',
    model: 'Jupiter 110',
    name: 'TVS Jupiter 110',
    fuel: 'petrol',
    type: 'scooter',
    art: 'scooter',
    featured: true,
    _verify: 'medium',
    price: { from: 79000, to: 92000, note: 'Indicative ex-showroom' },
    headline: 'Built for the everyday.',
    blurb:
      'The default answer for a household that needs one dependable scooter. Largest underseat storage in its class, a genuinely flat floorboard and a fuel filler you reach without lifting the seat.',
    quick: [
      { label: 'Engine', value: '113.3', unit: 'cc' },
      { label: 'Mileage', value: '57', unit: 'km/l', q: 'claimed' },
      { label: 'Kerb weight', value: '106', unit: 'kg' },
      { label: 'Storage', value: '33', unit: 'L' },
      { label: 'Fuel tank', value: '5.1', unit: 'L' },
    ],
    perf: [
      { label: 'Max power', value: '5.9', unit: 'kW (8.0 PS) @ 6,500 rpm' },
      { label: 'Max torque', value: '9.8', unit: 'Nm @ 5,500 rpm' },
      { label: 'Transmission', value: 'CVT', unit: 'automatic' },
      { label: 'Starting', value: 'Electric', unit: '+ kick' },
    ],
    practical: [
      { label: 'Underseat storage', value: '33', unit: 'L' },
      { label: 'Fuel capacity', value: '5.1', unit: 'L' },
      { label: 'Seat height', value: '765', unit: 'mm' },
      { label: 'Ground clearance', value: '163', unit: 'mm' },
      { label: 'Front wheel', value: '12', unit: 'inch' },
    ],
    tech: [
      'Semi-digital instrument cluster',
      'External fuel fill — no need to lift the seat',
      'USB charging port',
      'Pass-by switch and engine kill switch',
      'LED headlamp with position lamp',
    ],
    safety: [
      'Combi-Brake System (CBS) — synchronised braking',
      'Telescopic front suspension',
      'Tubeless tyres front and rear',
      'Side-stand indicator',
    ],
    ownership: {
      warranty: 'Manufacturer warranty — confirm current term and battery/engine coverage with MM Motors',
      service: 'Periodic service at MM Motors service bay · free first services as per TVS schedule',
      finance: 'EMI via MM Motors finance partners · subject to eligibility',
      exchange: 'Old two-wheeler exchange evaluated in-showroom',
    },
    colours: [
      { name: 'Titanium Blue', paint: '#2E9BD6', paintDark: '#1B6A96' },
      { name: 'Dawn Red', paint: '#8E2231', paintDark: '#5E141F' },
      { name: 'Meteor Black', paint: '#22262B', paintDark: '#12151A' },
      { name: 'Pristine White', paint: '#E7E5E0', paintDark: '#A9A6A0' },
    ],
    variants: [
      { name: 'Drum', note: 'Steel wheels, drum brakes', from: 79000 },
      { name: 'Drum Alloy', note: 'Alloy wheels, drum brakes', from: 84000 },
      { name: 'Disc', note: 'Front disc brake, alloy wheels', from: 92000 },
    ],
    match: { use: ['commute', 'family', 'college'], priority: ['mileage', 'storage', 'comfort'] },
  },

  {
    id: 'tvs-jupiter-125',
    brand: 'tvs',
    model: 'Jupiter 125',
    name: 'TVS Jupiter 125',
    fuel: 'petrol',
    type: 'scooter',
    art: 'scooter',
    featured: false,
    _verify: 'medium',
    price: { from: 89000, to: 99000, note: 'Indicative ex-showroom' },
    headline: 'The same everyday, with more in reserve.',
    blurb:
      'A Jupiter with a 125 cc engine underneath. Pulls two adults up a flyover without protest, and keeps the class-leading 33-litre boot. The pick if your commute includes gradients or a pillion every day.',
    quick: [
      { label: 'Engine', value: '124.8', unit: 'cc' },
      { label: 'Mileage', value: '57', unit: 'km/l', q: 'claimed' },
      { label: 'Kerb weight', value: '108', unit: 'kg' },
      { label: 'Storage', value: '33', unit: 'L' },
      { label: 'Fuel tank', value: '5.0', unit: 'L' },
    ],
    perf: [
      { label: 'Max power', value: '6.0', unit: 'kW (8.15 PS) @ 6,500 rpm' },
      { label: 'Max torque', value: '10.5', unit: 'Nm @ 4,500 rpm' },
      { label: 'Transmission', value: 'CVT', unit: 'automatic' },
      { label: 'Starting', value: 'Electric', unit: 'starter-generator' },
    ],
    practical: [
      { label: 'Underseat storage', value: '33', unit: 'L' },
      { label: 'Fuel capacity', value: '5.0', unit: 'L' },
      { label: 'Seat height', value: '765', unit: 'mm' },
      { label: 'Ground clearance', value: '163', unit: 'mm' },
    ],
    tech: [
      'Bluetooth-enabled cluster on higher variants',
      'External fuel fill',
      'USB charging port',
      'Voice assist and call alerts on connected variants',
      'LED headlamp',
    ],
    safety: [
      'Combi-Brake System (CBS)',
      'Front disc brake on Disc variant',
      'Telescopic front suspension',
      'Tubeless tyres',
    ],
    ownership: {
      warranty: 'Manufacturer warranty — confirm current term with MM Motors',
      service: 'Periodic service at MM Motors service bay',
      finance: 'EMI via MM Motors finance partners',
      exchange: 'Old two-wheeler exchange evaluated in-showroom',
    },
    colours: [
      { name: 'Royal Wine', paint: '#6E1F2C', paintDark: '#43101A' },
      { name: 'Titanium Grey', paint: '#7C8188', paintDark: '#4B4F55' },
      { name: 'Pearl White', paint: '#EAE8E3', paintDark: '#ADAAA4' },
    ],
    variants: [
      { name: 'Drum', note: 'Alloy wheels, drum brakes', from: 89000 },
      { name: 'Disc', note: 'Front disc brake', from: 95000 },
      { name: 'Disc SmartXonnect', note: 'Bluetooth cluster', from: 99000 },
    ],
    match: { use: ['commute', 'family'], priority: ['comfort', 'storage', 'performance'] },
  },

  {
    id: 'tvs-ntorq-125',
    brand: 'tvs',
    model: 'NTorq 125',
    name: 'TVS NTorq 125',
    fuel: 'petrol',
    type: 'scooter',
    art: 'scooter',
    featured: true,
    _verify: 'medium',
    price: { from: 95000, to: 115000, note: 'Indicative ex-showroom' },
    headline: 'Made for city movement.',
    blurb:
      'The sport scooter. Bluetooth console with lap timer and top-speed recorder, the strongest engine in the 125 cc scooter class, and a chassis that rewards a rider who actually enjoys the commute.',
    quick: [
      { label: 'Engine', value: '124.8', unit: 'cc' },
      { label: 'Mileage', value: '47', unit: 'km/l', q: 'claimed' },
      { label: 'Kerb weight', value: '118', unit: 'kg' },
      { label: 'Top speed', value: '95', unit: 'km/h', q: 'claimed' },
      { label: 'Storage', value: '22', unit: 'L' },
    ],
    perf: [
      { label: 'Max power', value: '6.9', unit: 'kW (9.4 PS) @ 7,000 rpm' },
      { label: 'Max torque', value: '10.5', unit: 'Nm @ 5,500 rpm' },
      { label: 'Top speed', value: '95', unit: 'km/h', q: 'claimed' },
      { label: 'Transmission', value: 'CVT', unit: 'automatic' },
    ],
    practical: [
      { label: 'Underseat storage', value: '22', unit: 'L' },
      { label: 'Fuel capacity', value: '5.8', unit: 'L' },
      { label: 'Seat height', value: '770', unit: 'mm' },
      { label: 'Ground clearance', value: '155', unit: 'mm' },
    ],
    tech: [
      'SmartXonnect Bluetooth connectivity',
      'Turn-by-turn navigation on the cluster',
      'Lap timer, top-speed and 0–60 recorder',
      'Incoming call and SMS alerts',
      'LED headlamp and LED tail lamp',
      'USB charging port in the glovebox',
    ],
    safety: [
      'Front disc brake, synchronised braking',
      'Telescopic front suspension, gas-charged rear',
      'Tubeless tyres front and rear',
      'Hazard lamps on select variants',
    ],
    ownership: {
      warranty: 'Manufacturer warranty — confirm current term with MM Motors',
      service: 'Periodic service at MM Motors service bay',
      finance: 'EMI via MM Motors finance partners',
      exchange: 'Old two-wheeler exchange evaluated in-showroom',
    },
    colours: [
      { name: 'Stealth Black', paint: '#1D2024', paintDark: '#0D0F12' },
      { name: 'Racing Red', paint: '#C1281F', paintDark: '#7E150F' },
      { name: 'Combat Blue', paint: '#20486E', paintDark: '#122B44' },
      { name: 'Metallic Silver', paint: '#B9BEC4', paintDark: '#7D8288' },
    ],
    variants: [
      { name: 'Race XP', note: 'Ride modes, voice assist', from: 115000 },
      { name: 'Super Squad', note: 'Themed graphics edition', from: 108000 },
      { name: 'Race Edition', note: 'Bluetooth console', from: 95000 },
    ],
    match: { use: ['college', 'commute'], priority: ['performance', 'tech'] },
  },

  {
    id: 'tvs-iqube',
    brand: 'tvs',
    model: 'iQube',
    name: 'TVS iQube',
    fuel: 'electric',
    type: 'scooter',
    art: 'scooter',
    featured: true,
    _verify: 'medium',
    price: { from: 115000, to: 160000, note: 'Indicative ex-showroom, before subsidy' },
    headline: 'Electric for everyday.',
    blurb:
      'An electric scooter built like a scooter, not a gadget. Flat floor, 32-litre boot, home charging from a standard socket. The figures below are for the 3.4 kWh battery — MM Motors also stocks the smaller and larger packs.',
    quick: [
      { label: 'Battery', value: '3.4', unit: 'kWh' },
      { label: 'Range', value: '100', unit: 'km', q: 'idc' },
      { label: 'Motor', value: '4.4', unit: 'kW peak' },
      { label: 'Kerb weight', value: '118', unit: 'kg' },
      { label: 'Top speed', value: '78', unit: 'km/h', q: 'claimed' },
    ],
    perf: [
      { label: 'Motor power', value: '4.4', unit: 'kW peak' },
      { label: 'Top speed', value: '78', unit: 'km/h', q: 'claimed' },
      { label: 'Range', value: '100', unit: 'km', q: 'idc' },
      { label: 'Riding modes', value: 'Eco', unit: '· Power' },
      { label: 'Reverse assist', value: 'Yes', unit: '' },
    ],
    practical: [
      { label: 'Battery capacity', value: '3.4', unit: 'kWh' },
      { label: 'Charging time', value: '4:30', unit: 'hrs (0–80%)', q: 'claimed' },
      { label: 'Charger', value: '650', unit: 'W onboard' },
      { label: 'Underseat storage', value: '32', unit: 'L' },
      { label: 'Seat height', value: '770', unit: 'mm' },
    ],
    tech: [
      '5-inch TFT touchscreen cluster',
      'TVS SmartXonnect with turn-by-turn navigation',
      'Geo-fencing, ride stats and remote battery status',
      'Q-Park Assist (reverse)',
      'Over-the-air software updates',
      'USB charging port',
    ],
    safety: [
      'Combi-Brake System with regenerative braking',
      'Telescopic front suspension',
      'Tubeless tyres',
      'Battery management system with thermal monitoring',
    ],
    ownership: {
      warranty:
        'Battery warranty is the figure that matters on an EV — confirm the exact term and kilometre cap with MM Motors in writing before purchase',
      service: 'Fewer wear items than petrol · periodic checks at MM Motors service bay',
      finance: 'EMI via MM Motors finance partners',
      exchange: 'Old two-wheeler exchange evaluated in-showroom',
    },
    colours: [
      { name: 'Copper Bronze', paint: '#8C6239', paintDark: '#5A3D22' },
      { name: 'Titan Grey', paint: '#6F747A', paintDark: '#43474C' },
      { name: 'Mercury Grey', paint: '#2C3A4A', paintDark: '#18222D' },
      { name: 'Pearl White', paint: '#EDEBE6', paintDark: '#AFACA6' },
    ],
    variants: [
      { name: '2.2 kWh', note: 'Shorter range, lowest entry price', from: 115000 },
      { name: '3.4 kWh', note: 'The volume variant', from: 132000 },
      { name: 'ST 5.1 kWh', note: 'Longest range, larger TFT', from: 160000 },
    ],
    match: { use: ['commute', 'college', 'family'], priority: ['running-cost', 'tech', 'comfort'] },
  },

  {
    id: 'tvs-radeon',
    brand: 'tvs',
    model: 'Radeon',
    name: 'TVS Radeon',
    fuel: 'petrol',
    type: 'motorcycle',
    art: 'motorcycle',
    featured: false,
    _verify: 'medium',
    price: { from: 74000, to: 84000, note: 'Indicative ex-showroom' },
    headline: 'More kilometres from every litre.',
    blurb:
      'A 110 cc commuter motorcycle with a long, well-padded seat and a genuinely comfortable ride over broken roads. Bought for mileage and for the pillion who has to sit on it every day.',
    quick: [
      { label: 'Engine', value: '109.7', unit: 'cc' },
      { label: 'Mileage', value: '69.3', unit: 'km/l', q: 'claimed' },
      { label: 'Kerb weight', value: '116', unit: 'kg' },
      { label: 'Fuel tank', value: '10', unit: 'L' },
      { label: 'Clearance', value: '180', unit: 'mm' },
    ],
    perf: [
      { label: 'Max power', value: '5.9', unit: 'kW (8.08 PS) @ 7,350 rpm' },
      { label: 'Max torque', value: '8.7', unit: 'Nm @ 4,500 rpm' },
      { label: 'Transmission', value: '4-speed', unit: 'manual' },
    ],
    practical: [
      { label: 'Fuel capacity', value: '10', unit: 'L' },
      { label: 'Seat height', value: '785', unit: 'mm' },
      { label: 'Ground clearance', value: '180', unit: 'mm' },
      { label: 'Seat length', value: 'Long', unit: 'two-up' },
    ],
    tech: [
      'Semi-digital console with econometer',
      'USB charging port on select variants',
      'LED daytime running lamp',
      'Side-stand indicator',
    ],
    safety: [
      'Synchronised braking',
      'Tubeless tyres',
      'Telescopic front suspension with 5-step adjustable rear',
    ],
    ownership: {
      warranty: 'Manufacturer warranty — confirm current term with MM Motors',
      service: 'Periodic service at MM Motors service bay',
      finance: 'EMI via MM Motors finance partners',
      exchange: 'Old two-wheeler exchange evaluated in-showroom',
    },
    colours: [
      { name: 'Royal Blue', paint: '#1E4FA8', paintDark: '#12306A' },
      { name: 'Titanium Grey', paint: '#7B8087', paintDark: '#4A4E54' },
      { name: 'Black Purple', paint: '#26202E', paintDark: '#15111B' },
    ],
    variants: [
      { name: 'Drum', note: 'Base commuter spec', from: 74000 },
      { name: 'Drum Alloy', note: 'Alloy wheels, USB port', from: 79000 },
      { name: 'Disc', note: 'Front disc brake', from: 84000 },
    ],
    match: { use: ['commute', 'work'], priority: ['mileage', 'comfort'] },
  },

  {
    id: 'tvs-apache-rtx-300',
    brand: 'tvs',
    model: 'Apache RTX 300',
    name: 'TVS Apache RTX 300',
    fuel: 'petrol',
    type: 'motorcycle',
    art: 'motorcycle',
    featured: true,
    _verify: 'low',
    price: { from: 200000, to: 235000, note: 'Indicative ex-showroom' },
    headline: 'The long way round, on purpose.',
    blurb:
      'The adventure-tourer in the MM Motors range. A liquid-cooled 300 cc engine, long-travel suspension, ride-by-wire and cruise control — built for a rider whose weekend does not end at the city limits.',
    quick: [
      { label: 'Engine', value: '299', unit: 'cc liquid-cooled' },
      { label: 'Max power', value: '35.6', unit: 'PS', q: 'claimed' },
      { label: 'Max torque', value: '28.5', unit: 'Nm', q: 'claimed' },
      { label: 'Gearbox', value: '6', unit: 'speed' },
      { label: 'Fuel tank', value: '14', unit: 'L' },
    ],
    perf: [
      { label: 'Max power', value: '35.6', unit: 'PS @ 9,000 rpm', q: 'claimed' },
      { label: 'Max torque', value: '28.5', unit: 'Nm @ 7,000 rpm', q: 'claimed' },
      { label: 'Transmission', value: '6-speed', unit: 'with slip-assist clutch' },
      { label: 'Throttle', value: 'Ride', unit: 'by-wire' },
      { label: 'Cooling', value: 'Liquid', unit: 'cooled' },
    ],
    practical: [
      { label: 'Fuel capacity', value: '14', unit: 'L' },
      { label: 'Riding position', value: 'Upright', unit: 'touring' },
      { label: 'Suspension', value: 'Long', unit: 'travel USD fork' },
      { label: 'Luggage', value: 'Mounts', unit: 'for panniers' },
    ],
    tech: [
      'Full-colour TFT cluster with smartphone connectivity',
      'Cruise control',
      'Multiple ride modes',
      'Turn-by-turn navigation',
      'Adjustable levers and windscreen',
      'Type-C charging',
    ],
    safety: [
      'Dual-channel ABS with off-road mode',
      'Traction control',
      'Slip-assist clutch',
      'Dual-purpose tubeless tyres',
    ],
    ownership: {
      warranty: 'Manufacturer warranty — confirm current term with MM Motors',
      service: 'Periodic service at MM Motors service bay · touring-interval servicing available',
      finance: 'EMI via MM Motors finance partners',
      exchange: 'Old two-wheeler exchange evaluated in-showroom',
    },
    colours: [
      { name: 'Sagebrush Green', paint: '#8B9457', paintDark: '#5A6136' },
      { name: 'Pearl White', paint: '#E9E7E2', paintDark: '#ABA8A2' },
      { name: 'Meteor Black', paint: '#1F2226', paintDark: '#101214' },
    ],
    variants: [
      { name: 'Base', note: 'Core touring spec', from: 200000 },
      { name: 'Top', note: 'Full electronics suite', from: 235000 },
    ],
    match: { use: ['touring', 'work'], priority: ['performance', 'tech', 'comfort'] },
  },

  {
    id: 'tvs-xl100',
    brand: 'tvs',
    model: 'XL100',
    name: 'TVS XL100',
    fuel: 'petrol',
    type: 'moped',
    art: 'moped',
    featured: false,
    _verify: 'low',
    price: { from: 52000, to: 60000, note: 'Indicative ex-showroom' },
    headline: 'The one that earns its keep.',
    blurb:
      'Not a lifestyle purchase. A moped that carries a load, starts every morning, costs very little to run and is repaired anywhere. MM Motors sells more of these to small businesses than to anyone else.',
    quick: [
      { label: 'Engine', value: '99.7', unit: 'cc' },
      { label: 'Mileage', value: '70', unit: 'km/l', q: 'claimed' },
      { label: 'Kerb weight', value: '90', unit: 'kg' },
      { label: 'Load rating', value: 'High', unit: 'duty' },
      { label: 'Transmission', value: 'Auto', unit: 'clutchless' },
    ],
    perf: [
      { label: 'Engine', value: '99.7', unit: 'cc, air-cooled' },
      { label: 'Transmission', value: 'Automatic', unit: 'single speed' },
      { label: 'Starting', value: 'Kick', unit: '/ electric on select variants' },
    ],
    practical: [
      { label: 'Carrier', value: 'Front', unit: '+ rear' },
      { label: 'Wheels', value: 'Spoke', unit: 'wire' },
      { label: 'Fuel capacity', value: 'Compact', unit: 'tank' },
    ],
    tech: ['Analogue console', 'Simple, serviceable mechanicals', 'Low running cost'],
    safety: ['Drum brakes front and rear', 'Low seat height for easy footing'],
    ownership: {
      warranty: 'Manufacturer warranty — confirm current term with MM Motors',
      service: 'Low-cost periodic service at MM Motors service bay',
      finance: 'EMI via MM Motors finance partners',
      exchange: 'Old two-wheeler exchange evaluated in-showroom',
    },
    colours: [
      { name: 'Coral Peach', paint: '#E39377', paintDark: '#A8624B' },
      { name: 'Ocean Blue', paint: '#2A6699', paintDark: '#184060' },
      { name: 'Black', paint: '#202327', paintDark: '#111316' },
    ],
    variants: [
      { name: 'Comfort', note: 'Standard spec', from: 52000 },
      { name: 'Heavy Duty', note: 'Reinforced for load carrying', from: 60000 },
    ],
    match: { use: ['work', 'commute'], priority: ['mileage', 'running-cost'] },
  },

  /* ===================== HONDA ===================== */
  {
    id: 'honda-activa',
    brand: 'honda',
    model: 'Activa 110',
    name: 'Honda Activa 110',
    fuel: 'petrol',
    type: 'scooter',
    art: 'scooter',
    featured: true,
    _verify: 'medium',
    price: { from: 82000, to: 94000, note: 'Indicative ex-showroom' },
    headline: 'The one everybody already trusts.',
    blurb:
      'India’s reference-point scooter. Nothing about it is exciting and that is precisely the appeal — it is the smoothest, quietest, most predictable thing on this floor, and resale is the strongest in the category.',
    quick: [
      { label: 'Engine', value: '109.51', unit: 'cc' },
      { label: 'Mileage', value: '47', unit: 'km/l', q: 'claimed' },
      { label: 'Kerb weight', value: '106', unit: 'kg' },
      { label: 'Fuel tank', value: '5.3', unit: 'L' },
      { label: 'Clearance', value: '171', unit: 'mm' },
    ],
    perf: [
      { label: 'Max power', value: '5.7', unit: 'kW (7.79 PS) @ 8,000 rpm' },
      { label: 'Max torque', value: '8.90', unit: 'Nm @ 5,250 rpm' },
      { label: 'Transmission', value: 'CVT', unit: 'automatic' },
      { label: 'Engine tech', value: 'eSP', unit: 'enhanced smart power' },
    ],
    practical: [
      { label: 'Fuel capacity', value: '5.3', unit: 'L' },
      { label: 'Seat height', value: '765', unit: 'mm' },
      { label: 'Ground clearance', value: '171', unit: 'mm' },
      { label: 'External fuel fill', value: 'Yes', unit: '' },
    ],
    tech: [
      'Silent start (ACG starter) — no starter whine',
      'Digital-analogue meter with real-time mileage',
      'External fuel lid',
      'LED headlamp',
      'Side-stand engine cut-off',
    ],
    safety: [
      'Combi-Brake System with Equalizer',
      'Telescopic front suspension',
      'Tubeless tyres',
      'Side-stand indicator with engine inhibitor',
    ],
    ownership: {
      warranty: 'Manufacturer warranty — confirm current term with MM Motors',
      service: 'Periodic service at MM Motors service bay',
      finance: 'EMI via MM Motors finance partners',
      exchange: 'Old two-wheeler exchange evaluated in-showroom',
    },
    colours: [
      { name: 'Pearl Siena Blue', paint: '#264F8C', paintDark: '#152F57' },
      { name: 'Rebel Red Metallic', paint: '#9C2230', paintDark: '#65131C' },
      { name: 'Pearl Precious White', paint: '#EEECE8', paintDark: '#B0ADA8' },
      { name: 'Black', paint: '#1C1F23', paintDark: '#0E1013' },
    ],
    variants: [
      { name: 'Drum', note: 'Standard spec', from: 82000 },
      { name: 'Drum Alloy', note: 'Alloy wheels', from: 87000 },
      { name: 'Disc', note: 'Front disc brake, LED', from: 94000 },
    ],
    match: { use: ['commute', 'family', 'college'], priority: ['comfort', 'mileage'] },
  },

  {
    id: 'honda-activa-125',
    brand: 'honda',
    model: 'Activa 125',
    name: 'Honda Activa 125',
    fuel: 'petrol',
    type: 'scooter',
    art: 'scooter',
    featured: false,
    _verify: 'medium',
    price: { from: 94000, to: 105000, note: 'Indicative ex-showroom' },
    headline: 'Refinement, with a bigger engine behind it.',
    blurb:
      'The Activa for riders who carry a pillion daily or ride longer distances. Same silence and same smoothness, more torque low down, and a slightly more substantial feel on the road.',
    quick: [
      { label: 'Engine', value: '123.92', unit: 'cc' },
      { label: 'Mileage', value: '47', unit: 'km/l', q: 'claimed' },
      { label: 'Kerb weight', value: '111', unit: 'kg' },
      { label: 'Fuel tank', value: '5.3', unit: 'L' },
      { label: 'Max torque', value: '10.4', unit: 'Nm' },
    ],
    perf: [
      { label: 'Max power', value: '6.1', unit: 'kW (8.29 PS) @ 6,500 rpm' },
      { label: 'Max torque', value: '10.4', unit: 'Nm @ 5,000 rpm' },
      { label: 'Transmission', value: 'CVT', unit: 'automatic' },
      { label: 'Engine tech', value: 'eSP', unit: 'with silent start' },
    ],
    practical: [
      { label: 'Fuel capacity', value: '5.3', unit: 'L' },
      { label: 'Seat height', value: '770', unit: 'mm' },
      { label: 'Ground clearance', value: '162', unit: 'mm' },
      { label: 'External fuel fill', value: 'Yes', unit: '' },
    ],
    tech: [
      'Silent start (ACG starter)',
      'Fully digital cluster on higher variants',
      'Bluetooth connectivity on top variant',
      'LED headlamp with position lamp',
      'USB charging socket',
    ],
    safety: [
      'Combi-Brake System with Equalizer',
      'Front disc brake on Disc variant',
      'Telescopic front suspension',
      'Tubeless tyres',
    ],
    ownership: {
      warranty: 'Manufacturer warranty — confirm current term with MM Motors',
      service: 'Periodic service at MM Motors service bay',
      finance: 'EMI via MM Motors finance partners',
      exchange: 'Old two-wheeler exchange evaluated in-showroom',
    },
    colours: [
      { name: 'Pearl Deep Ground Grey', paint: '#4A4E54', paintDark: '#2A2D31' },
      { name: 'Maroon Metallic', paint: '#6D2130', paintDark: '#44121D' },
      { name: 'Pearl Precious White', paint: '#EEECE8', paintDark: '#B0ADA8' },
    ],
    variants: [
      { name: 'Drum', note: 'Standard spec', from: 94000 },
      { name: 'Disc', note: 'Front disc brake', from: 100000 },
      { name: 'H-Smart', note: 'Smart key, Bluetooth', from: 105000 },
    ],
    match: { use: ['commute', 'family'], priority: ['comfort', 'performance'] },
  },

  {
    id: 'honda-sp-125',
    brand: 'honda',
    model: 'SP 125',
    name: 'Honda SP 125',
    fuel: 'petrol',
    type: 'motorcycle',
    art: 'motorcycle',
    featured: true,
    _verify: 'low',
    price: { from: 92000, to: 100000, note: 'Indicative ex-showroom' },
    headline: 'Efficiency without feeling slow.',
    blurb:
      'The sensible 125 that still pulls cleanly onto a highway. Honda’s eSP engine keeps vibration low at commuting speeds, and the full-digital console tells you your real mileage rather than guessing at it.',
    quick: [
      { label: 'Engine', value: '123.94', unit: 'cc' },
      { label: 'Mileage', value: '65', unit: 'km/l', q: 'claimed' },
      { label: 'Max power', value: '10.72', unit: 'PS', q: 'claimed' },
      { label: 'Kerb weight', value: '117', unit: 'kg' },
      { label: 'Fuel tank', value: '11.2', unit: 'L' },
    ],
    perf: [
      { label: 'Max power', value: '7.9', unit: 'kW (10.72 PS) @ 7,500 rpm' },
      { label: 'Max torque', value: '10.9', unit: 'Nm @ 6,000 rpm' },
      { label: 'Transmission', value: '5-speed', unit: 'manual' },
      { label: 'Engine tech', value: 'eSP', unit: 'with silent start' },
    ],
    practical: [
      { label: 'Fuel capacity', value: '11.2', unit: 'L' },
      { label: 'Seat height', value: '790', unit: 'mm' },
      { label: 'Ground clearance', value: '160', unit: 'mm' },
    ],
    tech: [
      'Fully digital console with real-time and average mileage',
      'Silent start (ACG starter)',
      'LED headlamp',
      'Engine stop switch',
      'Side-stand indicator',
    ],
    safety: [
      'Combi-Brake System with Equalizer',
      'Front disc brake on Disc variant',
      'Tubeless tyres',
      'Telescopic front forks',
    ],
    ownership: {
      warranty: 'Manufacturer warranty — confirm current term with MM Motors',
      service: 'Periodic service at MM Motors service bay',
      finance: 'EMI via MM Motors finance partners',
      exchange: 'Old two-wheeler exchange evaluated in-showroom',
    },
    colours: [
      { name: 'Imperial Red Metallic', paint: '#B3202A', paintDark: '#761218' },
      { name: 'Pearl Igneous Black', paint: '#1B1E22', paintDark: '#0D0F12' },
      { name: 'Matte Axis Grey', paint: '#565B61', paintDark: '#33373B' },
    ],
    variants: [
      { name: 'Drum', note: 'Standard spec', from: 92000 },
      { name: 'Disc', note: 'Front disc brake', from: 100000 },
    ],
    match: { use: ['commute', 'work', 'touring'], priority: ['mileage', 'performance'] },
  },

  {
    id: 'honda-shine',
    brand: 'honda',
    model: 'Shine 125',
    name: 'Honda Shine 125',
    fuel: 'petrol',
    type: 'motorcycle',
    art: 'motorcycle',
    featured: false,
    _verify: 'low',
    price: { from: 88000, to: 96000, note: 'Indicative ex-showroom' },
    headline: 'Ten years of the same answer.',
    blurb:
      'The commuter motorcycle MM Motors recommends when somebody says "I just don’t want trouble." Long seat, soft ride, unremarkable in the best possible way, and it holds its value.',
    quick: [
      { label: 'Engine', value: '123.94', unit: 'cc' },
      { label: 'Mileage', value: '65', unit: 'km/l', q: 'claimed' },
      { label: 'Max power', value: '10.59', unit: 'PS', q: 'claimed' },
      { label: 'Kerb weight', value: '114', unit: 'kg' },
      { label: 'Fuel tank', value: '10.5', unit: 'L' },
    ],
    perf: [
      { label: 'Max power', value: '7.8', unit: 'kW (10.59 PS) @ 7,500 rpm' },
      { label: 'Max torque', value: '11.0', unit: 'Nm @ 6,000 rpm' },
      { label: 'Transmission', value: '5-speed', unit: 'manual' },
    ],
    practical: [
      { label: 'Fuel capacity', value: '10.5', unit: 'L' },
      { label: 'Seat height', value: '791', unit: 'mm' },
      { label: 'Ground clearance', value: '162', unit: 'mm' },
    ],
    tech: [
      'Semi-digital console',
      'Silent start (ACG starter)',
      'Side-stand indicator',
      'Engine stop switch',
    ],
    safety: [
      'Combi-Brake System with Equalizer',
      'Tubeless tyres',
      'Telescopic front forks',
      'Optional front disc brake',
    ],
    ownership: {
      warranty: 'Manufacturer warranty — confirm current term with MM Motors',
      service: 'Periodic service at MM Motors service bay',
      finance: 'EMI via MM Motors finance partners',
      exchange: 'Old two-wheeler exchange evaluated in-showroom',
    },
    colours: [
      { name: 'Pearl Igneous Black', paint: '#1A1D21', paintDark: '#0C0E11' },
      { name: 'Geny Grey Metallic', paint: '#5C6167', paintDark: '#373B40' },
      { name: 'Imperial Red Metallic', paint: '#A7202A', paintDark: '#6E1218' },
    ],
    variants: [
      { name: 'Drum', note: 'Standard spec', from: 88000 },
      { name: 'Disc', note: 'Front disc brake', from: 96000 },
    ],
    match: { use: ['commute', 'work'], priority: ['mileage', 'comfort'] },
  },

  {
    id: 'honda-livo',
    brand: 'honda',
    model: 'Livo',
    name: 'Honda Livo',
    fuel: 'petrol',
    type: 'motorcycle',
    art: 'motorcycle',
    featured: false,
    _verify: 'low',
    price: { from: 80000, to: 88000, note: 'Indicative ex-showroom' },
    headline: 'A commuter that looks like it wants to be ridden.',
    blurb:
      'Honda’s 110 cc commuter with sharper bodywork and graphics than the category usually allows. Same efficiency brief as the rest, aimed at a younger first-time buyer.',
    quick: [
      { label: 'Engine', value: '109.51', unit: 'cc' },
      { label: 'Mileage', value: '65', unit: 'km/l', q: 'claimed' },
      { label: 'Max power', value: '8.79', unit: 'PS', q: 'claimed' },
      { label: 'Kerb weight', value: '112', unit: 'kg' },
      { label: 'Fuel tank', value: '9.1', unit: 'L' },
    ],
    perf: [
      { label: 'Max power', value: '6.5', unit: 'kW (8.79 PS) @ 7,500 rpm' },
      { label: 'Max torque', value: '9.30', unit: 'Nm @ 5,500 rpm' },
      { label: 'Transmission', value: '4-speed', unit: 'manual' },
    ],
    practical: [
      { label: 'Fuel capacity', value: '9.1', unit: 'L' },
      { label: 'Seat height', value: '790', unit: 'mm' },
      { label: 'Ground clearance', value: '179', unit: 'mm' },
    ],
    tech: [
      'Semi-digital console',
      'LED headlamp on select variants',
      'Silent start (ACG starter)',
      'Side-stand indicator',
    ],
    safety: ['Combi-Brake System with Equalizer', 'Tubeless tyres', 'Telescopic front forks'],
    ownership: {
      warranty: 'Manufacturer warranty — confirm current term with MM Motors',
      service: 'Periodic service at MM Motors service bay',
      finance: 'EMI via MM Motors finance partners',
      exchange: 'Old two-wheeler exchange evaluated in-showroom',
    },
    colours: [
      { name: 'Pearl Siren Blue', paint: '#1F3F78', paintDark: '#12264A' },
      { name: 'Black with Neon', paint: '#1C1F24', paintDark: '#0E1013' },
      { name: 'Imperial Red', paint: '#A6222B', paintDark: '#6C1319' },
    ],
    variants: [
      { name: 'Drum', note: 'Standard spec', from: 80000 },
      { name: 'Disc', note: 'Front disc brake', from: 88000 },
    ],
    match: { use: ['commute', 'college'], priority: ['mileage', 'performance'] },
  },

  /* ===================== BAJAJ ===================== */
  {
    id: 'bajaj-chetak',
    brand: 'bajaj',
    model: 'Chetak',
    name: 'Bajaj Chetak',
    fuel: 'electric',
    type: 'scooter',
    art: 'scooter',
    featured: false,
    _verify: 'low',
    price: { from: 115000, to: 135000, note: 'Indicative ex-showroom, before subsidy' },
    headline: 'Electric, with a metal body.',
    blurb:
      'The only scooter here with pressed-steel panels rather than plastic, and it feels it. Retro on purpose, quiet by nature, built around a shape people already trust. Figures below are for the larger battery.',
    quick: [
      { label: 'Battery', value: '3.2', unit: 'kWh' },
      { label: 'Range', value: '127', unit: 'km', q: 'idc' },
      { label: 'Motor', value: '4.2', unit: 'kW peak' },
      { label: 'Kerb weight', value: '134', unit: 'kg' },
      { label: 'Top speed', value: '63', unit: 'km/h', q: 'claimed' },
    ],
    perf: [
      { label: 'Motor power', value: '4.2', unit: 'kW peak' },
      { label: 'Top speed', value: '63', unit: 'km/h', q: 'claimed' },
      { label: 'Range', value: '127', unit: 'km', q: 'idc' },
      { label: 'Riding modes', value: 'Eco', unit: 'and Sport' },
    ],
    practical: [
      { label: 'Battery capacity', value: '3.2', unit: 'kWh' },
      { label: 'Charging time', value: '3:30', unit: 'hrs', q: 'claimed' },
      { label: 'Underseat storage', value: '35', unit: 'L' },
      { label: 'Body panels', value: 'Pressed', unit: 'steel' },
    ],
    tech: [
      'TFT colour display on higher variants',
      'Bluetooth connectivity and ride statistics',
      'Reverse assist',
      'Keyless start',
      'Hill-hold assist',
    ],
    safety: [
      'Combi-Brake System with regenerative braking',
      'Front disc brake',
      'Tubeless tyres',
      'Battery management system with thermal monitoring',
    ],
    ownership: {
      warranty:
        'Battery warranty is the figure that matters on an EV — confirm the exact term and kilometre cap with MM Motors in writing before purchase',
      service: 'Fewer wear items than petrol · periodic checks at MM Motors service bay',
      finance: 'EMI via MM Motors finance partners',
      exchange: 'Old two-wheeler exchange evaluated in-showroom',
    },
    colours: [
      { name: 'Indigo Metallic', paint: '#1E8C8C', paintDark: '#12595A' },
      { name: 'Brooklyn Black', paint: '#1C1F23', paintDark: '#0E1013' },
      { name: 'Hazelnut', paint: '#9C7B57', paintDark: '#654E36' },
    ],
    variants: [
      { name: '2903', note: 'Smaller battery', from: 115000 },
      { name: '3501', note: 'Larger battery, TFT display', from: 135000 },
    ],
    match: { use: ['commute', 'family'], priority: ['running-cost', 'comfort', 'storage'] },
  },

  {
    id: 'bajaj-pulsar-ns200',
    brand: 'bajaj',
    model: 'Pulsar NS200',
    name: 'Bajaj Pulsar NS200',
    fuel: 'petrol',
    type: 'motorcycle',
    art: 'motorcycle',
    featured: true,
    _verify: 'low',
    price: { from: 150000, to: 160000, note: 'Indicative ex-showroom' },
    headline: 'The one that is not a commuter.',
    blurb:
      'A liquid-cooled 200 on a perimeter frame with a genuinely quick engine. Not the sensible choice on this floor and not pretending to be — this is what people buy because they want to ride, not merely to arrive.',
    quick: [
      { label: 'Engine', value: '199.5', unit: 'cc liquid-cooled' },
      { label: 'Max power', value: '24.5', unit: 'PS', q: 'claimed' },
      { label: 'Max torque', value: '18.74', unit: 'Nm', q: 'claimed' },
      { label: 'Kerb weight', value: '158', unit: 'kg' },
      { label: 'Fuel tank', value: '12', unit: 'L' },
    ],
    perf: [
      { label: 'Max power', value: '24.5', unit: 'PS @ 9,750 rpm', q: 'claimed' },
      { label: 'Max torque', value: '18.74', unit: 'Nm @ 8,000 rpm', q: 'claimed' },
      { label: 'Transmission', value: '6-speed', unit: 'manual' },
      { label: 'Cooling', value: 'Liquid', unit: 'cooled' },
    ],
    practical: [
      { label: 'Fuel capacity', value: '12', unit: 'L' },
      { label: 'Seat height', value: '805', unit: 'mm' },
      { label: 'Ground clearance', value: '168', unit: 'mm' },
      { label: 'Frame', value: 'Perimeter', unit: 'steel' },
    ],
    tech: [
      'Semi-digital console',
      'LED projector headlamp on current variants',
      'USB charging on select variants',
      'Gear position and shift indicator',
    ],
    safety: [
      'Dual-channel ABS on higher variants',
      'Front and rear disc brakes',
      'Petal discs and tubeless tyres',
      'Gas-charged rear monoshock',
    ],
    ownership: {
      warranty: 'Manufacturer warranty — confirm current term with MM Motors',
      service: 'Periodic service at MM Motors service bay',
      finance: 'EMI via MM Motors finance partners',
      exchange: 'Old two-wheeler exchange evaluated in-showroom',
    },
    colours: [
      { name: 'Pewter Grey', paint: '#4E5257', paintDark: '#2D3034' },
      { name: 'Burnt Red', paint: '#A82722', paintDark: '#6E1714' },
      { name: 'Metallic Black', paint: '#1A1D21', paintDark: '#0C0E11' },
    ],
    variants: [
      { name: 'Single-channel ABS', note: 'Base spec', from: 150000 },
      { name: 'Dual-channel ABS', note: 'Rear-wheel ABS added', from: 160000 },
    ],
    match: { use: ['college', 'touring'], priority: ['performance'] },
  },

  /* ===================== ROYAL ENFIELD ===================== */
  {
    id: 're-classic-350',
    brand: 'royalenfield',
    model: 'Classic 350',
    name: 'Royal Enfield Classic 350',
    fuel: 'petrol',
    type: 'motorcycle',
    art: 'motorcycle',
    featured: true,
    _verify: 'medium',
    price: { from: 199000, to: 232000, note: 'Indicative ex-showroom' },
    headline: 'Bought for how it feels.',
    blurb:
      'Heavy, unhurried, and completely unbothered about it. The J-series engine is far smoother than the Classic’s reputation suggests. Sit on one before you decide — at 195 kg this is a different proposition to everything else on the floor.',
    quick: [
      { label: 'Engine', value: '349', unit: 'cc' },
      { label: 'Max power', value: '20.2', unit: 'PS', q: 'claimed' },
      { label: 'Max torque', value: '27', unit: 'Nm', q: 'claimed' },
      { label: 'Kerb weight', value: '195', unit: 'kg' },
      { label: 'Fuel tank', value: '13', unit: 'L' },
    ],
    perf: [
      { label: 'Max power', value: '20.2', unit: 'PS @ 6,100 rpm', q: 'claimed' },
      { label: 'Max torque', value: '27', unit: 'Nm @ 4,000 rpm', q: 'claimed' },
      { label: 'Transmission', value: '5-speed', unit: 'manual' },
      { label: 'Engine', value: 'J-series', unit: 'single, air-oil cooled' },
    ],
    practical: [
      { label: 'Fuel capacity', value: '13', unit: 'L' },
      { label: 'Seat height', value: '805', unit: 'mm' },
      { label: 'Ground clearance', value: '170', unit: 'mm' },
      { label: 'Kerb weight', value: '195', unit: 'kg — check you can hold it' },
    ],
    tech: [
      'Analogue dial with a small digital inset',
      'Tripper turn-by-turn navigation on higher variants',
      'USB charging port',
      'Extensive factory accessory range',
    ],
    safety: [
      'Dual-channel ABS',
      'Front and rear disc brakes',
      'Tubeless tyres on alloy-wheel variants',
    ],
    ownership: {
      warranty: 'Manufacturer warranty — confirm current term with MM Motors',
      service: 'Periodic service at MM Motors service bay',
      finance: 'EMI via MM Motors finance partners',
      exchange: 'Old two-wheeler exchange evaluated in-showroom',
    },
    colours: [
      { name: 'Chrome Silver', paint: '#B9BDC2', paintDark: '#7D8186' },
      { name: 'Redditch Red', paint: '#8E2B2B', paintDark: '#5C1A1A' },
      { name: 'Stealth Black', paint: '#1B1E22', paintDark: '#0D0F12' },
    ],
    variants: [
      { name: 'Halcyon', note: 'Spoke wheels, single-channel ABS', from: 199000 },
      { name: 'Signals', note: 'Alloy wheels, dual-channel ABS', from: 216000 },
      { name: 'Chrome', note: 'Chrome tank, Tripper navigation', from: 232000 },
    ],
    match: { use: ['touring'], priority: ['comfort', 'performance'] },
  },

  {
    id: 're-continental-gt-650',
    brand: 'royalenfield',
    model: 'Continental GT 650',
    name: 'Royal Enfield Continental GT 650',
    fuel: 'petrol',
    type: 'motorcycle',
    art: 'motorcycle',
    featured: false,
    _verify: 'medium',
    price: { from: 320000, to: 360000, note: 'Indicative ex-showroom' },
    headline: 'A twin, and a riding position with opinions.',
    blurb:
      'The most powerful thing MM Motors sells. A 648 cc parallel twin with clip-on bars and rear-set pegs — wonderful on an open road, demanding in city traffic. Ride it in both before you decide.',
    quick: [
      { label: 'Engine', value: '648', unit: 'cc parallel twin' },
      { label: 'Max power', value: '47', unit: 'PS', q: 'claimed' },
      { label: 'Max torque', value: '52', unit: 'Nm', q: 'claimed' },
      { label: 'Kerb weight', value: '214', unit: 'kg' },
      { label: 'Fuel tank', value: '12.5', unit: 'L' },
    ],
    perf: [
      { label: 'Max power', value: '47', unit: 'PS @ 7,250 rpm', q: 'claimed' },
      { label: 'Max torque', value: '52', unit: 'Nm @ 5,250 rpm', q: 'claimed' },
      { label: 'Transmission', value: '6-speed', unit: 'with slip-assist clutch' },
      { label: 'Configuration', value: 'Parallel', unit: 'twin, air-oil cooled' },
    ],
    practical: [
      { label: 'Fuel capacity', value: '12.5', unit: 'L' },
      { label: 'Seat height', value: '804', unit: 'mm' },
      { label: 'Riding position', value: 'Clip-ons', unit: 'and rear-set pegs' },
      { label: 'Kerb weight', value: '214', unit: 'kg' },
    ],
    tech: [
      'Twin analogue dials',
      'Tripper turn-by-turn navigation',
      'USB charging port',
      'LED tail lamp',
    ],
    safety: [
      'Dual-channel ABS',
      'Twin-piston front caliper',
      'Tubeless tyres',
      'Slip-assist clutch',
    ],
    ownership: {
      warranty: 'Manufacturer warranty — confirm current term with MM Motors',
      service: 'Periodic service at MM Motors service bay · twin-cylinder servicing',
      finance: 'EMI via MM Motors finance partners',
      exchange: 'Old two-wheeler exchange evaluated in-showroom',
    },
    colours: [
      { name: 'Rocker Red', paint: '#B0231F', paintDark: '#731412' },
      { name: 'British Racing Green', paint: '#1F4A33', paintDark: '#12301F' },
      { name: 'Slipstream Blue', paint: '#2A5C8C', paintDark: '#183857' },
    ],
    variants: [
      { name: 'Standard', note: 'Single-tone', from: 320000 },
      { name: 'Custom', note: 'Dual-tone with chrome detailing', from: 360000 },
    ],
    match: { use: ['touring'], priority: ['performance', 'comfort'] },
  },

  /* ===================== RIVER ===================== */
  {
    id: 'river-indie',
    brand: 'river',
    model: 'Indie',
    name: 'River Indie',
    fuel: 'electric',
    type: 'scooter',
    art: 'scooter',
    featured: true,
    _verify: 'medium',
    price: { from: 143000, to: 153000, note: 'Indicative ex-showroom, before subsidy' },
    headline: 'More movement. Less complexity.',
    blurb:
      'Built around carrying things rather than around looking light. The largest boot on this floor by a wide margin, bolt-on mounting points front and rear, and a deliberately over-engineered feel. The utility EV of the range.',
    quick: [
      { label: 'Battery', value: '4.0', unit: 'kWh' },
      { label: 'Range', value: '161', unit: 'km', q: 'claimed' },
      { label: 'Motor', value: '6.4', unit: 'kW' },
      { label: 'Storage', value: '43', unit: 'L' },
      { label: 'Charging', value: '3.5', unit: 'hrs', q: 'claimed' },
    ],
    perf: [
      { label: 'Motor power', value: '6.4', unit: 'kW' },
      { label: 'Range', value: '161', unit: 'km', q: 'claimed' },
      { label: 'Top speed', value: '90', unit: 'km/h', q: 'claimed' },
      { label: 'Riding modes', value: 'Eco', unit: ', Ride and Rush' },
    ],
    practical: [
      { label: 'Battery capacity', value: '4.0', unit: 'kWh' },
      { label: 'Charging time', value: '3.5', unit: 'hrs', q: 'claimed' },
      { label: 'Underseat storage', value: '43', unit: 'L' },
      { label: 'Kerb weight', value: '124', unit: 'kg' },
      { label: 'Accessory mounts', value: 'Front', unit: 'and rear, bolt-on' },
    ],
    tech: [
      'Digital cluster with ride statistics',
      'Three riding modes',
      'Reverse assist',
      'Modular accessory mounting points',
      'USB charging',
    ],
    safety: [
      'Disc brakes front and rear',
      'Regenerative braking',
      'Tubeless tyres',
      'Battery management system with thermal monitoring',
    ],
    ownership: {
      warranty:
        'Battery warranty is the figure that matters on an EV — confirm the exact term and kilometre cap with MM Motors in writing before purchase',
      service: 'Fewer wear items than petrol · periodic checks at MM Motors service bay',
      finance: 'EMI via MM Motors finance partners',
      exchange: 'Old two-wheeler exchange evaluated in-showroom',
    },
    colours: [
      { name: 'Uphill Grey', paint: '#565B61', paintDark: '#33373B' },
      { name: 'Summit White', paint: '#EAE8E3', paintDark: '#ADAAA4' },
      { name: 'Aqua Blue', paint: '#3FBCD4', paintDark: '#237E92' },
      { name: 'Mud Yellow', paint: '#C9A227', paintDark: '#8A6D14' },
    ],
    variants: [{ name: 'Indie', note: 'Single variant', from: 143000 }],
    match: { use: ['work', 'commute', 'family'], priority: ['storage', 'running-cost', 'tech'] },
  },

  /* ============ HONDA · 350 cc roadster ============ */
  {
    id: 'honda-cb350',
    brand: 'honda',
    model: 'CB350',
    name: 'Honda CB350',
    fuel: 'petrol',
    type: 'motorcycle',
    art: 'motorcycle',
    featured: false,
    _verify: 'medium',
    price: { from: 205000, to: 220000, note: 'Indicative ex-showroom' },
    headline: 'The refined way to do a 350.',
    blurb:
      'Honda’s answer to the retro roadster, and it answers with smoothness. Less character than a Royal Enfield, noticeably less vibration, and a lighter clutch. If the Classic appeals but its weight worries you, ride these two back to back.',
    quick: [
      { label: 'Engine', value: '348.36', unit: 'cc' },
      { label: 'Max power', value: '21', unit: 'PS', q: 'claimed' },
      { label: 'Max torque', value: '30', unit: 'Nm', q: 'claimed' },
      { label: 'Kerb weight', value: '181', unit: 'kg' },
      { label: 'Fuel tank', value: '15', unit: 'L' },
    ],
    perf: [
      { label: 'Max power', value: '21', unit: 'PS @ 5,500 rpm', q: 'claimed' },
      { label: 'Max torque', value: '30', unit: 'Nm @ 3,000 rpm', q: 'claimed' },
      { label: 'Transmission', value: '5-speed', unit: 'with assist-slipper clutch' },
      { label: 'Cooling', value: 'Air', unit: 'cooled single' },
    ],
    practical: [
      { label: 'Fuel capacity', value: '15', unit: 'L' },
      { label: 'Seat height', value: '800', unit: 'mm' },
      { label: 'Ground clearance', value: '166', unit: 'mm' },
      { label: 'Kerb weight', value: '181', unit: 'kg' },
    ],
    tech: [
      'Semi-digital console with gear position indicator',
      'Honda Selectable Torque Control',
      'Bluetooth connectivity on higher variants',
      'Assist-slipper clutch',
      'Side-stand engine cut-off',
    ],
    safety: [
      'Dual-channel ABS',
      'Honda Selectable Torque Control (traction)',
      'Front and rear disc brakes',
      'Tubeless tyres',
    ],
    ownership: {
      warranty: 'Manufacturer warranty — confirm current term with MM Motors',
      service: 'Periodic service at MM Motors service bay',
      finance: 'EMI via MM Motors finance partners',
      exchange: 'Old two-wheeler exchange evaluated in-showroom',
    },
    colours: [
      { name: 'Precious Silver', paint: '#B6BABF', paintDark: '#7A7E83' },
      { name: 'Pearl Night Star Black', paint: '#1A1D21', paintDark: '#0C0E11' },
      { name: 'Matte Steel Black', paint: '#4A4E54', paintDark: '#2A2D31' },
    ],
    variants: [
      { name: 'DLX', note: 'Standard spec', from: 205000 },
      { name: 'DLX Pro', note: 'Bluetooth, dual-tone', from: 220000 },
    ],
    match: { use: ['touring', 'commute'], priority: ['comfort', 'performance'] },
  },
];

/* --------------------------------------------------------------------------
   Derived helpers
   -------------------------------------------------------------------------- */

export const byId = (id) => VEHICLES.find((v) => v.id === id);
export const byBrand = (b) => VEHICLES.filter((v) => v.brand === b);
export const byFuel = (f) => VEHICLES.filter((v) => v.fuel === f);
export const featured = () => VEHICLES.filter((v) => v.featured);

export const imgSrc = (v) => `assets/img/vehicles/${v.id}.png`;

export const priceLabel = (n) =>
  new Intl.NumberFormat('en-IN', { maximumFractionDigits: 0 }).format(n);

/* Headline metric used on cards and in comparison: engine size or battery */
export const powerplant = (v) =>
  v.fuel === 'electric'
    ? { label: 'Battery', value: v.quick.find((q) => /battery/i.test(q.label))?.value ?? '—', unit: 'kWh' }
    : { label: 'Engine', value: v.quick.find((q) => /engine/i.test(q.label))?.value ?? '—', unit: 'cc' };

/* Headline efficiency: mileage or range — never conflated */
export const efficiency = (v) => {
  const m = v.quick.find((q) => /mileage|range/i.test(q.label));
  return m ?? { label: '—', value: '—', unit: '' };
};

/* Counts used in copy. Derived, never written by hand — a hardcoded "12
   models" is wrong the moment a bike is added. */
export const COUNTS = {
  get brands() { return Object.keys(BRANDS).length; },
  get models() { return VEHICLES.length; },
  get petrol() { return VEHICLES.filter((v) => v.fuel === 'petrol').length; },
  get electric() { return VEHICLES.filter((v) => v.fuel === 'electric').length; },
};

const WORDS = ['zero','one','two','three','four','five','six','seven','eight','nine','ten',
  'eleven','twelve','thirteen','fourteen','fifteen','sixteen','seventeen','eighteen',
  'nineteen','twenty'];
export const inWords = (n) => WORDS[n] ?? String(n);

export const USE_CASES = [
  { id: 'commute', label: 'Daily commute', note: 'Same route, every day' },
  { id: 'college', label: 'College', note: 'Style and running cost' },
  { id: 'family', label: 'Family', note: 'Pillion, groceries, school runs' },
  { id: 'work', label: 'Work', note: 'Load, distance, durability' },
  { id: 'touring', label: 'Long rides', note: 'Highways and weekends' },
];

export const PRIORITIES = [
  { id: 'mileage', label: 'Mileage' },
  { id: 'performance', label: 'Performance' },
  { id: 'comfort', label: 'Comfort' },
  { id: 'storage', label: 'Storage' },
  { id: 'tech', label: 'Technology' },
  { id: 'running-cost', label: 'Running cost' },
];

export const BUDGETS = [
  { id: 'b1', label: 'Under ₹80,000', max: 80000 },
  { id: 'b2', label: '₹80,000 – ₹1,00,000', max: 100000 },
  { id: 'b3', label: '₹1,00,000 – ₹1,50,000', max: 150000 },
  { id: 'b4', label: 'Above ₹1,50,000', max: Infinity },
];
