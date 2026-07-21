const express = require('express');
const app = express();
app.use(express.json());
const PORT = 8080;
const db = require('./supabase');
const emergencyRoutes = require('./sms_location/emergencyRoutes')(db);
const { sendEmergencyLink } = require('./sms_location/sendEmergencyLink');

app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    res.send('Runnning');
});

app.use(emergencyRoutes);


app.post('/api/trigger-alert', async (req, res) => {
  const { phoneNumber } = req.body;
  const requestId = await sendEmergencyLink(phoneNumber, db);
  res.json({ requestId });
});


app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});