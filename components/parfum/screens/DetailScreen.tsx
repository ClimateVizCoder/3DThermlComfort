"use client";
import { Screen } from "../ParfumApp";
import { Flakon } from "../data";
import { colors, familyColorMap } from "../uiTokens";
import {
  ScreenBase, FuellstandBar, DuftfamilieTag, SectionLabel,
  Divider, BottleIcon, HomeBar,
} from "../ui";

function NoteTag({ note, color }: { note: string; color: string }) {
  return (
    <span style={{
      display: "inline-block",
      padding: "4px 10px", borderRadius: 99,
      fontSize: 10, fontWeight: 500, color,
      background: color + "15",
      border: `1px solid ${color}25`,
    }}>
      {note}
    </span>
  );
}

function PyramidRow({
  label, notes, color, opacity = 1,
}: { label: string; notes: string[]; color: string; opacity?: number }) {
  return (
    <div style={{ display: "flex", alignItems: "flex-start", gap: 16 }}>
      <div style={{
        minWidth: 80, fontSize: 10, fontWeight: 600,
        color, textTransform: "uppercase", letterSpacing: "0.1em",
        paddingTop: 4, opacity,
      }}>
        {label}
      </div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 6, flex: 1 }}>
        {notes.map((n) => (
          <NoteTag key={n} note={n} color={color} />
        ))}
      </div>
    </div>
  );
}

export default function DetailScreen({ flakon: f, nav }: {
  flakon: Flakon; nav: (s: Screen) => void;
}) {
  const familyColor = familyColorMap[f.familie] ?? colors.gold;

  return (
    <ScreenBase>
      {/* ── Hero ──────────────────────────────────────────────────────── */}
      <div style={{
        height: 320, position: "relative",
        background: `linear-gradient(160deg, ${f.farbAccent}EE, ${f.farbAccent}66 60%, ${colors.bgBase})`,
        display: "flex", alignItems: "center", justifyContent: "center",
        overflow: "hidden",
        flexShrink: 0,
      }}>
        {/* Glow */}
        <div style={{
          position: "absolute", inset: 0,
          background: `radial-gradient(circle at 60% 40%, ${f.farbAccent}55 0%, transparent 70%)`,
        }} />

        <BottleIcon accent={f.farbAccent} size={160} />

        {/* Bottom fade */}
        <div style={{
          position: "absolute", bottom: 0, left: 0, right: 0, height: 100,
          background: `linear-gradient(transparent, ${colors.bgBase})`,
        }} />

        {/* Back button */}
        <button
          onClick={() => nav("kollektion")}
          style={{
            position: "absolute", top: 56, left: 20,
            width: 38, height: 38, borderRadius: 99,
            background: "rgba(0,0,0,0.45)", backdropFilter: "blur(8px)",
            border: `1px solid rgba(255,255,255,0.12)`,
            color: colors.textPrimary, fontSize: 18,
            display: "flex", alignItems: "center", justifyContent: "center",
            cursor: "pointer",
          }}
        >
          ‹
        </button>

        {/* Recommendation badge */}
        <div style={{
          position: "absolute", bottom: 48, left: 24,
          display: "inline-flex", alignItems: "center", gap: 6,
          padding: "6px 12px", borderRadius: 99,
          background: colors.gold + "22",
          border: `1px solid ${colors.gold}40`,
          backdropFilter: "blur(8px)",
        }}>
          <span style={{ fontSize: 9, color: colors.gold }}>✦</span>
          <span style={{ fontSize: 10, fontWeight: 600, color: colors.gold, letterSpacing: "0.04em" }}>
            Empfohlen für heute
          </span>
        </div>
      </div>

      {/* ── Content ───────────────────────────────────────────────────── */}
      <div style={{ padding: "24px 24px 110px" }}>

        {/* Name block */}
        <div style={{ marginBottom: 20 }}>
          <div style={{
            fontFamily: "'Cormorant Garamond', Georgia, serif",
            fontSize: 36, fontWeight: 600, color: colors.textPrimary,
            letterSpacing: "-0.02em", lineHeight: 1.05, marginBottom: 6,
          }}>
            {f.name}
          </div>
          <div style={{
            fontSize: 14, color: colors.textSecondary, marginBottom: 12,
          }}>
            {f.maison}
          </div>
          {/* Meta pills */}
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8, alignItems: "center" }}>
            {[f.konzentration, `${f.jahr}`, f.familie].map((tag, i) => (
              <span
                key={i}
                style={{
                  padding: "4px 12px", borderRadius: 99, fontSize: 10, fontWeight: 500,
                  background: i === 2 ? familyColor + "18" : colors.bgElevated,
                  color: i === 2 ? familyColor : colors.textSecondary,
                  border: `1px solid ${i === 2 ? familyColor + "30" : colors.divider}`,
                }}
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        <Divider mt={4} mb={24} />

        {/* Füllstand */}
        <div style={{ marginBottom: 28 }}>
          <SectionLabel>Füllstand</SectionLabel>
          <FuellstandBar
            pct={f.fuellstand}
            ml={f.fuellstandMl}
            kapazitaet={f.kapazitaetMl}
            height={6}
          />
        </div>

        <Divider mt={0} mb={24} />

        {/* Duftpyramide */}
        <div style={{ marginBottom: 28 }}>
          <SectionLabel>Duftpyramide</SectionLabel>
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <PyramidRow label="Kopfnote" notes={f.kopfnoten} color={colors.goldLight} />
            <PyramidRow label="Herznote" notes={f.herznoten} color={colors.gold} />
            <PyramidRow label="Basisnote" notes={f.basisnoten} color={colors.goldDim} opacity={0.9} />
          </div>
        </div>

        <Divider mt={0} mb={24} />

        {/* Tragehäufigkeit */}
        <div style={{
          display: "flex", justifyContent: "space-between", alignItems: "center",
          marginBottom: 28,
        }}>
          <div>
            <SectionLabel>Zuletzt getragen</SectionLabel>
            <div style={{ fontSize: 15, fontWeight: 600, color: colors.textPrimary }}>
              {f.zuletztGetragen}
            </div>
          </div>
          <div style={{
            textAlign: "right",
          }}>
            <div style={{
              fontFamily: "'Cormorant Garamond', Georgia, serif",
              fontSize: 32, fontWeight: 600, color: colors.gold, lineHeight: 1,
            }}>
              {f.tragediesenMonat}×
            </div>
            <div style={{ fontSize: 10, color: colors.textMuted, marginTop: 2 }}>
              diesen Monat
            </div>
          </div>
        </div>

        {/* Action buttons */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 12 }}>
          <button style={{
            padding: "13px 0", borderRadius: 12,
            background: colors.bgSurface,
            border: `1px solid ${colors.divider}`,
            color: colors.textSecondary, fontSize: 12, fontWeight: 500,
            fontFamily: "'Inter', sans-serif", cursor: "pointer",
          }}>
            Füllstand ↑
          </button>
          <button style={{
            padding: "13px 0", borderRadius: 12,
            background: colors.bgSurface,
            border: `1px solid ${colors.divider}`,
            color: colors.textSecondary, fontSize: 12, fontWeight: 500,
            fontFamily: "'Inter', sans-serif", cursor: "pointer",
          }}>
            ♡ Wunschliste
          </button>
        </div>
        <button style={{
          width: "100%", padding: "13px 0", borderRadius: 12,
          background: colors.gold + "14",
          border: `1px solid ${colors.gold}28`,
          color: colors.gold, fontSize: 12, fontWeight: 600,
          fontFamily: "'Inter', sans-serif", cursor: "pointer",
        }}>
          + Notiz hinzufügen
        </button>
      </div>

      <HomeBar />
    </ScreenBase>
  );
}
