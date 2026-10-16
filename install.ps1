# dsh-model-picker 安装脚本
# 通过 DSH 插件管理器把本地插件安装到当前 profile。
# 用法：.\install.ps1
param(
    [string]$PluginDir = $PSScriptRoot
)

$ErrorActionPreference = 'Stop'

$spec = "file:$PluginDir"
Write-Host "安装插件：$spec"
Write-Host ""
Write-Host "请在 DSH 插件管理界面确认安装，或在 DSH 中执行："
Write-Host "  install_bundle  target: '$spec'"
Write-Host ""
Write-Host "安装完成后：设置 → 插件 → 启用 dsh-model-picker，刷新页面生效。"
Write-Host ""
Write-Host "提示：插件管理器接受本地绝对路径（目录或 .tgz）。"
Write-Host "也可以先把本目录打成 tgz 再安装："
Write-Host "  cd $PluginDir; tar -czf ..\dsh-model-picker-1.0.0.tgz package.json index.js client.js cordis.patch.yml README.md"
