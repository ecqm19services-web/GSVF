const { getDatabases, Query, DATABASE_ID, COLLECTIONS } = require('./_appwrite.cjs');

exports.handler = async (event, context) => {
  if (!context.clientContext || !context.clientContext.user) {
    return {
      statusCode: 401,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: 'Unauthorized' }),
    };
  }

  if (event.httpMethod !== 'GET') {
    return {
      statusCode: 405,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  }

  try {
    const db = getDatabases();
    const res = await db.listDocuments(DATABASE_ID, COLLECTIONS.CONTACTS, [
      Query.orderDesc('$createdAt'),
      Query.limit(200),
    ]);

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ documents: res.documents }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: error.message || 'Internal error' }),
    };
  }
};
