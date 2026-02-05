export const encodeStoryId = (value: string) => {
  const encoded = btoa(value)
    .replaceAll("+", "-")
    .replaceAll("/", "_")
    .replaceAll("=", "");
  return encoded;
};

export const decodeStoryId = (value: string) => {
  const padded = value.replaceAll("-", "+").replaceAll("_", "/");
  const padLength = padded.length % 4 === 0 ? 0 : 4 - (padded.length % 4);
  const withPadding = padded + "=".repeat(padLength);
  try {
    return atob(withPadding);
  } catch {
    return value;
  }
};
