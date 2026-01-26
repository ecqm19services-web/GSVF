const { Client, Databases, Permission, Role } = require('node-appwrite');

// Configuration depuis les variables d'environnement ou valeurs par défaut
const config = {
  endpoint: process.env.APPWRITE_ENDPOINT || 'https://cloud.appwrite.io/v1',
  projectId: process.env.APPWRITE_PROJECT_ID,
  apiKey: process.env.APPWRITE_API_KEY,
  databaseId: process.env.APPWRITE_DATABASE_ID,
  collectionId: 'site_pages'
};

// Validation de la configuration
if (!config.projectId || !config.apiKey || !config.databaseId) {
  console.error('❌ Variables d\'environnement manquantes !');
  console.error('Assurez-vous que ces variables sont définies :');
  console.error('  - APPWRITE_PROJECT_ID');
  console.error('  - APPWRITE_API_KEY');
  console.error('  - APPWRITE_DATABASE_ID');
  process.exit(1);
}

// Initialisation du client Appwrite
const client = new Client()
  .setEndpoint(config.endpoint)
  .setProject(config.projectId)
  .setKey(config.apiKey);

const databases = new Databases(client);

async function setupCollection() {
  console.log('🚀 Création de la collection site_pages...\n');

  try {
    // Étape 1 : Créer la collection
    console.log('📦 Création de la collection...');
    const collection = await databases.createCollection(
      config.databaseId,
      config.collectionId,
      'Site Pages',
      [
        Permission.read(Role.any()) // Lecture publique
      ],
      false, // documentSecurity = false (on utilise les permissions de collection)
      true   // enabled
    );
    console.log('✅ Collection créée :', collection.$id);

    // Étape 2 : Créer l'attribut "page"
    console.log('\n📝 Création de l\'attribut "page"...');
    await databases.createStringAttribute(
      config.databaseId,
      config.collectionId,
      'page',
      100,      // size
      true,     // required
      null,     // default
      false     // array
    );
    console.log('✅ Attribut "page" créé');

    // Attendre que l'attribut soit disponible
    await waitForAttribute('page');

    // Étape 3 : Créer l'attribut "content"
    console.log('\n📝 Création de l\'attribut "content"...');
    await databases.createStringAttribute(
      config.databaseId,
      config.collectionId,
      'content',
      1000000,  // size (1 million de caractères)
      true,     // required
      null,     // default
      false     // array
    );
    console.log('✅ Attribut "content" créé');

    // Attendre que l'attribut soit disponible
    await waitForAttribute('content');

    // Étape 4 : Créer un index unique sur "page"
    console.log('\n🔑 Création de l\'index unique sur "page"...');
    await databases.createIndex(
      config.databaseId,
      config.collectionId,
      'page_unique',
      'unique',
      ['page'],
      ['ASC']
    );
    console.log('✅ Index "page_unique" créé');

    console.log('\n✨ Configuration terminée avec succès !');
    console.log('\n📋 Résumé :');
    console.log(`  - Collection ID : ${config.collectionId}`);
    console.log(`  - Database ID : ${config.databaseId}`);
    console.log(`  - Attributs : page (string, 100), content (string, 1000000)`);
    console.log(`  - Index : page_unique (unique)`);
    console.log(`  - Permissions : Any (read)`);
    console.log('\n🎉 Tu peux maintenant tester : https://cpvf.netlify.app/api/page-content?page=accueil');

  } catch (error) {
    if (error.code === 409) {
      console.error('⚠️  La collection existe déjà !');
      console.log('Si tu veux la recréer, supprime-la d\'abord dans Appwrite Console.');
    } else {
      console.error('❌ Erreur lors de la création :', error.message);
      console.error('Détails :', error);
    }
    process.exit(1);
  }
}

// Fonction helper pour attendre qu'un attribut soit disponible
async function waitForAttribute(attributeKey) {
  console.log(`⏳ Attente de la disponibilité de l'attribut "${attributeKey}"...`);
  let attempts = 0;
  const maxAttempts = 30;

  while (attempts < maxAttempts) {
    try {
      const collection = await databases.getCollection(config.databaseId, config.collectionId);
      const attribute = collection.attributes.find(attr => attr.key === attributeKey);
      
      if (attribute && attribute.status === 'available') {
        console.log(`✅ Attribut "${attributeKey}" disponible`);
        return;
      }
      
      await new Promise(resolve => setTimeout(resolve, 2000)); // Attendre 2 secondes
      attempts++;
    } catch (error) {
      console.error(`❌ Erreur lors de la vérification : ${error.message}`);
      break;
    }
  }

  throw new Error(`Timeout : l'attribut "${attributeKey}" n'est pas devenu disponible après ${maxAttempts * 2}s`);
}

// Exécution
setupCollection();
