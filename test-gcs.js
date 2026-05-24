async function test() {
  try {
    const get1 = await fetch('https://api.screenapp.io/v2/files/shared/kNV5bPTxa5', { headers: { 'Origin': 'https://example.com' } });
    const json = await get1.json();
    const url = json?.data?.file?.alternativeFormats?.mp3?.url || json?.data?.file?.url;
    console.log('Got audio URL:', url);

    const get = await fetch(url, { headers: { 'Origin': 'https://example.com' } });
    console.log('GCS GET', get.status, get.headers.get('access-control-allow-origin'));
  } catch (e) {
    console.error(e);
  }
}
test();
