$projectRoot = (Resolve-Path (Join-Path $PSScriptRoot "..")).Path
$appJsPath = Join-Path $projectRoot "app.js"
$imagesDir = Join-Path $projectRoot "images"
$manifestPath = Join-Path $imagesDir "manifest.json"

function Get-ImageKey {
  param(
    [string]$Jp,
    [string]$Cn
  )

  $s = "$Jp|$Cn"
  [int64]$h = 2166136261

  foreach ($ch in $s.ToCharArray()) {
    $h = ($h -bxor [int][char]$ch)
    $h = (($h * 16777619) -band 0xffffffffL)
  }

  return $h.ToString("x8")
}

function Get-SearchQuery {
  param($Product)

  if ($Product.type -eq "cigarette") {
    return "$($Product.jp) cigarette pack"
  }

  if ($Product.type -eq "heated") {
    return "$($Product.jp) heated tobacco pack"
  }

  if ($Product.type -eq "device") {
    return "$($Product.jp) IQOS device"
  }

  return "$($Product.jp) vape pod"
}

function Get-ProductsJson {
  $nodeScript = @"
const fs = require('fs');
const vm = require('vm');
const src = fs.readFileSync(process.argv[1], 'utf8');
const match = src.match(/const products = \[(.|\r|\n)*?\];/);
if (!match) throw new Error('Unable to locate products array in app.js');
const context = {};
vm.createContext(context);
vm.runInContext(match[0] + '; globalThis.__products = products;', context);
console.log(JSON.stringify(context.__products));
"@

  return node -e $nodeScript $appJsPath
}

function Get-FirstImageResult {
  param([string]$Query)

  $encoded = [uri]::EscapeDataString($Query)
  $headers = @{ "User-Agent" = "Mozilla/5.0" }
  $searchHtml = (Invoke-WebRequest -UseBasicParsing -Headers $headers -Uri "https://duckduckgo.com/?q=$encoded&iax=images&ia=images" -TimeoutSec 25).Content
  $vqdMatch = [regex]::Match($searchHtml, 'vqd="([^"]+)"')

  if (-not $vqdMatch.Success) {
    throw "Missing vqd token"
  }

  $jsonHeaders = @{
    "User-Agent" = "Mozilla/5.0"
    "Referer" = "https://duckduckgo.com/"
  }
  $apiUrl = "https://duckduckgo.com/i.js?l=jp-jp&o=json&q=$encoded&vqd=$([uri]::EscapeDataString($vqdMatch.Groups[1].Value))&p=1"
  $json = Invoke-WebRequest -UseBasicParsing -Headers $jsonHeaders -Uri $apiUrl -TimeoutSec 25
  $data = $json.Content | ConvertFrom-Json

  if (-not $data.results -or $data.results.Count -eq 0) {
    throw "No search image results"
  }

  $first = $data.results[0]
  $imageUrl = if ($first.thumbnail) { $first.thumbnail } else { $first.image }

  if (-not $imageUrl) {
    throw "First result did not include an image URL"
  }

  return [pscustomobject]@{
    imageUrl = $imageUrl
    sourcePage = $first.url
    title = $first.title
  }
}

New-Item -ItemType Directory -Force -Path $imagesDir | Out-Null

$products = (Get-ProductsJson) | ConvertFrom-Json
$manifest = @()

foreach ($product in $products) {
  $key = Get-ImageKey -Jp $product.jp -Cn $product.cn
  $outputPath = Join-Path $imagesDir "$key.jpg"
  $query = Get-SearchQuery -Product $product

  if (Test-Path $outputPath) {
    $manifest += [pscustomobject]@{
      type = $product.type
      jp = $product.jp
      cn = $product.cn
      key = $key
      query = $query
      status = "exists"
    }
    continue
  }

  try {
    $result = Get-FirstImageResult -Query $query
    Invoke-WebRequest -UseBasicParsing -Headers @{ "User-Agent" = "Mozilla/5.0"; "Referer" = "https://duckduckgo.com/" } -Uri $result.imageUrl -OutFile $outputPath -TimeoutSec 30

    $manifest += [pscustomobject]@{
      type = $product.type
      jp = $product.jp
      cn = $product.cn
      key = $key
      query = $query
      status = "downloaded"
      imageUrl = $result.imageUrl
      sourcePage = $result.sourcePage
      title = $result.title
    }

    Write-Host "downloaded $($product.jp) -> $key.jpg"
  } catch {
    $manifest += [pscustomobject]@{
      type = $product.type
      jp = $product.jp
      cn = $product.cn
      key = $key
      query = $query
      status = "failed"
      error = $_.Exception.Message
    }

    Write-Warning "failed $($product.jp): $($_.Exception.Message)"
  }

  Start-Sleep -Milliseconds 800
}

$manifest | ConvertTo-Json -Depth 6 | Set-Content -Path $manifestPath -Encoding UTF8
Write-Host "done. manifest saved to $manifestPath"
