using System.Text.Json;
using Api.Enums;
using Api.Interfaces;
using Api.Models;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.Extensions.DependencyInjection;
using NSubstitute;

namespace Tests;

public class TapEndpointsTests : IClassFixture<WebApplicationFactory<Program>>
{
    private readonly WebApplicationFactory<Program> _factory;
    private readonly ITapEventsService _mockTapService;

    public TapEndpointsTests(WebApplicationFactory<Program> factory)
    {
        _mockTapService = Substitute.For<ITapEventsService>();

        _factory = factory.WithWebHostBuilder(builder =>
        {
            builder.ConfigureServices(services =>
            {
                services.AddSingleton(_mockTapService);
            });
        });
    }

    [Fact]
    public async Task GetTaps_StreamsDataAndClosesCorrectly()
    {
        // Arrange
        var mockTap = new Tap
        {
            EventId = Guid.NewGuid(),
            DeviceId = Guid.NewGuid(),
            DeviceName = "DEVICE ONE TEST",
            Timestamp = DateTime.UtcNow,
            CardToken = "CARD_TOKEN_ONE",
            Event = TapEvent.TapIn,
            Status = TapStatus.Success
        };

        var mockSummary = new TapSummary(1, 1, 0, 0, 0);

        // Update to return your new wrapped DTO shape
        var expectedPayloads = new[]
        {
            new TapStreamPayload(mockTap, mockSummary)
        };

        // Update to match the new service method signature
        _mockTapService.GetTapEvents(false,Arg.Any<CancellationToken>())
            .Returns(expectedPayloads.ToAsyncEnumerable());

        var client = _factory.CreateClient();

        // Act
        using var response = await client.GetAsync("/taps", HttpCompletionOption.ResponseHeadersRead);

        // Assert Headers
        Assert.True(response.IsSuccessStatusCode);
        Assert.Equal("text/event-stream", response.Content.Headers.ContentType?.MediaType);
        Assert.Equal("no-cache", response.Headers.CacheControl?.ToString());

        await using var stream = await response.Content.ReadAsStreamAsync();
        using var reader = new StreamReader(stream);

        var lines = new List<string>();

        while (await reader.ReadLineAsync() is { } line)
        {
            if (!string.IsNullOrWhiteSpace(line))
            {
                lines.Add(line);
            }
        }

        var dataLine = lines.FirstOrDefault(l => l.StartsWith("data: "));
        
        Assert.NotNull(dataLine);

        var jsonPayload = dataLine["data: ".Length..];
        var options = new JsonSerializerOptions(JsonSerializerDefaults.Web);
        var deserializedPayload = JsonSerializer.Deserialize<TapStreamPayload>(jsonPayload, options);

        Assert.NotNull(deserializedPayload);
        Assert.Equal("DEVICE ONE TEST", deserializedPayload.Tap.DeviceName);
        Assert.Equal(1, deserializedPayload.Summary.Total);
        Assert.Contains("event: close", lines);
        Assert.Contains("data: stream-finished", lines);
    }
}