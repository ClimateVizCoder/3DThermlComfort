"use client";
import { Screen } from "../ParfumApp";
import { flakons } from "../data";
import { colors, familyColorMap } from "../uiTokens";
import {
  ScreenBase, StatusBar, DuftfamilieTag, BottleIcon, HomeBar,
} from "../ui";

export default function EmpfehlungScreen({ nav }: { nav: (s: Screen, f?: any) => void }) {
  const primary = flakons[3]; // Aventus
  const alts = [flakons[2], flakons[0]]; // Shalimar, Oud Ispahan

  return (
    <ScreenBase>
      <StatusBar />

      <div style={{ padding: "56px 24px 100px" }}>

        {/* ── Weather context ──────────────────────────────────────────── */}
        <div style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          marginBottom: 28,
        }}>
          <div>
            <div style={{
              fontSize: 9, fontWeight: 600, color: colors.gold,
              letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: 6,
            }}>
              Tagesempfehlung
            </div>
            <div style={{
              fontFamily: "'Cormorant Garamond', Georgia, serif",
              fontSize: 28, fontWeight: 600, color: colors.textPrimary,
              letterSpacing: "-0.02em", lineHeight: 1,
            }}>
              Montag, 18. Mai
            </div>
          </div>
          {/* Weather badge */}
          <div style={{
            display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 4,
          }}>
            <div style={{
              background: colors.bgSurface,
              border: `1px solid ${colors.divider}`,
              borderRadius: 12, padding: "10px 14px",
              textAlign: "right",
            }}>
              <div style={{
                fontFamily: "'Cormorant Garamond', Georgia, serif",
                fontSize: 26, fontWeight: 600, color: colors.textPrimary, lineHeight: 1,
              }}>
                14°C
              </div>
              <div style={{ fontSize: 10, color: colors.textMuted, marginTop: 2 }}>
                München · Bewölkt
              </div>
            </div>
          </div>
        </div>

        {/* Mood strip */}
        <div style={{
          display: "flex", gap: 8, marginBottom: 28,
          overflowX: "auto",
        }}>
          {["Holzig-Warm", "Zitrus-Frisch", "Schwer-Opulent"].map((tag, i) => (
            <div
              key={tag}
              style={{
                flexShrink: 0,
                padding: "6px 14px", borderRadius: 99, fontSize: 10, fontWeight: 500,
                background: i === 0 ? colors.gold + "20" : colors.bgSurface,
                color: i === 0 ? colors.gold : colors.textMuted,
                border: `1px solid ${i === 0 ? colors.gold + "35" : colors.divider}`,
              }}
            >
              {tag}
            </div>
          ))}
        </div>

        {/* ── Primary recommendation ───────────────────────────────────── */}
        <div
          onClick={() => nav("detail", primary)}
          style={{
            background: `linear-gradient(160deg, ${primary.farbAccent}CC 0%, ${primary.farbAccent}44 50%, ${colors.bgSurface} 100%)`,
            borderRadius: 24,
            border: `1px solid ${colors.borderSubtle}`,
            overflow: "hidden",
            marginBottom: 20,
            cursor: "pointer",
            position: "relative",
          }}
        >
          {/* Large glow */}
          <div style={{
            position: "absolute", top: -40, right: -40, width: 200, height: 200,
            background: `radial-gradient(circle, ${primary.farbAccent}55, transparent 70%)`,
            pointerEvents: "none",
          }} />

          <div style={{ padding: "28px 28px 0", display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
            <div style={{ flex: 1, paddingRight: 16 }}>
              {/* Rank label */}
              <div style={{
                display: "inline-flex", alignItems: "center", gap: 6,
                padding: "5px 12px", borderRadius: 99,
                background: colors.gold + "20",
                border: `1px solid ${colors.gold}35`,
                marginBottom: 16,
              }}>
                <span style={{ fontSize: 10, color: colors.gold }}>✦</span>
                <span style={{ fontSize: 9, fontWeight: 700, color: colors.gold, letterSpacing: "0.1em", textTransform: "uppercase" }}>
                  Heutiger Pick
                </span>
              </div>

              <div style={{
                fontFamily: "'Cormorant Garamond', Georgia, serif",
                fontSize: 34, fontWeight: 600, color: colors.textPrimary,
                letterSpacing: "-0.02em", lineHeight: 1.05, marginBottom: 4,
              }}>
                {primary.name}
              </div>
              <div style={{ fontSize: 13, color: colors.textSecondary, marginBottom: 14 }}>
                {primary.maison}
              </div>
              <DuftfamilieTag familie={primary.familie} />
            </div>
            <BottleIcon accent={primary.farbAccent} size={120} />
          </div>

          {/* Reasoning */}
          <div style={{
            margin: "20px 28px 0",
            padding: "16px 20px",
            background: "rgba(0,0,0,0.35)",
            borderRadius: "14px 14px 0 0",
          }}>
            <div style={{
              fontSize: 9, fontWeight: 600, color: colors.gold,
              letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: 8,
            }}>
              Warum heute?
            </div>
            <div style={{
              fontSize: 13, color: colors.textSecondary, lineHeight: 1.6,
            }}>
              Bewölktes Wetter und 14°C sind ideal für holzig-frische Düfte.
              Aventus' Birken-Ananas-Akkord entfaltet sich besonders gut in kühler,
              feuchter Luft – ein zeitloser Begleiter für den Bürotag.
            </div>
          </div>

          {/* Füllstand indicator in card */}
          <div style={{
            padding: "16px 28px 24px",
            background: "rgba(0,0,0,0.35)",
          }}>
            <div style={{
              display: "flex", justifyContent: "space-between", alignItems: "center",
              marginBottom: 8,
            }}>
              <span style={{ fontSize: 10, color: colors.textMuted }}>Füllstand</span>
              <span style={{ fontSize: 10, fontWeight: 600, color: colors.goldDim }}>
                {primary.fuellstand}% · {primary.fuellstandMl} ml
              </span>
            </div>
            <div style={{ height: 3, background: "rgba(255,255,255,0.08)", borderRadius: 99, overflow: "hidden" }}>
              <div style={{
                height: "100%", width: `${primary.fuellstand}%`,
                background: `linear-gradient(90deg, ${colors.goldDim}, ${colors.gold})`,
                borderRadius: 99,
              }} />
            </div>
          </div>
        </div>

        {/* ── Algorithm note ───────────────────────────────────────────── */}
        {/* Algorithmuslogik: Empfehlung basiert auf Außentemperatur (kalt/kühl → holzig/orientalisch),
            Wochentag (Montag = Bürotag → frisch, nicht schwer), zuletzt getragenen Düften
            (Aventus 1 Tag Pause → wieder verfügbar) */}

        {/* ── Alternatives ────────────────────────────────────────────── */}
        <div style={{
          fontSize: 9, fontWeight: 600, color: colors.textMuted,
          letterSpacing: "0.12em", textTransform: "uppercase",
          marginBottom: 12,
        }}>
          Weitere Optionen
        </div>
        <div style={{ display: "flex", gap: 12 }}>
          {alts.map((f) => (
            <div
              key={f.id}
              onClick={() => nav("detail", f)}
              style={{
                flex: 1,
                background: colors.bgSurface,
                borderRadius: 16,
                border: `1px solid ${colors.divider}`,
                overflow: "hidden",
                cursor: "pointer",
              }}
            >
              <div style={{
                height: 100,
                background: `linear-gradient(160deg, ${f.farbAccent}CC, ${f.farbAccent}44)`,
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                <BottleIcon accent={f.farbAccent} size={64} />
              </div>
              <div style={{ padding: "10px 12px 14px" }}>
                <div style={{
                  fontSize: 12, fontWeight: 600, color: colors.textPrimary,
                  marginBottom: 2, lineHeight: 1.3,
                  overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
                }}>
                  {f.name}
                </div>
                <div style={{ fontSize: 10, color: colors.textMuted, marginBottom: 8, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                  {f.maison}
                </div>
                <DuftfamilieTag familie={f.familie} />
              </div>
            </div>
          ))}
        </div>
      </div>
      <HomeBar />
    </ScreenBase>
  );
}
