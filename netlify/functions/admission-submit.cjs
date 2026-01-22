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

  const {
    studentFirstName,
    studentLastName,
    studentBirthdate,
    desiredClass,
    currentSchool,
    parentFirstName,
    parentLastName,
    parentEmail,
    parentPhone,
    parentAddress,
    relationship,
    message,
  } = payload;

  if (!studentFirstName || !studentLastName || !studentBirthdate || !desiredClass || !parentFirstName || !parentLastName || !parentEmail || !parentPhone) {
    return json(400, { error: 'Missing fields' });
  }

  try {
    const db = getDatabases();
    const reference = generateReference('ADM');

    const payloadToCreate = {
      reference,
      studentFirstName,
      studentLastName,
      studentBirthdate,
      desiredClass,
      parentFirstName,
      parentLastName,
      parentEmail,
      parentPhone,
      status: 'new',
    };
    if (currentSchool) payloadToCreate.currentSchool = currentSchool;
    if (parentAddress) payloadToCreate.parentAddress = parentAddress;
    if (relationship) payloadToCreate.relationship = relationship;
    if (message) payloadToCreate.message = message;

    const doc = await db.createDocument(DATABASE_ID, COLLECTIONS.ADMISSIONS, ID.unique(), payloadToCreate);

    return json(200, { reference: doc.reference });
  } catch (error) {
    return json(500, { error: error.message || 'Internal error' });
  }
};
