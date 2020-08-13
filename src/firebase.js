import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/database';
import 'firebase/storage';

var firebaseConfig = {
    apiKey: "AIzaSyBWLuR84YJrCh4uz7bq8xhxzKYrrcqvMtM",
    authDomain: "react-slack-clone-3d7ab.firebaseapp.com",
    databaseURL: "https://react-slack-clone-3d7ab.firebaseio.com",
    projectId: "react-slack-clone-3d7ab",
    storageBucket: "react-slack-clone-3d7ab.appspot.com",
    messagingSenderId: "1069205386907",
    appId: "1:1069205386907:web:24dc661659fdc8ba9bf83e",
    measurementId: "G-HP94J8ETB0"
};

firebase.initializeApp(firebaseConfig);

export default firebase;