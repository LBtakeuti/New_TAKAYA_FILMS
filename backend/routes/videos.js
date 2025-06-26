const express = require('express');
const multer = require('multer');
const path = require('path');
const { authenticateToken } = require('../middleware/auth');
const db = require('../database');

const router = express.Router();

// Multer configuration for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '../uploads'));
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  fileFilter: function (req, file, cb) {
    const allowedTypes = /jpeg|jpg|png|gif|mp4|mov|avi|wmv/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only images and videos are allowed.'));
    }
  },
  limits: { fileSize: 100 * 1024 * 1024 } // 100MB limit
});

// GET all videos (public)
router.get('/', (req, res) => {
  const query = `
    SELECT * FROM videos 
    WHERE status = 'published' 
    ORDER BY featured DESC, sort_order ASC, created_at DESC
  `;
  
  db.all(query, [], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }
    res.json(rows);
  });
});

// GET all videos (admin)
router.get('/admin', authenticateToken, (req, res) => {
  const query = `
    SELECT * FROM videos 
    ORDER BY created_at DESC
  `;
  
  db.all(query, [], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }
    res.json(rows);
  });
});

// GET single video
router.get('/:id', (req, res) => {
  const { id } = req.params;
  
  db.get('SELECT * FROM videos WHERE id = ?', [id], (err, row) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }
    
    if (!row) {
      return res.status(404).json({ error: 'Video not found' });
    }
    
    res.json(row);
  });
});

// POST new video
router.post('/', authenticateToken, upload.fields([
  { name: 'video', maxCount: 1 },
  { name: 'thumbnail', maxCount: 1 }
]), (req, res) => {
  const {
    title,
    description,
    category,
    client,
    project_date,
    status = 'draft',
    featured = false,
    sort_order = 0
  } = req.body;

  if (!title) {
    return res.status(400).json({ error: 'Title is required' });
  }

  const video_url = req.files?.video ? `/uploads/${req.files.video[0].filename}` : null;
  const thumbnail_url = req.files?.thumbnail ? `/uploads/${req.files.thumbnail[0].filename}` : null;

  const query = `
    INSERT INTO videos (title, description, video_url, thumbnail_url, category, client, project_date, status, featured, sort_order)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  const params = [title, description, video_url, thumbnail_url, category, client, project_date, status, featured, sort_order];

  db.run(query, params, function(err) {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }
    
    res.status(201).json({
      id: this.lastID,
      message: 'Video created successfully'
    });
  });
});

// PUT update video
router.put('/:id', authenticateToken, upload.fields([
  { name: 'video', maxCount: 1 },
  { name: 'thumbnail', maxCount: 1 }
]), (req, res) => {
  const { id } = req.params;
  const {
    title,
    description,
    category,
    client,
    project_date,
    status,
    featured,
    sort_order
  } = req.body;

  // First, get the current video data
  db.get('SELECT * FROM videos WHERE id = ?', [id], (err, currentVideo) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }
    
    if (!currentVideo) {
      return res.status(404).json({ error: 'Video not found' });
    }

    // Use new files if uploaded, otherwise keep existing URLs
    const video_url = req.files?.video ? `/uploads/${req.files.video[0].filename}` : currentVideo.video_url;
    const thumbnail_url = req.files?.thumbnail ? `/uploads/${req.files.thumbnail[0].filename}` : currentVideo.thumbnail_url;

    const query = `
      UPDATE videos 
      SET title = ?, description = ?, video_url = ?, thumbnail_url = ?, category = ?, client = ?, 
          project_date = ?, status = ?, featured = ?, sort_order = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `;

    const params = [title, description, video_url, thumbnail_url, category, client, project_date, status, featured, sort_order, id];

    db.run(query, params, function(err) {
      if (err) {
        return res.status(500).json({ error: 'Database error' });
      }
      
      if (this.changes === 0) {
        return res.status(404).json({ error: 'Video not found' });
      }
      
      res.json({ message: 'Video updated successfully' });
    });
  });
});

// DELETE video
router.delete('/:id', authenticateToken, (req, res) => {
  const { id } = req.params;
  
  db.run('DELETE FROM videos WHERE id = ?', [id], function(err) {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }
    
    if (this.changes === 0) {
      return res.status(404).json({ error: 'Video not found' });
    }
    
    res.json({ message: 'Video deleted successfully' });
  });
});

module.exports = router;