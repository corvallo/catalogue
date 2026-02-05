type InfoCardProps = {
  title: string;
  description: string;
};

export const InfoCard = ({ title, description }: InfoCardProps) => {
  return (
    <div
      style={{
        border: "1px solid #e3e7eb",
        borderRadius: 12,
        padding: 16,
        maxWidth: 360,
        background: "white",
      }}
    >
      <div style={{ fontWeight: 600, marginBottom: 6 }}>{title}</div>
      <div style={{ color: "#4b5a68" }}>{description}</div>
    </div>
  );
};
