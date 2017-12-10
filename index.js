const Flickr = require('flickr-sdk');
const { initialAuth } = require('./auth');

async function run() {
  if (!process.env.FLICKR_OAUTH_TOKEN || process.env.FORCE_LOGIN) {
    await initialAuth();
  }

  const flickr = new Flickr(Flickr.OAuth.createPlugin(
    process.env.FLICKR_CONSUMER_KEY,
    process.env.FLICKR_CONSUMER_SECRET,
    process.env.FLICKR_OAUTH_TOKEN,
    process.env.FLICKR_OAUTH_TOKEN_SECRET,
  ));

  console.error(await flickr.test.login().then(x => x.body));

  const { body: { photos } } = await flickr.photos.search({
    user_id: 'me',
    extras: 'url_o,date_taken,tags,machine_tags,path_alias',
    per_page: 100,
    page: 1,
  });
  console.error(photos);
}

run();