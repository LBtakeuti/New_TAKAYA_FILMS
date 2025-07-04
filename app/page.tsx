'use client';

import React, { useState, useEffect } from 'react';
import api from '@/utils/api';
import ContactForm from '@/components/ContactForm';
import { Profile } from '@/types';

export default function HomePage() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const profileResponse = await api.get('/profile').catch(() => ({ data: null }));
      setProfile(profileResponse.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="App">
      {/* Navigation */}
      <nav className="App-nav">
        <div className="nav-container">
          <h1 className="nav-logo">TAKAYA FILMS</h1>
          <div className="nav-links">
            <a href="#about">ABOUT</a>
            <a href="#contact">CONTACT</a>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">TAKAYA FILMS</h1>
          <p className="hero-subtitle">Cinematic Visual Storytelling</p>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="about-section">
        <div className="about-container">
          <h2 className="section-title">ABOUT</h2>
          {profile ? (
            <div className="profile-content">
              <h3 className="profile-name">{profile.name}</h3>
              <p className="profile-title">{profile.title}</p>
              {profile.bio && <p className="profile-bio">{profile.bio}</p>}
              
              {profile.skills && profile.skills.length > 0 && (
                <div className="profile-section">
                  <h4>Skills</h4>
                  <div className="skills-list">
                    {profile.skills.map((skill, index) => (
                      <span key={index} className="skill-tag">{skill}</span>
                    ))}
                  </div>
                </div>
              )}

              {profile.services && profile.services.length > 0 && (
                <div className="profile-section">
                  <h4>Services</h4>
                  <ul className="services-list">
                    {profile.services.map((service, index) => (
                      <li key={index}>{service}</li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="social-links">
                {profile.social_links?.instagram && (
                  <a href={profile.social_links.instagram} target="_blank" rel="noopener noreferrer">
                    Instagram
                  </a>
                )}
                {profile.social_links?.youtube && (
                  <a href={profile.social_links.youtube} target="_blank" rel="noopener noreferrer">
                    YouTube
                  </a>
                )}
                {profile.social_links?.vimeo && (
                  <a href={profile.social_links.vimeo} target="_blank" rel="noopener noreferrer">
                    Vimeo
                  </a>
                )}
              </div>
            </div>
          ) : (
            <div className="profile-placeholder">
              <p>プロフィール情報を読み込んでいます...</p>
            </div>
          )}
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="contact-section">
        <div className="contact-container">
          <h2 className="section-title">CONTACT</h2>
          <ContactForm />
        </div>
      </section>

      {/* Footer */}
      <footer className="App-footer">
        <p>&copy; 2024 TAKAYA FILMS. All rights reserved.</p>
      </footer>

    </div>
  );
}
