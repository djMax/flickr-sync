const Flickr = require('flickr-sdk');
const readline = require('readline');
const open = require('open');

module.exports.initialAuth = async function () {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  const oauth = new Flickr.OAuth(
    process.env.FLICKR_CONSUMER_KEY,
    process.env.FLICKR_CONSUMER_SECRET,
  );
  const { body: { oauth_token, oauth_token_secret } } = await oauth.request('oob');
  console.error(oauth_token, oauth_token_secret)
  open(oauth.authorizeUrl(oauth_token, 'read'));

  const readToken = await new Promise((accept, reject) => {
    rl.question('Enter the verification code:', async (code) => {
      try {
        const { body: finalToken } = await oauth.verify(oauth_token, code, oauth_token_secret);
        console.error(finalToken);
        accept(finalToken);
      } catch (error) {
        reject(error);
      }
    });
  });
  process.env.FLICKR_OAUTH_TOKEN = readToken.oauth_token;
  process.env.FLICKR_OAUTH_TOKEN_SECRET = readToken.oauth_token_secret;
}