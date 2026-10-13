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
  it("excludes garden, pool and balcony from generic construction pricing", () => {
    const result = calculateEstimate(base("villa", 1, [{ bedroom: 1, garden: 1, pool: 1, balcony: 1 }]));
    expect(result.totalIndoorArea).toBe(12.6);
    expect(result.constructionCost).toBe(81_900_000);
    expect(result.hasSeparateItems).toBe(true);
  });
  it("prices custom indoor rooms while keeping stairs and terraces separate", () => {
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
    expect(withExtras.constructionCost).toBe(150_150_000);
    expect(withExtras.regularDesignCost).toBe(2_730_000);
    expect(withExtras.conditionalDesignCost).toBe(1_365_000);
    expect(withExtras.constructionCost).toBe(customOnly.constructionCost);
    expect(withExtras.regularDesignCost).toBe(customOnly.regularDesignCost);
    expect(withExtras.exceedsLand).toBe(customOnly.exceedsLand);
    expect(withExtras.totalCustomRoomArea).toBe(14);
    expect(withExtras.totalStaircaseArea).toBe(9);
    expect(withExtras.totalTerraceArea).toBe(12);
    expect(withExtras.hasSeparateItems).toBe(true);
  });
  it("rejects invalid dimensions and quantities", () => {
    expect(() => calculateEstimate({ ...base("villa", 1, [{}]), landWidth: 0 })).toThrow();
    expect(() => calculateEstimate({ ...base("villa", 1, [{}]), landLength: 1e308, landWidth: 2 })).toThrow();
    expect(() => calculateEstimate(base("villa", 1, [{ bedroom: -1 }]))).toThrow();
    expect(() => calculateEstimate({ ...base("villa", 1, [{}]), extraAreas: [{ staircaseArea: -2, terraceArea: 0, customRooms: [] }] })).toThrow();
    expect(() => calculateEstimate({ ...base("villa", 1, [{}]), extraAreas: [{ staircaseArea: 0, terraceArea: 0, customRooms: [{ name: "Ruang", area: 0 }] }] })).toThrow();
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
