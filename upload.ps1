### Upload new media from the local Music folder

Function Upload-Blob {
    [CmdletBinding()]
    Param(
        [Parameter(ValueFromPipelineByPropertyName)]
        [string]$FullName
    )
    Begin {}
    Process
    {
        $exists = $false
        $blob = Resolve-Path -LiteralPath $FullName -Relative
        $blob = $blob -replace '\\', '/'
        $blob = $blob -replace '\./', ''
        $find = $blob -replace '(\[|\])', '[$1]'
        try
        {
            $GetBlobParams = @{
                Container = $ContainerName
                Blob = $find
                Context = $Context
            }
            $result = Get-AzStorageBlob @GetBlobParams -ErrorAction Stop
            $exists = $result.Length -gt 0
        }
        finally
        {
            if (!$exists)
            {
                $SetBlobParams = @{
                    File = $FullName
                    Container = $ContainerName
                    Blob = $blob
                    Context = $Context
                }
                Set-AzStorageBlobContent @SetBlobParams
            }
        }
    }
    End {}
}

# Set global storage account variables
$global:StorageAccount = Get-AzStorageAccount -ResourceGroupName "media-resource-group" -Name "epistrophy"
$global:Context = $StorageAccount.Context
$global:ContainerName = 'cd-vault'

# Change current directory
Push-Location $HOME/Music

# Upload non-hidden audio files
Get-ChildItem -LiteralPath $HOME/Music -File -Recurse | Upload-Blob

# Upload hidden image files
Get-ChildItem -LiteralPath $HOME/Music -File -Recurse -Hidden -Filter "Folder.jpg" | Upload-Blob

# Restore current directory
Pop-Location
