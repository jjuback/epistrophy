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
    [string]$Index
    [string]$DisplayName
    [System.Collections.Generic.List[Album]]$Albums

    Artist([string]$Name) {
        $this.Name = $Name
        $hash = $global:Index.Item($Name)
        $this.Index = $(if ($null -eq $hash) {$Name} else {$hash[0]})
        $this.DisplayName = $(if ($null -eq $hash) {$Name} else {$hash[1]})
        $this.Albums = New-Object "System.Collections.Generic.List[Album]"
    }
}

# Process an individual blob storage item (either an audio file or JPEG image)
Function Update-Blob-Manifest {
    [CmdletBinding()]
    Param(
        [Parameter(ValueFromPipeline=$true)]$blob
    )
    Process
    {
        $items = $blob.Name.Split("/")
        if ($items.Length -eq 1) { return }

        $artist = $items[0]
        $album = $items[1]
        $url = $items[2]
        $esc = $blob.Name -replace '#', '%23'

        # Find or create the artist
        $objArtist = $global:Artists | Where-Object { $_.Name -eq $artist }
        if ($null -eq $objArtist) {
            $objArtist = [Artist]::new($artist)
            $global:Artists.Add($objArtist)    
        }

        # Find or create the album
        $objAlbum = $objArtist.Albums | Where-Object { $_.Title -eq $album }
        if ($null -eq $objAlbum) {
            $objAlbum = [Album]::new($album)
            $objArtist.Albums.Add($objAlbum)
        }
        
        # Append an audio track to the album or set its cover art
        if (!$url.EndsWith(".jpg")) {
            $title = $url | Select-String -Pattern "^[0-9]+\s(.+)\..+$"
            $title = $title.Matches.Groups[1].Value
            $objTrack = [Track]::new($title, $esc)
            $objAlbum.Tracks.Add($objTrack)
        } else {
            $objAlbum.Cover = $esc
        }
    }
}

# Build an array of artists/albums/tracks from blobs in a named storage container
Function Build-Manifest-Array {
    [CmdletBinding()]
    Param(
        [string]$ContainerName
    )
    Process {
        # Access Azure storage account
        $StorageAccount = Get-AzStorageAccount -ResourceGroupName "media-resource-group" -Name "epistrophy"
        $Context = $StorageAccount.Context

        # Create empty list of artists
        $global:Artists = New-Object "System.Collections.Generic.List[Artist]"

        # Load index of artists
        $global:Index = Get-Content -Raw ".\\index.json" | ConvertFrom-Json -AsHashtable

        # Process all blobs in the storage container
        $vault = Get-AzStorageContainer -Name $ContainerName -Context $Context
        $vault | Get-AzStorageBlob | Update-Blob-Manifest

        # Sort the artist list
        $global:Artists = $global:Artists | Sort-Object "Index"

        # Return manifest array as JSON string
        return ConvertTo-Json $global:Artists -Depth 5 -EscapeHandling EscapeHtml
    }
}

# Output artist lists by genre as Javascript arrays
$json = ".\\src\\data.js"

"export const cdVault =" | Out-File -FilePath $json
Build-Manifest-Array -ContainerName "cd-vault" | Out-File -Append -FilePath $json

"export const cdVaultClassical =" | Out-File -Append -FilePath $json
Build-Manifest-Array -ContainerName "cd-vault-classical" | Out-File -Append -FilePath $json
