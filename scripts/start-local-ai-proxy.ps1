$ErrorActionPreference = "Stop"

$ProjectRoot = Split-Path -Parent (Split-Path -Parent $PSCommandPath)
$Port = if ($env:TABAKO_AI_PROXY_PORT) { [int]$env:TABAKO_AI_PROXY_PORT } else { 8789 }
$HostName = if ($env:TABAKO_AI_PROXY_HOST) { $env:TABAKO_AI_PROXY_HOST } else { "127.0.0.1" }
$Node = "node"
$LogDir = Join-Path $ProjectRoot "output\local-ai-proxy"
$OutLog = Join-Path $LogDir "stdout.log"
$ErrLog = Join-Path $LogDir "stderr.log"

New-Item -ItemType Directory -Force -Path $LogDir | Out-Null

$Existing = Get-NetTCPConnection -LocalPort $Port -State Listen -ErrorAction SilentlyContinue |
  Where-Object { $_.LocalAddress -in @($HostName, "127.0.0.1", "::1") } |
  Select-Object -First 1

if ($Existing) {
  "Tabako AI proxy already listening on ${HostName}:${Port}" | Out-File -FilePath $OutLog -Append -Encoding utf8
  exit 0
}

Start-Process `
  -FilePath $Node `
  -ArgumentList "scripts/local-ai-proxy.mjs" `
  -WorkingDirectory $ProjectRoot `
  -WindowStyle Hidden `
  -RedirectStandardOutput $OutLog `
  -RedirectStandardError $ErrLog
