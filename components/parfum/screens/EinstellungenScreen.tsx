"use client";
import { useState } from "react";
import { Screen } from "../ParfumApp";
import { colors } from "../uiTokens";
import {
  ScreenBase, StatusBar, SectionLabel, Divider, HomeBar, AlertBanner,
} from "../ui";

function ToggleRow({ label, sub, on, onChange }: {
  label: string; sub?: string; on: boolean; onChange: (v: boolean) => void;
}) {
  return (
    <div style={{
      display: "flex", alignItems: "center", justifyContent: "space-between",
      paddingTop: 14, paddingBottom: 14,
      borderBottom: `1px solid ${colors.divider}`,
    }}>
      <div>
        <div style={{ fontSize: 14, color: colors.textPrimary, fontWeight: 400 }}>{label}</div>
        {sub && <div style={{ fontSize: 11, color: colors.textMuted, marginTop: 2 }}>{sub}</div>}
      </div>
      <button
        onClick={() => onChange(!on)}
        style={{
          width: 44, height: 26, borderRadius: 99,
          background: on
            ? `linear-gradient(90deg, ${colors.goldDim}, ${colors.gold})`
            : colors.bgElevated,
          border: `1px solid ${on ? colors.gold + "40" : colors.divider}`,
          position: "relative", cursor: "pointer", flexShrink: 0,
          transition: "all 0.25s",
        }}
      >
        <div style={{
          position: "absolute",
          top: 3, left: on ? 22 : 3,
          width: 20, height: 20, borderRadius: 99,
          background: on ? "#0C0A09" : colors.textMuted,
          transition: "left 0.25s",
        }} />
      </button>
    </div>
  );
}

function InfoRow({ label, value, sub }: { label: string; value: string; sub?: string }) {
  return (
    <div style={{
      display: "flex", justifyContent: "space-between", alignItems: "center",
      paddingTop: 14, paddingBottom: 14,
      borderBottom: `1px solid ${colors.divider}`,
    }}>
      <div>
        <div style={{ fontSize: 14, color: colors.textPrimary }}>{label}</div>
        {sub && <div style={{ fontSize: 11, color: colors.textMuted, marginTop: 2 }}>{sub}</div>}
      </div>
      <span style={{ fontSize: 13, color: colors.textMuted, textAlign: "right", maxWidth: 160 }}>
        {value}
      </span>
    </div>
  );
}

const LOG_EVENTS = [
  { time: "18. Mai, 09:38", msg: "Temperatur optimal – 17.4°C", type: "ok" as const },
  { time: "12. Mai, 02:14", msg: "Temperaturalarm – 19.8°C überschritten", type: "warn" as const },
  { time: "10. Mai, 15:00", msg: "Firmware 2.4.1 installiert", type: "info" as const },
  { time: "4. Mai, 07:22", msg: "BLE-Verbindung unterbrochen", type: "warn" as const },
  { time: "1. Mai, 12:00", msg: "Gerät hinzugefügt", type: "ok" as const },
];

export default function EinstellungenScreen({ nav }: { nav: (s: Screen) => void }) {
  const [tempAlarm, setTempAlarm] = useState(true);
  const [humAlarm, setHumAlarm] = useState(true);
  const [weeklyReport, setWeeklyReport] = useState(false);
  const [unit, setUnit] = useState("°C");
  const [language, setLanguage] = useState("DE");
  const [connected, setConnected] = useState(true);

  return (
    <ScreenBase>
      <StatusBar />
      <div style={{ padding: "56px 24px 100px" }}>

        {/* Header */}
        <div style={{ marginBottom: 28 }}>
          <div style={{
            fontFamily: "'Cormorant Garamond', Georgia, serif",
            fontSize: 32, fontWeight: 600, color: colors.textPrimary,
            letterSpacing: "-0.02em", lineHeight: 1,
          }}>
            Einstellungen
          </div>
        </div>

        {/* ── Device ──────────────────────────────────────────────────── */}
        <SectionLabel>Verbundenes Gerät</SectionLabel>
        <div style={{
          background: colors.bgSurface,
          borderRadius: 16,
          border: `1px solid ${colors.divider}`,
          padding: "0 16px",
          marginBottom: 24,
        }}>
          {/* Connection status */}
          <div style={{
            display: "flex", alignItems: "center", justifyContent: "space-between",
            paddingTop: 16, paddingBottom: 16,
            borderBottom: `1px solid ${colors.divider}`,
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{
                width: 8, height: 8, borderRadius: 99,
                background: connected ? colors.statusOk : colors.statusAlert,
                boxShadow: connected ? `0 0 8px ${colors.statusOk}80` : undefined,
              }} />
              <span style={{ fontSize: 14, color: colors.textPrimary }}>
                {connected ? "Verbunden" : "Getrennt"}
              </span>
            </div>
            <button
              onClick={() => setConnected(!connected)}
              style={{
                padding: "6px 14px", borderRadius: 8,
                background: colors.bgElevated,
                border: `1px solid ${colors.divider}`,
                color: colors.textSecondary, fontSize: 11, fontWeight: 500,
                fontFamily: "'Inter', sans-serif", cursor: "pointer",
              }}
            >
              {connected ? "Trennen" : "Verbinden"}
            </button>
          </div>
          <InfoRow label="Produktlinie" value="COLLECTOR" />
          <InfoRow label="Seriennummer" value="VC-2024-00847" />
          <InfoRow label="Firmware" value="2.4.1" sub="Aktuell" />
          <InfoRow label="Peltier-Module" value="2× aktiv" />
        </div>

        {/* ── Notifications ─────────────────────────────────────────── */}
        <SectionLabel>Benachrichtigungen</SectionLabel>
        <div style={{
          background: colors.bgSurface,
          borderRadius: 16, border: `1px solid ${colors.divider}`,
          padding: "0 16px", marginBottom: 24,
        }}>
          <ToggleRow label="Temperaturalarm" sub="Schwellwert: 19.5°C" on={tempAlarm} onChange={setTempAlarm} />
          <ToggleRow label="Luftfeuchtealarm" sub="Außerhalb 40–60%" on={humAlarm} onChange={setHumAlarm} />
          <ToggleRow label="Wochenbericht" sub="Jeden Montag" on={weeklyReport} onChange={setWeeklyReport} />
        </div>

        {/* ── Preferences ───────────────────────────────────────────── */}
        <SectionLabel>Darstellung</SectionLabel>
        <div style={{
          background: colors.bgSurface,
          borderRadius: 16, border: `1px solid ${colors.divider}`,
          padding: "16px", marginBottom: 24,
        }}>
          {/* Unit toggle */}
          <div style={{ marginBottom: 14 }}>
            <div style={{ fontSize: 11, color: colors.textMuted, marginBottom: 8 }}>Einheit</div>
            <div style={{ display: "flex", background: colors.bgElevated, borderRadius: 10, padding: 3 }}>
              {["°C", "°F"].map((u) => (
                <button
                  key={u}
                  onClick={() => setUnit(u)}
                  style={{
                    flex: 1, padding: "8px 0", borderRadius: 8,
                    background: unit === u ? colors.gold : "transparent",
                    color: unit === u ? "#0C0A09" : colors.textMuted,
                    border: "none", fontSize: 13, fontWeight: 600,
                    fontFamily: "'Inter', sans-serif", cursor: "pointer",
                    transition: "all 0.2s",
                  }}
                >
                  {u}
                </button>
              ))}
            </div>
          </div>
          {/* Language toggle */}
          <div>
            <div style={{ fontSize: 11, color: colors.textMuted, marginBottom: 8 }}>Sprache</div>
            <div style={{ display: "flex", background: colors.bgElevated, borderRadius: 10, padding: 3 }}>
              {["DE", "EN", "FR"].map((l) => (
                <button
                  key={l}
                  onClick={() => setLanguage(l)}
                  style={{
                    flex: 1, padding: "8px 0", borderRadius: 8,
                    background: language === l ? colors.gold : "transparent",
                    color: language === l ? "#0C0A09" : colors.textMuted,
                    border: "none", fontSize: 13, fontWeight: 600,
                    fontFamily: "'Inter', sans-serif", cursor: "pointer",
                    transition: "all 0.2s",
                  }}
                >
                  {l}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* ── Geräteprotokoll ───────────────────────────────────────── */}
        <SectionLabel>Geräteprotokoll</SectionLabel>
        <div style={{
          background: colors.bgSurface,
          borderRadius: 16, border: `1px solid ${colors.divider}`,
          padding: "0 16px", marginBottom: 24,
        }}>
          {LOG_EVENTS.map((e, i) => {
            const c = e.type === "ok" ? colors.statusOk
              : e.type === "warn" ? colors.statusWarn : colors.gold;
            return (
              <div
                key={i}
                style={{
                  display: "flex", gap: 12, alignItems: "flex-start",
                  paddingTop: 12, paddingBottom: 12,
                  borderBottom: i < LOG_EVENTS.length - 1 ? `1px solid ${colors.divider}` : undefined,
                }}
              >
                <div style={{
                  width: 6, height: 6, borderRadius: 99,
                  background: c, marginTop: 5, flexShrink: 0,
                }} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 12, color: colors.textPrimary, lineHeight: 1.4 }}>{e.msg}</div>
                  <div style={{ fontSize: 10, color: colors.textMuted, marginTop: 2 }}>{e.time}</div>
                </div>
              </div>
            );
          })}
        </div>

        {/* ── Data export ──────────────────────────────────────────── */}
        <button style={{
          width: "100%", padding: "14px 0", borderRadius: 12,
          background: colors.bgSurface,
          border: `1px solid ${colors.divider}`,
          color: colors.gold, fontSize: 13, fontWeight: 500,
          fontFamily: "'Inter', sans-serif", cursor: "pointer",
          display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
        }}>
          <span>↓</span> Klimadaten exportieren (CSV)
        </button>
      </div>
      <HomeBar />
    </ScreenBase>
  );
}
