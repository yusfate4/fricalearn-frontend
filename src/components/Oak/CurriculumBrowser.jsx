
import React, { useState, useEffect } from 'react';

export default function CurriculumBrowser() {
  const [subjects, setSubjects] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [topics, setTopics] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch all subjects
    fetch('/api/external-subjects')
      .then(res => res.json())
      .then(data => {
        setSubjects(data);
        setLoading(false);
      });
  }, []);

  const loadTopics = (subjectId) => {
    setSelectedSubject(subjectId);
    fetch(`/api/external-subjects/${subjectId}/topics`)
      .then(res => res.json())
      .then(data => setTopics(data));
  };

  if (loading) return <p>Loading curriculum...</p>;

  return (
    <div className="curriculum-browser">
      <h1>📚 UK Curriculum</h1>
      
      {/* Subjects Grid */}
      <div className="subjects-grid">
        {subjects.map(subject => (
          <div 
            key={subject.id}
            className={`subject-card ${selectedSubject === subject.id ? 'active' : ''}`}
            onClick={() => loadTopics(subject.id)}
          >
            <h3>{subject.name}</h3>
            <p>Year {subject.year_group} • Key Stage {subject.key_stage}</p>
            {subject.source === 'Oak National Academy' && (
              <span className="oak-badge">🌳 Oak</span>
            )}
          </div>
        ))}
      </div>

      {/* Topics List */}
      {selectedSubject && topics.length > 0 && (
        <div className="topics-section">
          <h2>Topics</h2>
          {topics.map(topic => (
            <div key={topic.id} className="topic-card">
              <h3>{topic.title}</h3>
              <p>{topic.description}</p>
              <button onClick={() => window.location.href = `/topics/${topic.id}`}>
                View Lessons →
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
