/**
 * Script pour initialiser la base de données Appwrite
 * Exécuter avec: node scripts/setup-appwrite.cjs
 */

const { Client, Databases } = require('node-appwrite');

// Configuration
const ENDPOINT = process.env.APPWRITE_ENDPOINT || process.env.VITE_APPWRITE_ENDPOINT || 'https://cloud.appwrite.io/v1';
const PROJECT_ID = process.env.APPWRITE_PROJECT_ID || process.env.VITE_APPWRITE_PROJECT_ID;
const API_KEY = process.env.APPWRITE_API_KEY;
const DATABASE_ID = process.env.APPWRITE_DATABASE_ID || process.env.VITE_APPWRITE_DATABASE_ID || 'school_db';

if (!PROJECT_ID || !API_KEY) {
  console.error('❌ Missing env vars: APPWRITE_PROJECT_ID and/or APPWRITE_API_KEY');
  console.error('   Tip: set them in your shell env before running this script.');
  process.exit(1);
}

// Initialiser le client
const client = new Client()
  .setEndpoint(ENDPOINT)
  .setProject(PROJECT_ID)
  .setKey(API_KEY);

const databases = new Databases(client);

// Définitions des collections
const collections = {
  contact_submissions: {
    name: 'Contact Submissions',
    attributes: [
      { key: 'reference', type: 'string', size: 20, required: true },
      { key: 'firstName', type: 'string', size: 100, required: true },
      { key: 'lastName', type: 'string', size: 100, required: true },
      { key: 'email', type: 'string', size: 255, required: true },
      { key: 'phone', type: 'string', size: 30, required: false },
      { key: 'subject', type: 'string', size: 200, required: true },
      { key: 'message', type: 'string', size: 5000, required: true },
      { key: 'status', type: 'string', size: 20, required: true },
      { key: 'adminNotes', type: 'string', size: 2000, required: false },
      { key: 'processedAt', type: 'string', size: 30, required: false },
    ],
    indexes: [
      { key: 'reference_idx', type: 'unique', attributes: ['reference'] },
      { key: 'status_idx', type: 'key', attributes: ['status'] },
    ]
  },
  site_pages: {
    name: 'Site Pages',
    attributes: [
      { key: 'page', type: 'string', size: 60, required: true },
      { key: 'kind', type: 'string', size: 20, required: true },
      { key: 'payload', type: 'string', size: 65535, required: true },
      { key: 'updatedAt', type: 'string', size: 40, required: false },
    ],
    indexes: [
      { key: 'page_idx', type: 'unique', attributes: ['page'] },
      { key: 'kind_idx', type: 'key', attributes: ['kind'] },
    ]
  },
  admission_submissions: {
    name: 'Admission Submissions',
    attributes: [
      { key: 'reference', type: 'string', size: 20, required: true },
      { key: 'studentFirstName', type: 'string', size: 100, required: true },
      { key: 'studentLastName', type: 'string', size: 100, required: true },
      { key: 'studentBirthdate', type: 'string', size: 15, required: true },
      { key: 'studentGender', type: 'string', size: 10, required: false },
      { key: 'currentSchool', type: 'string', size: 200, required: false },
      { key: 'desiredClass', type: 'string', size: 50, required: true },
      { key: 'parentFirstName', type: 'string', size: 100, required: true },
      { key: 'parentLastName', type: 'string', size: 100, required: true },
      { key: 'parentEmail', type: 'string', size: 255, required: true },
      { key: 'parentPhone', type: 'string', size: 30, required: true },
      { key: 'parentAddress', type: 'string', size: 500, required: false },
      { key: 'relationship', type: 'string', size: 50, required: false },
      { key: 'message', type: 'string', size: 2000, required: false },
      { key: 'status', type: 'string', size: 30, required: true },
      { key: 'adminNotes', type: 'string', size: 2000, required: false },
      { key: 'publicNotes', type: 'string', size: 1000, required: false },
      { key: 'processedAt', type: 'string', size: 30, required: false },
      { key: 'interviewDate', type: 'string', size: 30, required: false },
    ],
    indexes: [
      { key: 'reference_idx', type: 'unique', attributes: ['reference'] },
      { key: 'status_idx', type: 'key', attributes: ['status'] },
    ]
  },
  status_history: {
    name: 'Status History',
    attributes: [
      { key: 'submissionType', type: 'string', size: 20, required: true },
      { key: 'submissionId', type: 'string', size: 50, required: true },
      { key: 'oldStatus', type: 'string', size: 30, required: false },
      { key: 'newStatus', type: 'string', size: 30, required: true },
      { key: 'note', type: 'string', size: 1000, required: false },
    ],
    indexes: [
      { key: 'submission_idx', type: 'key', attributes: ['submissionId'] },
      { key: 'type_idx', type: 'key', attributes: ['submissionType'] },
    ]
  }
};

async function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function createDatabase() {
  try {
    console.log('📦 Création de la base de données...');
    const db = await databases.create(DATABASE_ID, 'Vision Future School DB');
    console.log('✅ Base de données créée:', db.$id);
    return db;
  } catch (error) {
    if (error.code === 409) {
      console.log('ℹ️  Base de données existe déjà');
      return { $id: DATABASE_ID };
    }

    const msg = String(error.message || '').toLowerCase();
    const isDbLimit = msg.includes('maximum number of databases') || msg.includes('increase the limit');
    if (isDbLimit) {
      console.error('❌ Impossible de créer une nouvelle database (limite du plan Appwrite atteinte).');
      try {
        try {
          const existing = await databases.get(DATABASE_ID);
          if (existing && existing.$id) {
            console.error(`ℹ️  La database '${DATABASE_ID}' existe déjà, utilisation de celle-ci.`);
            return { $id: DATABASE_ID };
          }
        } catch {
          // ignore
        }

        const listRes = await databases.list();
        const dbs = Array.isArray(listRes.databases) ? listRes.databases : [];
        const hasTarget = dbs.some((d) => d.$id === DATABASE_ID);

        if (dbs.length) {
          console.error('➡️  Databases existantes dans ce projet:');
          dbs.forEach((d) => {
            console.error(`   - ${d.$id}${d.name ? ` (${d.name})` : ''}`);
          });
        }

        if (hasTarget) {
          console.error(`ℹ️  La database '${DATABASE_ID}' existe déjà, relance le script.`);
          return { $id: DATABASE_ID };
        }
      } catch {
        // ignore
      }

      throw new Error(
        `Limite de databases atteinte. Choisis une database existante et relance en définissant APPWRITE_DATABASE_ID (ex: $env:APPWRITE_DATABASE_ID="<id>").`
      );
    }

    throw error;
  }
}

async function createCollection(collectionId, config) {
  const permissions = [];
  try {
    console.log(`\n📁 Création de la collection: ${config.name}`);
    
    const collection = await databases.createCollection(
      DATABASE_ID,
      collectionId,
      config.name,
      [
        ...permissions
      ]
    );
    console.log(`✅ Collection créée: ${collectionId}`);
    
    return collection;
  } catch (error) {
    if (error.code === 409) {
      console.log(`ℹ️  Collection ${collectionId} existe déjà`);
      try {
        await databases.getCollection(DATABASE_ID, collectionId);
      } catch {
        return { $id: collectionId };
      }
      return { $id: collectionId };
    }
    throw error;
  }
}

async function ensureAttributesAndIndexes(collectionId, config) {
  for (const attr of config.attributes) {
    try {
      console.log(`  📝 Attribut: ${attr.key}`);
      if (attr.default !== undefined) {
        await databases.createStringAttribute(
          DATABASE_ID,
          collectionId,
          attr.key,
          attr.size,
          attr.required,
          attr.default
        );
      } else {
        await databases.createStringAttribute(
          DATABASE_ID,
          collectionId,
          attr.key,
          attr.size,
          attr.required
        );
      }
      await sleep(1000);
    } catch (error) {
      if (error.code === 409) {
        console.log(`  ⚠️  Attribut ${attr.key} existe déjà`);
      } else {
        console.error(`  ❌ Erreur attribut ${attr.key}:`, error.message);
      }
    }
  }

  console.log('  ⏳ Attente de la création des attributs...');
  await sleep(5000);

  for (const idx of config.indexes) {
    try {
      console.log(`  🔍 Index: ${idx.key}`);
      await databases.createIndex(DATABASE_ID, collectionId, idx.key, idx.type, idx.attributes);
      await sleep(1000);
    } catch (error) {
      if (error.code === 409) {
        console.log(`  ⚠️  Index ${idx.key} existe déjà`);
      } else {
        console.error(`  ❌ Erreur index ${idx.key}:`, error.message);
      }
    }
  }
}

async function main() {
  console.log('🚀 Initialisation de la base Appwrite...\n');
  console.log('Endpoint:', ENDPOINT);
  console.log('Project ID:', PROJECT_ID);
  console.log('Database ID:', DATABASE_ID);
  console.log('');
  
  try {
    // Créer la base de données
    await createDatabase();
    
    // Créer les collections
    for (const [collectionId, config] of Object.entries(collections)) {
      await createCollection(collectionId, config);
      await ensureAttributesAndIndexes(collectionId, config);
    }
    
    console.log('\n✅ Configuration Appwrite terminée !');
    console.log('\n📋 Collections créées:');
    console.log('  - contact_submissions');
    console.log('  - site_pages');
    console.log('  - admission_submissions');
    console.log('  - status_history');
    
  } catch (error) {
    console.error('\n❌ Erreur:', error.message);
    process.exit(1);
  }
}

main();
