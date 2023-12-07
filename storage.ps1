### Run once to create Azure storage resources

# Create resource group
Connect-AzAccount
$Location = 'eastus'
$ResourceGroup = 'media-resource-group'
New-AzResourceGroup -Name $ResourceGroup -Location $Location

# Create storage account
$StorageParams = @{
   ResourceGroupName = $ResourceGroup
   Name = 'epistrophy'
   SkuName = 'Standard_LRS'
   Location = $Location
   AccessTier = 'Cool'
}
$StorageAccount = New-AzStorageAccount @StorageParams

# Create storage container
$Context = $StorageAccount.Context
$ContainerName = 'cd-vault'
New-AzStorageContainer -Name $ContainerName -Context $Context -Permission Blob
