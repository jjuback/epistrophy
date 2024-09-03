public class Album
{
    public required string Title { get; set; }

    public required string Cover { get; set; }

    public required IEnumerable<Track> Tracks { get; set; }
}
