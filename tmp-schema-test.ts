import { vehicleUpsertSchema } from './packages/core/src/index';

const payload = {
  vin: '1C4PJMMX9ND515945',
  make: 'Jeep',
  model: 'Cherokee',
  year: 2022,
  trim: 'Latitude Lux',
  registrationState: 'MD',
  fuelType: 'GAS',
  purpose: 'UTILITY_VEHICLE',
  vehicleType: 'SUV',
  registrationRenewedOn: null,
  emissionsTestedOn: null,
  mileage: 20020,
  color: 'Black',
  licensePlate: 'A365454',
};

try {
  const parsed = vehicleUpsertSchema.parse(payload);
  console.log('Parsed success:', parsed);
} catch (error) {
  console.error('Schema error:', error);
}

