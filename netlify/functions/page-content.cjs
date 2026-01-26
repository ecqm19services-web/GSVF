const { getDatabases, ID, Query, DATABASE_ID, COLLECTIONS } = require('./_appwrite.cjs');

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

function readPageParam(event) {
  const page = (event.queryStringParameters && event.queryStringParameters.page) || '';
  return String(page).trim();
}

function isValidPage(page) {
  return /^[a-z0-9-]{1,60}$/i.test(page);
}

async function getPageDocument(db, page) {
  const res = await db.listDocuments(DATABASE_ID, COLLECTIONS.SITE_PAGES, [
    Query.equal('page', page),
    Query.limit(1),
  ]);
  return (res.documents && res.documents[0]) || null;
}

exports.handler = async (event, context) => {
  const page = readPageParam(event);

  if (!page || !isValidPage(page)) {
    return json(400, { error: 'Missing or invalid page parameter' });
  }

  if (event.httpMethod === 'GET') {
    try {
      const db = getDatabases();
      const doc = await getPageDocument(db, page);
      return json(200, { document: doc });
    } catch (error) {
      return json(500, { error: error.message || 'Internal error' });
    }
  }

  if (event.httpMethod === 'PUT') {
    if (!context.clientContext || !context.clientContext.user) {
      return json(401, { error: 'Unauthorized' });
    }

    const payload = parseJsonBody(event.body);
    if (!payload) {
      return json(400, { error: 'Invalid JSON body' });
    }

    const { kind, payload: rawPayload } = payload;

    if ((kind !== 'markdown' && kind !== 'json') || typeof rawPayload !== 'string') {
      return json(400, { error: 'Missing or invalid fields' });
    }

    try {
      const db = getDatabases();
      const existing = await getPageDocument(db, page);
      const updatedAt = new Date().toISOString();

      const baseData = {
        page,
        kind,
        payload: rawPayload,
        content: rawPayload, // support required "content" attribute in schema
        updatedAt,
      };

      if (!existing) {
        const created = await db.createDocument(DATABASE_ID, COLLECTIONS.SITE_PAGES, ID.unique(), baseData);
        return json(200, { document: created });
      }

      const updated = await db.updateDocument(DATABASE_ID, COLLECTIONS.SITE_PAGES, existing.$id, baseData);

      return json(200, { document: updated });
    } catch (error) {
      return json(500, { error: error.message || 'Internal error' });
    }
  }

  return json(405, { error: 'Method not allowed' });
};
