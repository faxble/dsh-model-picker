# dsh-model-picker 安装脚本
# 支持 web 与 desktop 两个 profile（platform: web 的插件在两者中均生效）。
#
# 用法（在 PowerShell 中执行，任选其一）：
#   .\install.ps1                        # 默认安装到 web profile（本地目录）
#   .\install.ps1 -Profile desktop       # 安装到 desktop profile
#   .\install.ps1 -FromGitHub            # 免 clone，直接从 GitHub 远程安装
param(
    [string]$Profile = 'web',
    [switch]$FromGitHub,
    [string]$PluginDir = $PSScriptRoot
)

$ErrorActionPreference = 'Stop'

# 确保 dsh CLI 可用
if (-not (Get-Command dsh -ErrorAction SilentlyContinue)) {
    Write-Host "错误：未找到 dsh 命令。请先安装 DeepSeek Harness 并确保 dsh 在 PATH 中。" -ForegroundColor Red
    exit 1
}

if ($FromGitHub) {
    Write-Host "从 GitHub 远程安装到 '$Profile' profile ..."
    dsh plugin --profile $Profile add github:faxble/dsh-model-picker
    if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }
}
else {
    $spec = "file:$PluginDir"
    Write-Host "通过本地路径安装到 '$Profile' profile：$spec"
    dsh plugin --profile $Profile add $spec
    if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }
}

Write-Host ""
Write-Host "安装完成。接下来："
Write-Host "  1. 重启 DeepSeek Harness；"
Write-Host "  2. 设置 → 插件 → 启用 dsh-model-picker。"
