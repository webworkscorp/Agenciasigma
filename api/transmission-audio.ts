export default async function handler(req, res) {
  try {
    const shareId = req.query.id || "kNV5bPTxa5";
    console.log(`[Vercel Proxy] Fetching screenapp shared file metadata for ${shareId}...`);
    const metaRes = await fetch(`https://api.screenapp.io/v2/files/shared/${shareId}`);
    if (!metaRes.ok) {
      throw new Error(`Screenapp API returned status ${metaRes.status}`);
    }
    
    const metaJson = await metaRes.json();
    
    // Extract signed MP3 URL or falls back to M4A URL
    let audioUrl = metaJson?.data?.file?.alternativeFormats?.mp3?.url || metaJson?.data?.file?.url;
    if (!audioUrl) {
      throw new Error("Could not find audio URL in screenapp metadata payload");
    }
    
    console.log("[Vercel Proxy] Downloading audio buffer...");
    const audioRes = await fetch(audioUrl);
    if (!audioRes.ok) {
      throw new Error(`Google Storage returned status ${audioRes.status}`);
    }
    
    const arrayBuffer = await audioRes.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    
    // Set CORS and headers
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, HEAD, OPTIONS");
    res.setHeader("Accept-Ranges", "bytes");
    
    const range = req.headers.range;
    if (range) {
      const parts = range.replace(/bytes=/, "").split("-");
      const start = parseInt(parts[0], 10);
      const end = parts[1] ? parseInt(parts[1], 10) : buffer.length - 1;
      const chunksize = (end - start) + 1;
      res.writeHead(206, {
        "Content-Range": `bytes ${start}-${end}/${buffer.length}`,
        "Content-Length": chunksize,
        "Content-Type": audioRes.headers.get("Content-Type") || "audio/mpeg",
      });
      res.end(buffer.subarray(start, end + 1));
    } else {
      res.writeHead(200, {
        "Content-Length": buffer.length,
        "Content-Type": audioRes.headers.get("Content-Type") || "audio/mpeg",
        "Cache-Control": "public, max-age=86400"
      });
      res.end(buffer);
    }
  } catch (error) {
    console.error("[Vercel Proxy] Error fetching audio URL:", error.message);
    res.status(500).send(`Failed to proxy secure audio: ${error.message}`);
  }
}

