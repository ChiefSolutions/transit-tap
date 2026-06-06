using System.Text.Json.Serialization;

namespace Api.Models;

[JsonConverter(typeof(JsonStringEnumConverter))]
public enum TapStatus
{
    Success,
    Declined,
    SystemError
}