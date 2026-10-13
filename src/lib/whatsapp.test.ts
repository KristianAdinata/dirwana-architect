import { describe, expect, it } from "vitest";
import { buildWhatsAppMessage, buildWhatsAppUrl, validateLead } from "./whatsapp";

describe("WhatsApp consultation", () => {
  const lead = { name: "Ayu", whatsapp: "0812 3456 7890", location: "Denpasar" };
  it("includes room needs and never includes pricing figures", () => {
    const message = buildWhatsAppMessage({ lead, locale: "id", estimate: {
      buildingType: "rumah_tinggal", landLength: 10, landWidth: 20, floorCount: 2,
      floors: [{ bedroom: 2 }, { bathroom: 1 }],
    } });
    expect(message).toContain("2 × Kamar Tidur");
    expect(message).toContain("Tanah: 10 m × 20 m (200 m²)");
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
});
