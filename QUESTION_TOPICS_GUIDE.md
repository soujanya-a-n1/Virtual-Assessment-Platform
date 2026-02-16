# Question Bank Topics/Categories - Complete Guide

## ✅ Topics Feature Added Successfully!

Questions can now be organized by topics/categories for better management and filtering.

---

## 🎯 What Was Added

### Database
- ✅ Added `topic` column to questions table
- ✅ Automatically assigned topics to existing questions
- ✅ Supports custom topic names

### Frontend
- ✅ Topic dropdown in create/edit form
- ✅ Topic filter in search section
- ✅ Topic badge on question cards
- ✅ Dynamic topic list from database

### Backend
- ✅ Updated Question model with topic field
- ✅ Topic field in API responses
- ✅ Topic filtering support

---

## 📚 Available Topics

### Pre-defined Topics
1. **Mathematics** - Math problems, calculations, algebra
2. **Geography** - Countries, capitals, maps
3. **Programming** - Coding, algorithms, logic
4. **Web Development** - HTML, CSS, JavaScript
5. **Science** - General science questions
6. **Computer Science** - CS concepts, data structures
7. **General Knowledge** - Miscellaneous topics
8. **History** - Historical events, dates
9. **English** - Grammar, literature, vocabulary
10. **Physics** - Physics concepts, formulas
11. **Chemistry** - Chemical reactions, elements
12. **Biology** - Life sciences, anatomy
13. **Economics** - Economic concepts, markets
14. **Business** - Business management, finance
15. **Other** - Uncategorized questions

---

## 🚀 How to Use

### Creating Questions with Topics

1. **Open Question Bank**
   - Navigate to Question Bank page
   - Click "Create Question"

2. **Fill in Question Details**
   - Question text
   - Question type
   - Difficulty
   - Marks

3. **Select Topic**
   - Choose from dropdown
   - Or leave blank for no topic

4. **Complete and Save**
   - Fill remaining fields
   - Click "Create Question"

### Example: Creating a Math Question

```
Question Text: What is 5 × 8?
Type: Multiple Choice
Difficulty: Easy
Marks: 1
Topic: Mathematics

Options:
A: 35
B: 40 (Correct)
C: 45
D: 50

Explanation: 5 multiplied by 8 equals 40
```

---

## 🔍 Filtering by Topic

### Using the Topic Filter

1. **Go to Question Bank**
2. **Find Filter Section**
   - Located below search bar
   - Three dropdowns available

3. **Select Topic**
   - Click "All Topics" dropdown
   - Choose desired topic
   - Questions filter automatically

4. **Combine Filters**
   - Topic + Type + Difficulty
   - Search + Topic
   - All filters work together

### Example Filters

**Find all Easy Math questions:**
- Topic: Mathematics
- Difficulty: Easy
- Type: All Types

**Find Programming Multiple Choice:**
- Topic: Programming
- Type: Multiple Choice
- Difficulty: All Difficulties

---

## 📊 Question Organization

### By Subject Area

**STEM Topics:**
- Mathematics
- Science
- Physics
- Chemistry
- Biology
- Computer Science

**Humanities:**
- History
- Geography
- English
- Economics

**Technical:**
- Programming
- Web Development
- Computer Science

**General:**
- General Knowledge
- Other

---

## 🎨 Visual Features

### Topic Badge
- **Color**: Purple (#ce93d8)
- **Position**: On question card header
- **Style**: Rounded badge with border
- **Text**: Capitalized topic name

### Filter Dropdown
- **Icon**: Filter icon
- **Options**: Dynamic from database
- **Default**: "All Topics"
- **Updates**: Real-time filtering

---

## 📝 Sample Questions by Topic

### Mathematics
```
Q: What is the square root of 144?
A: 12
Topic: Mathematics
Difficulty: Easy
```

### Geography
```
Q: What is the capital of France?
A: Paris
Topic: Geography
Difficulty: Easy
```

### Programming
```
Q: What does HTML stand for?
A: Hyper Text Markup Language
Topic: Programming
Difficulty: Easy
```

### Science
```
Q: What is the largest planet in our solar system?
A: Jupiter
Topic: Science
Difficulty: Easy
```

---

## 🔧 Database Structure

### questions Table
```sql
CREATE TABLE questions (
  id INT PRIMARY KEY AUTO_INCREMENT,
  questionText TEXT NOT NULL,
  questionType ENUM(...),
  marks DECIMAL(10,2),
  difficulty ENUM('Easy', 'Medium', 'Hard'),
  topic VARCHAR(100),  -- NEW FIELD
  optionA TEXT,
  optionB TEXT,
  optionC TEXT,
  optionD TEXT,
  correctAnswer VARCHAR(100),
  explanation TEXT,
  createdAt TIMESTAMP,
  updatedAt TIMESTAMP
);
```

### Query by Topic
```sql
SELECT * FROM questions WHERE topic = 'Mathematics';
```

### Count by Topic
```sql
SELECT topic, COUNT(*) as count 
FROM questions 
GROUP BY topic 
ORDER BY count DESC;
```

---

## 🎯 Use Cases

### 1. Subject-Specific Exams
Create exams focused on one topic:
- Math exam: Filter by "Mathematics"
- Science exam: Filter by "Science"
- Programming exam: Filter by "Programming"

### 2. Mixed Topic Exams
Combine questions from multiple topics:
- General knowledge exam
- Aptitude test
- Comprehensive assessment

### 3. Topic-Based Practice
Students practice specific subjects:
- Math practice set
- Geography quiz
- Programming challenges

### 4. Curriculum Alignment
Organize by syllabus topics:
- Chapter-wise questions
- Unit-based assessments
- Module-specific tests

---

## 📈 Statistics by Topic

### View Topic Distribution

The Question Bank shows:
- Total questions per topic
- Filtered count
- Real-time updates

### Example Statistics
```
Mathematics: 15 questions
Programming: 12 questions
Science: 10 questions
Geography: 8 questions
History: 5 questions
```

---

## 🔄 Updating Existing Questions

### Add Topics to Old Questions

1. **Edit Question**
   - Click "Edit" on question card
   - Modal opens with current data

2. **Select Topic**
   - Choose from dropdown
   - Topic field is optional

3. **Save Changes**
   - Click "Update Question"
   - Topic badge appears on card

---

## 💡 Best Practices

### Topic Naming
- ✅ Use consistent names
- ✅ Keep topics broad
- ✅ Avoid too many topics
- ✅ Use standard subjects

### Organization
- ✅ Group related questions
- ✅ Use subtopics in question text
- ✅ Tag appropriately
- ✅ Review regularly

### Filtering
- ✅ Combine with difficulty
- ✅ Use with search
- ✅ Filter before creating exams
- ✅ Check distribution

---

## 🧪 Testing the Feature

### Quick Test

1. **Create Question with Topic**
   ```
   Question: What is 10 + 5?
   Topic: Mathematics
   ```

2. **Verify Topic Badge**
   - Purple badge should appear
   - Shows "Mathematics"

3. **Test Filter**
   - Select "Mathematics" in filter
   - Only math questions show

4. **Test Search + Filter**
   - Search: "10"
   - Topic: Mathematics
   - Should show matching questions

---

## 🎨 UI Elements

### Topic Dropdown (Form)
```
Location: Create/Edit modal
Position: After Marks field
Options: 15 predefined topics
Default: Empty (no topic)
```

### Topic Filter (Search)
```
Location: Filter section
Position: After Difficulty filter
Options: Dynamic from database
Default: "All Topics"
```

### Topic Badge (Card)
```
Location: Question card header
Color: Purple
Style: Rounded, bordered
Text: Capitalized topic name
```

---

## 📊 API Updates

### Create Question
```javascript
POST /api/questions
{
  "questionText": "What is 2+2?",
  "questionType": "Multiple Choice",
  "difficulty": "Easy",
  "marks": 1,
  "topic": "Mathematics",  // NEW
  "optionA": "3",
  "optionB": "4",
  "optionC": "5",
  "optionD": "6",
  "correctAnswer": "B"
}
```

### Response
```javascript
{
  "id": 1,
  "questionText": "What is 2+2?",
  "topic": "Mathematics",  // NEW
  "difficulty": "Easy",
  ...
}
```

---

## 🔧 Maintenance

### Adding New Topics

To add more topics, update:

1. **Frontend Dropdown**
   - Edit `QuestionBank.js`
   - Add option to topic select

2. **Database**
   - Topics are free-form text
   - No schema change needed

### Renaming Topics

Use SQL to update:
```sql
UPDATE questions 
SET topic = 'Computer Science' 
WHERE topic = 'CS';
```

---

## ✅ Success Checklist

After setup, verify:
- [ ] Topic field in create form
- [ ] Topic dropdown has options
- [ ] Can select topic
- [ ] Topic saves correctly
- [ ] Topic badge appears on card
- [ ] Topic filter works
- [ ] Filter shows correct questions
- [ ] Can combine filters
- [ ] Existing questions have topics
- [ ] Statistics show topic counts

---

## 🚀 Next Steps

### 1. Organize Existing Questions
- Review all questions
- Assign appropriate topics
- Ensure consistency

### 2. Create Topic-Based Exams
- Filter by topic
- Select questions
- Link to exams

### 3. Build Question Library
- Create questions for each topic
- Maintain balance
- Cover all subjects

### 4. Use for Practice
- Students filter by topic
- Practice specific subjects
- Track progress per topic

---

## 📞 Support

### Run Setup Script
```bash
cd backend
node add-topic-to-questions.js
```

### Check Topics
```sql
SELECT DISTINCT topic FROM questions;
```

### Count by Topic
```sql
SELECT topic, COUNT(*) as count 
FROM questions 
GROUP BY topic;
```

---

**Status**: ✅ Complete
**Feature**: Topics/Categories
**Database**: Updated
**Frontend**: Updated
**Backend**: Updated

---

## 🎉 Success!

Questions can now be organized by topics for better management and filtering!

**Happy Organizing! 📚**
