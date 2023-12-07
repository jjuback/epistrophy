### Run after new media has been uploaded

# Represents an album track
class Track {
    [string]$Title
    [string]$Url

    Track([string]$Title, [string]$Url) {
        $this.Title = $Title
        $this.Url = $Url
    }
}

# Represents a collection of tracks with cover art
class Album {
    [string]$Title
    [string]$Cover
    [System.Collections.Generic.List[Track]]$Tracks

    Album([string]$Title) {
        $this.Title = $Title
        $this.Tracks = New-Object "System.Collections.Generic.List[Track]"
    }
}

# Represents an artist with a collection of albums
class Artist {
    [string]$Name
    [System.Collections.Generic.List[Album]]$Albums

    Artist([string]$Name) {
        $this.Name = $Name
        $this.Albums = New-Object "System.Collections.Generic.List[Album]"
    }
}

# Process an individual blob storage item (either an audio file or JPEG image)
Function Process-Blob {
    [CmdletBinding()]
    Param(
        [Parameter(ValueFromPipeline=$true)]$blob
    )
    Begin {}
    Process
    {
        $items = $blob.Name.Split("/")
        $artist = $items[0]
        $album = $items[1]
        $url = $items[2]

        # Find or create the artist
        $objArtist = $global:Artists | Where-Object { $_.Name -eq $artist }
        if ($objArtist -eq $null) {
            $objArtist = [Artist]::new($artist)
            $global:Artists.Add($objArtist)    
        }

        # Find or create the album
        $objAlbum = $objArtist.Albums | Where-Object { $_.Title -eq $album }
        if ($objAlbum -eq $null) {
            $objAlbum = [Album]::new($album)
            $objArtist.Albums.Add($objAlbum)
        }
        
        # Append an audio track to the album or set its cover art
        if (!$url.EndsWith(".jpg")) {
            $title = $url | Select-String -Pattern "^[0-9]+\s(.+)\..+$"
            $title = $title.Matches.Groups[1].Value
            $objTrack = [Track]::new($title, $blob.Name)
            $objAlbum.Tracks.Add($objTrack)
        } else {
            $objAlbum.Cover = $blob.Name
        }
    }
    End {}
}

# Access Azure storage account
$StorageAccount = Get-AzStorageAccount -ResourceGroupName "media-resource-group" -Name "epistrophy"
$Context = $StorageAccount.Context

# Create empty list of artists
$global:Artists = New-Object "System.Collections.Generic.List[Artist]"

# Process all blobs in the storage container
$vault = Get-AzStorageContainer -Name "cd-vault" -Context $Context
$vault | Get-AzStorageBlob | Process-Blob

# Output the artist list as a Javascript array
$json = ".\\src\\data.js"
"export const cdVault =" | Out-File -FilePath $json
ConvertTo-Json $global:Artists -Depth 5 | Out-File -Append -FilePath $json
