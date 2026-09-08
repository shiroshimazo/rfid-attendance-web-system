param(
  [Parameter(Mandatory = $true)][string]$Uid,
  [string]$RequestId = [guid]::NewGuid().ToString(),
  [string]$BaseUrl = 'http://localhost:3000'
)

# Sends one real attendance request. Repeat RequestId only to retry the same tap.
# Set RFID_DEVICE_API_KEY in this shell; never put a Supabase key on a device.
$ErrorActionPreference = 'Stop'
if ([string]::IsNullOrWhiteSpace($env:RFID_DEVICE_API_KEY)) {
  throw 'Set RFID_DEVICE_API_KEY in this PowerShell session before testing.'
}
$target = [uri]($BaseUrl.TrimEnd('/') + '/api/rfid/tap')
if ($target.Scheme -ne 'https' -and -not $target.IsLoopback) {
  throw 'Use HTTPS for a remote server, or localhost for local testing.'
}
Write-Output "Request ID: $RequestId (reuse this ID for network retries only)"
$payload = @{ requestId = $RequestId; uid = $Uid } | ConvertTo-Json -Compress
Invoke-RestMethod -Method Post -Uri $target -ContentType 'application/json' `
  -Headers @{ Authorization = "Bearer $env:RFID_DEVICE_API_KEY" } -Body $payload |
  ConvertTo-Json -Depth 5
