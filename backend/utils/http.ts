// HTTP helpers used by the backend. 

export function applyCors(res: any): void { // Apply CORS headers.
  res.setHeader("Access-Control-Allow-Origin", "*"); // Allow all origins for local dev.
  res.setHeader("Access-Control-Allow-Headers", "Content-Type"); // Allow JSON header.
  res.setHeader("Access-Control-Allow-Methods", "POST,OPTIONS"); // Allow POST and OPTIONS.
} 

export function readRequestBody(req: any): Promise<string> { // Read raw request body.
  return new Promise((resolve) => { // Return a promise that resolves with body text.
    let body = ""; // Accumulate body chunks here.
    req.on("data", (chunk: string) => { // Handle incoming data chunks.
      body += chunk; // Append chunk.
    }); // End data handler.
    req.on("end", () => { // When request ends.
      resolve(body); // Resolve with full body string.
    }); 
  }); 
} 

export function sendJson(res: any, status: number, payload: any): void { // Send JSON response.
  res.statusCode = status; // Set HTTP status.
  res.setHeader("Content-Type", "application/json"); // Set JSON content type.
  res.end(JSON.stringify(payload)); // Send JSON payload.
} 
