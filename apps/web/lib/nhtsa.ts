const BASE_URL = "https://vpic.nhtsa.dot.gov/api/vehicles";

type NhtsaResponse<T> = {
  Results?: T[];
};

type MakeResult = {
  Make_Name?: string;
  MakeName?: string;
};

type ModelResult = {
  Model_Name?: string;
};

export const normalizeList = (values: (string | undefined)[]) => {
  const seen = new Set<string>();
  const cleaned: string[] = [];

  for (const value of values) {
    if (!value) continue;
    const trimmed = value.trim();
    if (!trimmed) continue;
    const normalized = trimmed.toUpperCase();
    if (seen.has(normalized)) continue;
    seen.add(normalized);
    cleaned.push(trimmed);
  }

  cleaned.sort((a, b) => a.localeCompare(b));
  return cleaned;
};

const fetchAllMakesFromApi = async () => {
  const response = await fetch(
    `${BASE_URL}/GetMakesForVehicleType/passenger%20car?format=json`,
  );
  if (!response.ok) {
    throw new Error("Unable to load vehicle makes from NHTSA.");
  }

  const data = (await response.json()) as NhtsaResponse<MakeResult>;
  const results = data.Results ?? [];
  return normalizeList(
    results.map((item) => item.Make_Name ?? item.MakeName ?? undefined),
  );
};

const fetchModelsForMakeFromApi = async (make: string) => {
  const response = await fetch(
    `${BASE_URL}/GetModelsForMake/${encodeURIComponent(make)}?format=json`,
  );

  if (!response.ok) {
    throw new Error("Unable to load vehicle models from NHTSA.");
  }

  const data = (await response.json()) as NhtsaResponse<ModelResult>;
  const results = data.Results ?? [];
  return normalizeList(results.map((item) => item.Model_Name));
};

const isBrowser = typeof window !== "undefined";

export const fetchAllMakes = async () => {
  if (!isBrowser) {
    return fetchAllMakesFromApi();
  }

  const response = await fetch("/api/nhtsa/makes");
  if (!response.ok) {
    throw new Error("Unable to load vehicle makes from NHTSA.");
  }

  const data = (await response.json()) as { makes?: string[] };
  return data.makes ?? [];
};

export const fetchModelsForMake = async (make: string) => {
  if (!isBrowser) {
    return fetchModelsForMakeFromApi(make);
  }

  const response = await fetch(
    `/api/nhtsa/models?make=${encodeURIComponent(make)}`,
  );

  if (!response.ok) {
    throw new Error("Unable to load vehicle models from NHTSA.");
  }

  const data = (await response.json()) as { models?: string[] };
  return data.models ?? [];
};

export const getAllMakes = fetchAllMakesFromApi;
export const getModelsForMake = fetchModelsForMakeFromApi;
