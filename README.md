# Blum Satset

Bot to automate any task on [Blum](https://t.me/BlumCryptoBot).

### Requirements

- [ts-node](https://typestrong.org/ts-node/) or [bun.sh](https://bun.sh/).

### Quickstart

#### For Windows:

Just run the **`start.bat`**
It will automatically run update, installing depedencies, and run the bot.

#### For Linux:

1. `chmod +x start.sh`
2. Run `./start.sh`
   It will automatically run update, installing depedencies, and run the bot.

#### Other:

1. Install `npm install`
2. Create `query.txt`
3. Put the telegram app data each line
4. Run `npx ts-node index.ts` or `bun run index.ts`

## Referral

To set your referral, just edit the `referral.txt` and edit the const `ref_XXXXXXXXX`

## Wallet

If the account not connecting the wallet yet, a wallet will be generated and the address and mnemonic will saved into `wallet.txt`

### Automaton

- [x] Auto Register with Referral
- [x] Auto Farming
- [x] Auto Play Games
- [x] Auto Task
- [x] Auto Claim Daily Rewards
- [x] Auto Claim Friends Balance
- [x] Auto Join Tribe
- [x] Auto Connect Wallet

### Config

`config.json` used to **enable/disable** feature that you dont want to run.

#### Common Error

If you are running with `start.bat` or `start.sh` usually new depedencies not installed. Try to run `npm install` or `bun/yarn install`.
