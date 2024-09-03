public class GenreBase
{
    public required string Name { get; set; }

    public required int Index { get; set; }
}

public class Genre : GenreBase
{
    public required IEnumerable<Artist> Artists { get; set; }
}
