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
        TapStatus.DeniedInsufficientFunds
    ];

    public async IAsyncEnumerable<TapStreamPayload> GetTapEvents(
        [EnumeratorCancellation] CancellationToken cancellationToken = default)
    {
        var cardStates = new Dictionary<string, TapEvent>();
        const string mockCardToken = "tkn_27rSqew9gZSjJ45xSi1yqKfa";

        int totalEvents = 0;
        int tapIns = 0;
        int tapOuts = 0;
        int declined = 0;
        int errors = 0;

        while (!cancellationToken.IsCancellationRequested)
        {
            await Task.Delay(Random.Shared.Next(500, 2000), cancellationToken);

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

            // Yield using your updated record signature
            yield return new TapStreamPayload(
                Tap: tap,
                Summary: new TapSummary(totalEvents, tapIns, tapOuts, declined, errors)
            );
        }
    }
}