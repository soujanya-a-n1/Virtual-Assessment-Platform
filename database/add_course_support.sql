-- Migration script to add course support to existing database
-- Run this if you already have a database without courseId columns

USE virtual_assessment_db;

-- Add courseId to exams table if it doesn't exist
SET @dbname = DATABASE();
SET @tablename = 'exams';
SET @columnname = 'courseId';
SET @preparedStatement = (SELECT IF(
  (
    SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS
    WHERE
      (table_name = @tablename)
      AND (table_schema = @dbname)
      AND (column_name = @columnname)
  ) > 0,
  'SELECT 1',
  CONCAT('ALTER TABLE ', @tablename, ' ADD COLUMN ', @columnname, ' INT AFTER createdBy, ADD FOREIGN KEY (', @columnname, ') REFERENCES courses(id) ON DELETE SET NULL, ADD INDEX idx_', @columnname, ' (', @columnname, ');')
));
PREPARE alterIfNotExists FROM @preparedStatement;
EXECUTE alterIfNotExists;
DEALLOCATE PREPARE alterIfNotExists;

-- Add courseId to questions table if it doesn't exist
SET @tablename = 'questions';
SET @columnname = 'courseId';
SET @preparedStatement = (SELECT IF(
  (
    SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS
    WHERE
      (table_name = @tablename)
      AND (table_schema = @dbname)
      AND (column_name = @columnname)
  ) > 0,
  'SELECT 1',
  CONCAT('ALTER TABLE ', @tablename, ' ADD COLUMN ', @columnname, ' INT AFTER displayOrder, ADD FOREIGN KEY (', @columnname, ') REFERENCES courses(id) ON DELETE SET NULL, ADD INDEX idx_', @columnname, ' (', @columnname, ');')
));
PREPARE alterIfNotExists FROM @preparedStatement;
EXECUTE alterIfNotExists;
DEALLOCATE PREPARE alterIfNotExists;

-- Add topic column to questions table if it doesn't exist
SET @tablename = 'questions';
SET @columnname = 'topic';
SET @preparedStatement = (SELECT IF(
  (
    SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS
    WHERE
      (table_name = @tablename)
      AND (table_schema = @dbname)
      AND (column_name = @columnname)
  ) > 0,
  'SELECT 1',
  CONCAT('ALTER TABLE ', @tablename, ' ADD COLUMN ', @columnname, ' VARCHAR(100) AFTER difficulty;')
));
PREPARE alterIfNotExists FROM @preparedStatement;
EXECUTE alterIfNotExists;
DEALLOCATE PREPARE alterIfNotExists;

SELECT 'Course support migration completed successfully!' AS Status;
