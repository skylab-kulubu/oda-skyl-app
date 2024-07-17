import prisma from "../../../prisma/client";

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

if(tokens.refresh_token){
  await prisma.environment.update({
    where: { id:1 },
    data: { name:"REFRESH_TOKEN", value: tokens.refresh_token },
  });
  //console.log(tokens);
}
  return creds;
};

const getNewAccessToken = async () => {
  const refreshTokenFromDb = await prisma.environment.findUnique({
    where: { id: 1 },
  });


  const response = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      client_id: process.env.CLIENT_ID,
      client_secret: process.env.CLIENT_SECRET,
      refresh_token: refreshTokenFromDb.value,
      grant_type: 'refresh_token',
    }),
  });

  const tokens = await response.json();

  if (!response.ok) {
    throw new Error(tokens.error);
  }

  return tokens;
};
