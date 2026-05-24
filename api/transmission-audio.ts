export default async function handler(req, res) {
  try {
    const shareId = req.query.id || "kNV5bPTxa5";
    console.log(`[Vercel Redirect] Fetching screenapp shared file metadata for ${shareId}...`);
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
    
    console.log("[Vercel Redirect] Redirecting to signed URL...");
    res.redirect(302, audioUrl);
  } catch (error) {
    console.error("[Vercel Proxy] Error fetching audio URL:", error.message);
    res.status(500).send(`Failed to redirect secure audio: ${error.message}`);
  }
}

