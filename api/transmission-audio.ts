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
    res.setHeader("Content-Type", audioRes.headers.get("Content-Type") || "audio/mpeg");
    res.setHeader("Content-Length", buffer.length);
    res.setHeader("Cache-Control", "public, max-age=86400");
    
    res.status(200).send(buffer);
  } catch (error) {
    console.error("[Vercel Proxy] Error fetching audio URL:", error.message);
    res.status(500).send(`Failed to proxy secure audio: ${error.message}`);
  }
}

