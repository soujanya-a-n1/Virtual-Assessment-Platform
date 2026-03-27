/**
 * QueueManager - Manages concurrent code execution requests with FIFO ordering
 * 
 * Implements a queue system that:
 * - Limits concurrent executions to maxConcurrent (default 5)
 * - Processes submissions in FIFO order
 * - Rejects submissions when queue exceeds 50 pending items
 * - Provides queue position and statistics
 */
class QueueManager {
  constructor(maxConcurrent = 5) {
    this.queue = [];
    this.running = new Set();
    this.maxConcurrent = maxConcurrent;
    this.logger = console; // Using console for logging
    this.stats = {
      totalProcessed: 0,
      totalWaitTime: 0,
    };
  }

  /**
   * Add submission to execution queue
   * @param {Object} submission - Submission details
   * @param {Function} executeFunc - Function to execute the submission
   * @returns {Promise<Object>} Execution result when complete
   */
  async enqueue(submission, executeFunc) {
    // Check queue overflow
    if (this.queue.length >= 50) {
      throw new Error('Server busy - too many pending executions');
    }

    const queueEntry = {
      submission,
      executeFunc,
      enqueuedAt: Date.now(),
      promise: null,
      resolve: null,
      reject: null,
      timeoutId: null,
    };

    // Create promise that will be resolved when execution completes
    queueEntry.promise = new Promise((resolve, reject) => {
      queueEntry.resolve = resolve;
      queueEntry.reject = reject;

      // Timeout after 5 minutes in queue
      queueEntry.timeoutId = setTimeout(() => {
        const index = this.queue.indexOf(queueEntry);
        if (index !== -1) {
          this.queue.splice(index, 1);
          reject(new Error('Execution timed out in queue'));
          this.logger.warn('Queue timeout', {
            submissionId: submission.id,
            waitTime: Date.now() - queueEntry.enqueuedAt,
          });
        }
      }, 5 * 60 * 1000);
    });

    this.queue.push(queueEntry);
    this.logger.info('Submission enqueued', {
      submissionId: submission.id,
      queuePosition: this.queue.length - 1,
      queueLength: this.queue.length,
      runningCount: this.running.size,
    });

    // Try to process immediately if capacity available
    this.processNext();

    return queueEntry.promise;
  }

  /**
   * Process next item in queue if capacity available
   */
  async processNext() {
    // Check if we have capacity and items in queue
    if (this.running.size >= this.maxConcurrent || this.queue.length === 0) {
      return;
    }

    // Dequeue next item (FIFO)
    const queueEntry = this.queue.shift();
    if (!queueEntry) {
      return;
    }

    // Clear timeout since we're processing now
    if (queueEntry.timeoutId) {
      clearTimeout(queueEntry.timeoutId);
    }

    // Add to running set
    const executionId = `${queueEntry.submission.id}-${Date.now()}`;
    this.running.add(executionId);

    const waitTime = Date.now() - queueEntry.enqueuedAt;
    this.stats.totalWaitTime += waitTime;

    this.logger.info('Submission execution started', {
      submissionId: queueEntry.submission.id,
      executionId,
      waitTime,
      runningCount: this.running.size,
      queueLength: this.queue.length,
    });

    try {
      // Execute the submission
      const result = await queueEntry.executeFunc(queueEntry.submission);
      
      this.stats.totalProcessed++;
      
      this.logger.info('Submission execution completed', {
        submissionId: queueEntry.submission.id,
        executionId,
        status: result.status,
      });

      queueEntry.resolve(result);
    } catch (error) {
      this.logger.error('Submission execution failed', {
        submissionId: queueEntry.submission.id,
        executionId,
        error: error.message,
      });

      queueEntry.reject(error);
    } finally {
      // Remove from running set
      this.running.delete(executionId);

      // Process next item in queue
      this.processNext();
    }
  }

  /**
   * Get current queue position for a submission
   * @param {number} submissionId - Submission ID
   * @returns {number} Queue position (0-indexed), -1 if not in queue
   */
  getQueuePosition(submissionId) {
    const index = this.queue.findIndex(
      entry => entry.submission.id === submissionId
    );
    return index;
  }

  /**
   * Get queue statistics
   * @returns {Object} Stats {queueLength, runningCount, averageWaitTime}
   */
  getStats() {
    const averageWaitTime = this.stats.totalProcessed > 0
      ? this.stats.totalWaitTime / this.stats.totalProcessed
      : 0;

    return {
      queueLength: this.queue.length,
      runningCount: this.running.size,
      averageWaitTime: Math.round(averageWaitTime),
      totalProcessed: this.stats.totalProcessed,
    };
  }

  /**
   * Get current number of running executions
   * @returns {number} Number of currently running executions
   */
  getRunningCount() {
    return this.running.size;
  }

  /**
   * Clear all queued items (for testing/cleanup)
   */
  clear() {
    // Reject all queued items
    for (const entry of this.queue) {
      if (entry.timeoutId) {
        clearTimeout(entry.timeoutId);
      }
      entry.reject(new Error('Queue cleared'));
    }
    
    this.queue = [];
    this.logger.info('Queue cleared');
  }
}

module.exports = QueueManager;
