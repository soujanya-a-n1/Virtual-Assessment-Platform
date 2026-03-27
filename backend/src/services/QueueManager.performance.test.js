const QueueManager = require('./QueueManager');

/**
 * Performance tests for QueueManager
 * 
 * These tests validate that the queue manager can handle high load scenarios
 * and maintains correctness under stress conditions.
 * 
 * Requirements tested:
 * - 10.1: Queue addition
 * - 10.2: FIFO processing
 * - 10.3: Concurrent execution limit (max 5)
 * - 10.4: Queue progression
 */
describe('QueueManager - Performance Tests', () => {
  let queueManager;

  beforeEach(() => {
    queueManager = new QueueManager(5); // Max 5 concurrent executions
  });

  afterEach(() => {
    queueManager.clear();
  });

  /**
   * Main performance test: 50 concurrent submissions
   * 
   * Validates Requirements:
   * - 10.1: All submissions are added to queue
   * - 10.2: Submissions are processed in FIFO order
   * - 10.3: Max 5 concurrent executions at any time
   * - 10.4: Queue progresses as executions complete
   */
  test('should handle 50 concurrent submissions successfully', async () => {
    const numSubmissions = 50;
    const maxConcurrent = 5;
    
    // Track execution metrics
    let maxObservedConcurrent = 0;
    const runningLock = { value: 0 };
    const executionOrder = [];
    const startTime = Date.now();
    
    // Create 50 submissions
    const submissions = Array.from({ length: numSubmissions }, (_, i) => ({
      id: i + 1,
      code: `print("Submission ${i + 1}")`,
      language: 'Python',
    }));

    // Execution function that simulates code compilation and execution
    const executeFunc = async (submission) => {
      // Track concurrent executions
      runningLock.value++;
      const currentConcurrent = runningLock.value;
      
      if (currentConcurrent > maxObservedConcurrent) {
        maxObservedConcurrent = currentConcurrent;
      }

      // Record execution order
      executionOrder.push(submission.id);

      // Simulate realistic execution time (50-200ms for compilation + execution)
      const executionTime = 50 + Math.random() * 150;
      await new Promise(resolve => setTimeout(resolve, executionTime));

      runningLock.value--;

      return {
        status: 'Success',
        submissionId: submission.id,
        executionTime,
        marksObtained: 10,
      };
    };

    // Enqueue all 50 submissions
    const promises = submissions.map(sub => 
      queueManager.enqueue(sub, executeFunc)
    );

    // Wait for all submissions to complete
    const results = await Promise.all(promises);
    
    const totalTime = Date.now() - startTime;

    // Requirement 10.1: All submissions should be processed
    expect(results.length).toBe(numSubmissions);
    
    // Requirement 10.1 & 10.4: All submissions should complete successfully
    results.forEach((result, i) => {
      expect(result.status).toBe('Success');
      expect(result.submissionId).toBe(i + 1);
      expect(result.marksObtained).toBeDefined();
    });

    // Requirement 10.3: Maximum concurrent executions should never exceed 5
    expect(maxObservedConcurrent).toBeLessThanOrEqual(maxConcurrent);
    expect(maxObservedConcurrent).toBeGreaterThan(0);

    // Requirement 10.2: Submissions should be processed in FIFO order
    // First 5 should start immediately, then as they complete, next ones start
    // The first submission should be the first to execute
    expect(executionOrder[0]).toBe(1);

    // Requirement 10.4: Queue should be empty after all complete
    expect(queueManager.queue.length).toBe(0);
    expect(queueManager.getRunningCount()).toBe(0);

    // Performance metrics
    const stats = queueManager.getStats();
    expect(stats.totalProcessed).toBe(numSubmissions);
    expect(stats.averageWaitTime).toBeGreaterThanOrEqual(0);

    console.log(`Performance Test Results:`);
    console.log(`  Total submissions: ${numSubmissions}`);
    console.log(`  Max concurrent observed: ${maxObservedConcurrent}/${maxConcurrent}`);
    console.log(`  Total time: ${totalTime}ms`);
    console.log(`  Average wait time: ${stats.averageWaitTime}ms`);
    console.log(`  Throughput: ${(numSubmissions / (totalTime / 1000)).toFixed(2)} submissions/sec`);
  }, 60000); // 1 minute timeout

  /**
   * Test queue limit enforcement under load
   * 
   * Validates Requirement 10.3: Concurrent execution limit is strictly enforced
   */
  test('should respect queue limits under high load', async () => {
    const numSubmissions = 50;
    let maxConcurrent = 0;
    const runningLock = { value: 0 };
    const concurrentSnapshots = [];

    const submissions = Array.from({ length: numSubmissions }, (_, i) => ({
      id: i + 1,
    }));

    const executeFunc = async (submission) => {
      runningLock.value++;
      const current = runningLock.value;
      
      // Take snapshot of concurrent count
      concurrentSnapshots.push(current);
      
      if (current > maxConcurrent) {
        maxConcurrent = current;
      }

      // Very short execution time to maximize concurrency pressure
      await new Promise(resolve => setTimeout(resolve, 20));

      runningLock.value--;

      return {
        status: 'Success',
        submissionId: submission.id,
      };
    };

    const promises = submissions.map(sub => 
      queueManager.enqueue(sub, executeFunc)
    );

    await Promise.all(promises);

    // Requirement 10.3: Maximum concurrent should never exceed 5
    expect(maxConcurrent).toBeLessThanOrEqual(5);
    
    // All snapshots should show <= 5 concurrent executions
    concurrentSnapshots.forEach(count => {
      expect(count).toBeLessThanOrEqual(5);
    });

    // Should reach the limit (5 concurrent) at some point
    expect(maxConcurrent).toBe(5);

    console.log(`Queue limit test: ${numSubmissions} submissions, max concurrent: ${maxConcurrent}`);
  }, 30000);

  /**
   * Test FIFO ordering under load
   * 
   * Validates Requirement 10.2: Submissions are processed in FIFO order
   */
  test('should maintain FIFO order with 50 submissions', async () => {
    const numSubmissions = 50;
    const executionOrder = [];
    const completionOrder = [];

    const submissions = Array.from({ length: numSubmissions }, (_, i) => ({
      id: i + 1,
    }));

    const executeFunc = async (submission) => {
      // Record when execution starts
      executionOrder.push(submission.id);

      // Simulate execution with varying times
      const executionTime = 30 + Math.random() * 70;
      await new Promise(resolve => setTimeout(resolve, executionTime));

      // Record when execution completes
      completionOrder.push(submission.id);

      return {
        status: 'Success',
        submissionId: submission.id,
      };
    };

    const promises = submissions.map(sub => 
      queueManager.enqueue(sub, executeFunc)
    );

    await Promise.all(promises);

    // Requirement 10.2: Execution should start in FIFO order
    // The first 5 should start immediately in order
    expect(executionOrder.slice(0, 5)).toEqual([1, 2, 3, 4, 5]);

    // All submissions should execute
    expect(executionOrder.length).toBe(numSubmissions);
    expect(completionOrder.length).toBe(numSubmissions);

    // Each submission should execute exactly once
    const uniqueExecutions = new Set(executionOrder);
    expect(uniqueExecutions.size).toBe(numSubmissions);

    console.log(`FIFO test: First 10 executions: ${executionOrder.slice(0, 10).join(', ')}`);
  }, 30000);

  /**
   * Test queue progression
   * 
   * Validates Requirement 10.4: Queue progresses as executions complete
   */
  test('should progress queue as executions complete', async () => {
    const numSubmissions = 50;
    const queueLengthSnapshots = [];
    const runningCountSnapshots = [];

    const submissions = Array.from({ length: numSubmissions }, (_, i) => ({
      id: i + 1,
    }));

    // Take initial snapshot before any processing starts
    const initialStats = queueManager.getStats();
    
    const executeFunc = async (submission) => {
      // Take snapshot at start of execution
      const stats = queueManager.getStats();
      queueLengthSnapshots.push(stats.queueLength);
      runningCountSnapshots.push(stats.runningCount);

      await new Promise(resolve => setTimeout(resolve, 50));

      return {
        status: 'Success',
        submissionId: submission.id,
      };
    };

    const promises = submissions.map(sub => 
      queueManager.enqueue(sub, executeFunc)
    );

    // Wait a moment for queue to fill up
    await new Promise(resolve => setTimeout(resolve, 10));
    
    // Take snapshot after queue is filled
    const afterEnqueueStats = queueManager.getStats();
    queueLengthSnapshots.unshift(afterEnqueueStats.queueLength);

    await Promise.all(promises);

    // Requirement 10.4: Queue length should decrease over time
    // Initial queue length should be high (most items queued, 5 running)
    expect(queueLengthSnapshots[0]).toBeGreaterThan(30);

    // Final queue length should be 0
    const finalStats = queueManager.getStats();
    expect(finalStats.queueLength).toBe(0);
    expect(finalStats.runningCount).toBe(0);

    // Queue should have decreased over time
    const maxQueueLength = Math.max(...queueLengthSnapshots);
    const minQueueLength = Math.min(...queueLengthSnapshots);
    expect(maxQueueLength).toBeGreaterThan(minQueueLength);

    console.log(`Queue progression: max=${maxQueueLength}, min=${minQueueLength}, final=${finalStats.queueLength}`);
  }, 30000);

  /**
   * Test performance with realistic execution times
   * 
   * Validates all requirements under realistic conditions
   */
  test('should handle 50 submissions with realistic execution times', async () => {
    const numSubmissions = 50;
    let maxConcurrent = 0;
    const runningLock = { value: 0 };
    const startTime = Date.now();

    const submissions = Array.from({ length: numSubmissions }, (_, i) => ({
      id: i + 1,
      language: ['Python', 'Java', 'C++', 'JavaScript'][i % 4],
    }));

    const executeFunc = async (submission) => {
      runningLock.value++;
      const current = runningLock.value;
      
      if (current > maxConcurrent) {
        maxConcurrent = current;
      }

      // Simulate realistic compilation + execution times
      // Compiled languages take longer
      let executionTime;
      if (['Java', 'C++'].includes(submission.language)) {
        executionTime = 100 + Math.random() * 200; // 100-300ms
      } else {
        executionTime = 50 + Math.random() * 100; // 50-150ms
      }

      await new Promise(resolve => setTimeout(resolve, executionTime));

      runningLock.value--;

      return {
        status: 'Success',
        submissionId: submission.id,
        language: submission.language,
        executionTime,
      };
    };

    const promises = submissions.map(sub => 
      queueManager.enqueue(sub, executeFunc)
    );

    const results = await Promise.all(promises);
    const totalTime = Date.now() - startTime;

    // All requirements should be met
    expect(results.length).toBe(numSubmissions);
    expect(maxConcurrent).toBeLessThanOrEqual(5);
    expect(queueManager.queue.length).toBe(0);
    expect(queueManager.getRunningCount()).toBe(0);

    // Calculate statistics
    const avgExecutionTime = results.reduce((sum, r) => sum + r.executionTime, 0) / results.length;
    const stats = queueManager.getStats();

    console.log(`Realistic performance test:`);
    console.log(`  Total time: ${totalTime}ms`);
    console.log(`  Average execution time: ${avgExecutionTime.toFixed(2)}ms`);
    console.log(`  Average wait time: ${stats.averageWaitTime}ms`);
    console.log(`  Max concurrent: ${maxConcurrent}`);
    console.log(`  Throughput: ${(numSubmissions / (totalTime / 1000)).toFixed(2)} submissions/sec`);
  }, 60000);

  /**
   * Test queue behavior with failures
   * 
   * Validates that queue limits are respected even when some executions fail
   */
  test('should maintain limits when some submissions fail', async () => {
    const numSubmissions = 50;
    let maxConcurrent = 0;
    const runningLock = { value: 0 };

    const submissions = Array.from({ length: numSubmissions }, (_, i) => ({
      id: i + 1,
      shouldFail: i % 7 === 0, // Every 7th submission fails
    }));

    const executeFunc = async (submission) => {
      runningLock.value++;
      const current = runningLock.value;
      
      if (current > maxConcurrent) {
        maxConcurrent = current;
      }

      await new Promise(resolve => setTimeout(resolve, 50));

      runningLock.value--;

      if (submission.shouldFail) {
        throw new Error('Compilation error');
      }

      return {
        status: 'Success',
        submissionId: submission.id,
      };
    };

    const promises = submissions.map(sub => 
      queueManager.enqueue(sub, executeFunc).catch(error => ({
        status: 'Failed',
        error: error.message,
        submissionId: sub.id,
      }))
    );

    const results = await Promise.all(promises);

    // All submissions should complete (success or failure)
    expect(results.length).toBe(numSubmissions);

    // Requirement 10.3: Limit should be respected even with failures
    expect(maxConcurrent).toBeLessThanOrEqual(5);

    // Some should succeed, some should fail
    const successes = results.filter(r => r.status === 'Success');
    const failures = results.filter(r => r.status === 'Failed');
    
    expect(successes.length).toBeGreaterThan(0);
    expect(failures.length).toBeGreaterThan(0);

    // Queue should be empty
    expect(queueManager.queue.length).toBe(0);
    expect(queueManager.getRunningCount()).toBe(0);

    console.log(`Failure test: ${successes.length} succeeded, ${failures.length} failed, max concurrent: ${maxConcurrent}`);
  }, 30000);

  /**
   * Stress test: Maximum load
   * 
   * Tests the absolute limits of the queue system
   */
  test('should handle maximum load without breaking', async () => {
    const numSubmissions = 50;
    let maxConcurrent = 0;
    const runningLock = { value: 0 };
    const startTime = Date.now();

    const submissions = Array.from({ length: numSubmissions }, (_, i) => ({
      id: i + 1,
    }));

    const executeFunc = async (submission) => {
      runningLock.value++;
      const current = runningLock.value;
      
      if (current > maxConcurrent) {
        maxConcurrent = current;
      }

      // Minimal execution time to maximize throughput
      await new Promise(resolve => setTimeout(resolve, 10));

      runningLock.value--;

      return {
        status: 'Success',
        submissionId: submission.id,
      };
    };

    const promises = submissions.map(sub => 
      queueManager.enqueue(sub, executeFunc)
    );

    const results = await Promise.all(promises);
    const totalTime = Date.now() - startTime;

    // All requirements should still be met under stress
    expect(results.length).toBe(numSubmissions);
    expect(maxConcurrent).toBeLessThanOrEqual(5);
    expect(queueManager.queue.length).toBe(0);
    expect(queueManager.getRunningCount()).toBe(0);

    // All should succeed
    results.forEach(result => {
      expect(result.status).toBe('Success');
    });

    console.log(`Stress test: ${numSubmissions} submissions in ${totalTime}ms, max concurrent: ${maxConcurrent}`);
    console.log(`  Throughput: ${(numSubmissions / (totalTime / 1000)).toFixed(2)} submissions/sec`);
  }, 30000);
});
