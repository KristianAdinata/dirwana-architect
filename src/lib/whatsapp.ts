import pricing from "@/config/pricing.json";
import contact from "@/config/contact.json";
import { calculateEstimate, roomPresets, type EstimatorInput } from "@/lib/estimate";

export type Lead = { name: string; whatsapp: string; location: string };
export type WhatsAppInput = { lead: Lead; locale: "id" | "en"; estimate?: EstimatorInput; otherBuildingType?: boolean };
export const whatsappNumber = pricing.waPhoneE164Digits;
export const displayWhatsAppNumber = `0${whatsappNumber.slice(2)}`;
export const consultationAdmins = [
  { id: "admin1", phone: whatsappNumber, displayPhone: displayWhatsAppNumber },
  { id: "admin2", phone: contact.admin2PhoneE164Digits, displayPhone: contact.admin2DisplayPhone },
] as const;
export type ConsultationAdminId = (typeof consultationAdmins)[number]["id"];

function consultationPhone(adminId: ConsultationAdminId) {
  return consultationAdmins.find((admin) => admin.id === adminId)!.phone;
}

export function buildGeneralWhatsAppUrl(locale: "id" | "en", adminId: ConsultationAdminId = "admin1") {
  const message = locale === "id" ? "Halo DIRWANA ARCHITECT, saya ingin konsultasi proyek." : "Hello DIRWANA ARCHITECT, I would like to discuss a project.";
  return `https://wa.me/${consultationPhone(adminId)}?text=${encodeURIComponent(message)}`;
}

function clean(value: string) {
  return value.replace(/[\r\n\t]+/g, " ")
    .replace(/(?:Rp\.?|IDR)\s*[\d.,]+(?:\s*(?:juta|jt|miliar|billion|million))?/gi, "")
    .replace(/(?:harga|biaya|budget|price|cost)\s*[:=]?\s*[\d.,]+/gi, "")
    .replace(/\b[\d.,]+\s*(?:juta|jt|miliar|million|billion)\b/gi, "")
    .replace(/\s+/g, " ").trim().slice(0, 120);
}

export function validateLead(lead: Lead, locale: "id" | "en") {
  const errors: Partial<Record<keyof Lead, string>> = {};
  if (clean(lead.name).length < 2) errors.name = locale === "id" ? "Isi nama minimal 2 karakter." : "Enter at least 2 characters.";
  const phone = lead.whatsapp.trim();
  const digits = phone.replace(/\D/g, "");
  if (!/^\+?\d[\d\s().-]*$/.test(phone) || digits.length < 8 || digits.length > 16 || /^0+$/.test(digits)) {
    errors.whatsapp = locale === "id" ? "Masukkan nomor WhatsApp yang valid." : "Enter a valid WhatsApp number.";
  }
  if (clean(lead.location).length < 3) errors.location = locale === "id" ? "Isi lokasi proyek minimal 3 karakter." : "Enter a project location of at least 3 characters.";
  return errors;
}

export function buildWhatsAppMessage({ lead, locale, estimate, otherBuildingType }: WhatsAppInput) {
  if (Object.keys(validateLead(lead, locale)).length) throw new Error("Invalid lead data");
  const id = locale === "id";
  const lines = [id ? "Halo DIRWANA ARCHITECT, saya ingin konsultasi proyek." : "Hello DIRWANA ARCHITECT, I would like to discuss a project.", "",
    `${id ? "Nama" : "Name"}: ${clean(lead.name)}`,
    `WhatsApp: ${lead.whatsapp.replace(/[^+\d]/g, "")}`,
    `${id ? "Lokasi proyek" : "Project location"}: ${clean(lead.location)}`];
  if (otherBuildingType || !estimate) {
    lines.push(`${id ? "Jenis bangunan" : "Building type"}: ${id ? "Lainnya (mohon konsultasi)" : "Other (please advise)"}`);
  } else {
    const result = calculateEstimate(estimate);
    const types = { rumah_tinggal: id ? "Rumah Tinggal" : "House", villa: "Villa", kos_ruko: id ? "Kos/Ruko" : "Boarding House/Shophouse" };
    lines.push(`${id ? "Jenis bangunan" : "Building type"}: ${types[estimate.buildingType]}`,
      `${id ? "Tanah" : "Land"}: ${estimate.landLength} m × ${estimate.landWidth} m (${result.landArea} m²)`,
      `${id ? "Jumlah lantai" : "Floors"}: ${estimate.floorCount}`);
    result.floors.forEach((floor, index) => {
      const counts = estimate.floors[index] ?? {};
      lines.push("", `${id ? "Lantai" : "Floor"} ${index + 1} — ${floor.indoorArea} m² ${id ? "perkiraan ruang indoor" : "estimated indoor rooms"}`);
      roomPresets.forEach((room) => {
        const count = counts[room.key] ?? 0;
        if (count > 0) lines.push(`- ${count} × ${id ? room.labelID : room.labelEN}${room.pricingClass !== "indoor" ? ` (${id ? "estimasi terpisah" : "separate estimate"})` : ""}`);
      });
      const extras = estimate.extraAreas?.[index];
      extras?.customRooms.forEach((room) => lines.push(`- ${clean(room.name)}: ${room.area} m² (${id ? "estimasi terpisah" : "separate estimate"})`));
      if (extras?.staircaseArea) lines.push(`- ${id ? "Area Tangga" : "Staircase Area"}: ${extras.staircaseArea} m² (${id ? "estimasi terpisah" : "separate estimate"})`);
      if (extras?.terraceArea) lines.push(`- ${id ? "Teras" : "Terrace"}: ${extras.terraceArea} m² (${id ? "estimasi terpisah" : "separate estimate"})`);
    });
    lines.push("", `${id ? "Total perkiraan luas ruang indoor" : "Total estimated indoor room area"}: ${result.totalIndoorArea} m²`);
  }
  lines.push("", id ? "Mohon informasi untuk langkah konsultasi berikutnya. Terima kasih." : "Please advise on the next consultation step. Thank you.");
  return lines.join("\n");
}

export function buildWhatsAppUrl(input: WhatsAppInput, adminId: ConsultationAdminId = "admin1") {
  return `https://wa.me/${consultationPhone(adminId)}?text=${encodeURIComponent(buildWhatsAppMessage(input))}`;
}
