const express = require('express');
const app = express();
const PORT = 8080;
const db = require('./supabase');
app.use(express.json());
const emergencyRoutes = require('./sms_location/emergencyRoutes')(db);
const { sendEmergencyLink } = require('./sms_location/sendEmergencyLink');

app.get('/', (req, res) => {
    res.send('Runnning');
});

app.post('/api/incoming-call',async(req,res)=>{
    const callNumber = req.body.From;

    const requestId =await sendEmergencyLink(callNumber,db);

    res.type('text/xml');
    res.send(
        '<Response>' +
        '<Say>Aapko SMS bheja gaya hai. Kripya apni location share karein.</Say>' +
        '</Response>'
    );
})

app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});