import firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/firestore'
import 'firebase/storage'

const firebaseConfig = {
    apiKey: "AIzaSyDZDKZSMEXkfNU23SzsJ2EinVEtoYaQyhQ",
    authDomain: "nextproject-9b470.firebaseapp.com",
    projectId: "nextproject-9b470",
    storageBucket: "nextproject-9b470.appspot.com",
    messagingSenderId: "120567066512",
    appId: "1:120567066512:web:fed74b382f849708cf0d15"

}

if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig)
}

export const auth = firebase.auth();
export const googleAuthProvider = new firebase.auth.GoogleAuthProvider();
export const firestore = firebase.firestore();
export const storage = firebase.storage();