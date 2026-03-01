const { Question, Course, Exam, ExamQuestion } = require('./src/models');

async function addCS201Questions() {
  try {
    console.log('=== Adding 15 CS201 Data Structures Questions ===\n');

    // Get CS201 course
    const course = await Course.findOne({ where: { code: 'CS201' } });
    if (!course) {
      console.error('❌ CS201 course not found!');
      process.exit(1);
    }
    console.log(`✓ Found course: ${course.code} - ${course.name}`);

    // Get CS201 exam
    const exam = await Exam.findOne({ 
      where: { courseId: course.id },
      order: [['createdAt', 'DESC']]
    });
    if (!exam) {
      console.error('❌ No exam found for CS201!');
      process.exit(1);
    }
    console.log(`✓ Found exam: ${exam.title}\n`);

    const questions = [
      // STACKS (1-5)
      {
        questionText: 'What is the time complexity of push and pop operations in a stack implemented using an array?',
        topic: 'Stacks',
        optionA: 'O(1) for both operations',
        optionB: 'O(n) for both operations',
        optionC: 'O(log n) for both operations',
        optionD: 'O(1) for push, O(n) for pop',
        correctAnswer: 'A',
        explanation: 'Both push and pop operations in an array-based stack take constant time O(1) as they only involve accessing the top element.'
      },
      {
        questionText: 'In a stack, if we want to access the element at the bottom without removing other elements, what is the minimum number of operations required?',
        topic: 'Stacks',
        optionA: '1 operation',
        optionB: 'n operations where n is the number of elements',
        optionC: 'log n operations',
        optionD: 'It is not possible without removing elements',
        correctAnswer: 'B',
        explanation: 'To access the bottom element, we need to pop all n elements, access the bottom, and push them back, requiring n operations.'
      },
      {
        questionText: 'Which of the following applications does NOT use a stack data structure?',
        topic: 'Stacks',
        optionA: 'Function call management',
        optionB: 'Expression evaluation',
        optionC: 'Undo mechanism in text editors',
        optionD: 'Job scheduling in operating systems',
        correctAnswer: 'D',
        explanation: 'Job scheduling typically uses queues (FIFO), not stacks. Stacks are used for function calls, expression evaluation, and undo operations.'
      },
      {
        questionText: 'What will be the postfix expression for the infix expression: A + B * C - D?',
        topic: 'Stacks',
        optionA: 'ABC*+D-',
        optionB: 'ABC+*D-',
        optionC: 'ABCD*+-',
        optionD: 'AB+C*D-',
        correctAnswer: 'A',
        explanation: 'Following operator precedence: B*C is evaluated first, then A+, then -D. Result: ABC*+D-'
      },
      {
        questionText: 'In a stack implemented using a linked list, where should new elements be inserted for optimal performance?',
        topic: 'Stacks',
        optionA: 'At the end of the list',
        optionB: 'At the beginning of the list',
        optionC: 'In the middle of the list',
        optionD: 'At any position',
        correctAnswer: 'B',
        explanation: 'Inserting at the beginning (head) of a linked list takes O(1) time, making it optimal for stack operations.'
      },

      // QUEUES (6-8)
      {
        questionText: 'In a circular queue with array size 5, if front = 2 and rear = 4, how many elements are currently in the queue?',
        topic: 'Queues',
        optionA: '2 elements',
        optionB: '3 elements',
        optionC: '4 elements',
        optionD: '5 elements',
        correctAnswer: 'B',
        explanation: 'Elements are at positions 2, 3, and 4. Count = (rear - front + 1) = (4 - 2 + 1) = 3 elements.'
      },
      {
        questionText: 'What is the main advantage of a circular queue over a simple queue?',
        topic: 'Queues',
        optionA: 'Faster insertion',
        optionB: 'Better memory utilization',
        optionC: 'Easier implementation',
        optionD: 'Lower time complexity',
        correctAnswer: 'B',
        explanation: 'Circular queues reuse empty spaces created by dequeue operations, preventing wasted space that occurs in simple queues.'
      },
      {
        questionText: 'In a priority queue implemented using a heap, what is the time complexity of inserting an element?',
        topic: 'Queues',
        optionA: 'O(1)',
        optionB: 'O(log n)',
        optionC: 'O(n)',
        optionD: 'O(n log n)',
        correctAnswer: 'B',
        explanation: 'Insertion in a heap requires bubbling up the element to maintain heap property, which takes O(log n) time.'
      },

      // LINKED LISTS (9-11)
      {
        questionText: 'What is the time complexity of inserting a node at the beginning of a singly linked list?',
        topic: 'Linked Lists',
        optionA: 'O(1)',
        optionB: 'O(n)',
        optionC: 'O(log n)',
        optionD: 'O(n²)',
        correctAnswer: 'A',
        explanation: 'Inserting at the beginning only requires updating the head pointer and the new node\'s next pointer, taking constant time O(1).'
      },
      {
        questionText: 'In a doubly linked list, what is the space overhead per node compared to a singly linked list?',
        topic: 'Linked Lists',
        optionA: 'One extra pointer',
        optionB: 'Two extra pointers',
        optionC: 'No extra space',
        optionD: 'One extra data field',
        correctAnswer: 'A',
        explanation: 'A doubly linked list has one additional pointer (prev) compared to a singly linked list which only has next.'
      },
      {
        questionText: 'To detect a cycle in a linked list using Floyd\'s algorithm, what is the relationship between the two pointers?',
        topic: 'Linked Lists',
        optionA: 'Both move at the same speed',
        optionB: 'One moves twice as fast as the other',
        optionC: 'One moves three times as fast',
        optionD: 'They move in opposite directions',
        correctAnswer: 'B',
        explanation: 'Floyd\'s cycle detection uses a slow pointer (moves 1 step) and a fast pointer (moves 2 steps). They meet if a cycle exists.'
      },

      // BINARY TREES (12-13)
      {
        questionText: 'In a complete binary tree with n nodes, what is the maximum height?',
        topic: 'Binary Trees',
        optionA: 'log₂(n)',
        optionB: '⌊log₂(n)⌋',
        optionC: '⌈log₂(n+1)⌉',
        optionD: 'n',
        correctAnswer: 'B',
        explanation: 'A complete binary tree has minimum height. The height is floor(log₂(n)) where n is the number of nodes.'
      },
      {
        questionText: 'What is the maximum number of nodes at level k in a binary tree?',
        topic: 'Binary Trees',
        optionA: '2^k',
        optionB: '2^(k-1)',
        optionC: '2^k - 1',
        optionD: 'k^2',
        correctAnswer: 'A',
        explanation: 'At level k (where root is at level 0), the maximum number of nodes is 2^k.'
      },

      // TREE TRAVERSALS (14-15)
      {
        questionText: 'Given a binary tree with inorder traversal: D B E A F C, and preorder traversal: A B D E C F, what is the postorder traversal?',
        topic: 'Tree Traversals',
        optionA: 'D E B F C A',
        optionB: 'D B E F C A',
        optionC: 'E D B F C A',
        optionD: 'D E F B C A',
        correctAnswer: 'A',
        explanation: 'Using inorder and preorder, we can construct the tree. Root is A, left subtree (B,D,E), right subtree (C,F). Postorder: D E B F C A.'
      },
      {
        questionText: 'In which tree traversal method is the root node visited between the left and right subtrees?',
        topic: 'Tree Traversals',
        optionA: 'Preorder',
        optionB: 'Inorder',
        optionC: 'Postorder',
        optionD: 'Level order',
        correctAnswer: 'B',
        explanation: 'Inorder traversal visits nodes in the order: Left subtree → Root → Right subtree.'
      }
    ];

    console.log('Creating questions...\n');
    const createdQuestions = [];
    let displayOrder = 1;

    for (const q of questions) {
      const question = await Question.create({
        questionText: q.questionText,
        questionType: 'Multiple Choice',
        marks: 5,
        difficulty: 'Medium',
        topic: q.topic,
        courseId: course.id,
        optionA: q.optionA,
        optionB: q.optionB,
        optionC: q.optionC,
        optionD: q.optionD,
        correctAnswer: q.correctAnswer,
        explanation: q.explanation
      });

      createdQuestions.push(question);
      console.log(`✓ Q${displayOrder}: ${q.topic} - ${q.questionText.substring(0, 60)}...`);
      displayOrder++;
    }

    console.log(`\n✓ Created ${createdQuestions.length} questions\n`);

    // Link questions to exam
    console.log('Linking questions to exam...\n');
    let linkedCount = 0;

    for (let i = 0; i < createdQuestions.length; i++) {
      const question = createdQuestions[i];
      
      // Check if already linked
      const existing = await ExamQuestion.findOne({
        where: { examId: exam.id, questionId: question.id }
      });

      if (!existing) {
        await ExamQuestion.create({
          examId: exam.id,
          questionId: question.id,
          displayOrder: i + 1
        });
        linkedCount++;
      }
    }

    console.log(`✓ Linked ${linkedCount} questions to exam: ${exam.title}\n`);

    // Summary
    console.log('=== Summary ===');
    console.log(`Course: ${course.code} - ${course.name}`);
    console.log(`Exam: ${exam.title}`);
    console.log(`Questions Created: ${createdQuestions.length}`);
    console.log(`Questions Linked: ${linkedCount}`);
    console.log(`Total Marks: ${createdQuestions.length * 5} marks`);
    console.log('\nTopics covered:');
    console.log('  - Stacks: 5 questions');
    console.log('  - Queues: 3 questions');
    console.log('  - Linked Lists: 3 questions');
    console.log('  - Binary Trees: 2 questions');
    console.log('  - Tree Traversals: 2 questions');
    console.log('\n✅ All questions added successfully!');

    process.exit(0);

  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error(error);
    process.exit(1);
  }
}

addCS201Questions();
