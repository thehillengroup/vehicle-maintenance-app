type VehicleModel = {
  name: string;
  trims: string[];
  yearRange?: [number, number];
};

type VehicleMake = {
  make: string;
  models: VehicleModel[];
};

const VEHICLE_CATALOG: VehicleMake[] = [
  {
    make: "Audi",
    models: [
      { name: "A3", trims: ["Premium", "Premium Plus"] },
      { name: "A4", trims: ["Premium", "Premium Plus", "Prestige", "S4"] },
      { name: "A5 Sportback", trims: ["Premium", "Premium Plus", "Prestige", "S5"] },
      { name: "A6", trims: ["Premium", "Premium Plus", "Prestige", "S6"] },
      { name: "A7", trims: ["Premium", "Premium Plus", "Prestige", "S7"] },
      { name: "A8", trims: ["L 55 TFSI quattro", "L 60 TFSI e", "S8"] },
      { name: "Q3", trims: ["Premium", "Premium Plus"] },
      { name: "Q4 e-tron", trims: ["Premium", "Premium Plus", "Prestige"] },
      { name: "Q5", trims: ["Premium", "Premium Plus", "Prestige", "S line"] },
      { name: "Q5 Sportback", trims: ["Premium", "Premium Plus", "Prestige"] },
      { name: "Q7", trims: ["Premium", "Premium Plus", "Prestige"] },
      { name: "Q8", trims: ["Premium", "Premium Plus", "Prestige", "SQ8"] },
      { name: "Q8 e-tron", trims: ["Premium", "Premium Plus", "Prestige"] },
      { name: "Q8 Sportback e-tron", trims: ["Premium", "Premium Plus", "Prestige"] },
      { name: "TT", trims: ["Coupe", "Roadster", "TTS", "TT RS"] },
      { name: "R8", trims: ["V10 Performance RWD", "V10 Performance quattro"] },
      { name: "e-tron GT", trims: ["Premium Plus", "Prestige", "RS e-tron GT"] },
    ],
  },
  {
    make: "BMW",
    models: [
      { name: "2 Series Coupe", trims: ["230i", "230i xDrive", "M240i xDrive"] },
      { name: "3 Series", trims: ["330i", "330e", "M340i", "M3 Competition"] },
      { name: "4 Series Gran Coupe", trims: ["430i", "M440i xDrive"] },
      { name: "5 Series", trims: ["530i", "540i xDrive", "i5 eDrive40", "i5 M60 xDrive"] },
      { name: "7 Series", trims: ["740i", "760i xDrive", "i7 xDrive60", "i7 M70"] },
      { name: "X1", trims: ["xDrive28i", "M35i xDrive"] },
      { name: "X3", trims: ["sDrive30i", "xDrive30i", "M40i", "X3 M Competition"] },
      { name: "X5", trims: ["sDrive40i", "xDrive40i", "xDrive50e", "M60i", "X5 M Competition"] },
      { name: "X7", trims: ["xDrive40i", "M60i", "ALPINA XB7"] },
      { name: "i4", trims: ["eDrive35", "eDrive40", "M50"] },
      { name: "i5", trims: ["eDrive40", "M60 xDrive"] },
      { name: "iX", trims: ["xDrive50", "M60"] },
      { name: "Z4 Roadster", trims: ["sDrive30i", "M40i"] },
    ],
  },
  {
    make: "Chevrolet",
    models: [
      { name: "Blazer", trims: ["2LT", "RS", "Premier"] },
      { name: "Blazer EV", trims: ["LT", "RS", "SS"] },
      { name: "Bolt EUV", trims: ["LT", "Premier", "Redline Edition"] },
      { name: "Camaro", trims: ["1LS", "1LT", "2LT", "3LT", "LT1", "1SS", "2SS", "ZL1"] },
      { name: "Colorado", trims: ["WT", "LT", "Trail Boss", "Z71", "ZR2"] },
      { name: "Corvette", trims: ["1LT", "2LT", "3LT", "Z06 1LZ", "ERay 1LZ"] },
      { name: "Equinox", trims: ["LS", "LT", "RS", "Premier"] },
      { name: "Silverado 1500", trims: ["WT", "Custom", "LT", "RST", "LTZ", "High Country", "Trail Boss", "ZR2"] },
      { name: "Suburban", trims: ["LS", "LT", "RST", "Premier", "High Country", "Z71"] },
      { name: "Tahoe", trims: ["LS", "LT", "RST", "Premier", "High Country", "Z71"] },
      { name: "Trailblazer", trims: ["LS", "LT", "ACTIV", "RS"] },
      { name: "Traverse", trims: ["LS", "LT", "RS", "Premier", "High Country", "Z71"] },
    ],
  },
  {
    make: "Ford",
    models: [
      { name: "Bronco", trims: ["Base", "Big Bend", "Black Diamond", "Outer Banks", "Badlands", "Wildtrak", "Heritage Edition", "Raptor"] },
      { name: "Bronco Sport", trims: ["Base", "Big Bend", "Heritage", "Outer Banks", "Badlands"] },
      { name: "Edge", trims: ["SE", "SEL", "ST-Line", "Titanium", "ST"] },
      { name: "Escape", trims: ["Active", "ST-Line", "ST-Line Select", "ST-Line Elite", "Platinum", "Plug-in Hybrid"] },
      { name: "Expedition", trims: ["XL STX", "XLT", "Limited", "Timberline", "King Ranch", "Platinum"] },
      { name: "Explorer", trims: ["Base", "XLT", "ST-Line", "Limited", "Timberline", "ST", "Platinum"] },
      { name: "F-150", trims: ["XL", "XLT", "Lariat", "King Ranch", "Platinum", "Limited", "Tremor", "Raptor"] },
      { name: "F-150 Lightning", trims: ["Pro", "XLT", "Flash", "Lariat", "Platinum"] },
      { name: "Maverick", trims: ["XL", "XLT", "Lariat", "Tremor Off-Road"] },
      { name: "Mustang", trims: ["EcoBoost", "EcoBoost Premium", "GT", "GT Premium", "Dark Horse", "Mach 1", "Shelby GT500"] },
      { name: "Mustang Mach-E", trims: ["Select", "Premium", "California Route 1", "GT", "GT Performance Edition"] },
      { name: "Ranger", trims: ["XL", "XLT", "Lariat", "Raptor"] },
      { name: "Super Duty F-250", trims: ["XL", "XLT", "Lariat", "King Ranch", "Platinum", "Limited"] },
      { name: "Super Duty F-350", trims: ["XL", "XLT", "Lariat", "King Ranch", "Platinum", "Limited"] },
      { name: "Super Duty F-450", trims: ["XL", "XLT", "Lariat", "King Ranch", "Platinum", "Limited"] },
      { name: "Transit", trims: ["Cargo Van", "Crew Van", "Passenger Van XL", "Passenger Van XLT"] },
    ],
  },
  {
    make: "Honda",
    models: [
      { name: "Accord", trims: ["LX", "EX", "Sport Hybrid", "Sport-L Hybrid", "Touring Hybrid"] },
      { name: "Civic Sedan", trims: ["Sport", "EX", "Touring"] },
      { name: "Civic Hatchback", trims: ["Sport", "Sport Touring"] },
      { name: "Civic Type R", trims: ["Type R"] },
      { name: "CR-V", trims: ["LX", "EX", "EX-L", "Sport-L Hybrid", "Sport Touring Hybrid"] },
      { name: "HR-V", trims: ["LX", "Sport", "EX-L"] },
      { name: "Passport", trims: ["EX-L", "TrailSport", "Black Edition"] },
      { name: "Pilot", trims: ["Sport", "EX-L", "TrailSport", "Touring", "Elite"] },
      { name: "Ridgeline", trims: ["Sport", "RTL", "RTL-E", "Black Edition", "TrailSport"] },
      { name: "Odyssey", trims: ["EX", "EX-L", "Sport", "Touring", "Elite"] },
    ],
  },
  {
    make: "Jaguar",
    models: [
      { name: "E-PACE", trims: ["P250 AWD", "R-Dynamic SE"] },
      { name: "F-PACE", trims: ["P250 AWD", "R-Dynamic S", "SVR"] },
      { name: "F-TYPE Coupe", trims: ["R-Dynamic", "R75"] },
      { name: "F-TYPE Convertible", trims: ["R-Dynamic", "R75"] },
      { name: "I-PACE", trims: ["R-Dynamic HSE", "R-Dynamic SE"] },
      { name: "XE", trims: ["P250 S", "P300 R-Dynamic S"] },
      { name: "XF", trims: ["P250 S", "P300 R-Dynamic SE"] },
    ],
  },
  {
    make: "Jeep",
    models: [
      {
        name: "Cherokee",
        trims: [
          "Latitude",
          "Latitude Lux",
          "Latitude Plus",
          "Altitude",
          "Limited",
          "Trailhawk",
          "Overland",
        ],
      },
      { name: "Compass", trims: ["Sport", "Latitude", "Latitude Lux", "Limited", "Trailhawk", "High Altitude"] },
      { name: "Gladiator", trims: ["Sport", "Willys", "Overland", "Mojave", "Rubicon"] },
      { name: "Grand Cherokee", trims: ["Laredo", "Altitude", "Limited", "Overland", "Summit", "Summit Reserve", "Trailhawk"] },
      { name: "Grand Cherokee 4xe", trims: ["Base 4xe", "Trailhawk", "Overland", "Summit", "Summit Reserve"] },
      { name: "Grand Cherokee L", trims: ["Laredo", "Altitude", "Limited", "Overland", "Summit", "Summit Reserve"] },
      { name: "Grand Wagoneer", trims: ["Series I", "Series II", "Series III", "Obsidian"] },
      { name: "Renegade", trims: ["Latitude", "Upland", "Trailhawk", "Limited"] },
      { name: "Wagoneer", trims: ["Base", "Series II", "Series III"] },
      { name: "Wrangler 2-Door", trims: ["Sport", "Sport S", "Willys", "Rubicon"] },
      { name: "Wrangler 4-Door", trims: ["Sport", "Sport S", "Sahara", "Rubicon", "Rubicon 392"] },
      { name: "Wrangler 4xe", trims: ["Sport S", "Willys", "Sahara", "Rubicon", "High Altitude"] },
    ],
  },
  {
    make: "Kia",
    models: [
      { name: "Carnival", trims: ["LX", "LX Seat Package", "EX", "SX", "SX Prestige"] },
      { name: "EV6", trims: ["Light RWD", "Light Long Range", "Wind", "GT-Line", "GT"] },
      { name: "EV9", trims: ["Light", "Wind", "Land", "GT-Line"] },
      { name: "Forte", trims: ["LX", "LXS", "GT-Line", "GT"] },
      { name: "K5", trims: ["LXS", "GT-Line", "EX", "GT"] },
      { name: "Niro", trims: ["LX", "EX", "EX Touring", "SX", "SX Touring"] },
      { name: "Seltos", trims: ["LX", "S", "EX", "X-Line", "SX"] },
      { name: "Sorento", trims: ["LX", "S", "EX", "SX", "SX Prestige", "X-Line EX", "X-Line SX Prestige"] },
      { name: "Sorento Hybrid", trims: ["EX", "SX Prestige"] },
      { name: "Sportage", trims: ["LX", "EX", "X-Line", "SX Prestige", "X-Pro Prestige"] },
      { name: "Telluride", trims: ["LX", "S", "EX", "EX X-Line", "SX", "SX Prestige", "SX X-Pro", "SX Prestige X-Pro"] },
      { name: "Soul", trims: ["LX", "S", "GT-Line", "EX"] },
      { name: "Stinger", trims: ["GT-Line", "GT2"] },
    ],
  },
  {
    make: "Lexus",
    models: [
      { name: "ES", trims: ["ES 250 AWD", "ES 350", "ES 300h"] },
      { name: "IS", trims: ["IS 300", "IS 350 F SPORT Design", "IS 500 F SPORT Performance"] },
      { name: "LC", trims: ["LC 500", "LC 500h"] },
      { name: "LS", trims: ["LS 500", "LS 500 F SPORT", "LS 500h"] },
      { name: "LX", trims: ["LX 600", "LX 600 F SPORT Handling", "LX 600 Ultra Luxury"] },
      { name: "NX", trims: ["NX 250", "NX 350", "NX 350h", "NX 350 F SPORT Handling", "NX 450h+"] },
      { name: "RC", trims: ["RC 300", "RC 350 F SPORT", "RC F"] },
      { name: "RZ", trims: ["RZ 450e Premium", "RZ 450e Luxury"] },
      { name: "TX", trims: ["TX 350", "TX 350h", "TX 500h F SPORT Performance", "TX 550h+"] },
      { name: "UX", trims: ["UX 250h Premium", "UX 250h F SPORT Design"] },
      { name: "GX", trims: ["GX 550 Premium", "GX 550 Overtrail", "GX 550 Luxury"] },
      { name: "RX", trims: ["RX 350", "RX 350h", "RX 350 F SPORT Handling", "RX 500h F SPORT Performance"] },
    ],
  },
  {
    make: "Mercedes-Benz",
    models: [
      { name: "A-Class", trims: ["A 220", "A 220 4MATIC"] },
      { name: "C-Class Sedan", trims: ["C 300", "C 300 4MATIC", "AMG C 43"] },
      { name: "CLA Coupe", trims: ["CLA 250", "CLA 250 4MATIC", "AMG CLA 35", "AMG CLA 45"] },
      { name: "CLS Coupe", trims: ["CLS 450 4MATIC", "AMG CLS 53"] },
      { name: "E-Class Sedan", trims: ["E 350 4MATIC", "E 450 4MATIC", "AMG E 53"] },
      { name: "EQB SUV", trims: ["EQB 300 4MATIC", "EQB 350 4MATIC"] },
      { name: "EQE Sedan", trims: ["EQE 350+", "EQE 350 4MATIC", "EQE 500 4MATIC", "AMG EQE"] },
      { name: "EQE SUV", trims: ["EQE 350+", "EQE 350 4MATIC", "EQE 500 4MATIC"] },
      { name: "EQS Sedan", trims: ["EQS 450+", "EQS 450 4MATIC", "EQS 580 4MATIC", "AMG EQS"] },
      { name: "EQS SUV", trims: ["EQS 450+", "EQS 450 4MATIC", "EQS 580 4MATIC", "Maybach EQS 680"] },
      { name: "G-Class", trims: ["G 550", "AMG G 63"] },
      { name: "GLA SUV", trims: ["GLA 250", "GLA 250 4MATIC", "AMG GLA 35"] },
      { name: "GLB SUV", trims: ["GLB 250", "GLB 250 4MATIC", "AMG GLB 35"] },
      { name: "GLC SUV", trims: ["GLC 300 4MATIC", "AMG GLC 43"] },
      { name: "GLE SUV", trims: ["GLE 350 4MATIC", "GLE 450 4MATIC", "AMG GLE 53", "AMG GLE 63 S"] },
      { name: "GLS SUV", trims: ["GLS 450 4MATIC", "GLS 580 4MATIC", "AMG GLS 63", "Maybach GLS 600"] },
      { name: "S-Class Sedan", trims: ["S 500 4MATIC", "S 580 4MATIC", "Maybach S 680"] },
      { name: "AMG GT", trims: ["AMG GT 55 4MATIC+", "AMG GT 63 4MATIC+"] },
    ],
  },
  {
    make: "Nissan",
    models: [
      { name: "Altima", trims: ["S", "SV", "SR", "SL", "SR VC-Turbo"] },
      { name: "Ariya", trims: ["Engage", "Engage e-4ORCE", "Evolve+", "Empower+", "Platinum+"] },
      { name: "Frontier", trims: ["S", "SV", "Tremor", "PRO-X", "PRO-4X"] },
      { name: "GT-R", trims: ["Premium", "Nismo"] },
      { name: "Kicks", trims: ["S", "SV", "SR"] },
      { name: "Leaf", trims: ["S", "SV Plus"] },
      { name: "Maxima", trims: ["SV", "SR", "Platinum"] },
      { name: "Murano", trims: ["S", "SV", "SL", "Platinum"] },
      { name: "Pathfinder", trims: ["S", "SV", "Rock Creek", "SL", "Platinum"] },
      { name: "Rogue", trims: ["S", "SV", "SL", "Platinum"] },
      { name: "Sentra", trims: ["S", "SV", "SR"] },
      { name: "Titan", trims: ["S", "SV", "Pro-4X", "Platinum Reserve"] },
      { name: "Titan XD", trims: ["S", "SV", "Pro-4X", "Platinum Reserve"] },
      { name: "Versa", trims: ["S", "SV", "SR"] },
      { name: "Z", trims: ["Sport", "Performance", "Proto Spec", "Nismo"] },
      { name: "Armada", trims: ["S", "SV", "SL", "Platinum"] },
    ],
  },
  {
    make: "Porsche",
    models: [
      { name: "718 Boxster", trims: ["Base", "Boxster T", "Boxster S", "Boxster GTS 4.0", "Boxster Spyder"] },
      { name: "718 Cayman", trims: ["Cayman", "Cayman T", "Cayman S", "Cayman GTS 4.0", "Cayman GT4", "Cayman GT4 RS"] },
      { name: "911", trims: ["Carrera", "Carrera T", "Carrera S", "Carrera GTS", "Targa 4", "Targa 4S", "Turbo", "Turbo S", "GT3", "GT3 RS", "S/T"] },
      { name: "Cayenne", trims: ["Base", "E-Hybrid", "S", "GTS", "Turbo", "Turbo GT"] },
      { name: "Macan", trims: ["Base", "T", "S", "GTS", "Electric 4", "Electric Turbo"] },
      { name: "Panamera", trims: ["Panamera", "4", "4S", "GTS", "Turbo S", "4 E-Hybrid", "4S E-Hybrid", "Turbo S E-Hybrid"] },
      { name: "Taycan", trims: ["Taycan", "4S", "GTS", "Turbo", "Turbo S", "4 Cross Turismo", "4S Cross Turismo", "Turbo Cross Turismo"] },
    ],
  },
  {
    make: "Tesla",
    models: [
      { name: "Model 3", trims: ["Rear-Wheel Drive", "Long Range AWD", "Performance"] },
      { name: "Model S", trims: ["Dual Motor", "Plaid"] },
      { name: "Model X", trims: ["Dual Motor", "Plaid"] },
      { name: "Model Y", trims: ["Rear-Wheel Drive", "Long Range AWD", "Performance"] },
      { name: "Cybertruck", trims: ["Rear-Wheel Drive", "All-Wheel Drive", "Cyberbeast"] },
      { name: "Roadster", trims: ["Base"] },
    ],
  },
  {
    make: "Toyota",
    models: [
      { name: "4Runner", trims: ["SR5", "TRD Sport", "TRD Off-Road", "Limited", "TRD Pro"] },
      {
        name: "Avalon",
        trims: ["XLE", "XSE", "Touring", "Limited"],
        yearRange: [1995, 2022],
      },
      { name: "bZ4X", trims: ["XLE", "Limited"] },
      { name: "Camry", trims: ["LE", "SE", "SE Nightshade", "XLE", "XSE", "TRD"] },
      { name: "Camry Hybrid", trims: ["LE", "SE", "XLE", "XSE"] },
      { name: "Corolla", trims: ["LE", "SE", "SE Nightshade", "XSE"] },
      { name: "Corolla Cross", trims: ["L", "LE", "XLE"] },
      { name: "Crown", trims: ["XLE", "Limited", "Platinum"] },
      { name: "GR Corolla", trims: ["Core", "Circuit Edition", "Morizo Edition"] },
      { name: "GR86", trims: ["Base", "Premium", "TRUENO Edition"] },
      { name: "Highlander", trims: ["L", "LE", "XLE", "XSE", "Limited", "Platinum"] },
      { name: "Highlander Hybrid", trims: ["LE", "XLE", "Bronze Edition", "Limited", "Platinum"] },
      { name: "Land Cruiser", trims: ["1958", "Land Cruiser", "First Edition"] },
      { name: "Prius", trims: ["LE", "XLE", "Limited"] },
      { name: "Prius Prime", trims: ["SE", "XSE", "XSE Premium"] },
      { name: "RAV4", trims: ["LE", "XLE", "XLE Premium", "Adventure", "TRD Off-Road", "Limited"] },
      { name: "RAV4 Hybrid", trims: ["LE", "XLE", "Woodland Edition", "XLE Premium", "SE", "XSE", "Limited"] },
      { name: "RAV4 Prime", trims: ["SE", "XSE"] },
      { name: "Sequoia", trims: ["SR5", "Limited", "Platinum", "TRD Pro", "Capstone"] },
      { name: "Sienna", trims: ["LE", "XLE", "Woodland Edition", "XSE", "Limited", "Platinum"] },
      { name: "Supra", trims: ["2.0", "3.0", "3.0 Premium", "45th Anniversary Edition"] },
      { name: "Tacoma", trims: ["SR", "SR5", "TRD PreRunner", "TRD Sport", "TRD Off-Road", "Limited", "TRD Pro", "Trailhunter"] },
      { name: "Tundra", trims: ["SR", "SR5", "Limited", "Platinum", "1794 Edition", "Capstone", "TRD Pro"] },
      { name: "Tundra i-FORCE MAX", trims: ["Limited", "Platinum", "1794 Edition", "Capstone", "TRD Pro"] },
      { name: "Venza", trims: ["LE", "XLE", "Nightshade", "Limited"] },
    ],
  },
  {
    make: "Acura",
    models: [
      { name: "Integra", trims: ["Base", "A-Spec", "A-Spec w/Technology", "Type S"] },
      { name: "MDX", trims: ["Technology", "A-Spec", "Advance", "Type S", "Type S Advance"] },
      { name: "RDX", trims: ["Base", "Technology", "A-Spec", "Advance"] },
      { name: "TLX", trims: ["Base", "Technology", "A-Spec", "Advance", "Type S"] },
      { name: "ZDX", trims: ["A-Spec", "A-Spec Performance", "Type S"] },
    ],
  },
  {
    make: "Alfa Romeo",
    models: [
      { name: "Giulia", trims: ["Sprint", "Ti", "Veloce", "Quadrifoglio"] },
      { name: "Stelvio", trims: ["Sprint", "Ti", "Veloce", "Quadrifoglio"] },
      { name: "Tonale", trims: ["Sprint", "Ti", "Veloce"] },
    ],
  },
  {
    make: "Buick",
    models: [
      { name: "Encore GX", trims: ["Preferred", "Sport Touring", "Avenir"] },
      { name: "Enclave", trims: ["Essence", "Premium", "Avenir"] },
      { name: "Envision", trims: ["Preferred", "Essence", "Avenir"] },
    ],
  },
  {
    make: "Cadillac",
    models: [
      { name: "CT4", trims: ["Luxury", "Premium Luxury", "Sport", "V-Series", "V-Series Blackwing"] },
      { name: "CT5", trims: ["Luxury", "Premium Luxury", "Sport", "V-Series", "V-Series Blackwing"] },
      { name: "Escalade", trims: ["Luxury", "Premium Luxury", "Sport", "Premium Luxury Platinum", "Sport Platinum", "V-Series"] },
      { name: "Lyriq", trims: ["Tech", "Luxury 2", "Sport 3"] },
      { name: "XT4", trims: ["Luxury", "Premium Luxury", "Sport"] },
      { name: "XT5", trims: ["Luxury", "Premium Luxury", "Sport"] },
      { name: "XT6", trims: ["Luxury", "Premium Luxury", "Sport"] },
    ],
  },
  {
    make: "Chrysler",
    models: [
      { name: "300", trims: ["Touring", "Touring L", "S"] },
      { name: "Pacifica", trims: ["Touring", "Touring L", "Limited", "Pinnacle", "Hybrid Touring L", "Hybrid Pinnacle"] },
    ],
  },
  {
    make: "Dodge",
    models: [
      { name: "Charger", trims: ["SXT", "GT", "R/T", "Scat Pack", "Hellcat Redeye"] },
      { name: "Challenger", trims: ["SXT", "GT", "R/T", "Scat Pack", "Hellcat Redeye"] },
      { name: "Durango", trims: ["SXT", "GT", "R/T", "Citadel", "SRT 392", "SRT Hellcat"] },
      { name: "Hornet", trims: ["GT", "GT Plus", "R/T", "R/T Plus"] },
    ],
  },
  {
    make: "GMC",
    models: [
      { name: "Acadia", trims: ["SLE", "SLT", "Denali", "AT4"] },
      { name: "Canyon", trims: ["Elevation", "AT4", "Denali", "AT4X"] },
      { name: "Hummer EV", trims: ["2X", "3X", "Edition 1"] },
      { name: "Sierra 1500", trims: ["Pro", "SLE", "Elevation", "SLT", "AT4", "Denali", "Denali Ultimate", "AT4X"] },
      { name: "Terrain", trims: ["SLE", "SLT", "AT4", "Denali"] },
      { name: "Yukon", trims: ["SLE", "SLT", "AT4", "Denali", "Denali Ultimate"] },
    ],
  },
  {
    make: "Hyundai",
    models: [
      { name: "Elantra", trims: ["SE", "SEL", "Limited", "N Line", "N"] },
      { name: "Ioniq 5", trims: ["SE Standard Range", "SE", "SEL", "Limited"] },
      { name: "Ioniq 6", trims: ["SE", "SEL", "Limited"] },
      { name: "Kona", trims: ["SE", "SEL", "N Line", "Limited", "Electric SE", "Electric Limited"] },
      { name: "Palisade", trims: ["SE", "SEL", "XRT", "Limited", "Calligraphy"] },
      { name: "Santa Cruz", trims: ["SE", "SEL", "Night", "SEL Premium", "Limited"] },
      { name: "Santa Fe", trims: ["SE", "SEL", "XRT", "Limited", "Calligraphy"] },
      { name: "Sonata", trims: ["SE", "SEL", "SEL Plus", "N Line", "Limited"] },
      { name: "Tucson", trims: ["SE", "SEL", "XRT", "N Line", "Limited", "Hybrid Blue", "Plug-in Hybrid Limited"] },
    ],
  },
  {
    make: "Infiniti",
    models: [
      { name: "Q50", trims: ["Luxury", "Sensory", "Red Sport 400"] },
      { name: "QX50", trims: ["Pure", "Luxe", "Sport", "Sensory", "Autograph"] },
      { name: "QX55", trims: ["Luxe", "Essential", "Sensory"] },
      { name: "QX60", trims: ["Pure", "Luxe", "Sensory", "Autograph"] },
      { name: "QX80", trims: ["Luxe", "Premium Select", "Sensory", "Autograph"] },
    ],
  },
  {
    make: "Land Rover",
    models: [
      { name: "Defender", trims: ["S", "SE", "X-Dynamic", "X", "V8"] },
      { name: "Discovery", trims: ["S", "Dynamic SE", "Metropolitan"] },
      { name: "Discovery Sport", trims: ["S", "Dynamic SE"] },
      { name: "Range Rover", trims: ["SE", "Autobiography", "SV"] },
      { name: "Range Rover Evoque", trims: ["S", "Dynamic SE"] },
      { name: "Range Rover Sport", trims: ["SE", "Dynamic SE", "Autobiography", "SV"] },
      { name: "Range Rover Velar", trims: ["S", "Dynamic SE", "Autobiography"] },
    ],
  },
  {
    make: "Mazda",
    models: [
      { name: "CX-30", trims: ["2.5 S", "Select Sport", "Preferred", "Carbon Edition", "Premium", "Turbo Premium Plus"] },
      { name: "CX-5", trims: ["2.5 S", "Select", "Preferred", "Carbon Edition", "Premium", "Turbo", "Turbo Signature"] },
      { name: "CX-50", trims: ["2.5 S", "Select", "Preferred", "Carbon Edition", "Premium", "Meridian Edition", "Turbo Premium Plus"] },
      { name: "CX-90", trims: ["Select", "Preferred", "Preferred Plus", "Premium", "Premium Plus", "Turbo S Premium", "Turbo S Premium Plus", "PHEV Premium Plus"] },
      { name: "Mazda3 Sedan", trims: ["2.5 S", "Select Sport", "Preferred", "Carbon Edition", "Premium", "Turbo Premium Plus"] },
      { name: "MX-5 Miata", trims: ["Sport", "Club", "Grand Touring"] },
    ],
  },
  {
    make: "MINI",
    models: [
      { name: "Hardtop 2 Door", trims: ["Cooper", "Cooper S", "John Cooper Works"] },
      { name: "Hardtop 4 Door", trims: ["Cooper", "Cooper S"] },
      { name: "Convertible", trims: ["Cooper", "Cooper S", "John Cooper Works"] },
      { name: "Countryman", trims: ["Cooper", "Cooper S", "Cooper SE", "John Cooper Works"] },
      { name: "Clubman", trims: ["Cooper S", "John Cooper Works"] },
    ],
  },
  {
    make: "Ram",
    models: [
      { name: "1500", trims: ["Tradesman", "Big Horn", "Laramie", "Rebel", "Limited Longhorn", "Limited", "TRX"] },
      { name: "2500", trims: ["Tradesman", "Big Horn", "Laramie", "Power Wagon", "Limited Longhorn", "Limited"] },
      { name: "3500", trims: ["Tradesman", "Big Horn", "Laramie", "Limited Longhorn", "Limited"] },
      { name: "ProMaster", trims: ["Cargo Van", "Window Van", "Chassis Cab", "Cutaway"] },
    ],
  },
  {
    make: "Subaru",
    models: [
      { name: "Ascent", trims: ["Base", "Premium", "Onyx Edition", "Limited", "Touring"] },
      { name: "BRZ", trims: ["Premium", "Limited", "tS"] },
      { name: "Crosstrek", trims: ["Base", "Premium", "Sport", "Limited", "Wilderness"] },
      { name: "Forester", trims: ["Base", "Premium", "Sport", "Wilderness", "Limited", "Touring"] },
      { name: "Impreza", trims: ["Base", "Sport", "RS"] },
      { name: "Legacy", trims: ["Base", "Premium", "Sport", "Limited", "Touring XT"] },
      { name: "Outback", trims: ["Base", "Premium", "Onyx Edition", "Wilderness", "Limited", "Touring"] },
      { name: "Solterra", trims: ["Premium", "Limited", "Touring"] },
    ],
  },
  {
    make: "Volkswagen",
    models: [
      { name: "Atlas", trims: ["SE", "SE w/Technology", "SEL", "SEL Premium R-Line"] },
      { name: "Atlas Cross Sport", trims: ["SE", "SE w/Technology", "SEL", "SEL Premium R-Line"] },
      { name: "Golf GTI", trims: ["S", "SE", "Audiophile Edition"] },
      { name: "ID.4", trims: ["Standard", "Pro", "Pro S", "Pro S Plus"] },
      { name: "Jetta", trims: ["S", "Sport", "SE", "SEL"] },
      { name: "Taos", trims: ["S", "SE", "SEL"] },
      { name: "Tiguan", trims: ["S", "SE", "SE R-Line Black", "SEL R-Line"] },
    ],
  },
  {
    make: "Volvo",
    models: [
      { name: "C40 Recharge", trims: ["Core", "Plus", "Ultimate"] },
      { name: "EX30", trims: ["Core", "Plus", "Ultra"] },
      { name: "EX90", trims: ["Twin Motor", "Twin Motor Performance"] },
      { name: "S60", trims: ["Core", "Plus", "Ultimate", "Recharge Ultimate"] },
      { name: "S90", trims: ["Plus", "Ultimate"] },
      { name: "XC40", trims: ["Core", "Plus", "Ultimate", "Recharge Twin Ultimate"] },
      { name: "XC60", trims: ["Core", "Plus", "Ultimate", "Recharge Ultimate"] },
      { name: "XC90", trims: ["Core", "Plus", "Ultimate", "Recharge Ultimate"] },
    ],
  },
];

export const getMakeOptions = () =>
  VEHICLE_CATALOG.map((entry) => entry.make).sort((a, b) =>
    a.localeCompare(b),
  );

export const getModelOptions = (make: string) => {
  const makeEntry = VEHICLE_CATALOG.find((entry) => entry.make === make);
  if (!makeEntry) {
    return [];
  }
  return makeEntry.models.map((model) => model.name).sort((a, b) =>
    a.localeCompare(b),
  );
};

export const getTrimOptions = (make: string, model: string) => {
  const makeEntry = VEHICLE_CATALOG.find((entry) => entry.make === make);
  const modelEntry = makeEntry?.models.find((item) => item.name === model);
  return modelEntry ? modelEntry.trims : [];
};


