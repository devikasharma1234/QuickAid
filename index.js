import express from 'express';
import { supabase } from './supabase.js';

const app = express();

app.get('/hospitals', async (req, res) => {
  const { data, error } = await supabase
    .from('hospitals')
    .select('*');

  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

app.listen(8080, () => console.log('Server running on port 8080'));