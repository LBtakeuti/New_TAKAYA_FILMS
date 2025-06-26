const express = require('express');
const { authenticateToken } = require('../middleware/auth');
const db = require('../database');

const router = express.Router();

// GET all career entries (public)
router.get('/', (req, res) => {
  const query = `
    SELECT * FROM career 
    ORDER BY is_current DESC, start_date DESC, sort_order ASC
  `;
  
  db.all(query, [], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }
    res.json(rows);
  });
});

// GET single career entry
router.get('/:id', (req, res) => {
  const { id } = req.params;
  
  db.get('SELECT * FROM career WHERE id = ?', [id], (err, row) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }
    
    if (!row) {
      return res.status(404).json({ error: 'Career entry not found' });
    }
    
    res.json(row);
  });
});

// POST new career entry
router.post('/', authenticateToken, (req, res) => {
  const {
    company_name,
    position,
    description,
    start_date,
    end_date,
    is_current = false,
    location,
    achievements,
    sort_order = 0
  } = req.body;

  if (!company_name || !position || !start_date) {
    return res.status(400).json({ error: 'Company name, position, and start date are required' });
  }

  const query = `
    INSERT INTO career (company_name, position, description, start_date, end_date, is_current, location, achievements, sort_order)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  const params = [company_name, position, description, start_date, end_date, is_current, location, achievements, sort_order];

  db.run(query, params, function(err) {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }
    
    res.status(201).json({
      id: this.lastID,
      message: 'Career entry created successfully'
    });
  });
});

// PUT update career entry
router.put('/:id', authenticateToken, (req, res) => {
  const { id } = req.params;
  const {
    company_name,
    position,
    description,
    start_date,
    end_date,
    is_current,
    location,
    achievements,
    sort_order
  } = req.body;

  const query = `
    UPDATE career 
    SET company_name = ?, position = ?, description = ?, start_date = ?, end_date = ?, 
        is_current = ?, location = ?, achievements = ?, sort_order = ?, updated_at = CURRENT_TIMESTAMP
    WHERE id = ?
  `;

  const params = [company_name, position, description, start_date, end_date, is_current, location, achievements, sort_order, id];

  db.run(query, params, function(err) {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }
    
    if (this.changes === 0) {
      return res.status(404).json({ error: 'Career entry not found' });
    }
    
    res.json({ message: 'Career entry updated successfully' });
  });
});

// DELETE career entry
router.delete('/:id', authenticateToken, (req, res) => {
  const { id } = req.params;
  
  db.run('DELETE FROM career WHERE id = ?', [id], function(err) {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }
    
    if (this.changes === 0) {
      return res.status(404).json({ error: 'Career entry not found' });
    }
    
    res.json({ message: 'Career entry deleted successfully' });
  });
});

module.exports = router;