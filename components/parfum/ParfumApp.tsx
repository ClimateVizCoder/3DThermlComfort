"use client";
import { useState } from "react";
import HomeScreen from "./screens/HomeScreen";
import KollektionScreen from "./screens/KollektionScreen";
import DetailScreen from "./screens/DetailScreen";
import KlimaScreen from "./screens/KlimaScreen";
import EmpfehlungScreen from "./screens/EmpfehlungScreen";
import EinstellungenScreen from "./screens/EinstellungenScreen";
import type { Flakon } from "./data";

export type Screen = "home" | "kollektion" | "detail" | "klima" | "empfehlung" | "einstellungen";

export default function ParfumApp() {
  const [screen, setScreen] = useState<Screen>("home");
  const [selectedFlakon, setSelectedFlakon] = useState<Flakon | null>(null);
  const [prevScreen, setPrevScreen] = useState<Screen>("home");

  function nav(to: Screen, flakon?: Flakon) {
    setPrevScreen(screen);
    if (flakon) setSelectedFlakon(flakon);
    setScreen(to);
  }

  return (
    <div
      style={{
        minHeight: "100dvh",
        background: "#0C0A09",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "'Inter', system-ui, sans-serif",
      }}
    >
      {/* Google Fonts */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;500;600;700&family=Inter:wght@300;400;500;600;700&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        :root { color-scheme: dark; }
        ::-webkit-scrollbar { display: none; }
        body { background: #0C0A09; }
      `}</style>

      {/* Phone shell */}
      <div
        style={{
          width: 390,
          height: 844,
          background: "#0C0A09",
          borderRadius: 48,
          overflow: "hidden",
          position: "relative",
          boxShadow: "0 40px 120px rgba(0,0,0,0.8), 0 0 0 1px rgba(255,255,255,0.08)",
          flexShrink: 0,
        }}
      >
        {/* Dynamic Island */}
        <div style={{
          position: "absolute", top: 12, left: "50%", transform: "translateX(-50%)",
          width: 120, height: 34, background: "#000", borderRadius: 20,
          zIndex: 100,
        }} />

        {/* Screens */}
        {screen === "home" && <HomeScreen nav={nav} />}
        {screen === "kollektion" && <KollektionScreen nav={nav} />}
        {screen === "detail" && selectedFlakon && (
          <DetailScreen flakon={selectedFlakon} nav={nav} />
        )}
        {screen === "klima" && <KlimaScreen nav={nav} />}
        {screen === "empfehlung" && <EmpfehlungScreen nav={nav} />}
        {screen === "einstellungen" && <EinstellungenScreen nav={nav} />}
      </div>

      {/* Screen selector strip – outside phone, for demo */}
      <nav
        style={{
          position: "fixed",
          bottom: 24,
          left: "50%",
          transform: "translateX(-50%)",
          display: "flex",
          gap: 8,
          background: "rgba(20,18,16,0.92)",
          backdropFilter: "blur(16px)",
          border: "1px solid rgba(200,169,110,0.14)",
          borderRadius: 99,
          padding: "8px 16px",
          zIndex: 999,
        }}
      >
        {(["home","kollektion","klima","empfehlung","einstellungen"] as Screen[]).map((s) => (
          <button
            key={s}
            onClick={() => nav(s)}
            style={{
              background: screen === s ? "#C8A96E" : "transparent",
              color: screen === s ? "#0C0A09" : "#6E665A",
              border: "none",
              borderRadius: 99,
              padding: "5px 12px",
              fontSize: 11,
              fontWeight: 500,
              fontFamily: "'Inter', sans-serif",
              cursor: "pointer",
              letterSpacing: "0.03em",
              transition: "all 0.2s",
              textTransform: "capitalize",
            }}
          >
            {s}
          </button>
        ))}
      </nav>
    </div>
  );
}
