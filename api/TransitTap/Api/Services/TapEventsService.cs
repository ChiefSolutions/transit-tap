using System.Runtime.CompilerServices;
using Api.Enums;
using Api.Interfaces;
using Api.Models;

namespace Api.Services;

public class TapEventsService() : ITapEventsService
{
    private static readonly (Guid Id, string Name)[] Devices;

    static TapEventsService()
    {
        Devices = new (Guid Id, string Name)[6];
        for (var i = 0; i < 3; i++)
        {
            Devices[i] = (Guid.NewGuid(), $"TRAM LINE {i + 1:D2}"); // TRAM LINE 01, 02, 03
            Devices[i + 3] = (Guid.NewGuid(), $"BUS LINE {i + 1:D2}"); // BUS LINE 01, 02, 03
        }
    }

    private static readonly TapStatus[] Statuses =
    [
        TapStatus.Success,
        TapStatus.Success,
        TapStatus.Success,
        TapStatus.Declined
    ];

    public async IAsyncEnumerable<TapStreamPayload> GetTapEvents(
        bool isProd,
        [EnumeratorCancellation] CancellationToken cancellationToken = default)
    {
        // TODO - SignalR to properly tie down time limits
        using var timeoutCts = new CancellationTokenSource(TimeSpan.FromMinutes(15));
        using var linkedCts = CancellationTokenSource.CreateLinkedTokenSource(cancellationToken, isProd ? timeoutCts.Token : CancellationToken.None);

        const string mockCardToken = "tkn_27rSqew9gZSjJ45xSi1yqKfa";
        const int minDelay = 500;
        const int maxStream = 500;
        
        var cardStates = new Dictionary<string, TapEvent>();
        var maxDelay = isProd ? 5000 : 2000;
        var totalEvents = 0;
        var tapIns = 0;
        var tapOuts = 0;
        var declined = 0;
        var errors = 0;
        var counter = 1;
        

        while (!linkedCts.Token.IsCancellationRequested && counter <= maxStream)
        {
            await Task.Delay(Random.Shared.Next(minDelay, maxDelay), cancellationToken);

            var device = Devices[Random.Shared.Next(Devices.Length)];
            var status = Statuses[Random.Shared.Next(Statuses.Length)];

            cardStates.TryGetValue(mockCardToken, out var lastEvent);
            var nextEvent = lastEvent == TapEvent.TapIn ? TapEvent.TapOut : TapEvent.TapIn;

            if (status == TapStatus.Success)
            {
                cardStates[mockCardToken] = nextEvent;
            }

            // Stats accumulation
            totalEvents++;
            if (nextEvent == TapEvent.TapIn) tapIns++;
            if (nextEvent == TapEvent.TapOut) tapOuts++;
            if (status != TapStatus.Success) declined++;
            if (status == TapStatus.SystemError) errors++;

            var tap = new Tap
            {
                EventId = Guid.NewGuid(),
                DeviceId = device.Id,
                DeviceName = device.Name,
                Timestamp = DateTime.UtcNow,
                CardToken = mockCardToken,
                Event = nextEvent,
                Status = status
            };
            
            counter++;

            // Yield using your updated record signature
            yield return new TapStreamPayload(
                Tap: tap,
                Summary: new TapSummary(totalEvents, tapIns, tapOuts, declined, errors)
            );
        }
    }
}