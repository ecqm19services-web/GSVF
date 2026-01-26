const https = require('https');

const API_URL = 'https://cpvf.netlify.app/api/page-content?page=accueil';

console.log('🧪 Test de l\'API Netlify...\n');
console.log(`URL: ${API_URL}\n`);

https.get(API_URL, (res) => {
  let data = '';
  
  console.log(`Status: ${res.statusCode}`);
  console.log(`Headers:`, res.headers);
  console.log('\n---\n');
  
  res.on('data', (chunk) => {
    data += chunk;
  });
  
  res.on('end', () => {
    console.log('Response body:');
    try {
      const json = JSON.parse(data);
      console.log(JSON.stringify(json, null, 2));
      
      if (res.statusCode === 500 && json.error === 'Unauthorized') {
        console.log('\n❌ Problème: Les variables Netlify ne sont pas correctes');
        console.log('\n📋 Checklist:');
        console.log('  1. Va sur Netlify Dashboard → Site settings → Environment variables');
        console.log('  2. Vérifie que ces variables existent:');
        console.log('     - APPWRITE_ENDPOINT=https://cloud.appwrite.io/v1');
        console.log('     - APPWRITE_PROJECT_ID=696f5bc50027f26737e9');
        console.log('     - APPWRITE_API_KEY=standard_d23c868...');
        console.log('     - APPWRITE_DATABASE_ID=school_db');
        console.log('  3. Si elles sont correctes, redéploie le site (Deploys → Trigger deploy → Deploy site)');
      } else if (res.statusCode === 404) {
        console.log('\n✅ API fonctionne ! (404 = normal, aucun document créé)');
      } else if (res.statusCode === 200) {
        console.log('\n✅ API fonctionne et document trouvé !');
      }
    } catch (e) {
      console.log(data);
    }
  });
  
}).on('error', (err) => {
  console.error('❌ Erreur:', err.message);
});
