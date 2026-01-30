// Primary RAG retrieval (use primary-rag files: character identity, style, and guardrails). 
// Reads ai/primary-rag/<character-slug> and returns formatted context.

declare const require: (module: string) => any; // Allow CommonJS require in TS.
declare const process: { cwd: () => string }; // Provide minimal process typing.

const fs = require("fs"); // Node file system module.
const path = require("path"); // Node path module.

export type PrimaryRagResult = { // Return shape for primary RAG.
  context: string; // Combined identity + style context.
  guardrails: any; // Guardrails JSON object.
  characterId: string; // Character ID string.
  characterName: string; // Character display name.
}; 

function readJsonSafe(filePath: string): any { // Read JSON with fallback.
  if (!fs.existsSync(filePath)) return {}; // Return empty if missing.
  try { // Try parsing JSON.
    return JSON.parse(fs.readFileSync(filePath, "utf8")); // Parse JSON content.
  } catch { // If JSON is invalid.
    return {}; // Return empty object.
  } 
} 

function formatSection(title: string, data: any): string { // Format one context block.
  return `## ${title}\n${JSON.stringify(data, null, 2)}\n`; // Markdown section.
} 

export function loadPrimaryRag(characterSlug: string): PrimaryRagResult { // Load primary RAG.
  const baseDir = path.join(process.cwd(), "ai", "primary-rag", characterSlug); // Base path.
  const identityPath = path.join(baseDir, "identity.json"); // Identity file path.
  const stylePath = path.join(baseDir, "style.json"); // Style file path.
  const guardrailsPath = path.join(baseDir, "guardrails.json"); // Guardrails file path.

  const identity = readJsonSafe(identityPath); // Read identity JSON.
  const style = readJsonSafe(stylePath); // Read style JSON.
  const guardrails = readJsonSafe(guardrailsPath); // Read guardrails JSON.

  const characterId = identity.character_id || characterSlug; // Use id or slug.
  const characterName = identity.character?.name || characterSlug; // Use name or slug.

  const context = [ // Build context sections.
    formatSection("Identity", identity), // Identity section.
    formatSection("Style", style), // Style section.
  ].join("\n"); // Join sections.

  return { context, guardrails, characterId, characterName }; // Return result.
} 
