$projectRoot = (Resolve-Path (Join-Path $PSScriptRoot "..")).Path
$downloader = Join-Path $PSScriptRoot "download-search-images.mjs"
$previousLocation = Get-Location

try {
  Set-Location -LiteralPath $projectRoot
  & node $downloader
  if ($LASTEXITCODE -ne 0) {
    throw "Image downloader exited with code $LASTEXITCODE"
  }
} finally {
  Set-Location -LiteralPath $previousLocation
}
