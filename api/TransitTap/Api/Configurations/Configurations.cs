namespace Api.Configurations;

public class PolicyOptions
{
    public const string SectionName = "Policies";

    public string Cors { get; set; } = string.Empty;
    public string Streaming { get; set; } = string.Empty;
}