# Ensure that a storage account exists in the specified resource group
Function Confirm-Storage-Account {
   [CmdletBinding()]
   Param(
      [string]$ResourceGroupName,
      [string]$Name
   )
   Begin
   {
      $Location = 'eastus'
   }
   Process
   {
      # Create resource group if it does not already exist
      $ResourceGroup = Get-AzResourceGroup -Name $ResourceGroupName -ErrorAction SilentlyContinue
      if ($null -eq $ResourceGroup)
      {
         New-AzResourceGroup -Name $ResourceGroupName -Location $Location
      }

      # Create storage account if it does not already exist
      $StorageAccount = Get-AzStorageAccount -ResourceGroupName $ResourceGroupName -Name $Name -ErrorAction SilentlyContinue
      if ($null -eq $StorageAccount)
      {
         $StorageParams = @{
            ResourceGroupName = $ResourceGroupName
            Name = $Name
            Location = $Location
            SkuName = 'Standard_LRS'
            AccessTier = 'Cool'
         }
         $StorageAccount = New-AzStorageAccount @StorageParams -AllowBlobPublicAccess $true
      }
      return $StorageAccount
   }
}

# Ensure that a storage container exists in the specified storage account context
Function Confirm-Storage-Container {
   [CmdletBinding()]
   Param(
       [string]$Name,
       [object]$Context
   )
   Process
   {
      $StorageContainer = Get-AzStorageContainer -Name $Name -Context $Context -ErrorAction SilentlyContinue
      if ($null -eq $StorageContainer)
      {
         $StorageContainer = New-AzStorageContainer -Name $Name -Context $Context -Permission Blob
      }
      return $StorageContainer
   }
}

# Authenticate Azure account and verify that resources exist
Connect-AzAccount
$StorageAccount = Confirm-Storage-Account -ResourceGroupName 'media-resource-group' -Name 'epistrophy'
Confirm-Storage-Container -Name 'cd-vault' -Context $StorageAccount.Context 
Confirm-Storage-Container -Name 'cd-vault-classical' -Context $StorageAccount.Context
