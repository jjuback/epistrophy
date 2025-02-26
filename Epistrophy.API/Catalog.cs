using System.Text.Json;
using System.Linq;
using System.Diagnostics;

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

    public static IEnumerable<SearchResult> Search(int genre, string text)
    {
        EnsureResource();
        var artists = _catalog![genre].Artists;
        return from artist in artists
               from album in artist.Albums
               from track in album.Tracks
               where track.Title.ToLower().Contains(text.ToLower())
               select new SearchResult()
               {
                   Artist = artist.Name,
                   Album = album.Title,
                   Cover = album.Cover,
                   Title = track.Title,
                   Url = track.Url
               };
    }
}