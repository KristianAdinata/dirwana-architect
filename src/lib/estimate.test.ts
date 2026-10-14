import { describe, expect, it } from "vitest";
import { calculateEstimate, type EstimatorInput } from "./estimate";

const base = (buildingType: EstimatorInput["buildingType"], floorCount: EstimatorInput["floorCount"], floors: EstimatorInput["floors"]): EstimatorInput =>
  ({ buildingType, floorCount, floors, landLength: 20, landWidth: 20 });

describe("construction tier uses total floor count and calculated indoor area", () => {
  it("adds 5% on both floors before applying the two-floor house rate", () => {
    const result = calculateEstimate(base("rumah_tinggal", 2, [
      { master_bedroom: 1, bedroom: 2, bathroom: 4, living_room: 1, kitchen: 0 }, // 80
      { master_bedroom: 1, bedroom: 2, bathroom: 0, living_room: 1 }, // 60
    ]));
    expect(result.floors.map((floor) => floor.baseIndoorArea)).toEqual([80, 60]);
    expect(result.floors.map((floor) => floor.circulationArea)).toEqual([4, 3]);
    expect(result.floors.map((floor) => floor.indoorArea)).toEqual([84, 63]);
    expect(result.totalIndoorArea).toBe(147);
    expect(result.constructionRate).toBe(7_000_000);
    expect(result.constructionCost).toBe(1_029_000_000);
    expect(result.designRate).toBe(100_000);
    expect(result.regularDesignCost).toBe(14_700_000);
    expect(result.conditionalDesignCost).toBe(7_350_000);
  });
  it("prices 100 m² one-floor kos/ruko with its 5% corridor allowance", () => {
    const result = calculateEstimate(base("kos_ruko", 1, [{ master_bedroom: 5 }]));
    expect(result.constructionCost).toBe(525_000_000);
    expect(result.regularDesignCost).toBe(10_500_000);
  });
  it("applies the same 5% allowance on all three floors with the three-floor villa rate", () => {
    const result = calculateEstimate(base("villa", 3, [{ master_bedroom: 5 }, { master_bedroom: 5 }, { master_bedroom: 5 }]));
    expect(result.floors.map((floor) => floor.circulationPct)).toEqual([0.05, 0.05, 0.05]);
    expect(result.floors.map((floor) => floor.indoorArea)).toEqual([105, 105, 105]);
    expect(result.constructionCost).toBe(2_520_000_000);
    expect(result.regularDesignCost).toBe(31_500_000);
  });
  it("prices pool and balcony for the early estimate while keeping garden separate", () => {
    const result = calculateEstimate(base("villa", 1, [{ bedroom: 1, garden: 1, pool: 1, balcony: 1 }]));
    expect(result.totalIndoorArea).toBe(12.6);
    expect(result.totalSpecialArea).toBe(28);
    expect(result.totalBuildingArea).toBe(40.6);
    expect(result.constructionCost).toBe(263_900_000);
    expect(result.regularDesignCost).toBe(4_060_000);
    expect(result.conditionalDesignCost).toBe(2_030_000);
    expect(result.hasSeparateItems).toBe(true);
    const withoutGarden = calculateEstimate(base("villa", 1, [{ bedroom: 1, pool: 1, balcony: 1 }]));
    expect(withoutGarden.constructionCost).toBe(result.constructionCost);
    expect(withoutGarden.hasSeparateItems).toBe(false);
    const specialsOnly = calculateEstimate(base("villa", 1, [{ pool: 1, balcony: 1 }]));
    expect(specialsOnly.totalBuildingArea).toBe(28);
    expect(specialsOnly.constructionCost).toBe(182_000_000);
    expect(specialsOnly.hasSeparateItems).toBe(false);
  });
  it("uses entered total preset areas per floor without multiplying by room count again", () => {
    const result = calculateEstimate({ ...base("rumah_tinggal", 2, [
      { bedroom: 2, garden: 1, balcony: 1 },
      { storage: 2 },
    ]), presetAreas: [{ bedroom: 30, garden: 40, balcony: 12 }, { storage: 16 }] });
    expect(result.floors.map((floor) => floor.baseIndoorArea)).toEqual([30, 16]);
    expect(result.floors.map((floor) => floor.circulationArea)).toEqual([1.5, 0.8]);
    expect(result.floors[0].outdoorArea).toBe(40);
    expect(result.floors[0].specialArea).toBe(12);
    expect(result.totalIndoorArea).toBe(48.3);
    expect(result.totalBuildingArea).toBe(60.3);
    expect(result.constructionCost).toBeCloseTo(422_100_000, 0);
    expect(result.regularDesignCost).toBeCloseTo(6_030_000, 0);
    expect(result.conditionalDesignCost).toBeCloseTo(3_015_000, 0);
  });
  it("prices custom rooms, stairs and terraces at the selected building rate", () => {
    const input = base("rumah_tinggal", 1, [{ bedroom: 1 }]);
    const original = calculateEstimate(input);
    const customOnly = calculateEstimate({ ...input, extraAreas: [{ customRooms: [{ name: "Ruang hobi", area: 14 }], staircaseArea: 0, terraceArea: 0 }] });
    const withExtras = calculateEstimate({ ...input, extraAreas: [{
      customRooms: [{ name: "Ruang hobi", area: 14 }], staircaseArea: 9, terraceArea: 12,
    }] });
    expect(original.totalIndoorArea).toBe(12.6);
    expect(withExtras.floors[0].baseIndoorArea).toBe(26);
    expect(withExtras.floors[0].circulationArea).toBe(1.3);
    expect(withExtras.totalIndoorArea).toBe(27.3);
    expect(withExtras.floors[0].buildingArea).toBe(48.3);
    expect(withExtras.totalBuildingArea).toBe(48.3);
    expect(withExtras.constructionCost).toBeCloseTo(265_650_000, 0);
    expect(withExtras.regularDesignCost).toBeCloseTo(4_830_000, 0);
    expect(withExtras.conditionalDesignCost).toBeCloseTo(2_415_000, 0);
    expect(withExtras.constructionCost).toBeGreaterThan(customOnly.constructionCost);
    expect(withExtras.regularDesignCost).toBeGreaterThan(customOnly.regularDesignCost);
    expect(withExtras.exceedsLand).toBe(customOnly.exceedsLand);
    expect(withExtras.totalCustomRoomArea).toBe(14);
    expect(withExtras.totalStaircaseArea).toBe(9);
    expect(withExtras.totalTerraceArea).toBe(12);
    expect(withExtras.hasSeparateItems).toBe(false);
  });
  it("rejects invalid dimensions and quantities", () => {
    expect(() => calculateEstimate({ ...base("villa", 1, [{}]), landWidth: 0 })).toThrow();
    expect(() => calculateEstimate({ ...base("villa", 1, [{}]), landLength: 1e308, landWidth: 2 })).toThrow();
    expect(() => calculateEstimate(base("villa", 1, [{ bedroom: -1 }]))).toThrow();
    expect(() => calculateEstimate({ ...base("villa", 1, [{}]), extraAreas: [{ staircaseArea: -2, terraceArea: 0, customRooms: [] }] })).toThrow();
    expect(() => calculateEstimate({ ...base("villa", 1, [{}]), extraAreas: [{ staircaseArea: 0, terraceArea: 0, customRooms: [{ name: "Ruang", area: 0 }] }] })).toThrow();
    expect(() => calculateEstimate({ ...base("villa", 1, [{ bedroom: 1 }]), presetAreas: [{ bedroom: 0 }] })).toThrow();
    expect(() => calculateEstimate({ ...base("villa", 1, [{ bedroom: 1 }]), presetAreas: [{ bedroom: Infinity }] })).toThrow();
    expect(() => calculateEstimate({ ...base("villa", 1, [{}]), presetAreas: [{ bedroom: 20 }] })).toThrow();
  });
  it.each([
    ["kos_ruko", 1, 5_000_000], ["kos_ruko", 2, 6_500_000], ["kos_ruko", 3, 7_000_000],
    ["rumah_tinggal", 1, 5_500_000], ["rumah_tinggal", 2, 7_000_000], ["rumah_tinggal", 3, 7_500_000],
    ["villa", 1, 6_500_000], ["villa", 2, 7_500_000], ["villa", 3, 8_000_000],
  ] as const)("uses agreed rate for %s with %i floors", (buildingType, floorCount, rate) => {
    const result = calculateEstimate(base(buildingType, floorCount, [{ bathroom: 1 }, {}, {}]));
    expect(result.constructionRate).toBe(rate);
    expect(result.constructionCost).toBe(5.25 * rate);
    expect(result.regularDesignCost).toBe(525_000);
  });
  it("warns when the ground floor plus garden exceeds land without counting upper floors as footprint", () => {
    const warning = calculateEstimate({ ...base("villa", 2, [{ bedroom: 1, garden: 1 }, { master_bedroom: 4 }]), landLength: 5, landWidth: 5 });
    expect(warning.exceedsLand).toBe(true);
    const clear = calculateEstimate({ ...base("villa", 2, [{ bedroom: 1 }, { master_bedroom: 4 }]), landLength: 5, landWidth: 5 });
    expect(clear.exceedsLand).toBe(false);
  });
});
