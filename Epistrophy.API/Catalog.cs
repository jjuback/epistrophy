using System.Text.Json;

public static class Catalog
{
    private static Genre[]? _catalog = null;

    private static void EnsureResource()
    {
        if (_catalog == null)
        {
        	var assembly = typeof(Program).Assembly;
	        using var stream = assembly.GetManifestResourceStream("Epistrophy.API.catalog.json");
        	if (stream == null)
		        throw new ArgumentException("Resource not found");
	        using TextReader reader = new StreamReader(stream);
            string json = reader.ReadToEnd();
            _catalog = (Genre[])JsonSerializer.Deserialize(json, typeof(Genre[]))!;
        }
    }

    public static Genre[] All
    {
        get
        {
            EnsureResource();
            return _catalog!;
        }
    }

    public static GenreBase[] Genres
    {
        get
        {
            EnsureResource();
            return _catalog!.Cast<GenreBase>().ToArray();
        }
    }

    public static ArtistBase[] Artists(int genre)
    {
        EnsureResource();
        return _catalog![genre].Artists.Cast<ArtistBase>().ToArray();
    }

    public static Artist Artist(int genre, int index)
    {
        EnsureResource();
        return _catalog![genre].Artists.ElementAt(index);
    }
}