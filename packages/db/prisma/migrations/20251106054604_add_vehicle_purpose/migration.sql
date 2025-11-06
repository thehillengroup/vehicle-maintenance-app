-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Vehicle" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "vin" TEXT NOT NULL,
    "make" TEXT NOT NULL,
    "model" TEXT NOT NULL,
    "year" INTEGER NOT NULL,
    "trim" TEXT,
    "nickname" TEXT,
    "licensePlate" TEXT,
    "registrationState" TEXT NOT NULL,
    "fuelType" TEXT DEFAULT 'GAS',
    "purpose" TEXT NOT NULL DEFAULT 'DAILY_DRIVER',
    "registrationRenewedOn" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "emissionsTestedOn" DATETIME,
    "registrationDueOn" DATETIME NOT NULL,
    "emissionsDueOn" DATETIME,
    "mileage" INTEGER,
    "color" TEXT,
    "vehicleType" TEXT NOT NULL DEFAULT 'SEDAN',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Vehicle_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Vehicle" ("color", "createdAt", "emissionsDueOn", "emissionsTestedOn", "fuelType", "id", "licensePlate", "make", "mileage", "model", "nickname", "registrationDueOn", "registrationRenewedOn", "registrationState", "trim", "updatedAt", "userId", "vehicleType", "vin", "year") SELECT "color", "createdAt", "emissionsDueOn", "emissionsTestedOn", "fuelType", "id", "licensePlate", "make", "mileage", "model", "nickname", "registrationDueOn", "registrationRenewedOn", "registrationState", "trim", "updatedAt", "userId", "vehicleType", "vin", "year" FROM "Vehicle";
DROP TABLE "Vehicle";
ALTER TABLE "new_Vehicle" RENAME TO "Vehicle";
CREATE UNIQUE INDEX "Vehicle_vin_key" ON "Vehicle"("vin");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
