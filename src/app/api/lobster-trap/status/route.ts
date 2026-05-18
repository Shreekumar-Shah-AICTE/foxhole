export const dynamic = "force-dynamic";

export async function GET() {
  const proxyUrl = process.env.LOBSTER_TRAP_URL || "http://localhost:8080";
  
  try {
    // Attempt a fast healthcheck request to the local Lobster Trap proxy
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 1000); // 1s quick timeout

    const response = await fetch(proxyUrl, {
      method: "GET",
      signal: controller.signal,
      headers: { "Accept": "application/json" }
    });

    clearTimeout(timeoutId);

    // If we get any response (even a 404 or 403), the proxy port is open and listening!
    return new Response(JSON.stringify({ active: true, url: proxyUrl }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  } catch (error) {
    // Port closed or proxy container not started yet
    return new Response(JSON.stringify({ active: false, url: proxyUrl }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  }
}
