# Setup

This guide will show you how to setup the bot for _development_ and _production_.

Both routes are quite different in their setups!

## Setup for production

The production build of this bot will utilize several technologies. It does sound complicated, but this bot wraps it all up into one package for you so once it's done you won't have to micro-manage a dedicated server yourself - everything is automated.

Areas we will cover:

- GitHub Actions
- Kubernetes
- SQLite hosting
- Cloud hosting
- Discord Bot configuration
- Creating your own Osu! application

Providers you will need an account on:

- <a href="https://turso.tech/" target="_blank">Turso</a> (DB host, no credit card required, free for up to 9GB storage 1bn reads)
- <a href="https://www.linode.com/" target="_blank">Linode</a> (Cloud host, not free, credit card required $12/mo to get started)
- GitHub (Free, no credit card required, 2000 mins of server time)
- Discord (Free, ofc)
- Osu! (Free also!)

### Create a Discord Bot application

There are several guides online on how to do this. I won't be going into creating the bot, and inviting it to your Discord. But you should have the bot invited to a server in an offline state.

You need to go to the <a href="https://discord.com/developers" target="_blank">Discord developer portal</a> and ensure your bot has the following:

- Privileged intent: **Server members intent**
- `applications.commands` permission

Make note of the following:

- Bot token (call it `DISCORD_TOKEN`)
- Application ID (call it `DISCORD_CLIENT_ID`)

### Create an Osu! OAuth2 application

Log in to your Osu! account, go to profile settings, and create a new OAuth application.

- Set the name to anything you like
- Set the callback url to https://**[your github username here]**.github.io/**[your repository name here]**

Make note of the following:

- Callback URL (call it `OSU_REDIRECT_URI`)
- Client ID (call it: `OSU_CLIENT_ID`)
- Client secret (call it: `OSU_CLIENT_SECRET`)

### Create a Turso SQLite database

Log in to Turso, and create a basic database.

Make note of the following:

- The database URL (call it: `DATABASE_URL`)
- The database token, you will need to generate this on Turso. (Call it `OPTIONAL_DATABASE_AUTH_TOKEN`)

Even though the name says "optional", in this case it isn't but the code supports its omission for environments with an unauthenticated DB. We do need it here, do not change the name.

Now, we need to initialize the DB, create the tables and schema:

- Download an install <a href="https://volta.sh/" target="_blank">Volta</a> and Git
- `git clone` your repo
- `cd` to where the repo is
- run `npm i`
- If on Windows, run: `$env:DATABASE_URL="[DB_URL_HERE]"; DATABASE_AUTH_TOKEN="[DB_AUTH_TOKEN_HERE]"; npm run db:push -w bot`
- If on Linux/Mac, run: `DATABASE_URL="[DB_URL_HERE]" && DATABASE_AUTH_TOKEN="[DB_AUTH_TOKEN]" && npm run db:push -w bot`

_Running database pushes and migrations is a manual process but you should only need to do this when the db updates or changes its schema with updates._

### Create a Linode Kubernetes cluster

Log in to Linode, click on "Kubernetes" and create a new cluster. For now, just assign the cluster one node. You will be warned 3 are recommended for minimal downtime but 1 is actually enough for this bot.

Wait for the provisioning, then copy the contents of the provided `*-kubeconfig.yaml` file.

Make note of the following:

- Kubeconfig yaml content (call it: `KUBECONFIG`)

### Generate a manual values

Using a password manager, or trusted tool, generate a very long random string I recommend no less than 30 characters.

Make note of the following:

- The secret (call it `JWT_SECRET`)

**other things**

- Note `NODE_ENV` and its value is `production`
- Note `IMAGE` and set its value to ghcr.io/**[your github username here]**/**[your github repo name here]**:bot

### Setup GitHub

Go to your repository settings and click "Pages". make sure Pages is enabled with the source "GitHub Actions".

Now go to "Secrets and variables". If you followed the above you should be able to add the values with EXACTLY these keys:

**Secrets**:

- DISCORD_TOKEN
- JWT_SECRET
- KUBECONFIG
- OPTIONAL_DATABASE_AUTH_TOKEN
- OSU_CLIENT_SECRET

**Variables**:

- DATABASE_URL
- DISCORD_CLIENT_ID
- IMAGE
- OSU_CLIENT_ID
- OSU_REDIRECT_URI

### Moment of truth... deploying! 🚀

Run IN THE FOLLOWING ORDER:

**Docker image build**

- Go to your repo and click on the "Actions" tab.
- On the left side click the "Build bot docker image" option
- Click "Run workflow" and then "Run workflow" again on "main"
- Wait for that to finish and hopefully go green

**Docker image deploy**

- On the left side again, click "Deploy bot docker image"
- Click "Run workflow" and then "Run workflow" again on "main"
- This uses the image build above, and sends it to the cloud (the Kubernetes cluster you setup)
- Wait for that to hopefully go green, your bot should appear online in your Discord server

**Deploy webpage**

This webpage is used as a stage during OAuth authorization, users log in with their Osu! account using a command, and authorize the bot to read their Osu! profile.

- On the left side lastly, click "Deploy static content to GitHub Pages"
- Wait for that to go green, you should now be able to visit https://**[your github username here]**.github.io/**[your repository name here]** and see a webpage

### And done!

You've officially deployed a basic Kubernetes-based Discord bot!

To update it, sync your fork with the base repository, then run the three deploy steps again.

If you know anything about GitHub actions, feel free to configure to run on repo change instead of button click for even more automation!

## Setup for development

Coming soon
