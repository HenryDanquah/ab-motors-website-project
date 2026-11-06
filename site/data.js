// =====================================================
//  AB MOTORS — EDIT YOUR DETAILS, CARS AND PARTS HERE
// =====================================================
const BUSINESS = {
  name: "AB Motors",
  whatsapp: "233500203480",        // WhatsApp: country code 233 + number without the first 0
  phoneDisplay: "050 020 3480",    // number shown on the website
  phoneCall: "+233500203480",      // number used by the "Call" buttons
  location: "Achimota, Accra",
  mapsLink: "https://www.google.com/maps/search/?api=1&query=Achimota%2C+Accra%2C+Ghana",
  hours: "Mon – Sat: 8:00am – 6:00pm",
  currency: "GH₵",
};

// ---------- CARS FOR SALE ----------
// type: "Car" | "SUV" | "Truck"     The first photo is the main photo.
// To add a car: put its photos in site/images/ and copy one block below.
const CARS = [
  {
    id: "jeep-wrangler-willys-2024",
    make: "Jeep", model: "Wrangler Willys", year: 2024,
    price: 900000, type: "SUV",
    condition: "Home Used", mileage: "60,000 miles",
    transmission: "Automatic", fuel: "Petrol", drive: "4×4",
    colour: "Black",
    featured: true,
    highlights: ["4×4 with transfer case", "Large touchscreen display", "Leather seats", "Off-road tyres", "Rear spare wheel"],
    description: "A bold 2024 Jeep Wrangler Willys in black, built for city roads and off-road trips. Four-wheel drive, a modern digital dashboard with large touchscreen, comfortable leather seating for five and rugged all-terrain tyres.",
    images: ["jeep-wrangler-1.jpg", "jeep-wrangler-2.jpg", "jeep-wrangler-3.jpg", "jeep-wrangler-4.jpg", "jeep-wrangler-5.jpg"],
  },
  {
    id: "kia-bongo-2015",
    make: "Kia", model: "Bongo 1.2 Ton", year: 2015,
    price: 230000, type: "Truck",
    condition: "Home Used", mileage: "90,000 miles",
    transmission: "Manual", fuel: "Diesel", drive: "2WD",
    colour: "Blue",
    featured: false,
    highlights: ["1.2-ton load capacity", "Drop-side cargo bed", "Diesel engine", "Twin rear wheels", "Ideal for business and haulage"],
    description: "A strong and reliable 2015 Kia Bongo drop-side truck with 1.2-ton capacity. Manual diesel, perfect for deliveries, market goods, building materials and everyday business haulage.",
    images: ["kia-bongo-1.jpg", "kia-bongo-2.jpg"],
  },
  {
    id: "kia-morning-2016",
    make: "Kia", model: "Morning", year: 2016,
    price: 105000, type: "Car",
    condition: "Home Used", mileage: "60,000 miles",
    transmission: "Automatic", fuel: "Petrol", drive: "FWD",
    colour: "Pearl White",
    featured: false,
    highlights: ["Very fuel efficient", "Automatic gearbox", "Touchscreen radio", "Alloy wheels", "Steering-wheel controls"],
    description: "A clean 2016 Kia Morning in pearl white. Economical, easy to drive and park, with an automatic gearbox, touchscreen media system, alloy wheels and comfortable seats. Ideal first car or Uber/Bolt car.",
    images: ["kia-morning-1.jpg", "kia-morning-2.jpg", "kia-morning-3.jpg", "kia-morning-4.jpg"],
  },
];

// ---------- SPARE PARTS ----------
// Leave empty to show "coming soon". Example:
// { name: "Brake pads (front)", fits: "Kia Morning 2011–2017", price: 280, inStock: true, image: "brake-pads.jpg" },
const PARTS = [];
