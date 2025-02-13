# Epistrophy

![Epistrophy](/public/apple-touch-icon.png?raw=true)

This project implements a static web app ([tinyurl.com/epistrophy](https://tinyurl.com/epistrophy)) that provides access to a library of audio files stored in Azure.\
It was bootstrapped with [Create React App](https://github.com/facebook/create-react-app) and uses the following technologies:
* [.NET 8.0](https://dotnet.microsoft.com/en-us/download/dotnet/8.0)
* ASP.NET Core [Minimal APIs](https://learn.microsoft.com/en-us/aspnet/core/fundamentals/minimal-apis/overview?view=aspnetcore-8.0) 
* Visual components from the [React Bootstrap](https://react-bootstrap.netlify.app/) framework
* [react-query](https://www.npmjs.com/package/@tanstack/react-query) for fetching, caching and updating asynchronous data in React
* [Azure Static Web Apps](https://learn.microsoft.com/en-us/azure/static-web-apps/) for hosting and deployment
* [GitHub Actions](https://github.com/features/actions) for building and deploying the app whenever a commit is pushed

The app provides a top-level list of artists that you can expand to reveal the available albums for each. In turn, selecting an album displays a list of its tracks with a standard HTML5 audio control for playback. Use the Genre control at the upper right to switch between Jazz and Classical collections. During playback on a mobile device, the lock screen displays album metadata including cover art via the [MediaSession](https://w3c.github.io/mediasession/#the-mediasession-interface) interface.

![Epistrophy](/images/Epistrophy.gif)

## Azure Resource Scripts

This project uses PowerShell scripts to create and update Azure resource groups and storage containers.\
The scripts iterate over one or more Windows music folders populated with Windows Media Player.

In the project directory, run the following scripts in this order:

### `confirm-storage`

Authenticates your Azure account and creates the following resources:
* Resource group (`media-resource-group`)
* Storage account (`epistrophy`)
* Storage containers (`cd-vault`, `cd-vault-classical`)

Re-running this script will not modify or delete any existing resources.\
Unless you add additional storage containers, you only need to run this script once.

### `update-blobs`

Uploads audio files and album cover art from a Windows media folder to an existing Azure storage container. Media folders are structured as in the following example:

```
John Coltrane
  My Favorite Things
    01 My Favorite Things.mp3
    02 Everytime We Say Goodbye.mp3
    03 Summertime.mp3
    04 But Not For Me.mp3
    Folder.jpg
```

Where `Folder.jpg` is a hidden image file representing album cover art. If Windows Media Player cannot locate an image automatically, you need to search for one, copy it to the appropriate folder, and set its hidden attribute from the command line. A reasonable image size is 720x720 pixels. 

### `update-catalog`

Builds a JSON manifest file from the resources previously uploaded to the Azure storage containers. For example, the media subfolder shown above is represented in the manifest file as follows (where the Index value _n_ is an ordinal number assigned by this script):

```
{
  "Name": "John Coltrane",
  "Index": n,
  "DisplayName": "John \u003cb\u003eColtrane\u003c/b\u003e",
  "Albums": [
    {
      "Title": "My Favorite Things",
      "Cover": "John Coltrane/My Favorite Things/Folder.jpg",
      "Tracks": [
        {
          "Title": "My Favorite Things",
          "Url": "John Coltrane/My Favorite Things/01 My Favorite Things.mp3"
        },
        {
          "Title": "Everytime We Say Goodbye",
          "Url": "John Coltrane/My Favorite Things/02 Everytime We Say Goodbye.mp3"
        },
        {
          "Title": "Summertime",
          "Url": "John Coltrane/My Favorite Things/03 Summertime.mp3"
        },
        {
          "Title": "But Not For Me",
          "Url": "John Coltrane/My Favorite Things/04 But Not For Me.mp3"
        }
      ]
    }
  ]
}
```

The manifest file is included as an embedded resource in the web API project. When the first API call is made, it is deserialized into a data structure that mirrors the API routes used by the React app.

## API Endpoints

The API root is published without authentication at `https://epistrophy-api.azurewebsites.net`.

URL | Description
--- | -----------
`/` | Returns the entire catalog. Not used by the app, but included for completeness.
`/genres` | Returns an array of the available genres corresponding to Azure storage containers.
`/genres/i/artists` | Returns an array of the artists for the specified genre.
`/genres/i/artists/n` | Returns info for the specified artist, including an array of albums with track details.

## Source Files (Web API)

File | Description
---- | -----------
`catalog.json` | Output from the `update-catalog` script. Contains an array for each storage container (genre).
`index.json` | Used by the `update-catalog` script to sort and format display names for artists.
`Catalog.cs` | Contains static methods that implement API endpoints.
`Program.cs` | Creates the web application that surfaces API endpoints.
`<Models>` | Folder containing POCO objects representing genres, artists, albums, and tracks.

## Source Files (React App)

File | Description
---- | -----------
`App.js` | The main page of the app. Displays a list of artists or the selected album, if any.
`Artists.js` | A scrollable list of artists for the selected genre. Clicking an artist reveals their available albums.
`ArtistDetail.js` | Displays the available albums for the selected artist.
`Album.js` | Displays the tracks for the selected album. Includes an audio control for playback.

