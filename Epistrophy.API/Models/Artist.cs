public class ArtistBase
{
    public required string Name { get; set; }

    public required int Index { get; set; }

    public required string DisplayName { get; set; }
}

public class Artist : ArtistBase
{
    public required IEnumerable<Album> Albums { get; set; }
}
