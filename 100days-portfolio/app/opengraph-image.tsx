import { ImageResponse } from "next/og";

export const alt = "100 DAYS / VIBE CODING — Make. Every × Day.";
export const dynamic = "force-static";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          background: "#f3efe5",
          color: "#171814",
          display: "flex",
          flexDirection: "column",
          height: "100%",
          padding: "68px 72px 48px",
          position: "relative",
          width: "100%",
        }}
      >
        <div
          style={{
            background: "#dfff00",
            height: 13,
            left: 0,
            position: "absolute",
            top: 0,
            width: "100%",
          }}
        />
        <div style={{ display: "flex", fontSize: 25, fontWeight: 700, letterSpacing: 5 }}>
          FURUTAHSS / 001—100
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            fontSize: 142,
            fontWeight: 900,
            letterSpacing: -11,
            lineHeight: 0.88,
            marginTop: 60,
          }}
        >
          <span style={{ fontSize: 106, letterSpacing: -8, marginBottom: 18 }}>MAKE.</span>
          <span>EVERY</span>
          <span>DAY.</span>
        </div>
        <div
          style={{
            alignItems: "center",
            background: "#171814",
            borderRadius: 999,
            color: "#f3efe5",
            display: "flex",
            fontSize: 70,
            fontWeight: 400,
            height: 114,
            justifyContent: "center",
            left: 590,
            position: "absolute",
            top: 245,
            transform: "rotate(7deg)",
            width: 114,
          }}
        >
          ×
        </div>
        <div
          style={{
            alignItems: "center",
            background: "#171814",
            borderRadius: 24,
            display: "flex",
            height: 290,
            justifyContent: "center",
            position: "absolute",
            right: 70,
            top: 160,
            width: 290,
          }}
        >
          <div
            style={{
              alignItems: "center",
              background: "#dfff00",
              borderRadius: 999,
              color: "#171814",
              display: "flex",
              fontSize: 150,
              height: 202,
              justifyContent: "center",
              width: 202,
            }}
          >
            ×
          </div>
        </div>
        <div
          style={{
            bottom: 48,
            display: "flex",
            fontSize: 25,
            fontWeight: 700,
            justifyContent: "space-between",
            left: 72,
            letterSpacing: 1,
            position: "absolute",
            right: 72,
          }}
        >
          <span>100 DAYS OF VIBE CODING</span>
          <span>ONGOING</span>
        </div>
      </div>
    ),
    size,
  );
}
