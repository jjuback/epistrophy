# Epistrophy

![Epistrophy](/public/apple-touch-icon.png?raw=true)

This project implements a static web app ([tinyurl.com/epistrophy](https://tinyurl.com/epistrophy)) that provides access to a library of audio files stored in Azure. It was bootstrapped with [Create React App](https://github.com/facebook/create-react-app) and uses visual components from the [React Bootstrap](https://react-bootstrap.netlify.app/) framework. GitHub Actions are used to build and deploy the app whenever a commit is pushed.

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

### `update-manifest`

Builds a JSON manifest file from the resources previously uploaded to the Azure storage containers. This file is used to populate the main screen of the application, providing a top-level list of artists that you can expand to reveal the available albums for each. In turn, selecting an album displays a list of its tracks with a standard HTML5 audio control for playback.

For example, the media subfolder shown above is represented in the manifest file as follows:

```
{
  "Name": "John Coltrane",
  "Index": "Coltrane",
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

## Source Files

File | Description
---- | -----------
`App.js` | The main page of the app. Displays a list of artists or the selected album, if any.
`Artists.js` | A scrollable list of artists. Clicking an artist reveals their available albums.
`Album.js` | Displays the tracks for the selected album. Includes an audio control for playback.
`data.js` | Output from the `update-manifest` script. Contains an array for each storage container (genre).
`index.json` | Used by the `update-manifest` script to sort and format display names for artists.
