const express = require('express');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const router = express.Router();

// db passed in from your main app (Supabase/pg client)
module.exports = (db) => {

  // Serve the page the SMS link points to
  router.get('/emergency/:requestId', async (req, res) => {
    const { requestId } = req.params;

    const { data, error } = await db
      .from('emergency_requests')
      .select('status')
      .eq('id', requestId)
      .single();

    if (error || !data) {
      return res.status(404).send('Invalid or expired link.');
    }
    if (data.status !== 'pending') {
      return res.send('This request has already been submitted. Help is on the way.');
    }

    res.sendFile(__dirname + '/public/location.html');
  });

  // Receive location + emergency details from the page
  router.post('/api/emergency/:requestId', async (req, res) => {
    const { requestId } = req.params;
    const { latitude, longitude, accuracy, cause, patient_name } = req.body;

    if (latitude == null || longitude == null || !cause || !patient_name) {
      return res.status(400).json({ error: 'Missing patient name, location, or cause of emergency.' });
    }

    const patient_id = uuidv4();

    const { error } = await db
      .from('emergency_requests')
      .update({
        latitude,
        longitude,
        accuracy,
        cause,
        patient_name,
        patient_id,
        status: 'submitted',
        submitted_at: new Date().toISOString(),
      })
      .eq('id', requestId);

    if (error) {
      return res.status(500).json({ error: 'Failed to save emergency details.' });
    }

    // TODO: trigger your dispatch/routing engine here using PostGIS
    // e.g. find nearest available ambulance to (latitude, longitude)

    res.json({ success: true });
  });

  return router;
};



