import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "LOMAS AI";
export const size = {
  width: 1200,
  height: 630
};
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          width: "100%",
          height: "100%",
          background:
            "linear-gradient(135deg, #ffffff 0%, #eef0ff 40%, #e8fbff 100%)",
          color: "#0e1726",
          padding: "56px",
          fontFamily: "sans-serif"
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            width: "100%",
            height: "100%",
            borderRadius: "36px",
            border: "1px solid rgba(255,255,255,0.8)",
            background: "rgba(255,255,255,0.72)",
            padding: "48px"
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "18px"
            }}
          >
            <div
              style={{
                display: "flex",
                width: "72px",
                height: "72px",
                borderRadius: "24px",
                alignItems: "center",
                justifyContent: "center",
                background: "#101728",
                color: "#ffffff",
                fontSize: "28px",
                fontWeight: 700
              }}
            >
              LA
            </div>
            <div
              style={{
                fontSize: "30px",
                letterSpacing: "0.28em",
                fontWeight: 700
              }}
            >
              LOMAS AI
            </div>
          </div>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "22px",
              maxWidth: "760px"
            }}
          >
            <div
              style={{
                fontSize: "68px",
                lineHeight: 1.05,
                fontWeight: 800
              }}
            >
              AI-driven learning infrastructure for modern classrooms
            </div>
            <div
              style={{
                fontSize: "30px",
                lineHeight: 1.4,
                color: "#36445d"
              }}
            >
              Intelligent products for teaching, engagement, and scalable
              educational delivery across India.
            </div>
          </div>
        </div>
      </div>
    ),
    size
  );
}
