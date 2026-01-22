const { getDatabases, ID, Query, DATABASE_ID, COLLECTIONS } = require('./_appwrite.cjs');

function parseJsonBody(body) {
  if (!body) return null;
  try {
    return JSON.parse(body);
  } catch {
    return null;
  }
}

exports.handler = async (event, context) => {
  if (!context.clientContext || !context.clientContext.user) {
    return {
      statusCode: 401,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: 'Unauthorized' }),
    };
  }

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  }

  const payload = parseJsonBody(event.body);
  if (!payload) {
    return {
      statusCode: 400,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: 'Invalid JSON body' }),
    };
  }

  const { type, id, newStatus, publicNotes } = payload;
  if ((type !== 'contact' && type !== 'admission') || !id || !newStatus) {
    return {
      statusCode: 400,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: 'Missing or invalid fields' }),
    };
  }

  try {
    const db = getDatabases();
    const collectionId = type === 'contact' ? COLLECTIONS.CONTACTS : COLLECTIONS.ADMISSIONS;

    const current = await db.getDocument(DATABASE_ID, collectionId, id);

    const updatePayload = { status: newStatus };

    if (type === 'contact') {
      if (newStatus === 'processed') updatePayload.processedAt = new Date().toISOString();
    } else {
      if (typeof publicNotes === 'string') updatePayload.publicNotes = publicNotes;
      if (newStatus === 'approved' || newStatus === 'rejected') updatePayload.processedAt = new Date().toISOString();
    }

    // Appwrite doesn't like undefined values
    Object.keys(updatePayload).forEach((k) => updatePayload[k] === undefined && delete updatePayload[k]);

    const updated = await db.updateDocument(DATABASE_ID, collectionId, id, updatePayload);

    const historyPayload = {
      submissionType: type,
      submissionId: id,
      oldStatus: current.status,
      newStatus,
    };
    if (typeof publicNotes === 'string' && publicNotes.trim()) {
      historyPayload.note = publicNotes;
    }
    await db.createDocument(DATABASE_ID, COLLECTIONS.STATUS_HISTORY, ID.unique(), historyPayload);

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ updated }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: error.message || 'Internal error' }),
    };
  }
};
