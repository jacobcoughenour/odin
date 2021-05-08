@echo off

SETLOCAL
SET FORGE_ARGS=%*

SET FORGE_ARGS=%FORGE_ARGS: =~ ~%
node "%~dp0/../node_modules/@electron-forge/cli/dist/electron-forge-start.js" --vscode -- ~%FORGE_ARGS%~

ENDLOCAL
