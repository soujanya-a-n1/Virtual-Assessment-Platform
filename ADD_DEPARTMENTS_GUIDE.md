# Add Departments to Database

## Departments to Add

1. **CSE** - Computer Science and Engineering
2. **ECE** - Electronics and Communication Engineering
3. **MECH** - Mechanical Engineering
4. **CIVIL** - Civil Engineering
5. **MBA** - Master of Business Administration

## Method 1: Using Node.js Script (Recommended)

This method works when MySQL is running and your backend can connect.

### Steps:

1. **Make sure MySQL is running** in XAMPP Control Panel

2. **Run the script:**
   ```cmd
   cd backend
   node add-departments.js
   ```

3. **Verify the output** - you should see:
   ```
   ✓ Created: CSE - Computer Science and Engineering
   ✓ Created: ECE - Electronics and Communication Engineering
   ✓ Created: MECH - Mechanical Engineering
   ✓ Created: CIVIL - Civil Engineering
   ✓ Created: MBA - Master of Business Administration
   ```

## Method 2: Using SQL Script

If you prefer to run SQL directly or the Node.js method doesn't work.

### Steps:

1. **Open phpMyAdmin** (http://localhost/phpmyadmin)

2. **Select your database** (`virtual_assessment_platform`)

3. **Go to SQL tab**

4. **Copy and paste** the contents of `database/insert_departments.sql`

5. **Click "Go"** to execute

## Method 3: Using MySQL Command Line

### Steps:

1. **Open Command Prompt**

2. **Navigate to MySQL bin:**
   ```cmd
   cd C:\xampp\mysql\bin
   ```

3. **Login to MySQL:**
   ```cmd
   mysql -u root -p
   ```

4. **Run the SQL file:**
   ```sql
   source D:/Virtual-Assessment-Platform/database/insert_departments.sql
   ```

## Verification

After adding departments, verify they were created:

### Using Node.js:
```cmd
cd backend
node -e "const Department = require('./src/models/Department'); const sequelize = require('./src/config/database'); (async () => { await sequelize.authenticate(); const depts = await Department.findAll(); console.log(depts.map(d => d.toJSON())); await sequelize.close(); })();"
```

### Using SQL:
```sql
SELECT * FROM departments ORDER BY code;
```

### Expected Result:
```
code   | name                                      | isActive
-------|-------------------------------------------|----------
CSE    | Computer Science and Engineering          | 1
ECE    | Electronics and Communication Engineering | 1
MECH   | Mechanical Engineering                    | 1
CIVIL  | Civil Engineering                         | 1
MBA    | Master of Business Administration         | 1
```

## Troubleshooting

### Error: "Cannot connect to database"
- Make sure MySQL is running in XAMPP
- Check your `backend/.env` file has correct database credentials

### Error: "Table 'departments' doesn't exist"
- Run the database schema first:
  ```cmd
  cd backend
  node src/models/sync.js
  ```

### Error: "Duplicate entry for key 'code'"
- Departments already exist! The script uses `findOrCreate` so it will update existing ones.

## Next Steps

After adding departments:
1. Add courses linked to these departments
2. Add lecturers and assign them to departments
3. Add students and enroll them in departments
