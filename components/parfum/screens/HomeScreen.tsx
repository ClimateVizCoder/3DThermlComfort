"use client";
import { Screen } from "../ParfumApp";
import { flakons, klimaDaten } from "../data";
import { colors } from "../uiTokens";
import {
  ScreenBase, StatusBar, FuellstandBar, DuftfamilieTag,
  StatusBadge, SectionLabel, BottleIcon, HomeBar,
} from "../ui";

export default function HomeScreen({ nav }: { nav: (s: Screen, f?: any) => void }) {
  return (
    <ScreenBase>
      <StatusBar />

      {/* ── Top bar ─────────────────────────────────────────────────────── */}
      <div style={{
        position: "sticky", top: 0, zIndex: 20,
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "56px 24px 16px",
        background: `linear-gradient(180deg, ${colors.bgBase} 60%, transparent)`,
      }}>
        <div>
          <div style={{
            fontSize: 10, fontWeight: 600, letterSpacing: "0.18em",
            color: colors.gold, textTransform: "uppercase", marginBottom: 2,
          }}>
            Vitrine
          </div>
          <div style={{
            fontFamily: "'Cormorant Garamond', Georgia, serif",
            fontSize: 28, fontWeight: 600, color: colors.textPrimary,
            letterSpacing: "-0.02em", lineHeight: 1,
          }}>
            Guten Morgen
          </div>
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          <button
            onClick={() => nav("einstellungen")}
            style={{
              width: 40, height: 40, borderRadius: 99,
              background: colors.bgSurface,
              border: `1px solid ${colors.divider}`,
              color: colors.textSecondary, fontSize: 16,
              display: "flex", alignItems: "center", justifyContent: "center",
              cursor: "pointer",
            }}
          >
            ⚙
          </button>
        </div>
      </div>

      <div style={{ padding: "0 24px 100px" }}>

        {/* ── Climate Status Card ──────────────────────────────────────── */}
        <div style={{
          background: colors.bgSurface,
          borderRadius: 20,
          border: `1px solid ${colors.divider}`,
          overflow: "hidden",
          marginBottom: 16,
          position: "relative",
        }}>
          {/* Gold accent line at top */}
          <div style={{
            height: 2,
            background: `linear-gradient(90deg, ${colors.gold}00, ${colors.gold}88, ${colors.gold}00)`,
          }} />

          <div style={{ padding: "20px 24px 24px" }}>
            <div style={{
              fontSize: 9, fontWeight: 600, color: colors.textMuted,
              letterSpacing: "0.14em", textTransform: "uppercase",
              marginBottom: 20,
            }}>
              Vitrine COLLECTOR · Live-Status
            </div>

            {/* 2×2 metrics */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px 0" }}>
              {[
                { label: "Temperatur", val: `${klimaDaten.temperatur}`, unit: "°C", good: true },
                { label: "Luftfeuchte", val: `${klimaDaten.luftfeuchte}`, unit: "%", good: true },
                { label: "UV-Filter", val: "Aktiv", unit: "", good: true },
                { label: "Lüfter", val: `${klimaDaten.luefter}`, unit: "%", good: true },
              ].map((m, i) => (
                <div key={i} style={{
                  borderRight: i % 2 === 0 ? `1px solid ${colors.divider}` : undefined,
                  paddingRight: i % 2 === 0 ? 24 : 0,
                  paddingLeft: i % 2 === 1 ? 24 : 0,
                }}>
                  <div style={{
                    fontSize: 9, fontWeight: 500, color: colors.textMuted,
                    letterSpacing: "0.1em", textTransform: "uppercase",
                    marginBottom: 6,
                  }}>
                    {m.label}
                  </div>
                  <div style={{ display: "flex", alignItems: "baseline", gap: 3 }}>
                    <span style={{
                      fontFamily: "'Cormorant Garamond', Georgia, serif",
                      fontSize: 36, fontWeight: 600, color: colors.textPrimary,
                      letterSpacing: "-0.02em", lineHeight: 1,
                    }}>
                      {m.val}
                    </span>
                    {m.unit && (
                      <span style={{ fontSize: 14, color: colors.textSecondary, fontWeight: 400 }}>
                        {m.unit}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Horizontal divider between rows */}
            <div style={{
              height: 1, background: colors.divider,
              position: "absolute", left: 24, right: 24, top: "50%",
              marginTop: -8,
            }} />
          </div>
        </div>

        {/* Status badge */}
        <div style={{ marginBottom: 32 }}>
          <StatusBadge type="ok" label="Optimal · Alle Parameter im Zielbereich" />
        </div>

        {/* ── Tagesempfehlung Teaser ───────────────────────────────────── */}
        <div
          onClick={() => nav("empfehlung")}
          style={{
            background: `linear-gradient(135deg, ${colors.bgSurface}, ${colors.bgElevated})`,
            borderRadius: 20,
            border: `1px solid ${colors.borderSubtle}`,
            padding: "20px 24px",
            marginBottom: 32,
            cursor: "pointer",
            display: "flex", alignItems: "center", justifyContent: "space-between",
          }}
        >
          <div>
            <div style={{
              fontSize: 9, fontWeight: 600, color: colors.gold,
              letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: 6,
            }}>
              Tagesempfehlung
            </div>
            <div style={{ fontSize: 15, fontWeight: 600, color: colors.textPrimary, marginBottom: 4 }}>
              Aventus
            </div>
            <div style={{ fontSize: 12, color: colors.textMuted }}>
              München · 14°C · Bewölkt
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <BottleIcon accent={flakons[3].farbAccent} size={64} />
            <span style={{ fontSize: 20, color: colors.textMuted }}>›</span>
          </div>
        </div>

        {/* ── Recent flakons ───────────────────────────────────────────── */}
        <div style={{ marginBottom: 16 }}>
          <div style={{
            display: "flex", alignItems: "center", justifyContent: "space-between",
            marginBottom: 16,
          }}>
            <SectionLabel>Zuletzt hinzugefügt</SectionLabel>
            <button
              onClick={() => nav("kollektion")}
              style={{
                background: "none", border: "none",
                fontSize: 12, color: colors.gold, fontWeight: 500,
                fontFamily: "'Inter', sans-serif", cursor: "pointer",
              }}
            >
              Alle →
            </button>
          </div>
        </div>

        {/* Horizontal scroll cards */}
        <div style={{
          display: "flex", gap: 12,
          overflowX: "auto", marginLeft: -24, paddingLeft: 24, paddingRight: 24,
          marginRight: -24,
          paddingBottom: 4,
        }}>
          {flakons.slice(0, 4).map((f) => (
            <div
              key={f.id}
              onClick={() => nav("detail", f)}
              style={{
                flexShrink: 0, width: 148,
                background: colors.bgSurface,
                borderRadius: 16,
                border: `1px solid ${colors.divider}`,
                overflow: "hidden",
                cursor: "pointer",
              }}
            >
              {/* Image area */}
              <div style={{
                height: 116,
                background: `linear-gradient(160deg, ${f.farbAccent}CC, ${f.farbAccent}55)`,
                display: "flex", alignItems: "center", justifyContent: "center",
                position: "relative",
              }}>
                <BottleIcon accent={f.farbAccent} size={72} />
                {/* Concentration badge */}
                <div style={{
                  position: "absolute", top: 10, right: 10,
                  fontSize: 8, fontWeight: 600, color: colors.goldLight,
                  background: "rgba(0,0,0,0.55)", borderRadius: 6,
                  padding: "3px 7px", letterSpacing: "0.06em",
                }}>
                  {f.konzentration}
                </div>
              </div>

              <div style={{ padding: "12px 12px 14px" }}>
                <div style={{
                  fontSize: 12, fontWeight: 600, color: colors.textPrimary,
                  marginBottom: 2, lineHeight: 1.3,
                  whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
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
                <div style={{
                  display: "flex", alignItems: "center",
                  justifyContent: "space-between", marginTop: 8,
                }}>
                  <span style={{ fontSize: 9, color: colors.goldDim, fontWeight: 500 }}>
                    {f.fuellstand}%
                  </span>
                  <DuftfamilieTag familie={f.familie} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <HomeBar />
    </ScreenBase>
  );
}
