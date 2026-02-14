const { ProctoringLog, ExamSubmission } = require('../models');

const logProctoringEvent = async (req, res) => {
  try {
    const { submissionId, eventType, severity, description, metadata } = req.body;

    const submission = await ExamSubmission.findByPk(submissionId);
    if (!submission) {
      return res.status(404).json({ message: 'Submission not found' });
    }

    const log = await ProctoringLog.create({
      submissionId,
      userId: submission.userId,
      eventType,
      severity,
      description,
      metadata,
    });

    // Count high severity events
    const highSeverityEvents = await ProctoringLog.count({
      where: { submissionId, severity: 'High' },
    });

    if (highSeverityEvents > 3) {
      await submission.update({
        cheatingDetected: true,
        cheatingDetails: { reason: 'Multiple high severity proctoring violations' },
      });
    }

    res.status(201).json({ message: 'Event logged successfully', log });
  } catch (error) {
    res.status(500).json({ message: 'Error logging event', error: error.message });
  }
};

const getProctoringLogs = async (req, res) => {
  try {
    const { submissionId } = req.params;

    const logs = await ProctoringLog.findAll({
      where: { submissionId },
      order: [['timestamp', 'DESC']],
    });

    res.json({ logs });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching logs', error: error.message });
  }
};

const getProctoringReport = async (req, res) => {
  try {
    const { submissionId } = req.params;

    const logs = await ProctoringLog.findAll({
      where: { submissionId },
    });

    const report = {
      totalEvents: logs.length,
      highSeverity: logs.filter((l) => l.severity === 'High').length,
      mediumSeverity: logs.filter((l) => l.severity === 'Medium').length,
      lowSeverity: logs.filter((l) => l.severity === 'Low').length,
      eventTypes: {},
    };

    logs.forEach((log) => {
      report.eventTypes[log.eventType] = (report.eventTypes[log.eventType] || 0) + 1;
    });

    res.json({ report });
  } catch (error) {
    res.status(500).json({ message: 'Error generating report', error: error.message });
  }
};

module.exports = {
  logProctoringEvent,
  getProctoringLogs,
  getProctoringReport,
};
