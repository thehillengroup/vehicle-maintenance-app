import { prisma } from "./client";
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
        registrationRenewedOn: new Date("2025-06-01"),
        emissionsTestedOn: null,
        mileage: 40211,
        color: "Pearl White",
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
