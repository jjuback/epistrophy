### Upload new media from the local Music folder
Function Upload-Blob {
    [CmdletBinding()]
    Param(
        [Parameter(ValueFromPipeline=$true)]$item
    )
    Begin {}
    Process
    {
        $exists = $true
        $blob = Resolve-Path -Relative -LiteralPath $item.FullName
        try
        {
            $GetBlobParams = @{
                Container = $ContainerName
                Blob = $blob
                Context = $Context
            }
            Get-AzStorageBlob @GetBlobParams -ErrorAction Stop
        }
        catch [Microsoft.WindowsAzure.Commands.Storage.Common.ResourceNotFoundException]
        {
            $exists = $false
        }
        finally
        {
            if (!$exists)
            {
                $SetBlobParams = @{
                    File = $item.FullName
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
Get-ChildItem -Path $HOME/Music -File -Recurse | Upload-Blob

# Upload hidden image files
Get-ChildItem -Path $HOME/Music -File -Recurse -Hidden -Filter "Folder.jpg" | Upload-Blob

# Restore current directory
Pop-Location
