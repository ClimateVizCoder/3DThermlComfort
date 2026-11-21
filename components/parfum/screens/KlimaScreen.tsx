"use client";
import { useState } from "react";
import { Screen } from "../ParfumApp";
import { klimaDaten } from "../data";
import { colors } from "../uiTokens";
import { ScreenBase, StatusBar, SectionLabel, Card, Divider, HomeBar } from "../ui";

function ClimateDial({ value, min, max, unit, label, onChange }: {
  value: number; min: number; max: number; unit: string; label: string;
  onChange: (v: number) => void;
}) {
  const pct = (value - min) / (max - min);
  const size = 200;
  const r = 80;
  const cx = size / 2;
  const cy = size / 2;
  const strokeW = 10;
  const startAngle = -220;
  const totalAngle = 260;
  const endAngle = startAngle + totalAngle * pct;

  const arc = (angle: number, radius = r) => {
    const rad = (angle * Math.PI) / 180;
    return {
      x: cx + radius * Math.cos(rad),
      y: cy + radius * Math.sin(rad),
    };
  };

  const describeArc = (startA: number, endA: number, ro: number) => {
    const s = arc(startA, ro);
    const e = arc(endA, ro);
    const large = endA - startA > 180 ? 1 : 0;
    return `M ${s.x} ${s.y} A ${ro} ${ro} 0 ${large} 1 ${e.x} ${e.y}`;
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
      <div style={{ position: "relative", width: size, height: size }}>
        <svg width={size} height={size}>
          {/* Track */}
          <path
            d={describeArc(startAngle, startAngle + totalAngle, r)}
            fill="none"
            stroke={colors.divider.replace("0.06", "0.12")}
            strokeWidth={strokeW}
            strokeLinecap="round"
          />
          {/* Progress */}
          <path
            d={describeArc(startAngle, endAngle, r)}
            fill="none"
            stroke="url(#dialGrad)"
            strokeWidth={strokeW}
            strokeLinecap="round"
          />
          {/* Tick marks */}
          {Array.from({ length: 9 }).map((_, i) => {
            const a = startAngle + (totalAngle / 8) * i;
            const inner = arc(a, r - 18);
            const outer = arc(a, r - 12);
            return (
              <line
                key={i}
                x1={inner.x} y1={inner.y}
                x2={outer.x} y2={outer.y}
                stroke={colors.textMuted}
                strokeWidth={1}
                opacity={0.4}
              />
            );
          })}
          {/* Thumb dot */}
          {(() => {
            const pt = arc(endAngle, r);
            return <circle cx={pt.x} cy={pt.y} r={6} fill={colors.gold} />;
          })()}
          <defs>
            <linearGradient id="dialGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor={colors.goldDim} />
              <stop offset="100%" stopColor={colors.gold} />
            </linearGradient>
          </defs>
        </svg>

        {/* Center content */}
        <div style={{
          position: "absolute", inset: 0,
          display: "flex", flexDirection: "column",
          alignItems: "center", justifyContent: "center",
        }}>
          <div style={{
            fontFamily: "'Cormorant Garamond', Georgia, serif",
            fontSize: 52, fontWeight: 600, color: colors.textPrimary,
            lineHeight: 1, letterSpacing: "-0.04em",
          }}>
            {value}
          </div>
          <div style={{ fontSize: 14, color: colors.gold, fontWeight: 500, marginTop: 2 }}>
            {unit}
          </div>
          <div style={{
            fontSize: 9, color: colors.textMuted, letterSpacing: "0.12em",
            textTransform: "uppercase", marginTop: 6, fontWeight: 600,
          }}>
            {label}
          </div>
        </div>
      </div>

      {/* +/- controls */}
      <div style={{ display: "flex", alignItems: "center", gap: 32, marginTop: -8 }}>
        <button
          onClick={() => onChange(Math.max(min, value - 1))}
          style={{
            width: 44, height: 44, borderRadius: 99,
            background: colors.bgElevated,
            border: `1px solid ${colors.divider}`,
            color: colors.textPrimary, fontSize: 22,
            display: "flex", alignItems: "center", justifyContent: "center",
            cursor: "pointer",
          }}
        >−</button>
        <span style={{ fontSize: 11, color: colors.textMuted, letterSpacing: "0.08em" }}>
          {min}° – {max}°
        </span>
        <button
          onClick={() => onChange(Math.min(max, value + 1))}
          style={{
            width: 44, height: 44, borderRadius: 99,
            background: colors.bgElevated,
            border: `1px solid ${colors.divider}`,
            color: colors.textPrimary, fontSize: 22,
            display: "flex", alignItems: "center", justifyContent: "center",
            cursor: "pointer",
          }}
        >+</button>
      </div>
    </div>
  );
}

function MiniChart({ data, days }: { data: number[]; days: string[] }) {
  const w = 310; const h = 70;
  const pad = 8;
  const minV = Math.min(...data) - 0.3;
  const maxV = Math.max(...data) + 0.3;
  const pts = data.map((v, i) => ({
    x: pad + (i / (data.length - 1)) * (w - pad * 2),
    y: h - pad - ((v - minV) / (maxV - minV)) * (h - pad * 2),
  }));
  const pathD = pts.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ");
  const areaD = `${pathD} L ${pts[pts.length - 1].x} ${h} L ${pts[0].x} ${h} Z`;

  return (
    <div style={{ position: "relative" }}>
      <svg width={w} height={h} style={{ overflow: "visible" }}>
        {/* Grid lines */}
        {[0.25, 0.5, 0.75].map((t, i) => (
          <line
            key={i}
            x1={pad} y1={pad + t * (h - pad * 2)}
            x2={w - pad} y2={pad + t * (h - pad * 2)}
            stroke={colors.divider} strokeWidth={1}
          />
        ))}
        {/* Area fill */}
        <path d={areaD} fill={`url(#chartArea)`} opacity={0.4} />
        {/* Line */}
        <path d={pathD} fill="none" stroke={colors.gold} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
        {/* Dots */}
        {pts.map((p, i) => (
          <circle key={i} cx={p.x} cy={p.y} r={2.5} fill={colors.gold} />
        ))}
        {/* Last value label */}
        <text
          x={pts[pts.length - 1].x - 4} y={pts[pts.length - 1].y - 10}
          fontSize={8} fill={colors.goldLight} fontFamily="Inter" fontWeight={600}
          textAnchor="middle"
        >
          {data[data.length - 1]}°C
        </text>
        <defs>
          <linearGradient id="chartArea" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={colors.gold} stopOpacity={0.3} />
            <stop offset="100%" stopColor={colors.gold} stopOpacity={0} />
          </linearGradient>
        </defs>
      </svg>
      <div style={{
        display: "flex", justifyContent: "space-between",
        marginTop: 6,
      }}>
        {days.map((d, i) => (
          <span key={i} style={{ fontSize: 9, color: colors.textMuted, fontWeight: 500, width: `${w / days.length}px`, textAlign: "center" }}>
            {d}
          </span>
        ))}
      </div>
    </div>
  );
}

export default function KlimaScreen({ nav }: { nav: (s: Screen) => void }) {
  const [temp, setTemp] = useState(klimaDaten.zielTemp);
  const [activeProgram, setActiveProgram] = useState("Tag");
  const [fanMode, setFanMode] = useState("Auto");

  const programs = [
    { name: "Tag",   temp: 17, sub: "08:00–22:00" },
    { name: "Nacht", temp: 18, sub: "22:00–08:00" },
    { name: "Eco",   temp: 20, sub: "Energiesparen" },
  ];

  return (
    <ScreenBase>
      <StatusBar />
      <div style={{ padding: "56px 24px 100px" }}>

        {/* Header */}
        <div style={{ marginBottom: 32 }}>
          <div style={{
            fontSize: 10, fontWeight: 600, color: colors.gold,
            letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: 4,
          }}>
            Klimasteuerung
          </div>
          <div style={{
            fontFamily: "'Cormorant Garamond', Georgia, serif",
            fontSize: 32, fontWeight: 600, color: colors.textPrimary,
            letterSpacing: "-0.02em", lineHeight: 1,
          }}>
            Vitrine COLLECTOR
          </div>
          <div style={{ fontSize: 11, color: colors.textMuted, marginTop: 6 }}>
            2× Peltier aktiv · Firmware 2.4.1
          </div>
        </div>

        {/* ── Temperature Dial ─────────────────────────────────────────── */}
        <div style={{
          display: "flex", justifyContent: "center",
          marginBottom: 8,
        }}>
          <ClimateDial value={temp} min={14} max={22} unit="°C" label="Zieltemperatur" onChange={setTemp} />
        </div>

        {/* Live reading */}
        <div style={{
          display: "flex", justifyContent: "center", alignItems: "center",
          gap: 8, marginBottom: 32,
        }}>
          <div style={{
            display: "flex", alignItems: "center", gap: 6,
            padding: "6px 14px", borderRadius: 99,
            background: colors.statusOk + "15",
            border: `1px solid ${colors.statusOk}28`,
          }}>
            <span style={{ fontSize: 7, color: colors.statusOk }}>●</span>
            <span style={{ fontSize: 11, color: colors.statusOk, fontWeight: 500 }}>
              Aktuell {klimaDaten.temperatur}°C
            </span>
          </div>
        </div>

        <Divider mt={0} mb={24} />

        {/* ── Time programs ────────────────────────────────────────────── */}
        <div style={{ marginBottom: 24 }}>
          <SectionLabel>Zeitprogramme</SectionLabel>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 }}>
            {programs.map((p) => {
              const active = activeProgram === p.name;
              return (
                <button
                  key={p.name}
                  onClick={() => { setActiveProgram(p.name); setTemp(p.temp); }}
                  style={{
                    padding: "14px 12px", borderRadius: 14, textAlign: "left",
                    background: active ? colors.bgElevated : colors.bgSurface,
                    border: active
                      ? `1px solid ${colors.borderSubtle}`
                      : `1px solid ${colors.divider}`,
                    cursor: "pointer",
                  }}
                >
                  <div style={{
                    fontFamily: "'Cormorant Garamond', Georgia, serif",
                    fontSize: 22, fontWeight: 600,
                    color: active ? colors.gold : colors.textPrimary,
                    lineHeight: 1, marginBottom: 4,
                  }}>
                    {p.temp}°
                  </div>
                  <div style={{ fontSize: 11, fontWeight: 600, color: active ? colors.gold : colors.textSecondary, marginBottom: 2 }}>
                    {p.name}
                  </div>
                  <div style={{ fontSize: 9, color: colors.textMuted }}>
                    {p.sub}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* ── Fan mode ─────────────────────────────────────────────────── */}
        <div style={{ marginBottom: 24 }}>
          <SectionLabel>Lüftermodus</SectionLabel>
          <div style={{
            display: "flex", background: colors.bgSurface,
            borderRadius: 12, padding: 4,
            border: `1px solid ${colors.divider}`,
          }}>
            {["Auto", "Silent", "Aus"].map((m) => (
              <button
                key={m}
                onClick={() => setFanMode(m)}
                style={{
                  flex: 1, padding: "9px 0", borderRadius: 9,
                  background: fanMode === m ? colors.bgElevated : "transparent",
                  border: fanMode === m ? `1px solid ${colors.borderSubtle}` : "1px solid transparent",
                  color: fanMode === m ? colors.gold : colors.textMuted,
                  fontSize: 12, fontWeight: fanMode === m ? 600 : 400,
                  fontFamily: "'Inter', sans-serif", cursor: "pointer",
                  transition: "all 0.2s",
                }}
              >
                {m}
              </button>
            ))}
          </div>
        </div>

        {/* ── Humidity ─────────────────────────────────────────────────── */}
        <div style={{ marginBottom: 24 }}>
          <SectionLabel>Luftfeuchte-Ziel</SectionLabel>
          <div style={{
            background: colors.bgSurface, borderRadius: 14,
            border: `1px solid ${colors.divider}`,
            padding: "16px 18px",
            display: "flex", alignItems: "center", justifyContent: "space-between",
          }}>
            <div>
              <div style={{ fontSize: 11, color: colors.textMuted, marginBottom: 4 }}>Zielbereich</div>
              <div style={{
                fontFamily: "'Cormorant Garamond', Georgia, serif",
                fontSize: 28, fontWeight: 600, color: colors.textPrimary,
              }}>
                {klimaDaten.zielFeuchte}<span style={{ fontSize: 14, color: colors.textSecondary, fontWeight: 400 }}>%</span>
              </div>
            </div>
            <div style={{ display: "flex", gap: 6 }}>
              {[40, 45, 50, 55, 60].map((v) => (
                <div
                  key={v}
                  style={{
                    width: 32, height: 36, borderRadius: 8,
                    background: v === klimaDaten.zielFeuchte ? colors.gold : colors.bgElevated,
                    border: `1px solid ${v === klimaDaten.zielFeuchte ? colors.gold : colors.divider}`,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 9, fontWeight: 600,
                    color: v === klimaDaten.zielFeuchte ? colors.bgBase : colors.textMuted,
                    cursor: "pointer",
                  }}
                >
                  {v}%
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── 7-Day Chart ──────────────────────────────────────────────── */}
        <div>
          <SectionLabel>Temperaturverlauf · 7 Tage</SectionLabel>
          <div style={{
            background: colors.bgSurface, borderRadius: 14,
            border: `1px solid ${colors.divider}`,
            padding: "16px 16px 14px",
          }}>
            <MiniChart data={klimaDaten.tempVerlauf} days={klimaDaten.days} />
          </div>
        </div>
      </div>
      <HomeBar />
    </ScreenBase>
  );
}
