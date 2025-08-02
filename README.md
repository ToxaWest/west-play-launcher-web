# West Play
___
## Faq
___
### What is it?
#### Light and customizable game launcher with achievements watcher
___
### Is Windows app?
#### It's electron based app with integrated ReactJS frontend. Currently supported only Windows
___
### What is supported?
- Steam games
- EGS games
- GOG games
- Cracked windows games
- [Ryujinx](https://git.ryujinx.app/ryubing/ryujinx/-/releases) (Nintendo Switch Emulator)
___
### For what sources achievements tracking working
- Steam: +
- EGS: +
- GOG: in future
- Cracked games: + (only if crack team created achievements.ini/json file with tracking user achievements)
- Ryujinx: -
___
### List of games tested with GoldbergSteamEmulator
- [src/helpers/GoldbergSteamEmulator.ts](https://github.com/ToxaWest/west-play-launcher-web/blob/master/src/helpers/GoldbergSteamEmulator.ts)

### Required thrid party utils
#### PowerShell
    `Install-Module -Name DisplayConfig`
