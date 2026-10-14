import { describe, expect, it } from "vitest";
import { buildGeneralWhatsAppUrl, buildWhatsAppMessage, buildWhatsAppUrl, validateLead } from "./whatsapp";

describe("WhatsApp consultation", () => {
  const lead = { name: "Ayu", whatsapp: "0812 3456 7890", location: "Denpasar" };
  it("includes room needs and never includes pricing figures", () => {
    const message = buildWhatsAppMessage({ lead, locale: "id", estimate: {
      buildingType: "rumah_tinggal", landLength: 10, landWidth: 20, floorCount: 2,
      floors: [{ bedroom: 2 }, { bathroom: 1 }],
    } });
    expect(message).toContain("2 × Kamar Tidur");
    expect(message).toContain("Tanah: 10 m × 20 m (200 m²)");
    expect(message).toContain("Koridor & ruang sisa: 5% × 24 m² = 1,2 m²");
    expect(message).toContain("Koridor & ruang sisa: 5% × 5 m² = 0,25 m²");
    expect(message).not.toMatch(/Rp|980000000|14\.000\.000|tarif|biaya desain|biaya bangun/i);
    expect(buildWhatsAppUrl({ lead, locale: "id" })).toMatch(/^https:\/\/wa\.me\/6281237489756\?text=/);
  });
  it("removes injected monetary values from free text", () => {
    const message = buildWhatsAppMessage({ lead: { ...lead, location: "Denpasar Rp900.000.000 900 juta" }, locale: "id" });
    expect(message).not.toMatch(/Rp|900\.000\.000|900 juta/i);
  });
  it("requires name, phone and location", () => {
    expect(Object.keys(validateLead({ name: "", whatsapp: "123", location: "" }, "id"))).toHaveLength(3);
  });
  it("rejects letters, misplaced plus signs and zero-only phone numbers", () => {
    for (const whatsapp of ["abc081234567890", "0812+34567890", "00000000"]) {
      expect(validateLead({ ...lead, whatsapp }, "id").whatsapp).toBeTruthy();
    }
    expect(validateLead({ ...lead, whatsapp: "+62 812-3456-7890" }, "id").whatsapp).toBeUndefined();
  });
  it("keeps English room summaries price-free and tolerates an empty upper floor", () => {
    const message = buildWhatsAppMessage({ lead, locale: "en", estimate: {
      buildingType: "villa", landLength: 10, landWidth: 20, floorCount: 2, floors: [{ bedroom: 1 }],
    } });
    expect(message).toContain("Floor 2 — 0 m² estimated indoor rooms");
    expect(message).toContain("1 × Bedroom");
    expect(message).not.toMatch(/Rp|IDR|price|cost|discount|\d[.,]000[.,]000/i);
  });
  it("offers both admins and includes manual areas without a price", () => {
    const input = { lead, locale: "id" as const, estimate: {
      buildingType: "rumah_tinggal" as const, landLength: 10, landWidth: 20, floorCount: 1 as const,
      floors: [{ bedroom: 1 }], extraAreas: [{ customRooms: [{ name: "Ruang hobi", area: 14 }], staircaseArea: 9, terraceArea: 12 }],
    } };
    const message = buildWhatsAppMessage(input);
    expect(message).toContain("Ruang hobi: 14 m²");
    expect(message).toContain("Koridor & ruang sisa: 5% × 26 m² = 1,3 m²");
    expect(message).toContain("Lantai 1 — 27,3 m² perkiraan ruang indoor");
    expect(message).toContain("Area Tangga: 9 m² (estimasi terpisah)");
    expect(message).toContain("Teras: 12 m² (estimasi terpisah)");
    expect(message).not.toMatch(/\bRp\.?\s*\d|\bIDR\b|biaya|tarif|\d[.,]000[.,]000/i);
    expect(buildWhatsAppUrl(input, "admin1")).toMatch(/^https:\/\/wa\.me\/6281237489756\?text=/);
    expect(buildWhatsAppUrl(input, "admin2")).toMatch(/^https:\/\/wa\.me\/6285961509075\?text=/);
    expect(buildGeneralWhatsAppUrl("en", "admin2")).toMatch(/^https:\/\/wa\.me\/6285961509075\?text=/);
  });
  it("sends entered total preset areas while keeping outdoor items separate and prices private", () => {
    const message = buildWhatsAppMessage({ lead, locale: "id", estimate: {
      buildingType: "villa", landLength: 20, landWidth: 20, floorCount: 1,
      floors: [{ bedroom: 2, garden: 1 }], presetAreas: [{ bedroom: 30, garden: 40 }],
    } });
    expect(message).toContain("2 × Kamar Tidur: 30 m²");
    expect(message).toContain("1 × Taman: 40 m² (estimasi terpisah)");
    expect(message).toContain("Koridor & ruang sisa: 5% × 30 m² = 1,5 m²");
    expect(message).not.toMatch(/\bRp\.?\s*\d|\bIDR\b|biaya|tarif|\d[.,]000[.,]000/i);
  });
});
