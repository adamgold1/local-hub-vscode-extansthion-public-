# LocalHub Public Build

This repository contains only the public installable build for LocalHub.

Included here:
- `localhub-3.0.1-win32-x64.vsix`
- install instructions

Not included here:
- private source code
- local databases
- personal settings
- user snapshots/history

## Install

1. Download `localhub-3.0.1-win32-x64.vsix`
2. Open VS Code
3. Go to Extensions
4. Open `...` menu
5. Choose `Install from VSIX...`
6. Select the downloaded `.vsix`
7. Reload VS Code

## Build Notes

- This public build is for `Windows x64`
- The build includes the `LocalHub Control Center` tray functionality
- Personal LocalHub data is not bundled into this package

## Status

- Public installable artifact: included in this repository
- VS Code Marketplace publish: pending publisher token/login
