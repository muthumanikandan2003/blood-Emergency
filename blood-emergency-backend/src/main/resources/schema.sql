-- Create database
CREATE DATABASE IF NOT EXISTS blood_emergency;
USE blood_emergency;

-- Donor table
CREATE TABLE IF NOT EXISTS donor (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    email VARCHAR(100),
    blood VARCHAR(10) NOT NULL,
    city VARCHAR(100)
);

-- Sample data (optional)
INSERT INTO donor (name, phone, email, blood, city) VALUES
('Ravi Kumar', '9876543210', 'ravi@gmail.com', 'A+', 'Chennai'),
('Anita Sharma', '9123456780', 'anita@gmail.com', 'O-', 'Bangalore');
