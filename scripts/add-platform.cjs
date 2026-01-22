/**
 * Script pour ajouter les plateformes web à Appwrite
 */

const https = require('https');

const PROJECT_ID = process.env.APPWRITE_PROJECT_ID;
const API_KEY = process.env.APPWRITE_API_KEY;

if (!PROJECT_ID || !API_KEY) {
  console.error('❌ Missing env vars: APPWRITE_PROJECT_ID and/or APPWRITE_API_KEY');
  process.exit(1);
}

const platforms = [
  { name: 'Localhost', hostname: 'localhost' },
  { name: 'Localhost 127', hostname: '127.0.0.1' },
];

async function addPlatform(name, hostname) {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify({
      type: 'web',
      name: name,
      hostname: hostname
    });

    const options = {
      hostname: 'cloud.appwrite.io',
      port: 443,
      path: `/v1/projects/${PROJECT_ID}/platforms`,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Appwrite-Key': API_KEY,
        'X-Appwrite-Project': PROJECT_ID,
        'Content-Length': data.length
      }
    };

    const req = https.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => body += chunk);
      res.on('end', () => {
        if (res.statusCode === 201) {
          resolve({ success: true, hostname });
        } else if (res.statusCode === 409) {
          resolve({ success: true, hostname, exists: true });
        } else {
          resolve({ success: false, hostname, status: res.statusCode, body });
        }
      });
    });

    req.on('error', (e) => reject(e));
    req.write(data);
    req.end();
  });
}

async function main() {
  console.log('🌐 Ajout des plateformes web à Appwrite...\n');

  for (const platform of platforms) {
    try {
      const result = await addPlatform(platform.name, platform.hostname);
      if (result.success) {
        if (result.exists) {
          console.log(`ℹ️  ${platform.hostname} existe déjà`);
        } else {
          console.log(`✅ ${platform.hostname} ajouté`);
        }
      } else {
        console.log(`⚠️  ${platform.hostname}: ${result.status}`);
      }
    } catch (error) {
      console.error(`❌ Erreur pour ${platform.hostname}:`, error.message);
    }
  }

  console.log('\n✅ Configuration des plateformes terminée !');
}

main();
