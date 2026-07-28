"use client";
import { CSSProperties, ReactNode } from "react";
import { colors } from "../uiTokens";
import { familyColorMap } from "../uiTokens";

// ── StatusBar ────────────────────────────────────────────────────────────────
export function StatusBar() {
  return (
    <div style={{
      position: "absolute", top: 0, left: 0, right: 0,
      height: 56, display: "flex", alignItems: "flex-end",
      paddingBottom: 10, paddingLeft: 24, paddingRight: 24,
      zIndex: 10,
    }}>
      <span style={{ fontSize: 15, fontWeight: 600, color: colors.textPrimary, letterSpacing: -0.3 }}>
        9:41
      </span>
    </div>
  );
}

// ── ScreenBase ───────────────────────────────────────────────────────────────
export function ScreenBase({ children, style }: { children: ReactNode; style?: CSSProperties }) {
  return (
    <div style={{
      position: "absolute", inset: 0,
      background: colors.bgBase,
      overflowY: "auto",
      overflowX: "hidden",
      ...style,
    }}>
      {children}
    </div>
  );
}

// ── FüllstandBar ─────────────────────────────────────────────────────────────
export function FuellstandBar({ pct, ml, kapazitaet, height = 4 }:
  { pct: number; ml?: number; kapazitaet?: number; height?: number }) {
  return (
    <div>
      <div style={{
        height, background: colors.divider, borderRadius: 99, overflow: "hidden",
      }}>
        <div style={{
          height: "100%",
          width: `${pct}%`,
          background: pct > 30
            ? `linear-gradient(90deg, ${colors.goldDim}, ${colors.gold})`
            : colors.statusWarn,
          borderRadius: 99,
          transition: "width 0.6s cubic-bezier(0.22,1,0.36,1)",
        }} />
      </div>
      {ml !== undefined && (
        <div style={{
          display: "flex", justifyContent: "space-between", marginTop: 5,
        }}>
          <span style={{ fontSize: 10, color: colors.goldDim, fontWeight: 500 }}>
            ~{ml} ml
          </span>
          <span style={{ fontSize: 10, color: colors.textMuted }}>
            {kapazitaet} ml · {pct}%
          </span>
        </div>
      )}
    </div>
  );
}

// ── DuftfamilieTag ────────────────────────────────────────────────────────────
export function DuftfamilieTag({ familie }: { familie: string }) {
  const c = familyColorMap[familie] ?? colors.gold;
  return (
    <span style={{
      display: "inline-block",
      padding: "3px 9px",
      borderRadius: 99,
      fontSize: 9,
      fontWeight: 600,
      letterSpacing: "0.06em",
      textTransform: "uppercase",
      color: c,
      background: c + "1A",
      border: `1px solid ${c}28`,
    }}>
      {familie}
    </span>
  );
}

// ── StatusBadge ───────────────────────────────────────────────────────────────
export function StatusBadge({ type, label }: { type: "ok" | "warn" | "alert"; label: string }) {
  const cfg = {
    ok:    { c: colors.statusOk,    icon: "●" },
    warn:  { c: colors.statusWarn,  icon: "●" },
    alert: { c: colors.statusAlert, icon: "●" },
  }[type];
  return (
    <div style={{
      display: "inline-flex", alignItems: "center", gap: 7,
      padding: "7px 14px", borderRadius: 99,
      background: cfg.c + "15",
      border: `1px solid ${cfg.c}28`,
    }}>
      <span style={{ fontSize: 7, color: cfg.c, lineHeight: 1 }}>{cfg.icon}</span>
      <span style={{ fontSize: 11, fontWeight: 500, color: cfg.c }}>{label}</span>
    </div>
  );
}

// ── AlertBanner ───────────────────────────────────────────────────────────────
export function AlertBanner({ type, title, body }: {
  type: "info" | "warn" | "critical"; title: string; body: string;
}) {
  const cfg = {
    info:     { c: colors.gold,        icon: "ℹ" },
    warn:     { c: colors.statusWarn,  icon: "⚠" },
    critical: { c: colors.statusAlert, icon: "✕" },
  }[type];
  return (
    <div style={{
      display: "flex", gap: 12, padding: "14px 16px", borderRadius: 14,
      background: cfg.c + "12",
      border: `1px solid ${cfg.c}28`,
    }}>
      <span style={{ fontSize: 16, color: cfg.c, lineHeight: 1.2 }}>{cfg.icon}</span>
      <div>
        <div style={{ fontSize: 12, fontWeight: 600, color: cfg.c, marginBottom: 2 }}>{title}</div>
        <div style={{ fontSize: 11, color: colors.textSecondary, lineHeight: 1.5 }}>{body}</div>
      </div>
    </div>
  );
}

// ── SectionLabel ─────────────────────────────────────────────────────────────
export function SectionLabel({ children }: { children: ReactNode }) {
  return (
    <div style={{
      fontSize: 9, fontWeight: 600, color: colors.textMuted,
      letterSpacing: "0.12em", textTransform: "uppercase",
      marginBottom: 12,
    }}>
      {children}
    </div>
  );
}

// ── Card ──────────────────────────────────────────────────────────────────────
export function Card({ children, style, onClick }: {
  children: ReactNode; style?: CSSProperties; onClick?: () => void;
}) {
  return (
    <div
      onClick={onClick}
      style={{
        background: colors.bgSurface,
        borderRadius: 16,
        border: `1px solid ${colors.divider}`,
        overflow: "hidden",
        cursor: onClick ? "pointer" : undefined,
        transition: onClick ? "transform 0.15s, opacity 0.15s" : undefined,
        ...style,
      }}
      onMouseDown={onClick ? (e) => (e.currentTarget.style.opacity = "0.75") : undefined}
      onMouseUp={onClick ? (e) => (e.currentTarget.style.opacity = "1") : undefined}
      onMouseLeave={onClick ? (e) => (e.currentTarget.style.opacity = "1") : undefined}
    >
      {children}
    </div>
  );
}

// ── GoldButton ────────────────────────────────────────────────────────────────
export function GoldButton({ label, onClick, fullWidth, variant = "filled" }: {
  label: string; onClick?: () => void; fullWidth?: boolean;
  variant?: "filled" | "ghost";
}) {
  return (
    <button
      onClick={onClick}
      style={{
        width: fullWidth ? "100%" : undefined,
        display: "inline-flex", alignItems: "center", justifyContent: "center",
        padding: "14px 24px", borderRadius: 12,
        background: variant === "filled"
          ? `linear-gradient(135deg, ${colors.goldDim}, ${colors.gold})`
          : "transparent",
        color: variant === "filled" ? "#0C0A09" : colors.gold,
        border: variant === "ghost" ? `1px solid ${colors.borderSubtle}` : "none",
        fontSize: 13, fontWeight: 600,
        fontFamily: "'Inter', sans-serif",
        cursor: "pointer",
        letterSpacing: "0.01em",
      }}
    >
      {label}
    </button>
  );
}

// ── BottomHomeBar ─────────────────────────────────────────────────────────────
export function HomeBar() {
  return (
    <div style={{
      position: "absolute", bottom: 8, left: "50%", transform: "translateX(-50%)",
      width: 134, height: 5, background: colors.textPrimary,
      borderRadius: 99, opacity: 0.18,
    }} />
  );
}

// ── Divider ───────────────────────────────────────────────────────────────────
export function Divider({ mt = 20, mb = 20 }: { mt?: number; mb?: number }) {
  return (
    <div style={{
      height: 1, background: colors.divider,
      marginTop: mt, marginBottom: mb,
    }} />
  );
}

// ── BottomSheetAction ─────────────────────────────────────────────────────────
export function BottomSheetAction({ icon, label, onClick }: {
  icon: string; label: string; onClick?: () => void;
}) {
  return (
    <button
      onClick={onClick}
      style={{
        width: "100%", display: "flex", alignItems: "center", gap: 14,
        padding: "15px 0", background: "none", border: "none",
        color: colors.textPrimary, fontSize: 15, fontWeight: 400,
        fontFamily: "'Inter', sans-serif", cursor: "pointer",
        borderBottom: `1px solid ${colors.divider}`,
      }}
    >
      <span style={{ fontSize: 18, color: colors.gold, width: 24, textAlign: "center" }}>
        {icon}
      </span>
      {label}
    </button>
  );
}

// ── FlakBotlleIcon ─────────────────────────────────────────────────────────────
export function BottleIcon({ accent, size = 80 }: { accent: string; size?: number }) {
  const w = size * 0.42;
  const h = size;
  return (
    <svg width={w} height={h} viewBox="0 0 42 80" fill="none">
      {/* Cap */}
      <rect x="14" y="0" width="14" height="10" rx="3" fill={accent} opacity="0.6" />
      {/* Neck */}
      <rect x="16" y="9" width="10" height="16" rx="2" fill={accent} opacity="0.35" />
      {/* Shoulder curve */}
      <path d="M8 25 Q8 24 16 24 L26 24 Q34 24 34 25 L36 30 H6 Z"
        fill={accent} opacity="0.25" />
      {/* Body */}
      <rect x="6" y="29" width="30" height="44" rx="5" fill={accent} opacity="0.22" />
      {/* Liquid fill (subtle gradient) */}
      <rect x="6" y="29" width="30" height="44" rx="5"
        fill="url(#liquidGrad)" opacity="0.12" />
      {/* Highlight reflection */}
      <rect x="10" y="34" width="5" height="24" rx="2.5"
        fill="white" opacity="0.08" />
      <defs>
        <linearGradient id="liquidGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="white" stopOpacity="0.5" />
          <stop offset="100%" stopColor="white" stopOpacity="0" />
        </linearGradient>
      </defs>
    </svg>
  );
}
