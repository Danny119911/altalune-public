export default {
    async fetch(request, env, ctx) {
        const url = new URL(request.url);
        
        // Intercept POST requests to the waitlist API
        if (url.pathname === '/api/subscribe' && request.method === 'POST') {
            try {
                const { email } = await request.json();
                
                // Server-side email validation
                if (!email || !email.includes('@') || email.length < 5) {
                    return new Response(
                        JSON.stringify({ success: false, error: "Please enter a valid email address." }),
                        { status: 400, headers: { 'Content-Type': 'application/json' } }
                    );
                }
                
                // Check if D1 database binding 'DB' is available
                if (!env.DB) {
                    return new Response(
                        JSON.stringify({ success: false, error: "Database binding 'DB' is missing in wrangler.jsonc. Please configure your D1 database binding." }),
                        { status: 500, headers: { 'Content-Type': 'application/json' } }
                    );
                }
                
                // Insert the email subscription into the database
                const timestamp = new Date().toISOString();
                await env.DB.prepare(
                    "INSERT INTO subscribers (email, created_at) VALUES (?, ?)"
                ).bind(email, timestamp).run();
                
                return new Response(
                    JSON.stringify({ success: true }),
                    { status: 200, headers: { 'Content-Type': 'application/json' } }
                );
                
            } catch (err) {
                // Handle unique constraint (already subscribed)
                if (err.message && err.message.includes("UNIQUE constraint failed")) {
                    return new Response(
                        JSON.stringify({ success: true, alreadySubscribed: true }),
                        { status: 200, headers: { 'Content-Type': 'application/json' } }
                    );
                }
                
                return new Response(
                    JSON.stringify({ success: false, error: err.message || "Database insert failure." }),
                    { status: 500, headers: { 'Content-Type': 'application/json' } }
                );
            }
        }
        
        // Fall back to serving static files from the asset directory
        return env.ASSETS.fetch(request);
    }
};
