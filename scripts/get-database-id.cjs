const { Client, Databases } = require('node-appwrite');
require('dotenv').config({ path: '.env.local' });

const client = new Client()
  .setEndpoint(process.env.APPWRITE_ENDPOINT || 'https://cloud.appwrite.io/v1')
  .setProject(process.env.APPWRITE_PROJECT_ID)
  .setKey(process.env.APPWRITE_API_KEY);

const databases = new Databases(client);

async function listDatabases() {
  console.log('🔍 Recherche des databases...\n');
  
  try {
    const response = await databases.list();
    
    if (response.databases.length === 0) {
      console.log('❌ Aucune database trouvée');
      return;
    }
    
    console.log('📋 Databases disponibles :\n');
    response.databases.forEach(db => {
      console.log(`  Name: ${db.name}`);
      console.log(`  ID: ${db.$id}`);
      console.log(`  Created: ${db.$createdAt}`);
      console.log('  ---');
    });
    
    const targetDb = response.databases.find(db => db.name === 'Vision Future School DB');
    if (targetDb) {
      console.log('\n✅ Database trouvée !');
      console.log(`\n📝 Copie cette valeur dans ton .env.local :`);
      console.log(`APPWRITE_DATABASE_ID=${targetDb.$id}`);
    }
    
  } catch (error) {
    console.error('❌ Erreur:', error.message);
  }
}

listDatabases();
