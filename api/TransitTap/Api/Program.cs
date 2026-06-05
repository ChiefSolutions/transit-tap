using System.Text.Json;
using System.Threading.RateLimiting;
using Api.Configurations;
using Api.EndPoints;
using Api.Extensions;
using Api.Interfaces;
using Api.Services;

var builder = WebApplication.CreateBuilder(args);
var allowedOrigins = builder.Configuration.GetSection("AllowedOrigins").Get<string[]>() ?? Array.Empty<string>();
var policies = builder.Configuration.GetSection(PolicyOptions.SectionName).Get<PolicyOptions>()
               ?? throw new InvalidOperationException($"{PolicyOptions.SectionName} config is missing.");

// Add services to the container.
// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
builder.Services.AddOpenApi();
builder.Services.AddScoped<ITapEventsService, TapEventsService>();
builder.Services.AddSingleton(new JsonSerializerOptions { PropertyNamingPolicy = JsonNamingPolicy.CamelCase });
builder.Services.AddCustomCors(policies.Cors, allowedOrigins);

if (builder.Environment.IsProduction())
{
    builder.Services.AddCustomRateLimiter(policies.Streaming);
}

var app = builder.Build();

app.UseHttpsRedirection();
app.UseCors(policies.Cors); // Fixed hardcoded string bug

if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}
else if (app.Environment.IsProduction())
{
    app.UseDefaultFiles();
    app.UseStaticFiles();
    app.UseRateLimiter();
    app.MapFallbackToFile("index.html");
}

app.RegisterTapEndPoints(app.Environment.IsProduction());

app.Run();