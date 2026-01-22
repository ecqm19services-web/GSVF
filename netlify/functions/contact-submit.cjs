const { getDatabases, ID, DATABASE_ID, COLLECTIONS } = require('./_appwrite.cjs');

function json(statusCode, body) {
  return {
    statusCode,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  };
}

function parseJsonBody(body) {
  if (!body) return null;
  try {
    return JSON.parse(body);
  } catch {
    return null;
  }
}

function generateReference(prefix) {
  const year = new Date().getFullYear();
  const random = Math.floor(Math.random() * 9000) + 1000;
  return `${prefix}-${year}-${random}`;
}

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return json(405, { error: 'Method not allowed' });
  }

  const payload = parseJsonBody(event.body);
  if (!payload) {
    return json(400, { error: 'Invalid JSON body' });
  }

  const { firstName, lastName, email, phone, subject, message } = payload;
  if (!firstName || !lastName || !email || !phone || !subject || !message) {
    return json(400, { error: 'Missing fields' });
  }

  try {
    const db = getDatabases();
    const reference = generateReference('CONT');

    const doc = await db.createDocument(DATABASE_ID, COLLECTIONS.CONTACTS, ID.unique(), {
      reference,
      firstName,
      lastName,
      email,
      phone,
      subject,
      message,
      status: 'new',
    });

    return json(200, { reference: doc.reference });
  } catch (error) {
    return json(500, { error: error.message || 'Internal error' });
  }
};
