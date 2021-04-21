import Firebase from 'firebase';

const firebaseConfig = {
  apiKey: 'AIzaSyAw--S7ox-xov79cGBqjSLTa2YXehhxVw8',
  authDomain: 'weathertest-311408.firebaseapp.com',
  projectId: 'weathertest-311408',
  storageBucket: 'weathertest-311408.appspot.com',
  messagingSenderId: '398031148848',
  appId: '1:398031148848:web:fd7e69b4551b71d2e7daf5',
  measurementId: 'G-NYXRQ2F1P6',
};

const app = Firebase.initializeApp(firebaseConfig);
export const db = app.database();
