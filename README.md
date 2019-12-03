# Kittelsen
Discord bot based in node.js

Still WIP to generelize it enough to be used as a template.

### Most useful commands/functionality:

* !8 - magic 8 ball. if message contains one or more "or", it will choose between them.
* !memes - generates memes based on input. 
* !convert - converts metric/imperial, as well as currencies. It reads from an api, and stores in a json file. Only fetches new data if the local is older than 24h.
* !cheers - simple point system where you can toast people. View leaderboard with !cheers leaderboard.
* Text manipulation: fullwidth, elder futhark, mOcKiNg, vertical/horizontal.
* !poll - makes a poll, can also do custom reactions.
* !ud - urban dictionary definition fetch.
* !cozy - returns something cozy another user has added. functionality for adding/removing/listing items in DB. 
* Lots of generic code, with dbHelper.js, and funcHelper.js helper files.


#### It uses:
* winston: for logging
* mysql: database
* fs: node module for reading files.


auth.json is nessecary, and has the format:
```json

{
  "token":"BOT_TOKEN",   
  "imgflip":{
    "user":"IMGFLIP_USERNAME",
    "pass":"IMGFLIP_PASSWORD"
  },
  "DB":{
    "pass":"DATABASE_PASSWORD",
    "database":"DATABASE_NAME"
    },
  "ownerId": "BOT_OWNER_ID"
}
```
