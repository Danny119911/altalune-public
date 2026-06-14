// Altalune Static Site Router
export default {
  async fetch(request) {
    const url = new URL(request.url);
    let pathname = url.pathname;

    // Default to index.html for root
    if (pathname === '/') {
      pathname = '/index.html';
    }

    // Route /v2/* to /V2/*
    if (pathname.startsWith('/v2/')) {
      pathname = pathname.replace('/v2/', '/V2/');
    }

    // Default to index.html for directory paths
    if (pathname.endsWith('/')) {
      pathname += 'index.html';
    }

    try {
      return await fetch(new Request(pathname, request));
    } catch (e) {
      // Return 404 if file not found
      return new Response('404 - File Not Found', { status: 404 });
    }
  }
};
