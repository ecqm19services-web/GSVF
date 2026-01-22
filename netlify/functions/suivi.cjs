const { getDatabases, Query, DATABASE_ID, COLLECTIONS } = require('./_appwrite.cjs');

function json(statusCode, body) {
  return {
    statusCode,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  };
}

exports.handler = async (event) => {
  if (event.httpMethod !== 'GET') {
    return json(405, { error: 'Method not allowed' });
  }

  const reference = (event.queryStringParameters && event.queryStringParameters.reference) || '';
  const ref = String(reference).trim().toUpperCase();
  if (!ref) {
    return json(400, { error: 'Missing reference' });
  }

  try {
    const db = getDatabases();

    const queryByRef = async (collectionId) => {
      const res = await db.listDocuments(DATABASE_ID, collectionId, [Query.equal('reference', ref), Query.limit(1)]);
      return res.documents[0] || null;
    };

    let type = null;
    let submission = null;

    if (ref.startsWith('CONT-')) {
      submission = await queryByRef(COLLECTIONS.CONTACTS);
      if (submission) type = 'contact';
    } else if (ref.startsWith('ADM-')) {
      submission = await queryByRef(COLLECTIONS.ADMISSIONS);
      if (submission) type = 'admission';
    } else {
      // Try both
      submission = await queryByRef(COLLECTIONS.CONTACTS);
      if (submission) type = 'contact';
      if (!submission) {
        submission = await queryByRef(COLLECTIONS.ADMISSIONS);
        if (submission) type = 'admission';
      }
    }

    if (!submission || !type) {
      return json(404, { error: 'Not found' });
    }

    // History
    const historyRes = await db.listDocuments(DATABASE_ID, COLLECTIONS.STATUS_HISTORY, [
      Query.equal('submissionType', type),
      Query.equal('submissionId', submission.$id),
      Query.orderAsc('$createdAt'),
      Query.limit(200),
    ]);

    // Sanitize the payload (do not leak private fields)
    const safeSubmission = {
      $id: submission.$id,
      $createdAt: submission.$createdAt,
      reference: submission.reference,
      status: submission.status,
      publicNotes: submission.publicNotes,
    };

    const safeHistory = (historyRes.documents || []).map((h) => ({
      $id: h.$id,
      $createdAt: h.$createdAt,
      oldStatus: h.oldStatus,
      newStatus: h.newStatus,
      note: h.note,
    }));

    return json(200, {
      type,
      submission: safeSubmission,
      history: safeHistory,
    });
  } catch (error) {
    return json(500, { error: error.message || 'Internal error' });
  }
};
