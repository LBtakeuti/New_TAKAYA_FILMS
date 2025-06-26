import React from 'react';

const About: React.FC = () => {
  return (
    <div className="min-h-screen bg-black text-white">
      {/* Hero Section */}
      <section className="py-20 bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-5xl font-bold mb-6">About TAKAYA</h1>
              <p className="text-xl text-gray-300 mb-6">
                Professional film creator and director with a passion for cinematic storytelling 
                and commercial video production.
              </p>
              <p className="text-gray-400 mb-8">
                With years of experience in the industry, I specialize in creating compelling 
                visual narratives that resonate with audiences and deliver results for clients.
              </p>
            </div>
            <div className="bg-gray-800 aspect-square rounded-lg flex items-center justify-center">
              <span className="text-gray-400 text-lg">Profile Image</span>
            </div>
          </div>
        </div>
      </section>

      {/* Skills Section */}
      <section className="py-16 bg-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-center mb-12">Skills & Expertise</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: 'Video Production',
                skills: ['Cinematography', 'Direction', 'Storytelling', 'Concept Development']
              },
              {
                title: 'Post-Production',
                skills: ['Video Editing', 'Color Grading', 'Sound Design', 'Motion Graphics']
              },
              {
                title: 'Equipment',
                skills: ['Professional Cameras', 'Lighting Setup', 'Audio Recording', 'Drone Operation']
              }
            ].map((category, index) => (
              <div key={index} className="bg-gray-900 p-6 rounded-lg">
                <h3 className="text-xl font-semibold mb-4">{category.title}</h3>
                <ul className="space-y-2">
                  {category.skills.map((skill, skillIndex) => (
                    <li key={skillIndex} className="text-gray-300 flex items-center">
                      <span className="w-2 h-2 bg-white rounded-full mr-3"></span>
                      {skill}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Experience Section */}
      <section className="py-16 bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-center mb-12">Experience</h2>
          <div className="space-y-8">
            {/* Placeholder for career items - will be populated from database */}
            <div className="text-center py-12">
              <p className="text-gray-400 text-lg">
                Career information will be displayed here once added through the admin panel.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Philosophy Section */}
      <section className="py-16 bg-black">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold mb-8">Creative Philosophy</h2>
          <blockquote className="text-xl text-gray-300 italic mb-6">
            "Every frame tells a story. Every story has the power to move, inspire, and transform. 
            My mission is to craft visual narratives that not only capture attention but also 
            touch hearts and drive action."
          </blockquote>
          <p className="text-gray-400">
            I believe in the power of authentic storytelling combined with technical excellence 
            to create videos that stand out in today's competitive landscape.
          </p>
        </div>
      </section>
    </div>
  );
};

export default About;