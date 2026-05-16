"use client";

export default function EmptyState({
  message = "No data found",
  action,
}: {
  message?: string;
  action?: React.ReactNode;
}) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "64px 32px",
        background: "#fff",
        borderRadius: 16,
        border: "2px dashed #e2e8f0",
        textAlign: "center",
        gap: 16,
      }}
    >
      <div
        style={{
          width: 72,
          height: 72,
          borderRadius: 20,
          background: "linear-gradient(135deg, #eff6ff, #ecfeff)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 32,
          boxShadow: "0 4px 16px rgba(37,99,235,0.1)",
        }}
      >
        📭
      </div>
      <div>
        <div style={{ fontSize: 16, fontWeight: 600, color: "#1e293b", marginBottom: 6 }}>
          {message}
        </div>
        <div style={{ fontSize: 13, color: "#94a3b8" }}>Nothing to display here yet.</div>
      </div>
      {action ? (
        <div
          style={{
            marginTop: 4,
            padding: "10px 22px",
            background: "linear-gradient(135deg, #2563eb, #0891b2)",
            borderRadius: 10,
            fontSize: 14,
            fontWeight: 600,
            color: "#fff",
            boxShadow: "0 2px 8px rgba(37,99,235,0.3)",
          }}
        >
          {action}
        </div>
      ) : null}
    </div>
  );
}
