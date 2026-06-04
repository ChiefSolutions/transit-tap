using Api.Enums;

namespace Api.Models;


public record Tap
{
    public Guid EventId { get; set; }
    public Guid DeviceId { get; set; }

    public string DeviceName { get; set; }
    public DateTime Timestamp { get; set; }
    public string CardToken { get; set; }
    public TapEvent Event { get; set; }
    public TapStatus Status { get; set; }
};

public record TapStreamPayload(
    Tap Tap,
    TapSummary Summary
);

public record TapSummary(
    int Total,
    int TapIns,
    int TapOuts,
    int Declined,
    int Errors
);