"use client";
import { useState } from "react";
import { Screen } from "../ParfumApp";
import { flakons, DuftFamilie } from "../data";
import { colors, familyColorMap } from "../uiTokens";
import {
  ScreenBase, StatusBar, FuellstandBar, DuftfamilieTag,
  BottleIcon, HomeBar,
} from "../ui";

const ALL_FILTERS = ["Alle", "Orientalisch", "Holzig", "Zitrus", "Frisch", "Blumig"] as const;
const SORT_OPTIONS = ["Maison", "Füllstand", "Zuletzt getragen"] as const;

export default function KollektionScreen({ nav }: { nav: (s: Screen, f?: any) => void }) {
  const [filter, setFilter] = useState("Alle");
  const [sort, setSort] = useState("Maison");

  const filtered = flakons
    .filter((f) => filter === "Alle" || f.familie === filter)
    .sort((a, b) => {
      if (sort === "Maison") return a.maison.localeCompare(b.maison);
      if (sort === "Füllstand") return b.fuellstand - a.fuellstand;
      return 0;
    });

  return (
    <ScreenBase>
      <StatusBar />

      {/* ── Header ────────────────────────────────────────────────────── */}
      <div style={{
        padding: "56px 24px 0",
        background: `linear-gradient(180deg, ${colors.bgBase} 70%, transparent)`,
        position: "sticky", top: 0, zIndex: 20,
      }}>
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 4 }}>
          <div>
            <div style={{
              fontFamily: "'Cormorant Garamond', Georgia, serif",
              fontSize: 32, fontWeight: 600, color: colors.textPrimary,
              letterSpacing: "-0.02em", lineHeight: 1,
            }}>
              Kollektion
            </div>
            <div style={{ fontSize: 12, color: colors.textMuted, marginTop: 6 }}>
              {filtered.length} von {flakons.length} Flakons
            </div>
          </div>
          {/* Sort button */}
          <div style={{ position: "relative" }}>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              style={{
                appearance: "none",
                background: colors.bgSurface,
                border: `1px solid ${colors.divider}`,
                color: colors.textSecondary,
                fontSize: 11, fontWeight: 500,
                padding: "8px 28px 8px 12px",
                borderRadius: 10,
                fontFamily: "'Inter', sans-serif",
                cursor: "pointer",
              }}
            >
              {SORT_OPTIONS.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
            <span style={{
              position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)",
              color: colors.textMuted, pointerEvents: "none", fontSize: 10,
            }}>▾</span>
          </div>
        </div>

        {/* Filter chips */}
        <div style={{
          display: "flex", gap: 8, overflowX: "auto",
          padding: "16px 0 14px",
          marginLeft: -24, paddingLeft: 24, marginRight: -24, paddingRight: 24,
        }}>
          {ALL_FILTERS.map((f) => {
            const active = filter === f;
            const c = f === "Alle" ? colors.gold : (familyColorMap[f] ?? colors.gold);
            return (
              <button
                key={f}
                onClick={() => setFilter(f)}
                style={{
                  flexShrink: 0,
                  padding: "7px 16px", borderRadius: 99,
                  fontSize: 11, fontWeight: active ? 600 : 400,
                  fontFamily: "'Inter', sans-serif",
                  cursor: "pointer",
                  background: active ? c : colors.bgSurface,
                  color: active ? "#0C0A09" : colors.textMuted,
                  border: active ? "none" : `1px solid ${colors.divider}`,
                  transition: "all 0.2s",
                }}
              >
                {f}
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Grid ────────────────────────────────────────────────────────── */}
      <div style={{
        display: "grid", gridTemplateColumns: "1fr 1fr",
        gap: 12, padding: "8px 24px 100px",
      }}>
        {filtered.map((f) => (
          <div
            key={f.id}
            onClick={() => nav("detail", f)}
            style={{
              background: colors.bgSurface,
              borderRadius: 16,
              border: `1px solid ${colors.divider}`,
              overflow: "hidden",
              cursor: "pointer",
            }}
          >
            {/* Image */}
            <div style={{
              height: 130,
              background: `linear-gradient(160deg, ${f.farbAccent}CC, ${f.farbAccent}44)`,
              display: "flex", alignItems: "center", justifyContent: "center",
              position: "relative",
            }}>
              <BottleIcon accent={f.farbAccent} size={80} />
              <div style={{
                position: "absolute", top: 10, right: 10,
                fontSize: 8, fontWeight: 600, color: colors.goldLight,
                background: "rgba(0,0,0,0.55)", borderRadius: 6,
                padding: "3px 7px", letterSpacing: "0.06em",
              }}>
                {f.konzentration}
              </div>
              {/* Low stock warning */}
              {f.fuellstand <= 30 && (
                <div style={{
                  position: "absolute", bottom: 10, left: 10,
                  fontSize: 8, fontWeight: 600, color: colors.statusWarn,
                  background: colors.statusWarn + "20",
                  border: `1px solid ${colors.statusWarn}40`,
                  borderRadius: 6, padding: "3px 7px",
                }}>
                  Nachfüllen
                </div>
              )}
            </div>

            <div style={{ padding: "12px 12px 14px" }}>
              <div style={{
                fontSize: 12, fontWeight: 600, color: colors.textPrimary,
                marginBottom: 2, lineHeight: 1.3,
                overflow: "hidden", textOverflow: "ellipsis",
                display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical",
              }}>
                {f.name}
              </div>
              <div style={{
                fontSize: 10, color: colors.textMuted, marginBottom: 10,
                whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
              }}>
                {f.maison}
              </div>
              <FuellstandBar pct={f.fuellstand} height={3} />
              <div style={{ marginTop: 10 }}>
                <DuftfamilieTag familie={f.familie} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* FAB */}
      <button
        style={{
          position: "absolute", bottom: 36, right: 24,
          width: 56, height: 56, borderRadius: 99,
          background: `linear-gradient(135deg, ${colors.goldDim}, ${colors.gold})`,
          border: "none",
          boxShadow: `0 8px 32px ${colors.gold}40`,
          fontSize: 26, color: "#0C0A09",
          display: "flex", alignItems: "center", justifyContent: "center",
          cursor: "pointer",
          fontFamily: "'Inter', sans-serif",
        }}
      >
        +
      </button>

      <HomeBar />
    </ScreenBase>
  );
}
