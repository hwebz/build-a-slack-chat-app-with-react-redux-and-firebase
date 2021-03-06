## Build a Slack Chat App with React, Redux, and Firebase
## Author: Reed Barger
### https://www.packtpub.com/programming/build-a-slack-chat-app-with-react-redux-and-firebase-video
## Github Repo:
### https://github.com/PacktPublishing/Build-a-Slack-Chat-App-with-React-Redux-and-Firebase

### Write Firebase Storage Rules for Media Files
<pre>
service firebase.storage {
    match /b/<i>storage.bucket.name</i>/o {
        match /avatars {
            match /users/{userId} {
                allow read: if request.auth != null;
                allow write: if request.auth != null && request.auth.uid == userId && request.resource.contentType.matches('image/.*') && request.resource.size < 1 * 1024 * 1024;
            }
        }

        match /chat {
            match /public/{imagePath=**} {
                allow read: if request.auth != null;
                allow write: if request.auth != null && request.resource.contentType.matches('image/.*') && request.resource.size < 1 * 1024 * 1024;
            }

            match /private/{userId1}/{userId2}/{imagePath=**} {
                allow read: if request.auth != null && (request.auth.uid == userId1 || request.auth.uid == userId2);
                allow write: if request.auth != null && (request.auth.uid == userId1 || request.auth.uid == userId2) && request.resource.contentType.matches('image/.*') && request.resource.size < 1 * 1024 * 1024;
            }
        }
    }
}
</pre>

### Write Firebase Database Rules
<pre>
{
    "rules":{
        "channels":{
            ".read":"auth != null",
            "$channelId":{
                ".write":"auth != null",
                ".validate":"newData.hasChildren(['id', 'name', 'createdBy', 'details'])",
                "id":{
                    ".validate":"newData.val() === $channelId"
                },
                "name":{
                    ".validate":"newData.val().length > 0"
                },
                "details":{
                    ".validate":"newData.val().length > 0"
                }
            }
        },
        "messages":{
            "$channelId":{
                ".read":"auth != null",
                ".validate":"root.child('channels/'+$channelId).exists()",
                "$messageId":{
                    ".write":"auth != null",
                    ".validate":"(newData.hasChildren(['content', 'user', 'timestamp']) && !newData.hasChildren(['image'])) || (newData.hasChildren(['image', 'user', 'timestamp']) && !newData.hasChildren(['content']))",
                    "content":{
                        ".validate":"newData.val().length > 0"
                    },
                    "image":{
                        ".validate":"newData.val().length > 0"
                    },
                    "user":{
                        ".validate":"newData.hasChildren(['id', 'name', 'avatar'])"
                    }
                }
            }
        },
        "privateMessages":{
            "$uid1":{
                "$uid2":{
                ".read":"auth != null && ($uid1 === auth.uid || $uid2 === auth.uid)",
                "$messageId":{
                    ".write":"auth != null",
                    ".validate":"(newData.hasChildren(['content', 'user', 'timestamp']) && !newData.hasChildren(['image'])) || (newData.hasChildren(['image', 'user', 'timestamp']) && !newData.hasChildren(['content']))",
                    "content":{
                        ".validate":"newData.val().length > 0"
                    },
                    "image":{
                        ".validate":"newData.val().length > 0"
                    },
                    "user":{
                        ".validate":"newData.hasChildren(['id', 'name', 'avatar'])"
                    }
                }
                }
            }
        },
        "presence":{
            ".read":"auth != null",
            ".write":"auth != null"
        },
        "typing":{
            ".read":"auth != null",
            ".write":"auth != null"
        },
        "users":{
            ".read":"auth != null",
            "$uid":{
                ".write":"auth != null && auth.uid === $uid",
                ".validate":"newData.hasChildren(['name', 'avatar'])",
                "name":{
                    ".validate":"newData.val().length > 0"
                },
                "avatar":{
                    ".validate":"newData.val().length > 0"
                }
            }
        }
    }
}
</pre>

### Deploy our App with Firebase Tools
> npm i firebase-tools -g<br />
> firebase login<br />
> firebase init (<i>Choose Database and Storage options => react-slack-clone => databases.rules.json => storage.rules.json => </i>)<br />
> npm run build<br />
#### Add configuration into <i>firebase.json</i>
<pre>
{
    "hosting": {
        "public": "./build"
    },
    "database": {
        "rules": "database.rules.json"
    },
    "storage": {
        "rules": "storage.rules.json"
    }
}
</pre>
> firebase deploy