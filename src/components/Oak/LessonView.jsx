
import React, { useState, useEffect } from 'react';
import MuxVideoPlayer from './MuxVideoPlayer';

export default function LessonView({ lessonId }) {
  const [lesson, setLesson] = useState(null);
  const [loading, setLoading] = useState(true);
  const [videoWatched, setVideoWatched] = useState(false);

  useEffect(() => {
    // Fetch lesson from your Laravel backend
    fetch(`/api/external-lessons/${lessonId}`)
      .then(res => res.json())
      .then(data => {
        setLesson(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error loading lesson:', err);
        setLoading(false);
      });
  }, [lessonId]);

  if (loading) {
    return (
      <div className="loading">
        <p>📖 Loading lesson...</p>
      </div>
    );
  }

  if (!lesson) {
    return <div className="error">❌ Lesson not found</div>;
  }

  return (
    <div className="lesson-view">
      {/* Lesson Header */}
      <div className="lesson-header">
        <h1>{lesson.title}</h1>
        <div className="lesson-meta">
          <span>⏱️ {lesson.duration_minutes} minutes</span>
        </div>
      </div>

      {/* Lesson Description */}
      <div className="lesson-description">
        <h2>📝 Lesson Overview</h2>
        <div dangerouslySetInnerHTML={{ __html: lesson.description }} />
      </div>

      {/* Video Player */}
      {lesson.video_url && (
        <div className="lesson-video">
          <h2>🎬 Watch the Lesson</h2>
          <MuxVideoPlayer
            videoUrl={lesson.video_url}
            onEnded={() => {
              setVideoWatched(true);
              console.log('✅ Video completed!');
            }}
          />
          {videoWatched && (
            <div className="video-complete-badge">
              ✅ Video completed! Ready for the quiz.
            </div>
          )}
        </div>
      )}

      {/* Quiz Section */}
      {lesson.quiz_data && (
        <div className="lesson-quiz">
          <h2>🎯 Test Your Knowledge</h2>
          {videoWatched ? (
            <button 
              className="start-quiz-btn"
              onClick={() => {
                // Navigate to quiz or show quiz component
                window.location.href = `/quiz/${lesson.id}`;
              }}
            >
              Start Quiz →
            </button>
          ) : (
            <div className="quiz-locked">
              🔒 Complete the video to unlock the quiz
            </div>
          )}
        </div>
      )}

      {/* Resources */}
      {lesson.has_worksheet && (
        <div className="lesson-resources">
          <h2>📄 Resources</h2>
          <a 
            href={`/api/lessons/${lesson.id}/worksheet`}
            className="download-btn"
            download
          >
            📥 Download Worksheet
          </a>
        </div>
      )}
    </div>
  );
}
