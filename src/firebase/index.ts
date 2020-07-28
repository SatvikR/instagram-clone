import firebase from "firebase/app";
import "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyB37Kim1tZzUeGtBhedSCEaisVZe7phdEc",
  authDomain: "instagram-clone-aa918.firebaseapp.com",
  databaseURL: "https://instagram-clone-aa918.firebaseio.com",
  projectId: "instagram-clone-aa918",
  storageBucket: "instagram-clone-aa918.appspot.com",
  messagingSenderId: "953328749771",
  appId: "1:953328749771:web:c287a2f7aba6c43c5ddf4e",
  measurementId: "G-3Z1WZFS2H8",
};

firebase.initializeApp(firebaseConfig);

const storage: firebase.storage.Storage = firebase.storage();

export { storage, firebase as default };
