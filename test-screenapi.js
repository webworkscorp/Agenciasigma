async function test() {
  try {
    const opts = await fetch('https://api.screenapp.io/v2/files/shared/kNV5bPTxa5', { method: 'OPTIONS', headers: { 'Origin': 'https://example.com' } });
    console.log('OPTIONS', opts.status, opts.headers.get('access-control-allow-origin'));

    const get = await fetch('https://api.screenapp.io/v2/files/shared/kNV5bPTxa5', { headers: { 'Origin': 'https://example.com' } });
    console.log('GET', get.status, get.headers.get('access-control-allow-origin'));
  } catch (e) {
    console.error(e);
  }
}
test();
