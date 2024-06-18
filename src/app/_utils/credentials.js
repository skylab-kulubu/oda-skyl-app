const fs = require("fs").promises;
const { google } = require("googleapis");

export const getCredentials = async () => {
  const creds = new google.auth.OAuth2(
    process.env.CLIENT_ID,
    process.env.CLIENT_SECRET,
    process.env.REDIRECT_URI
  );

  const tokens = await getNewAccessToken();
  creds.setCredentials(tokens);

  const newTokenJson = JSON.stringify(tokens);
  await fs.writeFile(
    ".env.local",
    `CLIENT_ID="${process.env.CLIENT_ID}"\nCALENDAR_ID="${process.env.CALENDAR_ID}"\nCLIENT_SECRET="${process.env.CLIENT_SECRET}"\nREDIRECT_URI="${process.env.REDIRECT_URI}"\nREFRESH_TOKEN="${tokens.refresh_token || process.env.REFRESH_TOKEN}"\nTOKENS='${newTokenJson}'\nDATABASE_URL="${process.env.DATABASE_URL}"\nJWT_SECRET="${process.env.JWT_SECRET}"`
  );

  return creds;
};

const getNewAccessToken = async () => {
  const refreshToken = process.env.REFRESH_TOKEN;
  const response = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      client_id: process.env.CLIENT_ID,
      client_secret: process.env.CLIENT_SECRET,
      refresh_token: refreshToken,
      grant_type: 'refresh_token',
    }),
  });

  const tokens = await response.json();

  if (!response.ok) {
    throw new Error(tokens.error);
  }

  return tokens;
};
