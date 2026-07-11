const express = require('express');
const cors = require('cors');
const path = require('path');
const Database = require('better-sqlite3');

const app = express();
const PORT = process.env.PORT || 3000;

// ===== Basic middleware =====
app.use(cors());
app.use(express.json());

// If you want to serve your html files from root
app.use(express.static(path.join(__dirname)));

// ===== DB setup =====
const db = new Database('shows.db');

// A single row per show; JSON columns store arrays/objects
db.exec(`
CREATE TABLE IF NOT EXISTS shows (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  castPage TEXT NOT NULL,
  password TEXT DEFAULT '',
  cast TEXT NOT NULL DEFAULT '[]',
  contacts TEXT NOT NULL DEFAULT '[]',
  calendar TEXT NOT NULL DEFAULT '[]',
  ticker TEXT NOT NULL DEFAULT '',
  callsheet TEXT NOT NULL DEFAULT '[]'
);
`);

const seedShows = [
  { id: 'fences', name: 'Fences', castPage: './cast-fences.html', password: 'Legacy' },
  { id: 'midsummer', name: "A Midsummer Night's Dream", castPage: './cast-midsummer.html', password: '' },
  { id: 'bare', name: 'Bare', castPage: './cast-bare.html', password: '' },
  { id: 'godofcarnage', name: 'God of Carnage', castPage: './cast-godofcarnage.html', password: '' },
  { id: 'rivals', name: 'The Rivals', castPage: './cast-rivals.html', password: '' },
  { id: 'pillowman', name: 'The Pillowman', castPage: './cast-pillowman.html', password: '' },
  { id: 'godot', name: 'Waiting for Godot', castPage: './cast-godot.html', password: '' }
];

const upsertShow = db.prepare(`
INSERT INTO shows (id, name, castPage, password, cast, contacts, calendar, ticker, callsheet)
VALUES (@id, @name, @castPage, @password, '[]', '[]', '[]', '', '[]')
ON CONFLICT(id) DO UPDATE SET
  name=excluded.name,
  castPage=excluded.castPage,
  password=excluded.password
`);

seedShows.forEach(s => upsertShow.run(s));

// ===== Helpers =====
function parseRow(row) {
  return {
    id: row.id,
    name: row.name,
    castPage: row.castPage,
    password: row.password,
    cast: JSON.parse(row.cast || '[]'),
    contacts: JSON.parse(row.contacts || '[]'),
    calendar: JSON.parse(row.calendar || '[]'),
    ticker: row.ticker || '',
    callsheet: JSON.parse(row.callsheet || '[]')
  };
}
function uid() {
  return 'id-' + Math.random().toString(36).slice(2) + Date.now();
}
function getShowOr404(res, showId) {
  const row = db.prepare(`SELECT * FROM shows WHERE id = ?`).get(showId);
  if (!row) {
    res.status(404).json({ error: 'Show not found' });
    return null;
  }
  return parseRow(row);
}
function saveShow(show) {
  db.prepare(`
    UPDATE shows SET
      name=@name,
      castPage=@castPage,
      password=@password,
      cast=@cast,
      contacts=@contacts,
      calendar=@calendar,
      ticker=@ticker,
      callsheet=@callsheet
    WHERE id=@id
  `).run({
    id: show.id,
    name: show.name,
    castPage: show.castPage,
    password: show.password || '',
    cast: JSON.stringify(show.cast || []),
    contacts: JSON.stringify(show.contacts || []),
    calendar: JSON.stringify(show.calendar || []),
    ticker: show.ticker || '',
    callsheet: JSON.stringify(show.callsheet || [])
  });
}

// ===== API =====

// list shows
app.get('/api/shows', (req, res) => {
  const rows = db.prepare(`SELECT * FROM shows ORDER BY name`).all();
  res.json(rows.map(parseRow));
});

// one show
app.get('/api/shows/:showId', (req, res) => {
  const show = getShowOr404(res, req.params.showId);
  if (!show) return;
  res.json(show);
});

// create show
app.post('/api/shows', (req, res) => {
  const { name, castPage = '#', password = '' } = req.body || {};
  if (!name || !name.trim()) return res.status(400).json({ error: 'name required' });

  const id = 'show-' + Math.random().toString(36).slice(2, 8);
  db.prepare(`
    INSERT INTO shows (id, name, castPage, password, cast, contacts, calendar, ticker, callsheet)
    VALUES (?, ?, ?, ?, '[]', '[]', '[]', '', '[]')
  `).run(id, name.trim(), castPage, password);

  const created = db.prepare(`SELECT * FROM shows WHERE id = ?`).get(id);
  res.status(201).json(parseRow(created));
});

// ticker
app.put('/api/shows/:showId/ticker', (req, res) => {
  const show = getShowOr404(res, req.params.showId);
  if (!show) return;
  show.ticker = (req.body?.ticker || '').toString();
  saveShow(show);
  res.json(show);
});

// cast
app.post('/api/shows/:showId/cast', (req, res) => {
  const show = getShowOr404(res, req.params.showId);
  if (!show) return;
  const { name, role, notes = '' } = req.body || {};
  if (!name || !role) return res.status(400).json({ error: 'name and role required' });

  show.cast.unshift({ id: uid(), name, role, notes });
  saveShow(show);
  res.json(show.cast);
});
app.delete('/api/shows/:showId/cast/:id', (req, res) => {
  const show = getShowOr404(res, req.params.showId);
  if (!show) return;
  show.cast = show.cast.filter(x => x.id !== req.params.id);
  saveShow(show);
  res.json(show.cast);
});

// contacts
app.post('/api/shows/:showId/contacts', (req, res) => {
  const show = getShowOr404(res, req.params.showId);
  if (!show) return;
  const { name, type, email, phone } = req.body || {};
  if (!name || !type || !email || !phone) return res.status(400).json({ error: 'all fields required' });

  show.contacts.unshift({ id: uid(), name, type, email, phone });
  saveShow(show);
  res.json(show.contacts);
});
app.delete('/api/shows/:showId/contacts/:id', (req, res) => {
  const show = getShowOr404(res, req.params.showId);
  if (!show) return;
  show.contacts = show.contacts.filter(x => x.id !== req.params.id);
  saveShow(show);
  res.json(show.contacts);
});

// calendar
app.post('/api/shows/:showId/calendar', (req, res) => {
  const show = getShowOr404(res, req.params.showId);
  if (!show) return;
  const { date, time, title, notes = '' } = req.body || {};
  if (!date || !time || !title) return res.status(400).json({ error: 'date, time, title required' });

  show.calendar.push({ id: uid(), date, time, title, notes });
  saveShow(show);
  res.json(show.calendar);
});
app.delete('/api/shows/:showId/calendar/:id', (req, res) => {
  const show = getShowOr404(res, req.params.showId);
  if (!show) return;
  show.calendar = show.calendar.filter(x => x.id !== req.params.id);
  saveShow(show);
  res.json(show.calendar);
});

// callsheet
app.post('/api/shows/:showId/callsheet', (req, res) => {
  const show = getShowOr404(res, req.params.showId);
  if (!show) return;
  const { dept, time, task } = req.body || {};
  if (!dept || !time || !task) return res.status(400).json({ error: 'dept, time, task required' });

  show.callsheet.unshift({ id: uid(), dept, time, task });
  saveShow(show);
  res.json(show.callsheet);
});
app.delete('/api/shows/:showId/callsheet/:id', (req, res) => {
  const show = getShowOr404(res, req.params.showId);
  if (!show) return;
  show.callsheet = show.callsheet.filter(x => x.id !== req.params.id);
  saveShow(show);
  res.json(show.callsheet);
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
