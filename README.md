# xlllBot app

![xlllBot](/preview.gif)

## Bot features
- Chat and app notifications:
  - subscription
  - oversubscription
  - gift subscription
  - renewal of gift subscription
  - renewal of anonymous gift subscription
  - raid
  - bits
- Automatic ban for words added to the list of prohibited through the application
- Standard chat commands:
  - !uptime - find out the duration of the stream
  - !followage - find out how long the viewer has been following to the channel
  - !ping - Ping Pong mini-game
  - !size - mini-game "Size..."
  - !sr - Order video in chat. The video is added to the playlist in the app where you can watch it, delete it, skip it, etc.
  - !skip - Ability for moderators to skip the video launched in the application
  - !mute, !ban, !unban - Full or temporary blocking of the viewer in the chat and removing the restriction
  - !game - Set stream category. You can specify the full names of the categories or use the available abbreviations from the list. For owner and moderators only
  - !title - Setting the title of the stream. For owner and moderators only
  - !poll - Create a vote via the StrawPoll service. For owner and moderators only
- Own commands added via the app
- Automatic sending of commands to the chat after a set period of time
- Settings to enable/disable some features or restrictions for ordinary viewers
- Simultaneous work of the bot on several different channels
- A new channel can be added to the bot only if it is in the invite list
- Authorization and registration of the channel in the bot via Twitch in the application

## Installation and launch
- Clone and install dependencies
  - `git clone https://github.com/xrystalll/xlllBot.git`
  - `cd xlllBot`
  - `npm install`
- Rename the file `default.example.json` to `default.json` in the folder `app/config`
- Fill in all fields
  - Specify the name of your Twitch bot
  - Get Oauth token for the bot - https://twitchapps.com/tmi
  - Create a Twitch application, get client id and secret key - https://dev.twitch.tv/console/apps (specify `http://localhost:1337/auth/twitch/callback` as the callback address)
  - Create a MongoDB cloud database at https://mongodb.com and specify the resulting url
- Specify the name of your Twitch bot in `src/config.js`
- Build the build react application with the command `npm run react:build`
- Build an application under OS Windows with the command `npm run build:win` or run it in development mode `npm start`
- Add the channel on which the bot will work to the database by url in the browser - `http://localhost:1337/api/invite/add?channel=CHANNEL NAME` (Delete line 724-737 in file `app/routes/index.js` after adding your channel)
- Run the created application from the `releases` folder
- Activate by clicking on the bot status switch on the main page of the control panel. The bot will connect to the chat (when the application is closed, the bot turns off)
