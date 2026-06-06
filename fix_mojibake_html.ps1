Set-StrictMode -Version Latest
$ErrorActionPreference = 'Stop'

function Get-MojibakeScore {
    param(
        [Parameter(Mandatory = $true)]
        [string]$Text
    )

    # Common mojibake traces from UTF-8 interpreted as Windows-1252.
    $pattern = '([\u00C2\u00C3\u00E2][\u0080-\u00BF]?)|\uFFFD'
    return ([regex]::Matches($Text, $pattern)).Count
}

function Try-FixText {
    param(
        [Parameter(Mandatory = $true)]
        [string]$InputText
    )

    $current = $InputText

    for ($i = 0; $i -lt 3; $i++) {
        $before = Get-MojibakeScore -Text $current
        $bytes = [System.Text.Encoding]::GetEncoding(1252).GetBytes($current)
        $decoded = [System.Text.Encoding]::UTF8.GetString($bytes)
        $after = Get-MojibakeScore -Text $decoded

        if ($after -lt $before) {
            $current = $decoded
            continue
        }

        break
    }

    return $current
}

$root = Split-Path -Parent $MyInvocation.MyCommand.Path
$files = Get-ChildItem -Path $root -Filter '*.html' -File

$changed = 0
foreach ($file in $files) {
    $original = Get-Content -Path $file.FullName -Raw -Encoding UTF8
    $fixed = Try-FixText -InputText $original

    if ($fixed -ne $original) {
        Set-Content -Path $file.FullName -Value $fixed -Encoding UTF8
        $changed++
        Write-Host "Fixed mojibake: $($file.Name)"
    }
}

Write-Host "Done. Files updated: $changed"