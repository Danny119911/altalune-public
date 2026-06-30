export async function onRequestPost(context) {
    const { request, env } = context;
    
    try {
        const { email } = await request.json();
        
        // Basic server-side email validation
        if (!email || !email.includes('@') || email.length < 5) {
            return new Response(
                JSON.stringify({ success: false, error: "Please enter a valid email address." }),
                { status: 400, headers: { 'Content-Type': 'application/json' } }
            );
        }
        
        // Check if D1 database binding 'DB' exists
        if (!env.DB) {
            return new Response(
                JSON.stringify({ success: false, error: "Database binding 'DB' is missing on Cloudflare. Please set up D1 bindings in your project settings." }),
                { status: 500, headers: { 'Content-Type': 'application/json' } }
            );
        }
        
        // Insert into D1 subscribers table
        const timestamp = new Date().toISOString();
        await env.DB.prepare(
            "INSERT INTO subscribers (email, created_at) VALUES (?, ?)"
        ).bind(email, timestamp).run();
        
        return new Response(
            JSON.stringify({ success: true }),
            { status: 200, headers: { 'Content-Type': 'application/json' } }
        );
        
    } catch (err) {
        // Handle unique constraint violation (email already exists)
        if (err.message && err.message.includes("UNIQUE constraint failed")) {
            return new Response(
                JSON.stringify({ success: true, alreadySubscribed: true }),
                { status: 200, headers: { 'Content-Type': 'application/json' } }
            );
        }
        
        return new Response(
            JSON.stringify({ success: false, error: err.message || "Database execution failure." }),
            { status: 500, headers: { 'Content-Type': 'application/json' } }
        );
    }
}
