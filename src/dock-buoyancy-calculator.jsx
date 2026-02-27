import { useState, useMemo, useRef, useEffect } from "react";

const FLOAT_CATALOG = [
  { sku: "RP1412",   size: "12x48x12",  buoyancy: 207,  weight: 16,  depth: 12 },
  { sku: "RP2312",   size: "24x36x12",  buoyancy: 332,  weight: 21,  depth: 12 },
  { sku: "RP2412",   size: "24x48x12",  buoyancy: 454,  weight: 27,  depth: 12 },
  { sku: "RP3412",   size: "36x48x12",  buoyancy: 700,  weight: 38,  depth: 12 },
  { sku: "RP3612",   size: "36x72x12",  buoyancy: 1061, weight: 55,  depth: 12 },
  { sku: "RP3812",   size: "36x96x12",  buoyancy: 1412, weight: 73,  depth: 12 },
  { sku: "RP4412",   size: "48x48x12",  buoyancy: 940,  weight: 49,  depth: 12 },
  { sku: "RP4512",   size: "48x60x12",  buoyancy: 1186, weight: 60,  depth: 12 },
  { sku: "RP4612",   size: "48x72x12",  buoyancy: 1420, weight: 71,  depth: 12 },
  { sku: "RP4812",   size: "48x96x12",  buoyancy: 1900, weight: 94,  depth: 12 },
  { sku: "RP2316",   size: "24x36x16",  buoyancy: 446,  weight: 25,  depth: 16 },
  { sku: "RP2416",   size: "24x48x16",  buoyancy: 598,  weight: 32,  depth: 16 },
  { sku: "RP3416",   size: "36x48x16",  buoyancy: 925,  weight: 44,  depth: 16 },
  { sku: "RP3616",   size: "36x72x16",  buoyancy: 1402, weight: 64,  depth: 16 },
  { sku: "RP3.5616", size: "42x72x16",  buoyancy: 1636, weight: 74,  depth: 16 },
  { sku: "RP3816",   size: "36x96x16",  buoyancy: 1870, weight: 85,  depth: 16 },
  { sku: "RP4416",   size: "48x48x16",  buoyancy: 1242, weight: 57,  depth: 16 },
  { sku: "RP4516",   size: "48x60x16",  buoyancy: 1568, weight: 69,  depth: 16 },
  { sku: "RP4616",   size: "48x72x16",  buoyancy: 1880, weight: 82,  depth: 16 },
  { sku: "RP4816",   size: "48x96x16",  buoyancy: 2518, weight: 108, depth: 16 },
  { sku: "RP2418",   size: "24x48x18",  buoyancy: 652,  weight: 34,  depth: 18 },
  { sku: "RP3418",   size: "36x48x18",  buoyancy: 1004, weight: 48,  depth: 18 },
  { sku: "RP1420",   size: "12x48x20",  buoyancy: 334,  weight: 22,  depth: 20 },
  { sku: "RP2320",   size: "24x36x20",  buoyancy: 537,  weight: 28,  depth: 20 },
  { sku: "RP2420",   size: "24x48x20",  buoyancy: 731,  weight: 36,  depth: 20 },
  { sku: "RP3420",   size: "36x48x20",  buoyancy: 1132, weight: 50,  depth: 20 },
  { sku: "RP3620",   size: "36x72x20",  buoyancy: 1718, weight: 72,  depth: 20 },
  { sku: "RP3820",   size: "36x96x20",  buoyancy: 2295, weight: 95,  depth: 20 },
  { sku: "RP4420",   size: "48x48x20",  buoyancy: 1522, weight: 64,  depth: 20 },
  { sku: "RP4520",   size: "48x60x20",  buoyancy: 1923, weight: 78,  depth: 20 },
  { sku: "RP4620",   size: "48x72x20",  buoyancy: 2307, weight: 93,  depth: 20 },
  { sku: "RP4820",   size: "48x96x20",  buoyancy: 3092, weight: 122, depth: 20 },
  { sku: "RP2424",   size: "24x48x24",  buoyancy: 882,  weight: 41,  depth: 24 },
  { sku: "RP3424",   size: "36x48x24",  buoyancy: 1364, weight: 57,  depth: 24 },
  { sku: "RP3624",   size: "36x72x24",  buoyancy: 2072, weight: 82,  depth: 24 },
  { sku: "RP3824",   size: "36x96x24",  buoyancy: 2771, weight: 108, depth: 24 },
  { sku: "RP4424",   size: "48x48x24",  buoyancy: 1836, weight: 73,  depth: 24 },
  { sku: "RP4524",   size: "48x60x24",  buoyancy: 2320, weight: 88,  depth: 24 },
  { sku: "RP4624",   size: "48x72x24",  buoyancy: 2786, weight: 105, depth: 24 },
  { sku: "RP4824",   size: "48x96x24",  buoyancy: 3737, weight: 137, depth: 24 },
  { sku: "RP3632",   size: "36x72x32",  buoyancy: 2678, weight: 105, depth: 32 },
  { sku: "RP4632",   size: "48x72x32",  buoyancy: 4638, weight: 131, depth: 32 },
  { sku: "RP3832",   size: "36x96x32",  buoyancy: 3626, weight: 134, depth: 32 },
  { sku: "RP4832",   size: "48x96x32",  buoyancy: 4920, weight: 167, depth: 32 },
];

const DEPTH_SERIES = [12, 16, 18, 20, 24, 32];

const STEEL_FRAME_SECTIONS = [
  { key: "2x10", label: "2' x 10'", weightLbs: 124 },
  { key: "3x10", label: "3' x 10'", weightLbs: 150 },
  { key: "4x10", label: "4' x 10'", weightLbs: 174 },
  { key: "5x10", label: "5' x 10'", weightLbs: 238 },
  { key: "6x10", label: "6' x 10'", weightLbs: 284 },
  { key: "8x10", label: "8' x 10'", weightLbs: 306 },
];

const FRAME_TYPES = {
  "Wood Framing":      { weightPerSqFt: 4.0, description: "Pressure treated lumber frame & stringers", isSteel: false },
  "Steel Truss Frame": { weightPerSqFt: null, description: "Galvanized steel truss — select sections below", isSteel: true },
  "Aluminium Frame":   { weightPerSqFt: 2.5, description: "Extruded aluminium frame & stringers", isSteel: false },
};

const DECKING_TYPES = {
  "Composite Decking":       { weightPerSqFt: 3.0, description: "Solid or hollow-core composite boards" },
  "Titan Decking":           { weightPerSqFt: 1.6, description: "Open-slot PVC/aluminium through flow panels" },
  "Pressure Treated Lumber": { weightPerSqFt: 2.5, description: "Pressure treated wood deck boards" },
};

const C = "#1D587C";

function InputRow({ label, value, onChange, unit, min, max, step, note }) {
  return (
    <div style={{ marginBottom: 14 }}>
      <label style={{ display: "block", fontWeight: 600, fontSize: 13, color: C, marginBottom: 4 }}>
        {label} {note && <span style={{ fontWeight: 400, color: C, fontSize: 12 }}>({note})</span>}
      </label>
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <input type="number" value={value} onChange={e => onChange(parseFloat(e.target.value) || 0)}
          min={min} max={max} step={step || 1}
          style={{ width: "100%", padding: "8px 12px", borderRadius: 8, border: "1.5px solid #e2e8f0", fontSize: 15, outline: "none", background: "#f8fafc", color: C }} />
        <span style={{ color: C, fontSize: 13, whiteSpace: "nowrap" }}>{unit}</span>
      </div>
    </div>
  );
}

function SelectRow({ label, value, onChange, options }) {
  return (
    <div style={{ marginBottom: 14 }}>
      <label style={{ display: "block", fontWeight: 600, fontSize: 13, color: C, marginBottom: 4 }}>{label}</label>
      <select value={value} onChange={e => onChange(e.target.value)}
        style={{ width: "100%", padding: "8px 12px", borderRadius: 8, border: "1.5px solid #e2e8f0", fontSize: 14, background: "#f8fafc", color: C, outline: "none" }}>
        <option value="">-- Select --</option>
        {options.map(o => <option key={o} value={o}>{o}</option>)}
      </select>
    </div>
  );
}

function InfoBox({ children, warn }) {
  return (
    <div style={{ background: warn ? "#fff7ed" : "#eff6ff", borderRadius: 8, padding: "8px 12px", fontSize: 13, color: warn ? "#c2410c" : C, marginBottom: 14 }}>
      {children}
    </div>
  );
}

function ResultCard({ label, value, unit, color, highlight }) {
  return (
    <div style={{ background: highlight ? color : "#f8fafc", border: "1.5px solid " + (highlight ? color : "#e2e8f0"), borderRadius: 10, padding: "14px 16px", flex: "1 1 140px" }}>
      <div style={{ fontSize: 12, color: highlight ? "#fff" : C, fontWeight: 600, marginBottom: 4 }}>{label}</div>
      <div style={{ fontSize: 22, fontWeight: 700, color: highlight ? "#fff" : C }}>
        {value} <span style={{ fontSize: 13, fontWeight: 400 }}>{unit}</span>
      </div>
    </div>
  );
}

const COL_WIDTH = 110;
const QTY_WIDTH = 26 + 44 + 26 + 8;

function QtyPicker({ items, quantities, onChange, columns }) {
  return (
    <div style={{ marginBottom: 14 }}>
      {columns.length > 0 && (
        <div style={{ display: "flex", alignItems: "center", marginBottom: 4, paddingLeft: 10, paddingRight: 10 }}>
          <div style={{ flex: 1 }} />
          {columns.map(col => (
            <div key={col.key} style={{ width: COL_WIDTH, fontSize: 10, fontWeight: 700, color: "#1D587C", textTransform: "uppercase", letterSpacing: 0.5, textAlign: "right", flexShrink: 0, whiteSpace: "nowrap" }}>{col.label}</div>
          ))}
          <div style={{ width: QTY_WIDTH, flexShrink: 0 }} />
        </div>
      )}
      {items.map(item => {
        const qty = quantities[item.key] || 0;
        return (
          <div key={item.key} style={{
            display: "flex", alignItems: "center",
            padding: "7px 10px", borderRadius: 8, marginBottom: 5,
            background: qty > 0 ? "#f0fdf4" : "#f8fafc",
            border: "1.5px solid " + (qty > 0 ? "#bbf7d0" : "#e2e8f0"),
          }}>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontWeight: 600, fontSize: 13, color: C }}>{item.label}</div>
              {item.sublabel && <div style={{ fontSize: 11, color: C }}>{item.sublabel}</div>}
            </div>
            {columns.map(col => (
              <div key={col.key} style={{ width: COL_WIDTH, fontSize: 13, color: C, whiteSpace: "nowrap", textAlign: "right", flexShrink: 0 }}>{col.render(item)}</div>
            ))}
            <div style={{ display: "flex", alignItems: "center", gap: 4, flexShrink: 0, marginLeft: 8 }}>
              <button onClick={() => onChange(item.key, Math.max(0, qty - 1))}
                style={{ width: 26, height: 26, borderRadius: 6, border: "1.5px solid #e2e8f0", background: "#fff", cursor: "pointer", fontSize: 16, color: C, display: "flex", alignItems: "center", justifyContent: "center" }}>
                -
              </button>
              <input type="number" value={qty} min={0}
                onChange={e => onChange(item.key, Math.max(0, parseInt(e.target.value) || 0))}
                style={{ width: 44, textAlign: "center", padding: "4px 0", borderRadius: 6, border: "1.5px solid #e2e8f0", fontSize: 14, background: "#fff", color: C, outline: "none" }} />
              <button onClick={() => onChange(item.key, qty + 1)}
                style={{ width: 26, height: 26, borderRadius: 6, border: "1.5px solid #e2e8f0", background: "#fff", cursor: "pointer", fontSize: 16, color: C, display: "flex", alignItems: "center", justifyContent: "center" }}>
                +
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}


function AIAssistant({ results, frameType, deckingType, liveLoad, safetyFactor, floatTotals }) {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: "assistant", content: "Hi! I am your Shoreline Supply flotation assistant. Ask me anything about float selection, buoyancy calculations, or your current dock configuration." }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    if (bottomRef.current) bottomRef.current.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const getSystem = () => [
    "You are a knowledgeable floating dock and marine flotation assistant for Shoreline Supply, a marine products company since 1956.",
    "Help customers with float selection, buoyancy calculations, dock configuration, and product questions.",
    "",
    "Permafloat catalog (buoyancy in lbs):",
    "12in: RP1412=207, RP2312=332, RP2412=454, RP3412=700, RP3612=1061, RP3812=1412, RP4412=940, RP4512=1186, RP4612=1420, RP4812=1900",
    "16in: RP2316=446, RP2416=598, RP3416=925, RP3616=1402, RP3.5616=1636, RP3816=1870, RP4416=1242, RP4516=1568, RP4616=1880, RP4816=2518",
    "18in: RP2418=652, RP3418=1004",
    "20in: RP1420=334, RP2320=537, RP2420=731, RP3420=1132, RP3620=1718, RP3820=2295, RP4420=1522, RP4520=1923, RP4620=2307, RP4820=3092",
    "24in: RP2424=882, RP3424=1364, RP3624=2072, RP3824=2771, RP4424=1836, RP4524=2320, RP4624=2786, RP4824=3737",
    "32in: RP3632=2678, RP4632=4638, RP3832=3626, RP4832=4920",
    "",
    "Frame types: Wood Framing (4.0 lbs/ft2), Steel Truss Frame (manual sections), Aluminium Frame (2.5 lbs/ft2)",
    "Decking: Composite (3.0 lbs/ft2), Titan Decking (1.6 lbs/ft2), Pressure Treated Lumber (2.5 lbs/ft2)",
    "Safety factor multiplies total load to get required buoyancy. 1.5=minimum, 2.0=standard residential, 2.5+=commercial.",
    "",
    "Current calculator state:",
    "Frame: " + (frameType || "not selected"),
    "Decking: " + (deckingType || "not selected"),
    "Live load: " + (liveLoad || 0) + " lbs",
    "Safety factor: " + (safetyFactor || "not set"),
    "Floats selected: " + floatTotals.totalCount,
    "Total buoyancy: " + floatTotals.totalBuoyancy + " lbs",
    "Total float weight: " + floatTotals.totalFloatWeight + " lbs",
    "Total design load: " + results.totalLoad + " lbs",
    "Required buoyancy: " + results.requiredBuoyancy + " lbs",
    "Status: " + (results.statusOk ? "Buoyancy sufficient" : "Insufficient buoyancy"),
    "",
    "Be concise, friendly, and practical. Always recommend consulting a licensed marine engineer for final structural decisions."
  ].join("\n");

  const send = async () => {
    if (!input.trim() || loading) return;
    const userMsg = { role: "user", content: input.trim() };
    const updated = [...messages, userMsg];
    setMessages(updated);
    setInput("");
    setLoading(true);
    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          system: getSystem(),
          messages: updated.map(m => ({ role: m.role, content: m.content })),
        }),
      });
      const data = await res.json();
      const reply = data.content && data.content[0] ? data.content[0].text : "Sorry, no response received.";
      setMessages(prev => [...prev, { role: "assistant", content: reply }]);
    } catch (_) {
      setMessages(prev => [...prev, { role: "assistant", content: "Sorry, something went wrong. Please try again." }]);
    }
    setLoading(false);
  };

  return (
    <div style={{ position: "fixed", bottom: 24, right: 24, zIndex: 1000 }}>
      {open && (
        <div style={{ width: 360, height: 500, background: "#fff", borderRadius: 16, boxShadow: "0 8px 32px rgba(0,0,0,0.18)", display: "flex", flexDirection: "column", marginBottom: 12, border: "1.5px solid #e2e8f0", overflow: "hidden" }}>
          <div style={{ background: "#1D587C", padding: "14px 16px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <div style={{ fontWeight: 700, fontSize: 14, color: "#fff" }}>Flotation Assistant</div>
              <div style={{ fontSize: 11, color: "rgba(255,255,255,0.7)" }}>Powered by Shoreline Supply</div>
            </div>
            <button onClick={() => setOpen(false)} style={{ background: "none", border: "none", color: "#fff", cursor: "pointer", fontSize: 22, lineHeight: 1, padding: 0 }}>x</button>
          </div>
          <div style={{ flex: 1, overflowY: "auto", padding: "14px 14px 8px" }}>
            {messages.map((m, i) => (
              <div key={i} style={{ marginBottom: 10, display: "flex", justifyContent: m.role === "user" ? "flex-end" : "flex-start" }}>
                <div style={{ maxWidth: "82%", padding: "9px 13px", borderRadius: m.role === "user" ? "14px 14px 2px 14px" : "14px 14px 14px 2px", background: m.role === "user" ? "#1D587C" : "#f1f5f9", color: m.role === "user" ? "#fff" : "#1D587C", fontSize: 13, lineHeight: 1.5 }}>
                  {m.content}
                </div>
              </div>
            ))}
            {loading && (
              <div style={{ display: "flex", justifyContent: "flex-start", marginBottom: 10 }}>
                <div style={{ background: "#f1f5f9", borderRadius: "14px 14px 14px 2px", padding: "9px 14px", fontSize: 13, color: "#1D587C" }}>Thinking...</div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>
          <div style={{ padding: "10px 12px", borderTop: "1px solid #e2e8f0", display: "flex", gap: 8 }}>
            <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === "Enter" && send()}
              placeholder="Ask about floats, loads, configuration..."
              style={{ flex: 1, padding: "8px 12px", borderRadius: 8, border: "1.5px solid #e2e8f0", fontSize: 13, outline: "none", color: "#1D587C" }} />
            <button onClick={send} disabled={loading || !input.trim()}
              style={{ padding: "8px 14px", borderRadius: 8, border: "none", background: input.trim() ? "#1D587C" : "#e2e8f0", color: input.trim() ? "#fff" : "#94a3b8", fontWeight: 600, fontSize: 13, cursor: input.trim() ? "pointer" : "default" }}>
              Send
            </button>
          </div>
        </div>
      )}
      <div style={{ display: "flex", justifyContent: "flex-end" }}>
        <button onClick={() => setOpen(o => !o)}
          style={{ width: 56, height: 56, borderRadius: "50%", background: "#1D587C", border: "none", boxShadow: "0 4px 16px rgba(29,88,124,0.4)", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, color: "#fff" }}>
          {open ? "x" : "?"}
        </button>
      </div>
    </div>
  );
}

export default function DockBuoyancyCalculator() {
  const [length, setLength] = useState("");
  const [width, setWidth] = useState("");
  const [frameType, setFrameType] = useState("");
  const [steelQty, setSteelQty] = useState({});
  const [deckingType, setDeckingType] = useState("");
  const [hardwareWeight, setHardwareWeight] = useState("");
  const [liveLoad, setLiveLoad] = useState("");
  const [safetyFactor, setSafetyFactor] = useState("");
  const [selectedDepth, setSelectedDepth] = useState(12);
  const [floatQty, setFloatQty] = useState({});

  const isSteel = frameType && FRAME_TYPES[frameType] ? FRAME_TYPES[frameType].isSteel : false;

  const handleSteelQty = (key, val) => setSteelQty(prev => ({ ...prev, [key]: val }));
  const handleFloatQty = (key, val) => setFloatQty(prev => ({ ...prev, [key]: val }));

  const steelTotalWeight = useMemo(() =>
    STEEL_FRAME_SECTIONS.reduce((s, f) => s + (steelQty[f.key] || 0) * f.weightLbs, 0), [steelQty]);
  const totalSteelSections = useMemo(() =>
    STEEL_FRAME_SECTIONS.reduce((s, f) => s + (steelQty[f.key] || 0), 0), [steelQty]);

  const floatsInSeries = useMemo(() =>
    FLOAT_CATALOG.filter(f => f.depth === selectedDepth), [selectedDepth]);

  const floatTotals = useMemo(() => {
    let totalBuoyancy = 0, totalFloatWeight = 0, totalCount = 0;
    FLOAT_CATALOG.forEach(f => {
      const qty = floatQty[f.sku] || 0;
      totalBuoyancy += qty * f.buoyancy;
      totalFloatWeight += qty * f.weight;
      totalCount += qty;
    });
    return { totalBuoyancy, totalFloatWeight, totalCount };
  }, [floatQty]);

  const results = useMemo(() => {
    const l = parseFloat(length) || 0;
    const w = parseFloat(width) || 0;
    const area = l * w;
    const frameSpec = frameType && FRAME_TYPES[frameType] ? FRAME_TYPES[frameType] : null;
    const deckSpec = deckingType && DECKING_TYPES[deckingType] ? DECKING_TYPES[deckingType] : null;
    const frameWeight = isSteel ? steelTotalWeight : (frameSpec ? frameSpec.weightPerSqFt * area : 0);
    const deckWeight = deckSpec ? deckSpec.weightPerSqFt * area : 0;
    const hw = parseFloat(hardwareWeight) || 0;
    const ll = parseFloat(liveLoad) || 0;
    const sf = parseFloat(safetyFactor) || 0;
    const totalDeadLoad = frameWeight + deckWeight + hw + floatTotals.totalFloatWeight;
    const totalLoad = totalDeadLoad + ll;
    const requiredBuoyancy = totalLoad * sf;
    const actualBuoyancy = floatTotals.totalBuoyancy;
    const netCapacity = actualBuoyancy - totalDeadLoad;
    const statusOk = requiredBuoyancy > 0 && actualBuoyancy >= requiredBuoyancy;
    const subPct = actualBuoyancy > 0 ? Math.min((totalLoad / actualBuoyancy) * 100, 100).toFixed(1) : "0.0";
    const submergedByModel = FLOAT_CATALOG
      .filter(f => (floatQty[f.sku] || 0) > 0)
      .map(f => ({
        sku: f.sku, size: f.size, depth: f.depth, qty: floatQty[f.sku] || 0,
        subIn: actualBuoyancy > 0 ? ((totalLoad / actualBuoyancy) * f.depth).toFixed(1) : "0.0",
      }));
    return {
      area, frameWeight: Math.round(frameWeight), deckWeight: Math.round(deckWeight),
      floatWeight: Math.round(floatTotals.totalFloatWeight),
      totalDeadLoad: Math.round(totalDeadLoad), totalLiveLoad: Math.round(ll),
      totalLoad: Math.round(totalLoad), requiredBuoyancy: Math.round(requiredBuoyancy),
      actualBuoyancy: Math.round(actualBuoyancy), netCapacity: Math.round(netCapacity),
      subPct, submergedByModel, statusOk,
      margin: Math.round(actualBuoyancy - requiredBuoyancy),
    };
  }, [length, width, frameType, isSteel, steelTotalWeight, deckingType, hardwareWeight, liveLoad, safetyFactor, floatTotals, floatQty]);

  const statusColor = results.statusOk ? "#16a34a" : "#dc2626";
  const statusBg = results.statusOk ? "#dcfce7" : "#fee2e2";
  const subFloat = parseFloat(results.subPct);

  return (
    <div style={{ fontFamily: "Inter, system-ui, sans-serif", background: "#f1f5f9", minHeight: "100vh", padding: "24px 16px" }}>
      <div style={{ maxWidth: 860, margin: "0 auto" }}>

        <div style={{ textAlign: "center", marginBottom: 28 }}>
          <div style={{ fontSize: 24, fontWeight: 800, color: C }}>Shoreline Supply Flotation Calculator</div>
          <p style={{ color: C, fontSize: 13, marginTop: 6 }}>Estimate float requirements and load capacity for your floating dock system.</p>
        </div>

        <div style={{ display: "flex", gap: 20, flexWrap: "wrap" }}>
          <div style={{ flex: "1 1 320px", display: "flex", flexDirection: "column", gap: 16 }}>

            <div style={{ background: "#fff", borderRadius: 14, padding: "18px 20px", boxShadow: "0 1px 4px rgba(0,0,0,0.06)" }}>
              <h3 style={{ margin: "0 0 14px", fontSize: 14, fontWeight: 700, color: C, textTransform: "uppercase", letterSpacing: 1 }}>Frame & Decking</h3>
              <SelectRow label="Frame Type" value={frameType} onChange={setFrameType} options={Object.keys(FRAME_TYPES)} />
              {!isSteel && frameType && FRAME_TYPES[frameType] && (
                <InfoBox>{FRAME_TYPES[frameType].description} &mdash; <strong>{FRAME_TYPES[frameType].weightPerSqFt} lbs/ft²</strong> = <strong>{results.frameWeight.toLocaleString()} lbs</strong></InfoBox>
              )}
              {isSteel && (
                <>
                  <QtyPicker
                    items={STEEL_FRAME_SECTIONS.map(s => ({ key: s.key, label: s.label, sublabel: s.weightLbs + " lbs each" }))}
                    quantities={steelQty} onChange={handleSteelQty} columns={[]}
                  />
                  {totalSteelSections > 0
                    ? <div style={{ background: "#f0fdf4", border: "1.5px solid #bbf7d0", borderRadius: 8, padding: "8px 12px", fontSize: 13, color: "#15803d", marginBottom: 14, display: "flex", justifyContent: "space-between" }}>
                        <span>{totalSteelSections} section{totalSteelSections !== 1 ? "s" : ""}</span>
                        <strong>{steelTotalWeight.toLocaleString()} lbs total</strong>
                      </div>
                    : <InfoBox warn>No sections selected — add sections above.</InfoBox>}
                </>
              )}
              <SelectRow label="Decking Type" value={deckingType} onChange={setDeckingType} options={Object.keys(DECKING_TYPES)} />
              {deckingType && DECKING_TYPES[deckingType] && (
                <InfoBox>{DECKING_TYPES[deckingType].description} &mdash; <strong>{DECKING_TYPES[deckingType].weightPerSqFt} lbs/ft²</strong> = <strong>{results.deckWeight.toLocaleString()} lbs</strong></InfoBox>
              )}
              <InputRow label="Hardware & Misc. Weight" value={hardwareWeight} onChange={setHardwareWeight} unit="lbs" min={0} note="cleats, ladders, lights" />
            </div>

            {(frameType === "Wood Framing" || frameType === "Aluminium Frame") && (
              <div style={{ background: "#fff", borderRadius: 14, padding: "18px 20px", boxShadow: "0 1px 4px rgba(0,0,0,0.06)" }}>
                <h3 style={{ margin: "0 0 14px", fontSize: 14, fontWeight: 700, color: C, textTransform: "uppercase", letterSpacing: 1 }}>Dock Dimensions</h3>
                <InputRow label="Length" value={length} onChange={setLength} unit="ft" min={4} max={200} />
                <InputRow label="Width" value={width} onChange={setWidth} unit="ft" min={2} max={50} />
                <InfoBox>Deck area: <strong>{results.area} ft²</strong></InfoBox>
              </div>
            )}

            <div style={{ background: "#fff", borderRadius: 14, padding: "18px 20px", boxShadow: "0 1px 4px rgba(0,0,0,0.06)" }}>
              <h3 style={{ margin: "0 0 14px", fontSize: 14, fontWeight: 700, color: C, textTransform: "uppercase", letterSpacing: 1 }}>Loads</h3>
              <InputRow label="Live Load" value={liveLoad} onChange={setLiveLoad} unit="lbs" min={0} note="total weight of people, permanent fixtures, equipment" />
              <InputRow label="Safety Factor" value={safetyFactor} onChange={setSafetyFactor} unit="x" min={1.5} max={4} step={0.1} note="typically 1.5-2.5" />
            </div>

            <div style={{ background: "#fff", borderRadius: 14, padding: "18px 20px", boxShadow: "0 1px 4px rgba(0,0,0,0.06)" }}>
              <h3 style={{ margin: "0 0 4px", fontSize: 14, fontWeight: 700, color: C, textTransform: "uppercase", letterSpacing: 1 }}>Permafloat Float System</h3>
              <p style={{ fontSize: 12, color: C, margin: "0 0 14px" }}>Select depth series, then enter quantity for each model.</p>
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 14 }}>
                {DEPTH_SERIES.map(d => (
                  <button key={d} onClick={() => setSelectedDepth(d)}
                    style={{ padding: "5px 12px", borderRadius: 20, fontSize: 13, fontWeight: 600, cursor: "pointer", border: "1.5px solid", background: selectedDepth === d ? C : "#f8fafc", color: selectedDepth === d ? "#fff" : C, borderColor: selectedDepth === d ? C : "#e2e8f0" }}>
                    {d}" Series
                  </button>
                ))}
              </div>
              <QtyPicker
                items={floatsInSeries.map(f => ({ key: f.sku, label: f.sku, sublabel: f.size, buoyancy: f.buoyancy, weight: f.weight }))}
                quantities={floatQty} onChange={handleFloatQty}
                columns={[
                  { key: "b", label: "Buoyancy Rating", render: item => item.buoyancy.toLocaleString() + " lbs" },
                  { key: "w", label: "Float Weight", render: item => item.weight + " lbs" },
                ]}
              />
              {floatTotals.totalCount > 0 ? (
                <div style={{ background: "#f0fdf4", border: "1.5px solid #bbf7d0", borderRadius: 8, padding: "10px 14px", fontSize: 13, color: "#15803d" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                    <span>Total floats selected</span><strong>{floatTotals.totalCount}</strong>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                    <span>Total float weight</span><strong>{floatTotals.totalFloatWeight.toLocaleString()} lbs</strong>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", borderTop: "1px solid #bbf7d0", paddingTop: 6, marginTop: 2 }}>
                    <span style={{ fontWeight: 700 }}>Total buoyancy</span><strong style={{ fontSize: 15 }}>{floatTotals.totalBuoyancy.toLocaleString()} lbs</strong>
                  </div>
                </div>
              ) : (
                <InfoBox warn>No floats selected — add floats above to calculate buoyancy.</InfoBox>
              )}
            </div>

          </div>

          <div style={{ flex: "1 1 280px" }}>
            <div style={{ position: "sticky", top: 20, display: "flex", flexDirection: "column", gap: 16 }}>

              <div style={{ background: statusBg, border: "2px solid " + statusColor, borderRadius: 14, padding: "16px 20px", textAlign: "center" }}>
                <div style={{ fontSize: 28 }}>{results.statusOk ? "✅" : "⚠️"}</div>
                <div style={{ fontWeight: 800, fontSize: 18, color: statusColor, marginTop: 4 }}>
                  {results.statusOk ? "Buoyancy Sufficient" : "Insufficient Buoyancy"}
                </div>
                <div style={{ fontSize: 13, color: statusColor, marginTop: 4 }}>
                  {results.statusOk
                    ? results.margin.toLocaleString() + " lbs of margin above required"
                    : "Need " + Math.abs(results.margin).toLocaleString() + " more lbs of buoyancy"}
                </div>
              </div>

              <div style={{ background: "#fff", borderRadius: 14, padding: "18px 20px", boxShadow: "0 1px 4px rgba(0,0,0,0.06)" }}>
                <h3 style={{ margin: "0 0 14px", fontSize: 14, fontWeight: 700, color: C, textTransform: "uppercase", letterSpacing: 1 }}>Load Summary</h3>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
                  <ResultCard label="Frame Weight"      value={results.frameWeight.toLocaleString()}   unit="lbs" color="#6366f1" />
                  <ResultCard label="Decking Weight"    value={results.deckWeight.toLocaleString()}    unit="lbs" color="#6366f1" />
                  <ResultCard label="Float Weight"      value={results.floatWeight.toLocaleString()}   unit="lbs" color="#6366f1" />
                  <ResultCard label="Total Dead Load"   value={results.totalDeadLoad.toLocaleString()} unit="lbs" color="#6366f1" />
                  <ResultCard label="Live Load"         value={results.totalLiveLoad.toLocaleString()} unit="lbs" color="#f59e0b" />
                  <ResultCard label="Total Design Load" value={results.totalLoad.toLocaleString()}     unit="lbs" color="#ef4444" />
                </div>
              </div>

              <div style={{ background: "#fff", borderRadius: 14, padding: "18px 20px", boxShadow: "0 1px 4px rgba(0,0,0,0.06)" }}>
                <h3 style={{ margin: "0 0 14px", fontSize: 14, fontWeight: 700, color: C, textTransform: "uppercase", letterSpacing: 1 }}>Buoyancy Summary</h3>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
                  <ResultCard label="Required Buoyancy" value={results.requiredBuoyancy.toLocaleString()} unit="lbs" color="#f97316" />
                  <ResultCard label="Actual Buoyancy"   value={results.actualBuoyancy.toLocaleString()}   unit="lbs" color="#16a34a" highlight={results.statusOk} />
                  <ResultCard label="Net Capacity"      value={results.netCapacity.toLocaleString()}      unit="lbs" color="#3b82f6" />
                </div>

                <div style={{ marginTop: 14 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, fontWeight: 600, color: C, marginBottom: 6 }}>
                    <span>Float Submersion at Design Load</span>
                    <span style={{ color: subFloat > 100 ? "#dc2626" : subFloat > 80 ? "#f97316" : "#16a34a" }}>{results.subPct}%</span>
                  </div>
                  <div style={{ background: "#e2e8f0", borderRadius: 999, height: 12, overflow: "hidden" }}>
                    <div style={{ height: "100%", borderRadius: 999, width: Math.min(subFloat, 100) + "%", background: subFloat > 100 ? "#dc2626" : subFloat > 80 ? "#f97316" : "#22c55e", transition: "width 0.3s ease" }} />
                  </div>
                  <div style={{ fontSize: 11, color: C, marginTop: 5 }}>
                    {subFloat <= 80 ? "✅ Good — floats have healthy reserve capacity"
                      : subFloat <= 100 ? "⚠️ Near capacity — consider adding floats or reducing load"
                      : "❌ Over capacity — floats will fully submerge under this load"}
                  </div>
                </div>

                {results.submergedByModel.length > 0 && (
                  <div style={{ marginTop: 14 }}>
                    <div style={{ fontSize: 13, fontWeight: 700, color: C, marginBottom: 8 }}>Submerged Depth by Float Model</div>
                    {results.submergedByModel.map(m => {
                      const pct = Math.min((parseFloat(m.subIn) / m.depth) * 100, 100);
                      const bc = pct > 100 ? "#dc2626" : pct > 80 ? "#f97316" : "#3b82f6";
                      return (
                        <div key={m.sku} style={{ marginBottom: 10 }}>
                          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: C, marginBottom: 3 }}>
                            <span><strong>{m.sku}</strong> <span>({m.size}, x{m.qty})</span></span>
                            <span style={{ fontWeight: 700, color: bc }}>{m.subIn}" / {m.depth}"</span>
                          </div>
                          <div style={{ background: "#e2e8f0", borderRadius: 999, height: 8, overflow: "hidden" }}>
                            <div style={{ height: "100%", borderRadius: 999, width: pct + "%", background: bc, transition: "width 0.3s ease" }} />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              <div style={{ fontSize: 11, color: C, background: "#f8fafc", borderRadius: 10, padding: "10px 14px", border: "1px solid #e2e8f0" }}>
                Buoyancy figures are maximums assuming complete submersion per Permafloat specifications. Consult a licensed marine engineer for final design.
              </div>

            </div>
          </div>
        </div>
      </div>
      <AIAssistant
        results={results}
        frameType={frameType}
        deckingType={deckingType}
        liveLoad={liveLoad}
        safetyFactor={safetyFactor}
        floatTotals={floatTotals}
      />
    </div>
  );
}
