export function formatINR(value: number, opts: { compact?: boolean; decimals?: number; sign?: boolean } = {}): string {
  const { compact = false, decimals = 0, sign = false } = opts;
  const signStr = sign && value > 0 ? "+" : value < 0 ? "−" : "";
  const abs = Math.abs(value);
  if (compact && abs >= 100000) {
    if (abs >= 10000000) return `${signStr}₹${(abs / 10000000).toFixed(2)}Cr`;
    return `${signStr}₹${(abs / 100000).toFixed(2)}L`;
  }
  return `${signStr}₹${abs.toLocaleString("en-IN", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  })}`;
}

export function formatPct(value: number, opts: { sign?: boolean; decimals?: number } = {}): string {
  const { sign = true, decimals = 2 } = opts;
  const signStr = sign && value > 0 ? "+" : "";
  return `${signStr}${value.toFixed(decimals)}%`;
}

export function formatDate(d: Date): string {
  return d.toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long" });
}

export function formatDay(d: Date): string {
  return d.toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short" });
}
