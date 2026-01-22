const { Client, Databases, ID, Query } = require('node-appwrite');

const APPWRITE_ENDPOINT = process.env.APPWRITE_ENDPOINT || 'https://cloud.appwrite.io/v1';
const APPWRITE_PROJECT_ID = process.env.APPWRITE_PROJECT_ID;
const APPWRITE_API_KEY = process.env.APPWRITE_API_KEY;
const DATABASE_ID = process.env.APPWRITE_DATABASE_ID || 'school_db';

const COLLECTIONS = {
  CONTACTS: 'contact_submissions',
  ADMISSIONS: 'admission_submissions',
  STATUS_HISTORY: 'status_history',
};

function getDatabases() {
  if (!APPWRITE_PROJECT_ID || !APPWRITE_API_KEY) {
    throw new Error('Missing APPWRITE_PROJECT_ID and/or APPWRITE_API_KEY');
  }

  const client = new Client()
    .setEndpoint(APPWRITE_ENDPOINT)
    .setProject(APPWRITE_PROJECT_ID)
    .setKey(APPWRITE_API_KEY);

  return new Databases(client);
}

module.exports = {
  getDatabases,
  ID,
  Query,
  DATABASE_ID,
  COLLECTIONS,
};
