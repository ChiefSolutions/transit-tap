using Api.Models;

namespace Api.Interfaces;

public interface ITapEventsService
{
    IAsyncEnumerable<TapStreamPayload> GetTapEvents(CancellationToken cancellationToken);
}