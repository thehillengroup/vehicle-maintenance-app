import { prisma } from "./client.ts";
import { upsertVehicle } from "./index";

const seed = async () => {
  const user = await prisma.user.upsert({
    where: { email: "demo@example.com" },
    update: {},
    create: {
      email: "demo@example.com",
      name: "Demo Driver",
      timeZone: "America/Los_Angeles",
    },
  });

  await Promise.all([
    upsertVehicle({
      userId: user.id,
      payload: {
        vin: "1HGCM82633A004352",
        make: "Honda",
        model: "Civic",
        year: 2021,
        trim: "EX",
        nickname: "Daily Driver",
        licensePlate: "7XYZ123",
        registrationState: "CA",
        fuelType: "GAS",
        purpose: "DAILY_DRIVER",
        vehicleType: "SEDAN",
        registrationRenewedOn: new Date("2025-02-12"),
        emissionsTestedOn: new Date("2024-12-15"),
        mileage: 18234,
        color: "Blue",
      },
    }),
    upsertVehicle({
      userId: user.id,
      payload: {
        vin: "5YJ3E1EA7KF317111",
        make: "Tesla",
        model: "Model 3",
        year: 2020,
        trim: "Long Range",
        nickname: "Commuter",
        licensePlate: "EV12345",
        registrationState: "CA",
        fuelType: "EV",
        purpose: "COMMUTER",
        vehicleType: "SEDAN",
        registrationRenewedOn: new Date("2025-06-01"),
        emissionsTestedOn: null,
        mileage: 40211,
        color: "Pearl White",
      },
    }),
    upsertVehicle({
      userId: user.id,
      payload: {
        vin: "1C4RJHAG0RC123456",
        make: "Jeep",
        model: "Grand Cherokee",
        year: 2024,
        trim: "Limited",
        nickname: "Trail Boss",
        licensePlate: "JEEP444",
        registrationState: "CA",
        fuelType: "GAS",
        purpose: "UTILITY_VEHICLE",
        vehicleType: "SUV",
        registrationRenewedOn: new Date("2025-08-15"),
        emissionsTestedOn: new Date("2025-04-10"),
        mileage: 15400,
        color: "Granite Crystal",
      },
    }),
    upsertVehicle({
      userId: user.id,
      payload: {
        vin: "WBAFE41010LL23456",
        make: "BMW",
        model: "X5",
        year: 2019,
        trim: "xDrive40i",
        nickname: "Downtown Shuttle",
        licensePlate: "BAVARIA",
        registrationState: "CA",
        fuelType: "GAS",
        purpose: "COMMUTER",
        vehicleType: "SUV",
        registrationRenewedOn: new Date("2025-03-20"),
        emissionsTestedOn: new Date("2025-01-05"),
        mileage: 61580,
        color: "Alpine White",
      },
    }),
    upsertVehicle({
      userId: user.id,
      payload: {
        vin: "4S4BTANC5N3354321",
        make: "Subaru",
        model: "Outback",
        year: 2022,
        trim: "Onyx Edition XT",
        nickname: "Weekend Escape",
        licensePlate: "WEEKNDR",
        registrationState: "CA",
        fuelType: "GAS",
        purpose: "WEEKENDER",
        vehicleType: "CROSSOVER",
        registrationRenewedOn: new Date("2025-09-01"),
        emissionsTestedOn: new Date("2025-05-30"),
        mileage: 28790,
        color: "Autumn Green",
      },
    }),
  ]);
};

seed()
  .then(async () => {
    await prisma.$disconnect();
    // eslint-disable-next-line no-console -- seed feedback
    console.log("Seed data created");
  })
  .catch(async (error) => {
    // eslint-disable-next-line no-console -- seed feedback
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
