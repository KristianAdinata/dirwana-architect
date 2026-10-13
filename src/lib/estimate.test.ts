import { describe, expect, it } from "vitest";
import { calculateEstimate, type EstimatorInput } from "./estimate";

const base = (buildingType: EstimatorInput["buildingType"], floorCount: EstimatorInput["floorCount"], floors: EstimatorInput["floors"]): EstimatorInput =>
  ({ buildingType, floorCount, floors, landLength: 20, landWidth: 20 });

describe("construction tier uses total floor count and total indoor area", () => {
  it("prices a 140 m² two-floor house at Rp980 million", () => {
    const result = calculateEstimate(base("rumah_tinggal", 2, [
      { master_bedroom: 1, bedroom: 2, bathroom: 4, living_room: 1, kitchen: 0 }, // 80
      { master_bedroom: 1, bedroom: 2, bathroom: 0, living_room: 1 }, // 60
    ]));
    expect(result.floors.map((floor) => floor.indoorArea)).toEqual([80, 60]);
    expect(result.totalIndoorArea).toBe(140);
    expect(result.constructionRate).toBe(7_000_000);
    expect(result.constructionCost).toBe(980_000_000);
    expect(result.designRate).toBe(100_000);
    expect(result.regularDesignCost).toBe(14_000_000);
    expect(result.conditionalDesignCost).toBe(7_000_000);
  });
  it("prices 100 m² one-floor kos/ruko at Rp500 million", () => {
    const result = calculateEstimate(base("kos_ruko", 1, [{ master_bedroom: 5 }]));
    expect(result.constructionCost).toBe(500_000_000);
    expect(result.regularDesignCost).toBe(10_000_000);
  });
  it("prices 200 m² three-floor villa at Rp1.6 billion", () => {
    const result = calculateEstimate(base("villa", 3, [{ master_bedroom: 5 }, { master_bedroom: 5 }, {}]));
    expect(result.constructionCost).toBe(1_600_000_000);
    expect(result.regularDesignCost).toBe(20_000_000);
  });
  it("excludes garden, pool and balcony from generic construction pricing", () => {
    const result = calculateEstimate(base("villa", 1, [{ bedroom: 1, garden: 1, pool: 1, balcony: 1 }]));
    expect(result.totalIndoorArea).toBe(12);
    expect(result.constructionCost).toBe(78_000_000);
    expect(result.hasSeparateItems).toBe(true);
  });
  it("rejects invalid dimensions and quantities", () => {
    expect(() => calculateEstimate({ ...base("villa", 1, [{}]), landWidth: 0 })).toThrow();
    expect(() => calculateEstimate({ ...base("villa", 1, [{}]), landLength: 1e308, landWidth: 2 })).toThrow();
    expect(() => calculateEstimate(base("villa", 1, [{ bedroom: -1 }]))).toThrow();
  });
  it.each([
    ["kos_ruko", 1, 5_000_000], ["kos_ruko", 2, 6_500_000], ["kos_ruko", 3, 7_000_000],
    ["rumah_tinggal", 1, 5_500_000], ["rumah_tinggal", 2, 7_000_000], ["rumah_tinggal", 3, 7_500_000],
    ["villa", 1, 6_500_000], ["villa", 2, 7_500_000], ["villa", 3, 8_000_000],
  ] as const)("uses agreed rate for %s with %i floors", (buildingType, floorCount, rate) => {
    const result = calculateEstimate(base(buildingType, floorCount, [{ bathroom: 1 }, {}, {}]));
    expect(result.constructionRate).toBe(rate);
    expect(result.constructionCost).toBe(5 * rate);
    expect(result.regularDesignCost).toBe(500_000);
  });
  it("warns when the ground floor plus garden exceeds land without counting upper floors as footprint", () => {
    const warning = calculateEstimate({ ...base("villa", 2, [{ bedroom: 1, garden: 1 }, { master_bedroom: 4 }]), landLength: 5, landWidth: 5 });
    expect(warning.exceedsLand).toBe(true);
    const clear = calculateEstimate({ ...base("villa", 2, [{ bedroom: 1 }, { master_bedroom: 4 }]), landLength: 5, landWidth: 5 });
    expect(clear.exceedsLand).toBe(false);
  });
});
