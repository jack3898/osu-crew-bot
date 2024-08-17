// If you fancy using PM2 as a daemon, this is the file for you!
// Fill in the environment variables and you're good to go.

// `npx pm2 start ecosystem.config.cjs`

// eslint-disable-next-line no-undef
module.exports = {
  apps: [
    {
      name: "osu-crew-bot",
      script: "./bot/dist/index.js",
      env: {
        DISCORD_TOKEN: "?",
        DISCORD_CLIENT_ID: "?",
        OPTIONAL_DISCORD_GUILD_ID: "?",
        NODE_ENV: "production",
        OSU_CLIENT_ID: "?",
        OSU_CLIENT_SECRET: "?",
        OSU_REDIRECT_URI: "?",
        JWT_SECRET: "?",
        DISCORD_OSU_RANK_ROLE_MAPPINGS_URL: "?",
      },
    },
  ],
};
