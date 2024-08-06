# Upload a local media item if it does not exist in the storage container
Function Update-Blob-Item {
    [CmdletBinding()]
    Param(
        [Parameter(ValueFromPipelineByPropertyName)]
        [string]$FullName
    )
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
        catch
        {
            $exists = $false
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
}

# Recursively scan a local folder and upload blobs as needed
Function Update-Blob-Container {
    [CmdletBinding()]
    Param(
        [string]$Name,
        [string]$LocalPath
    )
    Process
    {
        # Set global storage account variables
        $StorageAccount = Get-AzStorageAccount -ResourceGroupName "media-resource-group" -Name "epistrophy"
        $global:Context = $StorageAccount.Context
        $global:ContainerName = $Name

        # Change current directory
        Push-Location $LocalPath

        # Upload non-hidden audio files
        Get-ChildItem -LiteralPath $LocalPath -File -Recurse | Update-Blob-Item

        # Upload hidden image files
        Get-ChildItem -LiteralPath $LocalPath -File -Recurse -Hidden -Filter "Folder.jpg" | Update-Blob-Item

        # Restore current directory
        Pop-Location
    }
}

# Scan local media folders and update Azure storage containers accordingly
Update-Blob-Container -Name 'cd-vault' -LocalPath $HOME/Music
Update-Blob-Container -Name 'cd-vault-classical' -LocalPath $HOME/"Classical Music"
