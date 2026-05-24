import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";

async function startServer() {
  const app = express();
  const PORT = 3000;

  // API dynamic proxy to fetch screenapp shared audio file
  app.get("/api/transmission-audio", async (req, res) => {
    try {
      const shareId = (req.query.id as string) || "kNV5bPTxa5";
      console.log(`[Proxy] Fetching screenapp shared file metadata for ${shareId}...`);
      const metaRes = await fetch(`https://api.screenapp.io/v2/files/shared/${shareId}`);
      if (!metaRes.ok) {
        throw new Error(`Screenapp API returned status ${metaRes.status}`);
      }
      
      const metaJson: any = await metaRes.json();
      
      // Extract signed MP3 URL or falls back to M4A URL
      let audioUrl = metaJson?.data?.file?.alternativeFormats?.mp3?.url || metaJson?.data?.file?.url;
      if (!audioUrl) {
        throw new Error("Could not find audio URL in screenapp metadata payload");
      }
      
      console.log("[Proxy] Streaming audio from signed URL...");
      const audioRes = await fetch(audioUrl);
      if (!audioRes.ok) {
        throw new Error(`Google Storage returned status ${audioRes.status}`);
      }
      
      // Set headers for audio streaming
      res.setHeader("Content-Type", audioRes.headers.get("Content-Type") || "audio/mpeg");
      const contentLength = audioRes.headers.get("Content-Length");
      if (contentLength) {
        res.setHeader("Content-Length", contentLength);
      }
      res.setHeader("Accept-Ranges", "bytes");
      res.setHeader("Cache-Control", "no-cache");
      
      // Pipe Web ReadableStream to Node WritableStream
      if (audioRes.body) {
        const reader = audioRes.body.getReader();
        const pump = async () => {
          try {
            const { done, value } = await reader.read();
            if (done) {
              res.end();
              return;
            }
            res.write(Buffer.from(value));
            pump();
          } catch (err) {
            console.error("[Proxy] Stream piping error:", err);
            res.end();
          }
        };
        await pump();
      } else {
        res.status(500).send("Audio body stream not available");
      }
    } catch (error: any) {
      console.error("[Proxy] Error fetching or streaming audio:", error.message);
      res.status(500).send(`Failed to stream secure audio: ${error.message}`);
    }
  });

  // Health check endpoint
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
  });
}

startServer();
