import pricing from "@/config/pricing.json";
import presetData from "@/config/room-presets.example.json";

export type BuildingType = "rumah_tinggal" | "villa" | "kos_ruko";
export type FloorCount = 1 | 2 | 3;
export type RoomClass = "indoor" | "outdoor" | "special";
export type RoomPreset = { key: string; labelID: string; labelEN: string; area: number; pricingClass: RoomClass };
export type RoomCounts = Record<string, number>;
export type CustomRoom = { name: string; area: number };
export type FloorExtraAreas = { staircaseArea: number; terraceArea: number; customRooms: CustomRoom[] };
export type EstimatorInput = {
  buildingType: BuildingType;
  landLength: number;
  landWidth: number;
  floorCount: FloorCount;
  floors: RoomCounts[];
  presetAreas?: Record<string, number>[];
  extraAreas?: FloorExtraAreas[];
};
// Preset areas are DIRWANA's estimates; visitors may replace each selected total area.
export const roomPresets = presetData.roomSizes as RoomPreset[];
export const circulationReservePctByFloor = presetData.circulationReservePctByFloor;
const roundArea = (area: number) => Math.round((area + Number.EPSILON) * 100) / 100;

export function isBuildingType(value: string): value is BuildingType {
  return value === "rumah_tinggal" || value === "villa" || value === "kos_ruko";
}

export function calculateEstimate(input: EstimatorInput) {
  if (!isBuildingType(input.buildingType)) throw new Error("Invalid building type");
  if (![1, 2, 3].includes(input.floorCount)) throw new Error("Invalid floor count");
  if (!Number.isFinite(input.landLength) || !Number.isFinite(input.landWidth) || input.landLength <= 0 || input.landWidth <= 0 || !Number.isFinite(input.landLength * input.landWidth)) {
    throw new Error("Land dimensions must be greater than zero");
  }
  const floors = Array.from({ length: input.floorCount }, (_, index) => {
    const counts = input.floors[index] ?? {};
    const presetAreas = input.presetAreas?.[index] ?? {};
    const extras = input.extraAreas?.[index] ?? { staircaseArea: 0, terraceArea: 0, customRooms: [] };
    for (const quantity of Object.values(counts)) {
      if (!Number.isInteger(quantity) || quantity < 0) throw new Error("Room quantities must be nonnegative integers");
    }
    if (![extras.staircaseArea, extras.terraceArea].every((area) => Number.isFinite(area) && area >= 0)) throw new Error("Manual areas must be nonnegative");
    for (const room of extras.customRooms) {
      if (!room.name.trim() || !Number.isFinite(room.area) || room.area <= 0) throw new Error("Custom rooms need a name and positive area");
    }
    for (const [key, area] of Object.entries(presetAreas)) {
      if (!roomPresets.some((room) => room.key === key) || !Number.isFinite(area) || area <= 0 || (counts[key] ?? 0) < 1) {
        throw new Error("Selected preset areas must be positive and belong to a selected room");
      }
    }
    const areaOf = (pricingClass: RoomClass) => roomPresets.reduce((area, room) =>
      area + (room.pricingClass === pricingClass && (counts[room.key] ?? 0) > 0 ? presetAreas[room.key] ?? room.area * counts[room.key] : 0), 0);
    const customRoomArea = roundArea(extras.customRooms.reduce((area, room) => area + room.area, 0));
    const baseIndoorArea = roundArea(areaOf("indoor") + customRoomArea);
    const circulationPct = circulationReservePctByFloor[index];
    const circulationArea = roundArea(baseIndoorArea * circulationPct);
    const indoorArea = roundArea(baseIndoorArea + circulationArea);
    return { baseIndoorArea, circulationPct, circulationArea, indoorArea, outdoorArea: areaOf("outdoor"), specialArea: areaOf("special") + extras.staircaseArea + extras.terraceArea, customRoomArea, staircaseArea: extras.staircaseArea, terraceArea: extras.terraceArea };
  });
  const totalIndoorArea = roundArea(floors.reduce((sum, floor) => sum + floor.indoorArea, 0));
  const landArea = input.landLength * input.landWidth;
  const rate = pricing.constructionStartingRatesPerM2[input.buildingType][String(input.floorCount) as "1" | "2" | "3"];
  const regularDesignCost = totalIndoorArea * pricing.designRatePerM2;
  return {
    floors,
    landArea,
    totalIndoorArea,
    totalBaseIndoorArea: roundArea(floors.reduce((sum, floor) => sum + floor.baseIndoorArea, 0)),
    totalCirculationArea: roundArea(floors.reduce((sum, floor) => sum + floor.circulationArea, 0)),
    totalCustomRoomArea: roundArea(floors.reduce((sum, floor) => sum + floor.customRoomArea, 0)),
    totalStaircaseArea: floors.reduce((sum, floor) => sum + floor.staircaseArea, 0),
    totalTerraceArea: floors.reduce((sum, floor) => sum + floor.terraceArea, 0),
    constructionRate: rate,
    constructionCost: totalIndoorArea * rate,
    designRate: pricing.designRatePerM2,
    regularDesignCost,
    conditionalDesignCost: regularDesignCost * (1 - pricing.designDiscountIfConstructionWithDirwana),
    exceedsLand: floors[0].indoorArea + floors[0].outdoorArea > landArea,
    hasSeparateItems: floors.some((floor) => floor.specialArea > 0 || floor.outdoorArea > 0),
  };
}

export const formatRupiah = (value: number) => new Intl.NumberFormat("id-ID", {
  style: "currency", currency: "IDR", maximumFractionDigits: 0,
}).format(value);

export const formatArea = (value: number, locale: "id" | "en" = "id") =>
  `${new Intl.NumberFormat(locale === "id" ? "id-ID" : "en-US", { maximumFractionDigits: 2 }).format(value)} m²`;
