const fc = require('fast-check');
const QueueManager = require('./QueueManager');

// Feature: code-compiler, Property 31: Concurrent execution limit
describe('QueueManager - Property-Based Tests', () => {
  let queueManager;

  beforeEach(() => {
    queueManager = new QueueManager(5); // Max 5 concurrent executions
  });

  afterEach(() => {
    // Clean up any remaining queue items
    queueManager.clear();
  });

  // Feature: code-compiler, Property 31: Concurrent execution limit
  test('Property 31: Max 5 executions run simultaneously', async () => {
    // Track the maximum number of concurrent executions observed
    let maxConcurrent = 0;
    let currentlyRunning = 0;
    const runningLock = { value: 0 };

    await fc.assert(
      fc.asyncProperty(
        // Generate a number of submissions to test (between 10 and 30)
        fc.integer({ min: 10, max: 30 }),
        async (numSubmissions) => {
          // Reset tracking variables
          maxConcurrent = 0;
          currentlyRunning = 0;
          runningLock.value = 0;

          // Create mock submissions
          const submissions = Array.from({ length: numSubmissions }, (_, i) => ({
            id: i + 1,
            code: `print("Submission ${i + 1}")`,
          }));

          // Create execution function that tracks concurrent executions
          const executeFunc = async (submission) => {
            // Increment running count
            runningLock.value++;
            currentlyRunning = runningLock.value;
            
            // Track maximum concurrent executions
            if (currentlyRunning > maxConcurrent) {
              maxConcurrent = currentlyRunning;
            }

            // Simulate execution time (50-200ms)
            const executionTime = 50 + Math.random() * 150;
            await new Promise(resolve => setTimeout(resolve, executionTime));

            // Decrement running count
            runningLock.value--;

            return {
              status: 'Success',
              submissionId: submission.id,
              executionTime,
            };
          };

          // Enqueue all submissions
          const promises = submissions.map(sub => 
            queueManager.enqueue(sub, executeFunc)
          );

          // Wait for all to complete
          const results = await Promise.all(promises);

          // Property: Maximum concurrent executions should never exceed 5
          expect(maxConcurrent).toBeLessThanOrEqual(5);
          expect(maxConcurrent).toBeGreaterThan(0);

          // Property: All submissions should complete successfully
          expect(results.length).toBe(numSubmissions);
          results.forEach((result, i) => {
            expect(result.status).toBe('Success');
            expect(result.submissionId).toBe(i + 1);
          });

          // Property: Queue should be empty after all complete
          expect(queueManager.queue.length).toBe(0);
          expect(queueManager.getRunningCount()).toBe(0);
        }
      ),
      { numRuns: 20 } // Test with various submission counts
    );
  }, 60000); // 1 minute timeout

  // Feature: code-compiler, Property 31: Concurrent execution limit - exact boundary test
  test('Property 31: Exactly 5 executions can run simultaneously', async () => {
    let maxConcurrent = 0;
    const runningLock = { value: 0 };
    const concurrentSnapshots = [];

    // Create 10 submissions that will take some time to execute
    const submissions = Array.from({ length: 10 }, (_, i) => ({
      id: i + 1,
      code: `print("Submission ${i + 1}")`,
    }));

    const executeFunc = async (submission) => {
      runningLock.value++;
      const current = runningLock.value;
      
      // Take snapshot of concurrent count
      concurrentSnapshots.push(current);
      
      if (current > maxConcurrent) {
        maxConcurrent = current;
      }

      // Simulate longer execution (200ms) to ensure overlap
      await new Promise(resolve => setTimeout(resolve, 200));

      runningLock.value--;

      return {
        status: 'Success',
        submissionId: submission.id,
      };
    };

    // Enqueue all submissions
    const promises = submissions.map(sub => 
      queueManager.enqueue(sub, executeFunc)
    );

    // Wait for all to complete
    await Promise.all(promises);

    // Property: Maximum concurrent should be exactly 5 (the limit)
    expect(maxConcurrent).toBe(5);

    // Property: At least one snapshot should show 5 concurrent executions
    expect(concurrentSnapshots).toContain(5);

    // Property: No snapshot should show more than 5 concurrent executions
    concurrentSnapshots.forEach(count => {
      expect(count).toBeLessThanOrEqual(5);
    });

    console.log(`Max concurrent: ${maxConcurrent}, Snapshots: ${concurrentSnapshots.join(', ')}`);
  }, 30000);

  // Feature: code-compiler, Property 31: Concurrent execution limit - stress test
  test('Property 31: Limit holds under high load', async () => {
    let maxConcurrent = 0;
    const runningLock = { value: 0 };

    // Create many submissions (50) to stress test the queue
    const submissions = Array.from({ length: 50 }, (_, i) => ({
      id: i + 1,
      code: `print("Submission ${i + 1}")`,
    }));

    const executeFunc = async (submission) => {
      runningLock.value++;
      const current = runningLock.value;
      
      if (current > maxConcurrent) {
        maxConcurrent = current;
      }

      // Very short execution time to maximize concurrency pressure
      await new Promise(resolve => setTimeout(resolve, 10));

      runningLock.value--;

      return {
        status: 'Success',
        submissionId: submission.id,
      };
    };

    // Enqueue all submissions
    const promises = submissions.map(sub => 
      queueManager.enqueue(sub, executeFunc)
    );

    // Wait for all to complete
    const results = await Promise.all(promises);

    // Property: Maximum concurrent should never exceed 5, even under high load
    expect(maxConcurrent).toBeLessThanOrEqual(5);

    // Property: All 50 submissions should complete successfully
    expect(results.length).toBe(50);
    results.forEach(result => {
      expect(result.status).toBe('Success');
    });

    console.log(`Stress test: ${submissions.length} submissions, max concurrent: ${maxConcurrent}`);
  }, 30000);

  // Feature: code-compiler, Property 31: Concurrent execution limit - with varying execution times
  test('Property 31: Limit holds with varying execution times', async () => {
    await fc.assert(
      fc.asyncProperty(
        // Generate random execution times for each submission
        fc.array(
          fc.integer({ min: 10, max: 500 }),
          { minLength: 15, maxLength: 25 }
        ),
        async (executionTimes) => {
          let maxConcurrent = 0;
          const runningLock = { value: 0 };

          const submissions = executionTimes.map((time, i) => ({
            id: i + 1,
            executionTime: time,
          }));

          const executeFunc = async (submission) => {
            runningLock.value++;
            const current = runningLock.value;
            
            if (current > maxConcurrent) {
              maxConcurrent = current;
            }

            // Use the submission's execution time
            await new Promise(resolve => setTimeout(resolve, submission.executionTime));

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

          // Property: Maximum concurrent should never exceed 5
          expect(maxConcurrent).toBeLessThanOrEqual(5);
          expect(maxConcurrent).toBeGreaterThan(0);
        }
      ),
      { numRuns: 15 }
    );
  }, 60000);

  // Feature: code-compiler, Property 31: Concurrent execution limit - with failures
  test('Property 31: Limit holds even when some executions fail', async () => {
    let maxConcurrent = 0;
    const runningLock = { value: 0 };

    // Create submissions, some will fail
    const submissions = Array.from({ length: 20 }, (_, i) => ({
      id: i + 1,
      shouldFail: i % 3 === 0, // Every 3rd submission fails
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
        throw new Error('Simulated execution failure');
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

    // Property: Maximum concurrent should never exceed 5, even with failures
    expect(maxConcurrent).toBeLessThanOrEqual(5);

    // Property: All submissions should complete (success or failure)
    expect(results.length).toBe(20);

    // Property: Some should succeed, some should fail
    const successes = results.filter(r => r.status === 'Success');
    const failures = results.filter(r => r.status === 'Failed');
    
    expect(successes.length).toBeGreaterThan(0);
    expect(failures.length).toBeGreaterThan(0);

    console.log(`With failures: ${successes.length} succeeded, ${failures.length} failed, max concurrent: ${maxConcurrent}`);
  }, 30000);

  // Feature: code-compiler, Property 31: Concurrent execution limit - real-time monitoring
  test('Property 31: Running count never exceeds 5 at any point in time', async () => {
    const runningCountSnapshots = [];
    
    // Create 30 submissions
    const submissions = Array.from({ length: 30 }, (_, i) => ({
      id: i + 1,
    }));

    const executeFunc = async (submission) => {
      // Take snapshot before execution
      const countBefore = queueManager.getRunningCount();
      runningCountSnapshots.push(countBefore);

      await new Promise(resolve => setTimeout(resolve, 100));

      // Take snapshot during execution
      const countDuring = queueManager.getRunningCount();
      runningCountSnapshots.push(countDuring);

      return {
        status: 'Success',
        submissionId: submission.id,
      };
    };

    const promises = submissions.map(sub => 
      queueManager.enqueue(sub, executeFunc)
    );

    await Promise.all(promises);

    // Property: All snapshots should show running count <= 5
    runningCountSnapshots.forEach(count => {
      expect(count).toBeLessThanOrEqual(5);
      expect(count).toBeGreaterThanOrEqual(0);
    });

    // Property: At least one snapshot should show 5 concurrent (we had 30 submissions)
    expect(Math.max(...runningCountSnapshots)).toBe(5);

    console.log(`Running count snapshots: min=${Math.min(...runningCountSnapshots)}, max=${Math.max(...runningCountSnapshots)}`);
  }, 30000);

  // Feature: code-compiler, Property 31: Concurrent execution limit - queue statistics
  test('Property 31: Queue statistics reflect concurrent limit', async () => {
    // Create 20 submissions
    const submissions = Array.from({ length: 20 }, (_, i) => ({
      id: i + 1,
    }));

    const statsSnapshots = [];

    const executeFunc = async (submission) => {
      // Capture stats during execution
      const stats = queueManager.getStats();
      statsSnapshots.push(stats);

      await new Promise(resolve => setTimeout(resolve, 100));

      return {
        status: 'Success',
        submissionId: submission.id,
      };
    };

    const promises = submissions.map(sub => 
      queueManager.enqueue(sub, executeFunc)
    );

    await Promise.all(promises);

    // Property: Running count in stats should never exceed 5
    statsSnapshots.forEach(stats => {
      expect(stats.runningCount).toBeLessThanOrEqual(5);
      expect(stats.runningCount).toBeGreaterThanOrEqual(0);
    });

    // Property: Final stats should show all processed
    const finalStats = queueManager.getStats();
    expect(finalStats.totalProcessed).toBe(20);
    expect(finalStats.queueLength).toBe(0);
    expect(finalStats.runningCount).toBe(0);

    console.log(`Final stats: ${JSON.stringify(finalStats)}`);
  }, 30000);
});

// Feature: code-compiler, Property 31: Concurrent execution limit - unit tests
describe('QueueManager - Unit Tests', () => {
  let queueManager;

  beforeEach(() => {
    queueManager = new QueueManager(5);
  });

  afterEach(() => {
    queueManager.clear();
  });

  test('should initialize with correct max concurrent limit', () => {
    expect(queueManager.maxConcurrent).toBe(5);
    expect(queueManager.queue.length).toBe(0);
    expect(queueManager.getRunningCount()).toBe(0);
  });

  test('should allow custom max concurrent limit', () => {
    const customQueue = new QueueManager(3);
    expect(customQueue.maxConcurrent).toBe(3);
  });

  test('should track running count correctly', async () => {
    const submission = { id: 1 };
    let runningDuringExecution = 0;

    const executeFunc = async (sub) => {
      runningDuringExecution = queueManager.getRunningCount();
      await new Promise(resolve => setTimeout(resolve, 50));
      return { status: 'Success' };
    };

    await queueManager.enqueue(submission, executeFunc);

    expect(runningDuringExecution).toBe(1);
    expect(queueManager.getRunningCount()).toBe(0);
  });

  test('should process submissions in FIFO order', async () => {
    const executionOrder = [];
    
    const submissions = [
      { id: 1 },
      { id: 2 },
      { id: 3 },
    ];

    const executeFunc = async (sub) => {
      executionOrder.push(sub.id);
      await new Promise(resolve => setTimeout(resolve, 10));
      return { status: 'Success' };
    };

    const promises = submissions.map(sub => 
      queueManager.enqueue(sub, executeFunc)
    );

    await Promise.all(promises);

    // Should execute in order: 1, 2, 3
    expect(executionOrder).toEqual([1, 2, 3]);
  });

  test('should return correct queue position', async () => {
    const executeFunc = async (sub) => {
      await new Promise(resolve => setTimeout(resolve, 1000));
      return { status: 'Success' };
    };

    // Enqueue 10 items
    const promises = [];
    for (let i = 0; i < 10; i++) {
      promises.push(queueManager.enqueue({ id: i + 1 }, executeFunc));
    }

    // Check positions (first 5 are running, rest are queued)
    // Position is 0-indexed in the queue array
    // Items 6-10 should be in queue at positions 0-4
    const position6 = queueManager.getQueuePosition(6);
    const position10 = queueManager.getQueuePosition(10);

    expect(position6).toBeGreaterThanOrEqual(0);
    expect(position10).toBeGreaterThanOrEqual(0);

    // Clean up
    queueManager.clear();
  });

  // Feature: code-compiler, Property 34: Queue overflow rejection
  test('Property 34: Queue overflow rejection with "Server busy" message', async () => {
    // Test the core overflow logic by checking queue length before enqueue
    // Create a new queue manager for this test to avoid interference
    const testQueue = new QueueManager(5);
    
    // Simulate a full queue by setting queue length to 50
    // We'll use a simple approach: enqueue 50 items that take a while
    const slowExecute = async (sub) => {
      await new Promise(resolve => setTimeout(resolve, 10000)); // Very slow
      return { status: 'Success', submissionId: sub.id };
    };

    // Start enqueueing 50 items (they won't complete during the test)
    const promises = [];
    for (let i = 0; i < 50; i++) {
      promises.push(testQueue.enqueue({ id: i + 1 }, slowExecute).catch(() => {}));
    }

    // Wait for all to be added to queue
    await new Promise(resolve => setTimeout(resolve, 100));

    // Property: Attempting to enqueue when queue has 50 pending should reject
    await expect(
      testQueue.enqueue({ id: 51 }, slowExecute)
    ).rejects.toThrow('Server busy - too many pending executions');

    // Property: Error message should contain "Server busy"
    try {
      await testQueue.enqueue({ id: 52 }, slowExecute);
      fail('Should have thrown an error');
    } catch (error) {
      expect(error.message).toContain('Server busy');
    }

    // Clean up
    testQueue.clear();
    await Promise.all(promises);
  }, 5000);

  // Feature: code-compiler, Property 34: Queue overflow rejection - simple unit test
  test('Property 34: Queue rejects when queue length is 50', async () => {
    // Simple unit test: verify the check happens at queue length 50
    const testQueue = new QueueManager(5);
    
    // Manually set queue to have 50 items (simulating full queue)
    testQueue.queue = new Array(50).fill(null).map((_, i) => ({
      submission: { id: i + 1 },
      executeFunc: async () => {},
      enqueuedAt: Date.now(),
      promise: Promise.resolve(),
      resolve: () => {},
      reject: () => {},
      timeoutId: null,
    }));

    // Property: Should reject with "Server busy" message
    await expect(
      testQueue.enqueue({ id: 51 }, async () => ({ status: 'Success' }))
    ).rejects.toThrow('Server busy - too many pending executions');

    // Clean up
    testQueue.queue = [];
  });

  // Feature: code-compiler, Property 34: Queue overflow rejection - boundary test
  test('Property 34: Queue accepts at 49, rejects at 50', async () => {
    const testQueue = new QueueManager(5);
    
    // Set queue to 49 items
    testQueue.queue = new Array(49).fill(null).map((_, i) => ({
      submission: { id: i + 1 },
      executeFunc: async () => {},
      enqueuedAt: Date.now(),
      promise: Promise.resolve(),
      resolve: () => {},
      reject: () => {},
      timeoutId: null,
    }));

    // Property: 50th item should be accepted (boundary)
    const promise50 = testQueue.enqueue({ id: 50 }, async (sub) => {
      await new Promise(resolve => setTimeout(resolve, 100));
      return { status: 'Success', submissionId: sub.id };
    }).catch(() => {});

    await expect(promise50).resolves.toBeDefined();

    // Wait for it to be added
    await new Promise(resolve => setTimeout(resolve, 50));

    // Property: 51st item should be rejected (overflow)
    await expect(
      testQueue.enqueue({ id: 51 }, async () => ({ status: 'Success' }))
    ).rejects.toThrow('Server busy');

    // Clean up
    testQueue.clear();
    await promise50;
  });

  // Feature: code-compiler, Property 34: Queue overflow rejection - recovery test
  test('Property 34: Queue accepts new items after some complete', async () => {
    const testQueue = new QueueManager(5);
    
    const executeFunc = async (sub) => {
      await new Promise(resolve => setTimeout(resolve, 50));
      return { status: 'Success', submissionId: sub.id };
    };

    // Fill queue to 50 items with fast execution
    const promises = [];
    for (let i = 0; i < 50; i++) {
      promises.push(
        testQueue.enqueue({ id: i + 1 }, executeFunc).catch(() => {})
      );
    }

    // Wait a bit for queue to fill (but not complete)
    await new Promise(resolve => setTimeout(resolve, 10));

    // Property: Should reject when at capacity
    await expect(
      testQueue.enqueue({ id: 51 }, executeFunc)
    ).rejects.toThrow('Server busy');

    // Wait for many items to complete (at least 10 should complete in 150ms)
    await new Promise(resolve => setTimeout(resolve, 150));

    // Property: Should accept new items after some complete
    await expect(
      testQueue.enqueue({ id: 52 }, executeFunc).catch(() => {})
    ).resolves.toBeDefined();

    // Wait for all to complete
    await Promise.all(promises);
  }, 10000);
});
