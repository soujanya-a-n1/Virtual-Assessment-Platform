import { proctoringAPI } from '../services/api';

// Initialize proctoring for exam
export const initializeProctoring = (submissionId) => {
  // Tab switch detection
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      logProctoringEvent(submissionId, 'Tab Switch', 'High', 'Student switched to another tab');
    }
  });

  // Copy-paste blocking
  document.addEventListener('copy', (e) => {
    e.preventDefault();
    logProctoringEvent(
      submissionId,
      'Copy Paste',
      'High',
      'Student attempted to copy content'
    );
  });

  document.addEventListener('cut', (e) => {
    e.preventDefault();
    logProctoringEvent(
      submissionId,
      'Copy Paste',
      'High',
      'Student attempted to cut content'
    );
  });

  // Right-click prevention
  document.addEventListener('contextmenu', (e) => {
    e.preventDefault();
    logProctoringEvent(
      submissionId,
      'Right Click',
      'Medium',
      'Student attempted right-click'
    );
  });

  // Fullscreen enforcement
  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen().catch((err) => {
      logProctoringEvent(
        submissionId,
        'Fullscreen Exit',
        'High',
        'Failed to enter fullscreen mode'
      );
    });
  }

  // Keyboard shortcuts prevention
  document.addEventListener('keydown', (e) => {
    // Prevent F12 (Developer Tools)
    if (e.key === 'F12') {
      e.preventDefault();
    }
    // Prevent Ctrl+Shift+I (Developer Tools)
    if (e.ctrlKey && e.shiftKey && e.key === 'I') {
      e.preventDefault();
    }
    // Prevent Ctrl+C (Copy)
    if (e.ctrlKey && e.key === 'c') {
      e.preventDefault();
      logProctoringEvent(
        submissionId,
        'Copy Paste',
        'High',
        'Student attempted keyboard copy shortcut'
      );
    }
  });
};

// Log proctoring event
export const logProctoringEvent = async (
  submissionId,
  eventType,
  severity,
  description
) => {
  try {
    await proctoringAPI.logEvent(submissionId, eventType, severity, description, {
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Error logging proctoring event:', error);
  }
};

// Cleanup proctoring
export const cleanupProctoring = () => {
  if (document.fullscreenElement) {
    document.exitFullscreen().catch((err) => {
      console.error('Error exiting fullscreen:', err);
    });
  }
};
