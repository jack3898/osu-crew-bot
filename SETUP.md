# Setup

This projects has two sub-projects:

- The bot itself
- A static SPA application

The static SPA is used for OAuth purposes so users can authorize their Osu! accounts with the bot.

## Prerequisites

- You will need Node.js with npm preferably using the latest LTS.
- A public URL you plan to use to home the static site.
- An OAuth app created in your Osu! account.
- A Discord bot application created.
  - With the privileged guild members gateway intent enabled.
- Generate a long and secure JWT secret token (which can be anything), using a cryptographically secure method.
- Copy and rename example.env to .env, and fill in the required fields using the various credentials you have just created.
- Create a `DATABASE_URL` in your **system** environment variables. If it's local use this as a value `file:<path to file here>`.

## Setup for production

### Bot

- `npm install`
- `npm run db:push -w bot` (to initialize a db)
- Select `Yes, I want to execute all statements`
- `npm run build -w bot`
- `npm run start -w bot`

It is recommended to have a process manager/daemon to keep your bot online in case it crashes.

### Pages

The site is a React application. This site is used for OAuth 2.0 authorization with the bot.

- `npm run build -w pages`
- Copy the pages/dist to your public web server.

## Setup for development

For development, install <a href="https://volta.sh/">Volta</a>. Or use the Node and npm versions defined in the package.json.

Ensure your Osu! callback URL when setting up the OAuth 2.0 application on Osu!'s side is `http://localhost:5173` and this value is also in the .env file (`OSU_REDIRECT_URI`).

To test slash commands straight away you will need to define `OPTIONAL_DISCORD_GUILD_ID` in the .env file. Otherwise slash commands will be global and take up to an hour to propagate.

- `npm install`
- `npm run dev -w pages`
- `npm run db:push -w bot` (to initialize a db)
- Select `Yes, I want to execute all statements`
- `npm run dev -w bot`

## Database info

This bot uses Sqlite for the database (so you can use Turso as a cloud host).

Please set `DATABASE_URL` as an environment variable. If you want the db to be a local file, using `file:.data/database.db` is recommended.
This environment veriable should not be in `.env`, so you will need to set it on your system. This is because this environment variable is read in different contexts, i.e. during migration, pushing and when the bot runs.
