-- Users table
CREATE TABLE users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(255) UNIQUE,
    email VARCHAR(255) UNIQUE,
    password_hash VARCHAR(255),
    role ENUM('admin', 'student'),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Access codes table
CREATE TABLE access_codes (
    id INT PRIMARY KEY AUTO_INCREMENT,
    code VARCHAR(50) UNIQUE,
    student_id INT,
    category_id INT,
    expires_at DATETIME,
    is_used BOOLEAN DEFAULT FALSE,
    created_by INT,
    FOREIGN KEY (student_id) REFERENCES users(id),
    FOREIGN KEY (created_by) REFERENCES users(id)
);

-- Button categories table
CREATE TABLE button_categories (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255),
    description TEXT,
    created_by INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Buttons table
CREATE TABLE buttons (
    id INT PRIMARY KEY AUTO_INCREMENT,
    category_id INT,
    title VARCHAR(255),
    link_url TEXT,
    description TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_by INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES button_categories(id)
);

-- Quiz questions table
CREATE TABLE quiz_questions (
    id INT PRIMARY KEY AUTO_INCREMENT,
    category ENUM('rccg_history', 'bible_knowledge', 'doctrine'),
    question_text TEXT,
    options JSON,
    correct_answer VARCHAR(10),
    points INT DEFAULT 1,
    created_by INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Student progress table
CREATE TABLE student_progress (
    id INT PRIMARY KEY AUTO_INCREMENT,
    student_id INT,
    activity_type VARCHAR(100),
    activity_id INT,
    completed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    score INT,
    FOREIGN KEY (student_id) REFERENCES users(id)
);