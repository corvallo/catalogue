type ToggleProps = {
  label: string;
  checked: boolean;
  onChange: (next: boolean) => void;
};

export const Toggle = ({ label, checked, onChange }: ToggleProps) => {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      style={{
        display: "flex",
        alignItems: "center",
        gap: 10,
        background: "transparent",
        border: "none",
        padding: 0,
        cursor: "pointer",
        font: "inherit",
      }}
    >
      <span
        style={{
          width: 40,
          height: 22,
          borderRadius: 999,
          background: checked ? "#8dd2e8" : "#e1e7eb",
          position: "relative",
          display: "inline-flex",
          alignItems: "center",
        }}
      >
        <span
          style={{
            width: 18,
            height: 18,
            borderRadius: "50%",
            background: "#ffffff",
            position: "absolute",
            top: 2,
            left: checked ? 20 : 2,
            transition: "left 150ms ease",
          }}
        />
      </span>
      <span>{label}</span>
    </button>
  );
};
