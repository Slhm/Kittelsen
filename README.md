# Kittelsen
Discord bot based in node.js

### Most interesting commands/functionality:

* !8 - magic 8 ball. if message contains one or more "or", it will choose between them.
* !memes - generates memes based on input. 
* !convert - converts metric/imperial, as well as currencies. It reads from an api, and stores in a json file. Only fetches new data if the local is older than 24h.
* Text manipulation: fullwidth, elder futhark, mOcKiNg, vertical/horizontal.
* !poll - makes a poll, can also do custom reactions.
* !ud - urban dictionary definition fetch.


#### It uses:
* winston: for logging
* mysql: database
* fs: node module for reading files.
* 


auth.json is nessecary, and has the format:
```json

{
  "token":"",   
  "imgflip":{
    "user":"",  
    "pass":""  
  },
  "DB":{
    "pass":"",
    "database":""
    },
  "ownerId": ""
}
```
token: discordbot token.

imgflip(for meme generator): username/password.
