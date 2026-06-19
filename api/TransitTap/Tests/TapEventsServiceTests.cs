using Api.Enums;
using Api.Models;
using Api.Services;
using Xunit;

namespace Tests; // Matches your separate test project namespace

public class TapEventsServiceTests
{
    [Fact]
    public async Task GetTapEvents_StreamsValidData_AndAbortsOnCancellation()
    {
        // Arrange
        var service = new TapEventsService();
        using var cts = new CancellationTokenSource();
        var generatedPayloads = new List<TapStreamPayload>();

        // Act
        cts.CancelAfter(TimeSpan.FromSeconds(5));

        try
        {
            await foreach (var payload in service.GetTapEvents(false, cts.Token))
            {
                generatedPayloads.Add(payload);
                
                if (generatedPayloads.Count >= 3)
                {
                    await cts.CancelAsync();
                }
            }
        }
        catch (OperationCanceledException)
        {
            // Expected exception when Task.Delay handles the cancellation token
        }

        // Assert
        Assert.Equal(3, generatedPayloads.Count);
        
        // Structure Validation on the Nested Tap
        var firstPayload = generatedPayloads[0];
        var firstTap = firstPayload.Tap;
        
        Assert.NotEqual(Guid.Empty, firstTap.EventId);
        Assert.NotEqual(Guid.Empty, firstTap.DeviceId);
        Assert.NotNull(firstTap.DeviceName);
        Assert.Equal("tkn_27rSqew9gZSjJ45xSi1yqKfa", firstTap.CardToken);
        Assert.True(firstTap.Timestamp <= DateTime.UtcNow);

        // Value Range Validation
        Assert.Contains(firstTap.Status, new[] { TapStatus.Success, TapStatus.Declined });
        Assert.Contains(firstTap.Event, new[] { TapEvent.TapIn, TapEvent.TapOut });

        // Summary Accumulation Validation
        var finalSummary = generatedPayloads[^1].Summary; // Get the last payload's summary
        Assert.Equal(3, finalSummary.Total);
        Assert.True(finalSummary.TapIns >= 0);
        Assert.True(finalSummary.TapOuts >= 0);
        Assert.Equal(finalSummary.TapIns + finalSummary.TapOuts, finalSummary.Total);
    }

    [Fact]
    public async Task GetTapEvents_WhenCancelledImmediately_ReturnsEmptyStream()
    {
        // Arrange
        var service = new TapEventsService();
        using var cts = new CancellationTokenSource();
        await cts.CancelAsync(); 

        var generatedPayloads = new List<TapStreamPayload>();

        // Act
        await foreach (var payload in service.GetTapEvents(false, cts.Token))
        {
            generatedPayloads.Add(payload);
        }

        // Assert
        Assert.Empty(generatedPayloads);
    }

    [Fact]
    public async Task GetTapEvents_ShouldStopStreaming_WhenCancelledInFlight()
    {
        // Arrange
        var service = new TapEventsService();
        using var cts = new CancellationTokenSource();
        var generatedPayloads = new List<TapStreamPayload>();

        // Act
        try
        {
            await foreach (var payload in service.GetTapEvents(false, cts.Token))
            {
                generatedPayloads.Add(payload);

                if (generatedPayloads.Count == 2)
                {
                    await cts.CancelAsync();
                }
            }
        }
        catch (OperationCanceledException)
        {
            // Expected
        }

        // Assert
        Assert.Equal(2, generatedPayloads.Count);
    }
}