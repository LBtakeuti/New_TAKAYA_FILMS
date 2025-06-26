const express = require('express');
const multer = require('multer');
const path = require('path');
const { authenticateToken } = require('../middleware/auth');
const db = require('../database');

const router = express.Router();

// Multer configuration for profile image uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '../uploads'));
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'profile-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  fileFilter: function (req, file, cb) {
    const allowedTypes = /jpeg|jpg|png|gif/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only images are allowed.'));
    }
  },
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
});

// GET profile (public)
router.get('/', (req, res) => {
  db.get('SELECT * FROM profile ORDER BY id LIMIT 1', [], (err, row) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }
    
    if (!row) {
      return res.status(404).json({ error: 'Profile not found' });
    }
    
    // Parse JSON fields
    try {
      if (row.social_links) row.social_links = JSON.parse(row.social_links);
      if (row.skills) row.skills = JSON.parse(row.skills);
      if (row.services) row.services = JSON.parse(row.services);
    } catch (parseErr) {
      console.error('JSON parse error:', parseErr);
    }
    
    res.json(row);
  });
});

// PUT update profile
router.put('/', authenticateToken, upload.single('profile_image'), (req, res) => {
  const {
    name,
    title,
    bio,
    email,
    phone,
    location,
    website,
    social_links,
    skills,
    services
  } = req.body;

  // First, get the current profile data
  db.get('SELECT * FROM profile ORDER BY id LIMIT 1', [], (err, currentProfile) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }

    // Use new profile image if uploaded, otherwise keep existing URL
    const profile_image_url = req.file ? `/uploads/${req.file.filename}` : (currentProfile?.profile_image_url || null);

    // Prepare JSON fields
    const socialLinksJson = typeof social_links === 'string' ? social_links : JSON.stringify(social_links || {});
    const skillsJson = typeof skills === 'string' ? skills : JSON.stringify(skills || []);
    const servicesJson = typeof services === 'string' ? services : JSON.stringify(services || []);

    if (currentProfile) {
      // Update existing profile
      const query = `
        UPDATE profile 
        SET name = ?, title = ?, bio = ?, profile_image_url = ?, email = ?, phone = ?, 
            location = ?, website = ?, social_links = ?, skills = ?, services = ?, 
            updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
      `;

      const params = [name, title, bio, profile_image_url, email, phone, location, website, socialLinksJson, skillsJson, servicesJson, currentProfile.id];

      db.run(query, params, function(err) {
        if (err) {
          return res.status(500).json({ error: 'Database error' });
        }
        
        res.json({ message: 'Profile updated successfully' });
      });
    } else {
      // Create new profile
      const query = `
        INSERT INTO profile (name, title, bio, profile_image_url, email, phone, location, website, social_links, skills, services)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `;

      const params = [name, title, bio, profile_image_url, email, phone, location, website, socialLinksJson, skillsJson, servicesJson];

      db.run(query, params, function(err) {
        if (err) {
          return res.status(500).json({ error: 'Database error' });
        }
        
        res.status(201).json({
          id: this.lastID,
          message: 'Profile created successfully'
        });
      });
    }
  });
});

module.exports = router;