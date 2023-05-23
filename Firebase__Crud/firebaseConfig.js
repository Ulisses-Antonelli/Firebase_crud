const express = require('express');
const bodyParser = require('body-parser');
const { initializeApp, credential } = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');
const serviceAccount = require('./creds.json');

const app = express();
app.use(bodyParser.json());

initializeApp({
  credential: credential.cert(serviceAccount)
});

const db = getFirestore();

module.exports = { db };


 

  