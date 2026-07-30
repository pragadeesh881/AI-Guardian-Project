require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mysql = require('mysql2/promise');

const app = express();
const PORT = process.env.PORT || 3001;

// ─── Middleware ────────────────────────────────────────────────────────────────
app.use(cors({ origin: ['http://localhost:5173', 'http://localhost:3000'] }));
app.use(express.json());

// ─── MySQL Connection Pool ─────────────────────────────────────────────────────
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 3306,
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'ai_guardian',
  waitForConnections: true,
  connectionLimit: 10,
});

// Test DB connection on startup
pool.getConnection()
  .then(conn => {
    console.log('✅ Connected to MySQL database: ai_guardian');
    conn.release();
  })
  .catch(err => {
    console.error('❌ MySQL connection failed:', err.message);
    process.exit(1);
  });

// ─── Helper ───────────────────────────────────────────────────────────────────
const asyncHandler = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);

// ─── EMERGENCY INCIDENTS ───────────────────────────────────────────────────────

// GET all incidents
app.get('/api/incidents', asyncHandler(async (req, res) => {
  const [rows] = await pool.query('SELECT * FROM emergency_incidents ORDER BY created_at DESC');
  res.json(rows);
}));

// GET single incident
app.get('/api/incidents/:id', asyncHandler(async (req, res) => {
  const [rows] = await pool.query('SELECT * FROM emergency_incidents WHERE id = ?', [req.params.id]);
  if (!rows.length) return res.status(404).json({ error: 'Incident not found' });
  res.json(rows[0]);
}));

// POST create incident
app.post('/api/incidents', asyncHandler(async (req, res) => {
  const { emergency_type, description, gps_coordinates, location, source = 'web' } = req.body;
  if (!emergency_type) return res.status(400).json({ error: 'emergency_type is required' });

  const [result] = await pool.query(
    'INSERT INTO emergency_incidents (emergency_type, description, gps_coordinates, location, source) VALUES (?, ?, ?, ?, ?)',
    [emergency_type, description || null, gps_coordinates || null, location || null, source]
  );

  // Also auto-create a volunteer request for this incident
  await pool.query(
    'INSERT INTO volunteer_requests (emergency_type, location, description, status, incident_id) VALUES (?, ?, ?, "active", ?)',
    [emergency_type, location || 'Unknown Location', description || '', result.insertId]
  );

  const [newRow] = await pool.query('SELECT * FROM emergency_incidents WHERE id = ?', [result.insertId]);
  res.status(201).json(newRow[0]);
}));

// PATCH update incident status
app.patch('/api/incidents/:id', asyncHandler(async (req, res) => {
  const { status } = req.body;
  await pool.query('UPDATE emergency_incidents SET status = ? WHERE id = ?', [status, req.params.id]);
  const [rows] = await pool.query('SELECT * FROM emergency_incidents WHERE id = ?', [req.params.id]);
  res.json(rows[0]);
}));

// ─── VOLUNTEER REQUESTS ────────────────────────────────────────────────────────

// GET all volunteer requests
app.get('/api/volunteers', asyncHandler(async (req, res) => {
  const [rows] = await pool.query('SELECT * FROM volunteer_requests ORDER BY created_at DESC');
  res.json(rows);
}));

// POST create volunteer request
app.post('/api/volunteers', asyncHandler(async (req, res) => {
  const { emergency_type, location, description, distance, incident_id } = req.body;
  if (!emergency_type || !location) return res.status(400).json({ error: 'emergency_type and location are required' });

  const [result] = await pool.query(
    'INSERT INTO volunteer_requests (emergency_type, location, description, distance, incident_id) VALUES (?, ?, ?, ?, ?)',
    [emergency_type, location, description || null, distance || null, incident_id || null]
  );

  const [newRow] = await pool.query('SELECT * FROM volunteer_requests WHERE id = ?', [result.insertId]);
  res.status(201).json(newRow[0]);
}));

// PATCH update volunteer request status (accept / resolve)
app.patch('/api/volunteers/:id', asyncHandler(async (req, res) => {
  const { status } = req.body;
  if (!['active', 'accepted', 'resolved'].includes(status)) {
    return res.status(400).json({ error: 'Invalid status. Must be active, accepted, or resolved' });
  }

  await pool.query('UPDATE volunteer_requests SET status = ? WHERE id = ?', [status, req.params.id]);
  const [rows] = await pool.query('SELECT * FROM volunteer_requests WHERE id = ?', [req.params.id]);
  if (!rows.length) return res.status(404).json({ error: 'Volunteer request not found' });
  res.json(rows[0]);
}));

// ─── EMERGENCY CARDS ──────────────────────────────────────────────────────────

// GET all emergency cards
app.get('/api/emergency-cards', asyncHandler(async (req, res) => {
  const [rows] = await pool.query('SELECT * FROM emergency_cards ORDER BY created_at DESC');
  res.json(rows);
}));

// POST save emergency card
app.post('/api/emergency-cards', asyncHandler(async (req, res) => {
  const { emergency_type, gps_coordinates, description, contact_info, timestamp, source = 'web', incident_id } = req.body;
  if (!emergency_type) return res.status(400).json({ error: 'emergency_type is required' });

  const [result] = await pool.query(
    'INSERT INTO emergency_cards (emergency_type, gps_coordinates, description, contact_info, timestamp, source, incident_id) VALUES (?, ?, ?, ?, ?, ?, ?)',
    [emergency_type, gps_coordinates || null, description || null, contact_info || null, timestamp || new Date().toISOString(), source, incident_id || null]
  );

  const [newRow] = await pool.query('SELECT * FROM emergency_cards WHERE id = ?', [result.insertId]);
  res.status(201).json(newRow[0]);
}));

// ─── Health Check ──────────────────────────────────────────────────────────────
app.get('/api/health', asyncHandler(async (req, res) => {
  await pool.query('SELECT 1');
  res.json({ status: 'ok', database: 'connected', timestamp: new Date().toISOString() });
}));

// ─── Global Error Handler ─────────────────────────────────────────────────────
app.use((err, req, res, next) => {
  console.error('API Error:', err.message);
  res.status(500).json({ error: 'Internal server error', details: err.message });
});

app.listen(PORT, () => {
  console.log(`🚀 AI Guardian API Server running on http://localhost:${PORT}`);
  console.log(`   Health check: http://localhost:${PORT}/api/health`);
});
