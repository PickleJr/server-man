This app is just a simple discord bot that will execute commands on your computer when a user submits a request.

## Requirements
 * Current version of nodejs.
 * Current version of npm.

## To Start: 
 1. Rename `src/config-example.json` to `src/config.json`
 2. Fill out `src/config.json` to be as desired. You may add more games, just keep the pattern.
 * For this script to work in windows (and possibly linux), the command needs to be in the \$PATH\$ variable.
 3. run `npm install`
 4. End then you can either build the applicaion with `npm run build` or straight up launch the app with `npm start`.

## To Use:
No `HELP` yet. :(

* [prefix]off [gamename]
* * Turns off a `gamename` server.
* [prefix]status [gamename]
* * Checks the status of a server for `gamename`
* [prefix]on [gamename].
* * Turns on the server for the `gameanem`.