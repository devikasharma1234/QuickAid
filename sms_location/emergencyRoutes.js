const express = require('express');
const router = express.Router();

// db passed in from your main app (Supabase/pg client)
module.exports = (db) => {

  // Serve the page the SMS link points to
  router.get('/emergency/:requestId', async (req, res) => {
    const { requestId } = req.params;

    const { rows } = await db.query(
      `SELECT status FROM emergency_requests WHERE id = $1`,
      [requestId]
    );

    if (rows.length === 0) {
      return res.status(404).send('Invalid or expired link.');
    }
    if (rows[0].status !== 'pending') {
      return res.send('This request has already been submitted. Help is on the way.');
    }

    res.sendFile(__dirname + '/public/location.html');
  });

  // Receive location + emergency details from the page
  router.post('/api/emergency/:requestId', express.json(), async (req, res) => {
    const { requestId } = req.params;
    const { latitude, longitude, accuracy, cause } = req.body;

    if (latitude == null || longitude == null || !cause) {
      return res.status(400).json({ error: 'Missing location or cause of emergency.' });
    }

    await db.query(
      `UPDATE emergency_requests
       SET latitude = $1, longitude = $2, accuracy = $3, cause = $4,
           status = 'submitted', submitted_at = NOW()
       WHERE id = $5`,
      [latitude, longitude, accuracy, cause, requestId]
    );

    // TODO: trigger your dispatch/routing engine here using PostGIS
    // e.g. find nearest available ambulance to (latitude, longitude)

    res.json({ success: true });
  });

  return router;
};