// Minimal .env loader for local development.
declare const require: (module: string) => any; // Allow CommonJS require in TS.
declare const process: { cwd: () => string; env: Record<string, string | undefined> }; // Minimal process typing.

const fs = require("fs"); // Node file system module.
const path = require("path"); // Node path module.

function parseLine(line: string): { key: string; value: string } | null {
  const trimmed = line.trim();
  if (!trimmed || trimmed.startsWith("#")) return null;
  const eqIndex = trimmed.indexOf("=");
  if (eqIndex === -1) return null;
  const key = trimmed.slice(0, eqIndex).trim();
  let value = trimmed.slice(eqIndex + 1).trim();
  if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
    value = value.slice(1, -1);
  }
  if (!key) return null;
  return { key, value };
}

export function loadEnv(): void {
  const envPath = path.join(process.cwd(), ".env");
  if (!fs.existsSync(envPath)) return;
  const content = fs.readFileSync(envPath, "utf8");
  const lines = content.split(/\r?\n/);
  lines.forEach((line) => {
    const parsed = parseLine(line);
    if (!parsed) return;
    if (process.env[parsed.key] === undefined) {
      process.env[parsed.key] = parsed.value;
    }
  });
}
