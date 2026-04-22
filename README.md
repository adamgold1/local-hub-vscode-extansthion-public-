# LocalHub Public Build

This repository contains only the public installable build for LocalHub.

Included here:
- `localhub-3.0.1-win32-x64.vsix`
- `localhub-tray-runtime-win32-x64.zip`
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

## First Launch

- This Marketplace/public build keeps the main extension lightweight.
- On first launch, LocalHub will auto-download `localhub-tray-runtime-win32-x64.zip`
  to enable the `LocalHub Control Center` tray runtime.

## Build Notes

- This public build is for `Windows x64`
- Tray runtime is delivered by auto-download on first launch
- Personal LocalHub data is not bundled into this package

## Status

- Public installable artifact: included in this repository
- VS Code Marketplace publish: pending publisher token/login
