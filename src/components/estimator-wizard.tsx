"use client";

import { useEffect, useState, type FormEvent } from "react";
import { ArrowLeft, ArrowRight, ArrowUpRight, Check, ChevronDown, Minus, Plus, RotateCcw } from "lucide-react";
import { getDictionary, type Locale } from "@/i18n";
import { calculateEstimate, formatArea, formatRupiah, roomPresets, type BuildingType, type EstimatorInput, type FloorCount, type RoomCounts, type RoomPreset } from "@/lib/estimate";
import { buildWhatsAppUrl, validateLead, type Lead } from "@/lib/whatsapp";

type WizardState = { buildingType: BuildingType | "other"; landLength: string; landWidth: string; floorCount: FloorCount; floors: RoomCounts[]; step: 1 | 2 | 3; activeFloor: number };
const initialState: WizardState = { buildingType: "rumah_tinggal", landLength: "", landWidth: "", floorCount: 1, floors: [{}, {}, {}], step: 1, activeFloor: 0 };
const storageKey = "dirwana-estimator-v1";

function validLandDimensions(length: number, width: number) {
  return length > 0 && width > 0 && Number.isFinite(length) && Number.isFinite(width) && Number.isFinite(length * width);
}

function toInput(state: WizardState): EstimatorInput | null {
  if (state.buildingType === "other") return null;
  const landLength = Number(state.landLength);
  const landWidth = Number(state.landWidth);
  if (!validLandDimensions(landLength, landWidth)) return null;
  return { buildingType: state.buildingType, landLength, landWidth, floorCount: state.floorCount, floors: state.floors.slice(0, state.floorCount) };
}

export function EstimatorWizard({ locale }: { locale: Locale }) {
  const t = getDictionary(locale);
  const [state, setState] = useState<WizardState>(initialState);
  const [ready, setReady] = useState(false);
  const [showLandError, setShowLandError] = useState(false);
  const input = toInput(state);
  const landInvalid = !validLandDimensions(Number(state.landLength), Number(state.landWidth));
  const estimate = input ? calculateEstimate(input) : null;

  useEffect(() => {
    const timer = window.setTimeout(() => {
      try {
        const saved = window.localStorage.getItem(storageKey);
        if (saved) {
          const parsed = JSON.parse(saved) as Partial<WizardState>;
          const floorCount = Number(parsed.floorCount);
          const step = Number(parsed.step);
          if ([1, 2, 3].includes(floorCount) && Array.isArray(parsed.floors) && [1, 2, 3].includes(step)) {
            const floors = Array.from({ length: 3 }, (_, index) => Object.fromEntries(roomPresets.map((room) => {
              const quantity = Number(parsed.floors?.[index]?.[room.key]);
              return [room.key, Number.isInteger(quantity) && quantity >= 0 && quantity <= 99 ? quantity : 0];
            })));
            setState({
              ...initialState,
              buildingType: ["rumah_tinggal", "villa", "kos_ruko", "other"].includes(String(parsed.buildingType)) ? parsed.buildingType! : initialState.buildingType,
              landLength: String(parsed.landLength ?? ""),
              landWidth: String(parsed.landWidth ?? ""),
              floorCount: floorCount as FloorCount,
              floors,
              step: step as WizardState["step"],
              activeFloor: Number.isInteger(Number(parsed.activeFloor)) ? Math.min(Math.max(Number(parsed.activeFloor), 0), floorCount - 1) : 0,
            });
          }
        }
      } catch { /* Ignore stale browser state. */ }
      setReady(true);
    }, 0);
    return () => window.clearTimeout(timer);
  }, []);
  useEffect(() => { if (ready) window.localStorage.setItem(storageKey, JSON.stringify(state)); }, [state, ready]);

  function update(patch: Partial<WizardState>) { setState((current) => ({ ...current, ...patch })); }
  function next() {
    if (state.step === 1 && state.buildingType !== "other" && !input) { setShowLandError(true); return; }
    setShowLandError(false);
    update({ step: Math.min(3, state.step + 1) as 1 | 2 | 3 });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
  function previous() { update({ step: state.buildingType === "other" ? 1 : Math.max(1, state.step - 1) as 1 | 2 | 3 }); window.scrollTo({ top: 0, behavior: "smooth" }); }
  function changeRoom(key: string, delta: number) {
    setState((current) => {
      const floors = current.floors.map((floor) => ({ ...floor }));
      floors[current.activeFloor][key] = Math.min(99, Math.max(0, (floors[current.activeFloor][key] ?? 0) + delta));
      return { ...current, floors };
    });
  }
  const roomCount = state.floors.slice(0, state.floorCount).reduce((sum, floor) => sum + Object.values(floor).reduce((count, n) => count + n, 0), 0);

  return <section className="calculator-shell site-container">
    <div className="wizard-progress" aria-label={locale === "id" ? "Kemajuan kalkulator" : "Estimator progress"}>
      {t.calc.steps.map((label, index) => <div key={label} className={`progress-item ${state.step === index + 1 ? "current" : ""} ${state.step > index + 1 ? "done" : ""}`}>
        <span className="progress-number">{state.step > index + 1 ? <Check size={15}/> : `0${index + 1}`}</span><span>{label}</span>
      </div>)}
    </div>
    <div className="calculator-grid">
      <div className="wizard-main">
        {state.step === 1 && <div className="wizard-panel">
          <div className="step-heading"><span>{t.calc.step} 01 {t.calc.of} 03</span><h2>{t.calc.typeTitle}</h2><p>{t.calc.typeHelp}</p></div>
          <div className="building-options" role="group" aria-label={t.calc.typeTitle}>
            {([ ["rumah_tinggal", t.calc.house], ["villa", t.calc.villa], ["kos_ruko", t.calc.kos], ["other", t.calc.other] ] as const).map(([value, label]) =>
              <button key={value} type="button" className={`building-option ${state.buildingType === value ? "selected" : ""}`} aria-pressed={state.buildingType === value} onClick={() => { update({ buildingType: value, step: value === "other" ? 3 : 1 }); setShowLandError(false); }}><span>{label}</span><span className="option-indicator">{state.buildingType === value ? <Check size={15}/> : <ArrowUpRight size={17}/>}</span></button>)}
          </div>
          {state.buildingType !== "other" && <>
            <div className="form-divider"/>
            <div className="step-heading compact"><h2>{t.calc.landTitle}</h2></div>
            <div className="dimension-grid">
              <label className="field"><span>{t.calc.landLength} <small>({t.calc.meter})</small></span><input type="number" inputMode="decimal" min="0.1" step="any" value={state.landLength} onChange={(event) => update({ landLength: event.target.value })} aria-invalid={showLandError && landInvalid} placeholder="10"/></label>
              <span className="dimension-x" aria-hidden="true">×</span>
              <label className="field"><span>{t.calc.landWidth} <small>({t.calc.meter})</small></span><input type="number" inputMode="decimal" min="0.1" step="any" value={state.landWidth} onChange={(event) => update({ landWidth: event.target.value })} aria-invalid={showLandError && landInvalid} placeholder="15"/></label>
            </div>
            {showLandError && <p className="form-error" role="alert">{t.calc.landInvalid}</p>}
            <div className="form-divider"/>
            <div className="step-heading compact"><h2>{t.calc.floorTitle}</h2></div>
            <div className="floor-options" role="group" aria-label={t.calc.floorTitle}>{([1, 2, 3] as const).map((number) => <button type="button" key={number} className={state.floorCount === number ? "selected" : ""} aria-pressed={state.floorCount === number} onClick={() => update({ floorCount: number, activeFloor: Math.min(state.activeFloor, number - 1) })}><strong>{number}</strong><span>{t.calc.floors}</span></button>)}</div>
          </>}
          <div className="wizard-actions"><button type="button" className="button button-dark" onClick={next}>{t.common.next}<ArrowRight size={17}/></button></div>
        </div>}
        {state.step === 2 && <div className="wizard-panel">
          <div className="step-heading"><span>{t.calc.step} 02 {t.calc.of} 03</span><h2>{t.calc.roomTitle}</h2><p>{t.calc.roomIntro}</p></div>
          <FloorEditor locale={locale} state={state} estimate={estimate} onFloorChange={(floor) => update({ activeFloor: floor })} onRoomChange={changeRoom}/>
          <p className="draft-note">{t.calc.draftPreset}</p>
          <div className="wizard-actions split"><button type="button" className="button button-plain" onClick={previous}><ArrowLeft size={17}/>{t.common.previous}</button><button type="button" className="button button-dark" onClick={next}>{t.common.next}<ArrowRight size={17}/></button></div>
        </div>}
        {state.step === 3 && <div className="wizard-panel">
          <div className="step-heading"><span>{t.calc.step} 03 {t.calc.of} 03</span><h2>{state.buildingType === "other" ? t.calc.other : t.calc.resultsTitle}</h2><p>{state.buildingType === "other" ? t.calc.otherHelp : t.calc.resultsIntro}</p></div>
          {state.buildingType !== "other" && <div className="mobile-result"><EstimateSummary locale={locale} estimate={estimate} roomCount={roomCount}/></div>}
          <LeadToWhatsappForm locale={locale} estimate={input} otherBuildingType={state.buildingType === "other"}/>
          <div className="wizard-actions split"><button type="button" className="button button-plain" onClick={previous}><ArrowLeft size={17}/>{t.common.previous}</button><button type="button" className="button button-plain" onClick={() => { setState(initialState); window.localStorage.removeItem(storageKey); }}><RotateCcw size={16}/>{t.calc.reset}</button></div>
        </div>}
      </div>
      <aside className="calculator-aside"><EstimateSummary locale={locale} estimate={estimate} roomCount={roomCount} other={state.buildingType === "other"}/><p className="save-note">{t.calc.saved}</p></aside>
    </div>
  </section>;
}

function FloorEditor({ locale, state, estimate, onFloorChange, onRoomChange }: { locale: Locale; state: WizardState; estimate: ReturnType<typeof calculateEstimate> | null; onFloorChange: (floor: number) => void; onRoomChange: (key: string, delta: number) => void }) {
  const t = getDictionary(locale);
  return <>
    <div className="floor-tabs" role="tablist" aria-label={t.calc.floorTitle}>{Array.from({ length: state.floorCount }, (_, index) => <button key={index} type="button" role="tab" aria-selected={state.activeFloor === index} className={state.activeFloor === index ? "active" : ""} onClick={() => onFloorChange(index)}>{t.calc.floor} {index + 1}<span>{estimate ? formatArea(estimate.floors[index].indoorArea, locale) : "0 m²"}</span></button>)}</div>
    {(["indoor", "outdoor", "special"] as const).map((category) => <div className="room-group" key={category}>
      <div className="room-group-heading"><h3>{t.calc[category]}</h3><span>{category === "indoor" ? `${roomPresets.filter((room) => room.pricingClass === category).length} ${locale === "id" ? "pilihan" : "options"}` : <ChevronDown size={15}/>}</span></div>
      <div className="room-grid">{roomPresets.filter((room) => room.pricingClass === category).map((room) => <RoomPicker key={room.key} room={room} locale={locale} count={state.floors[state.activeFloor]?.[room.key] ?? 0} onChange={(delta) => onRoomChange(room.key, delta)}/>)}</div>
    </div>)}
  </>;
}

function RoomPicker({ room, locale, count, onChange }: { room: RoomPreset; locale: Locale; count: number; onChange: (delta: number) => void }) {
  const t = getDictionary(locale);
  const label = locale === "id" ? room.labelID : room.labelEN;
  return <div className={`room-card ${count > 0 ? "chosen" : ""}`}>
    <div className="room-card-info"><strong>{label}</strong><small>±{room.area} m² · {t.calc.approxSize}</small></div>
    <div className="quantity-control"><button type="button" aria-label={`${t.calc.remove} ${label}`} onClick={() => onChange(-1)} disabled={count === 0}><Minus size={16}/></button><output aria-live="polite" aria-label={`${label}: ${count}`}>{count}</output><button type="button" aria-label={`${t.calc.add} ${label}`} onClick={() => onChange(1)} disabled={count >= 99}><Plus size={16}/></button></div>
  </div>;
}

function EstimateSummary({ locale, estimate, roomCount, other = false }: { locale: Locale; estimate: ReturnType<typeof calculateEstimate> | null; roomCount: number; other?: boolean }) {
  const t = getDictionary(locale);
  if (other) return <div className="summary-card"><p className="eyebrow">DIRWANA ARCHITECT</p><h3>{t.calc.other}</h3><p>{t.calc.otherHelp}</p></div>;
  return <div className="summary-card"><div className="summary-top"><p className="eyebrow">{t.calc.resultsTitle}</p><span>{roomCount} {t.calc.selected}</span></div>
    {!estimate || roomCount === 0 || estimate.totalIndoorArea === 0 ? <><div className="summary-empty"><span>✳</span><p>{t.calc.emptyRooms}</p></div>{estimate?.hasSeparateItems && <p className="info-note">{t.calc.specialNote}</p>}</> : <>
      <div className="summary-area-list"><div><span>{t.calc.landArea}</span><strong>{formatArea(estimate.landArea, locale)}</strong></div>{estimate.floors.map((floor, index) => <div key={index}><span>{t.calc.floor} {index + 1}</span><strong>{formatArea(floor.indoorArea, locale)}</strong></div>)}<div className="total"><span>{t.calc.totalArea}</span><strong>{formatArea(estimate.totalIndoorArea, locale)}</strong></div></div>
      <div className="summary-prices"><div><span>{t.calc.constructionRate}</span><strong>{formatRupiah(estimate.constructionRate)}</strong></div><div className="featured-price"><span>{t.calc.constructionCost}</span><strong>{formatRupiah(estimate.constructionCost)}</strong></div><div><span>{t.calc.designRate}</span><strong>{formatRupiah(estimate.designRate)}</strong></div><div><span>{t.calc.designCost}</span><strong>{formatRupiah(estimate.regularDesignCost)}</strong></div></div>
      <div className="discount-box"><span>{t.calc.conditionalDesign}</span><strong>{formatRupiah(estimate.conditionalDesignCost)}</strong><p>{t.calc.conditionalNote}</p></div>
      {estimate.exceedsLand && <p className="warning-note" role="status">{t.calc.landWarning}</p>}
      {estimate.hasSeparateItems && <p className="info-note">{t.calc.specialNote}</p>}
      <p className="summary-disclaimer">{t.calc.areaCaveat}</p><p className="summary-disclaimer">{t.calc.caveat}</p>
    </>}
  </div>;
}

function LeadToWhatsappForm({ locale, estimate, otherBuildingType }: { locale: Locale; estimate: EstimatorInput | null; otherBuildingType: boolean }) {
  const t = getDictionary(locale);
  const [lead, setLead] = useState<Lead>({ name: "", whatsapp: "", location: "" });
  const [submitted, setSubmitted] = useState(false);
  const errors = validateLead(lead, locale);
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setSubmitted(true);
    if (Object.keys(errors).length) return;
    const url = buildWhatsAppUrl({ lead, locale, estimate: estimate ?? undefined, otherBuildingType });
    window.open(url, "_blank", "noopener,noreferrer");
  }
  return <form className="lead-form" onSubmit={submit} noValidate>
    <div className="lead-heading"><p className="eyebrow">DIRWANA ARCHITECT</p><h3>{t.calc.leadTitle}</h3><p>{t.calc.leadIntro}</p></div>
    <div className="lead-fields">
      <label className="field"><span>{t.calc.name} *</span><input type="text" autoComplete="name" value={lead.name} onChange={(event) => setLead({ ...lead, name: event.target.value })} placeholder={t.calc.namePlaceholder} aria-invalid={submitted && !!errors.name} aria-describedby={submitted && errors.name ? "name-error" : undefined}/>{submitted && errors.name && <small id="name-error" className="form-error">{errors.name}</small>}</label>
      <label className="field"><span>{t.calc.phone} *</span><input type="tel" inputMode="tel" autoComplete="tel" value={lead.whatsapp} onChange={(event) => setLead({ ...lead, whatsapp: event.target.value })} placeholder={t.calc.phonePlaceholder} aria-invalid={submitted && !!errors.whatsapp} aria-describedby={submitted && errors.whatsapp ? "phone-error" : undefined}/>{submitted && errors.whatsapp && <small id="phone-error" className="form-error">{errors.whatsapp}</small>}</label>
      <label className="field full"><span>{t.calc.projectLocation} *</span><input type="text" autoComplete="address-level2" value={lead.location} onChange={(event) => setLead({ ...lead, location: event.target.value })} placeholder={t.calc.locationPlaceholder} aria-invalid={submitted && !!errors.location} aria-describedby={submitted && errors.location ? "location-error" : undefined}/>{submitted && errors.location && <small id="location-error" className="form-error">{errors.location}</small>}</label>
    </div>
    <button type="submit" className="button button-bronze">{t.common.consult}<ArrowUpRight size={17}/></button><p className="privacy-note">{t.calc.privacy}</p>
  </form>;
}
