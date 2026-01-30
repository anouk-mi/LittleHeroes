// Append unanswered questions to a JSONL log file.
declare const require: (module: string) => any; // Allow CommonJS require in TS.
declare const process: { cwd: () => string }; // Minimal process typing.

const fs = require("fs"); // Node file system module.
const path = require("path"); // Node path module.

const LOG_DIR = path.join(process.cwd(), "backend", "data");
const LOG_FILE = path.join(LOG_DIR, "unanswered_questions.jsonl");

type UnansweredRecord = {
  timestamp: string;
  character: string;
  message: string;
  reason: string;
};

function ensureLogFile(): void {
  if (!fs.existsSync(LOG_DIR)) {
    fs.mkdirSync(LOG_DIR, { recursive: true });
  }
  if (!fs.existsSync(LOG_FILE)) {
    fs.writeFileSync(LOG_FILE, "");
  }
}

export function logUnansweredQuestion(record: UnansweredRecord): void {
  try {
    ensureLogFile();
    const line = `${JSON.stringify(record)}\n`;
    fs.appendFileSync(LOG_FILE, line, "utf8");
  } catch {
    // Swallow logging errors to avoid breaking chat responses.
  }
}
