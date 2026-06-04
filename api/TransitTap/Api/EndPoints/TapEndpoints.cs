using System.Text.Json;
using Api.Interfaces;

namespace Api.EndPoints;

public static class TapEndpoints
{
    public static void RegisterTapEndPoints(this WebApplication app)
    {
        app.MapGet("/taps", async (HttpContext ctx, ITapEventsService ts, JsonSerializerOptions jsonOptions,
            CancellationToken ct) =>
        {
            ctx.Response.ContentType = "text/event-stream";
            ctx.Response.Headers["Cache-Control"] = "no-cache";
            ctx.Response.Headers["X-Accel-Buffering"] = "no";

            await foreach (var tap in ts.GetTapEvents(ct))
            {
                var json = JsonSerializer.Serialize(tap, jsonOptions);
                await ctx.Response.WriteAsync($"data: {json}\n\n", ct);
                await ctx.Response.Body.FlushAsync(ct);
            }

            await ctx.Response.WriteAsync("event: close\ndata: stream-finished\n\n", ct);
            await ctx.Response.Body.FlushAsync(ct);
        });
    }
}