-- Create database schema for School Expense Tracking System

-- Categories table
CREATE TABLE IF NOT EXISTS categories (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL UNIQUE,
  amount DECIMAL(10,2) NOT NULL,
  description TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Students table
CREATE TABLE IF NOT EXISTS students (
  id SERIAL PRIMARY KEY,
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  student_id VARCHAR(50) NOT NULL UNIQUE,
  class VARCHAR(20) NOT NULL,
  email VARCHAR(255),
  phone VARCHAR(20),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Student categories junction table
CREATE TABLE IF NOT EXISTS student_categories (
  id SERIAL PRIMARY KEY,
  student_id INTEGER REFERENCES students(id) ON DELETE CASCADE,
  category_id INTEGER REFERENCES categories(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(student_id, category_id)
);

-- Payments table
CREATE TABLE IF NOT EXISTS payments (
  id SERIAL PRIMARY KEY,
  student_id INTEGER REFERENCES students(id) ON DELETE CASCADE,
  category_id INTEGER REFERENCES categories(id) ON DELETE CASCADE,
  amount DECIMAL(10,2) NOT NULL,
  payment_date DATE NOT NULL,
  payment_method VARCHAR(50) NOT NULL,
  reference VARCHAR(255),
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert sample data
INSERT INTO categories (name, amount, description) VALUES
('SS1 School Fees', 50000.00, 'Annual school fees for SS1 students'),
('SS2 School Fees', 55000.00, 'Annual school fees for SS2 students'),
('SS3 School Fees', 60000.00, 'Annual school fees for SS3 students'),
('Textbooks', 15000.00, 'Required textbooks for all classes'),
('Uniform', 12000.00, 'School uniform package')
ON CONFLICT (name) DO NOTHING;

INSERT INTO students (first_name, last_name, student_id, class, email, phone) VALUES
('John', 'Doe', 'STU001', 'SS1', 'john.doe@email.com', '+2348012345678'),
('Jane', 'Smith', 'STU002', 'SS2', 'jane.smith@email.com', '+2348023456789'),
('Mike', 'Johnson', 'STU003', 'SS3', 'mike.johnson@email.com', '+2348034567890')
ON CONFLICT (student_id) DO NOTHING;

-- Insert sample student-category relationships
INSERT INTO student_categories (student_id, category_id)
SELECT s.id, c.id FROM students s, categories c
WHERE s.student_id = 'STU001' AND c.name IN ('SS1 School Fees', 'Textbooks')
ON CONFLICT DO NOTHING;

INSERT INTO student_categories (student_id, category_id)
SELECT s.id, c.id FROM students s, categories c
WHERE s.student_id = 'STU002' AND c.name IN ('SS2 School Fees', 'Textbooks')
ON CONFLICT DO NOTHING;

INSERT INTO student_categories (student_id, category_id)
SELECT s.id, c.id FROM students s, categories c
WHERE s.student_id = 'STU003' AND c.name IN ('SS3 School Fees', 'Textbooks')
ON CONFLICT DO NOTHING;

-- Insert sample payments
INSERT INTO payments (student_id, category_id, amount, payment_date, payment_method, reference, notes) VALUES
(1, 1, 50000.00, '2025-01-15', 'bank_transfer', 'TXN123456789', 'Full payment for first term'),
(2, 4, 15000.00, '2025-01-15', 'cash', NULL, 'Partial payment'),
(3, 3, 30000.00, '2025-01-14', 'card', 'CARD987654321', NULL)
ON CONFLICT DO NOTHING;