## Build a Slack Chat App with React, Redux, and Firebase
## Author: Reed Barger
### https://www.packtpub.com/programming/build-a-slack-chat-app-with-react-redux-and-firebase-video

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