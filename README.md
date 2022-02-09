# BalancedPNL bot

BalancedPNL is a bot intended to keep track of a wallet position on the [Balanced Network](https://balanced.network/). The bot gets your wallet debt on the platform and compares that debt to the value of all the tokens in the wallet to calculate a PNL.

If you just want to use the bot, go and send a dm to @[BalancedPNL_bot](https://telegram.me/BalancedPNL_bot) on Telegram, if you want to run your own version of the bot follow the install instructions.

Currently the bot has the following commands (you can always send `/info` as a command to the bot to get the list of commands):

* `/start` => Use this command to add, delete and view the wallets being tracked.
* `/info` => With this command the bot will reply with this info message.
* `/pnl` => Use this command to view the PNL of each wallet you have added and the overall PNL of all the wallets.
* `/assets` => Use this command to get a summary of each wallet. The summary shows each token in the wallet, their balance and the prices in the pools for that token.
* `/summary` => This command runs a /pnl and /assets check combined.

## Install
To run your own version of the bot locally you will need [nodejs](https://nodejs.org/en/download/) version 17.4.0 or newer.

Clone the project in a local folder and then run `npm install`.

You will need a bot authentication token from telegram, to get one you can follow [these instructions](https://core.telegram.org/bots).

After getting your authentication token, create a `.env` file inside the project folder and add the following content:
```
BOT_TOKEN="YOUR_AUTHENTICATION_TOKEN"
```
You can now run your own version of the bot locally with the command `npm run start`


## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details
