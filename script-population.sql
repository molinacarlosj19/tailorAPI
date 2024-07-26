-- Drop existing tables if they exist, using CASCADE to drop dependent objects
DROP TABLE IF EXISTS invoice_product_sources CASCADE;
DROP TABLE IF EXISTS product_order_products CASCADE;
DROP TABLE IF EXISTS product_orders CASCADE;
DROP TABLE IF EXISTS products CASCADE;
DROP TABLE IF EXISTS invoices CASCADE;
DROP TABLE IF EXISTS invoice_line_items CASCADE;

-- Create the products table
CREATE TABLE products (
    product_id SERIAL PRIMARY KEY,
    product_code VARCHAR(50) UNIQUE NOT NULL,
    product_name VARCHAR(100) NOT NULL
);

-- Create the product_orders table
CREATE TABLE product_orders (
    order_id SERIAL PRIMARY KEY,
    order_date DATE NOT NULL,
    order_number VARCHAR(50) NOT NULL,
    time_in TIME NOT NULL,
    time_out TIME NOT NULL
);

-- Create the product_order_products table
CREATE TABLE IF NOT EXISTS product_order_products (
    product_order_product_id SERIAL PRIMARY KEY,
    order_id INTEGER NOT NULL,
    product_id INTEGER NOT NULL,
    quantity INTEGER NOT NULL,
    expiration_date DATE,
    FOREIGN KEY (order_id) REFERENCES product_orders (order_id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products (product_id) ON DELETE CASCADE
);

-- Invoice Table
CREATE TABLE invoices (
    invoice_id SERIAL PRIMARY KEY,
    invoice_date DATE NOT NULL,
    selector VARCHAR(255) NOT NULL,
    checker VARCHAR(255) NOT NULL,
    driver VARCHAR(255) NOT NULL,
    received_by VARCHAR(255) NOT NULL
);

-- Create the invoice line items table
CREATE TABLE IF NOT EXISTS invoice_line_items (
    invoice_line_item_id SERIAL PRIMARY KEY,
    invoice_id INTEGER NOT NULL,
    product_id INTEGER NOT NULL,
    quantity INTEGER NOT NULL,
    FOREIGN KEY (invoice_id) REFERENCES invoices (invoice_id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products (product_id) ON DELETE CASCADE
);

-- Create new table to track product sources for invoices
CREATE TABLE IF NOT EXISTS invoice_product_sources (
    invoice_product_source_id SERIAL PRIMARY KEY,
    invoice_line_item_id INTEGER NOT NULL,
    product_order_product_id INTEGER NOT NULL,
    quantity INTEGER NOT NULL,
    expiration_date DATE NOT NULL,
    FOREIGN KEY (invoice_line_item_id) REFERENCES invoice_line_items (invoice_line_item_id),
    FOREIGN KEY (product_order_product_id) REFERENCES product_order_products (product_order_product_id)
);

-- Populate products table
INSERT INTO products (product_code, product_name) VALUES
('9602802', 'Product A'),
('9602803', 'Product B');

-- Populate product_orders table
INSERT INTO product_orders (order_date, order_number, time_in, time_out) VALUES
('2024-07-01', '123', '08:00:00', '10:00:00'),
('2024-07-05', '456', '09:00:00', '11:00:00');

-- Populate product_order_products table
INSERT INTO product_order_products (order_id, product_id, quantity, expiration_date) VALUES
(1, 1, 10, '2024-10-15'),
(2, 1, 2, '2024-10-12'),
(1, 2, 5, '2024-09-15'),
(2, 2, 3, '2024-09-12');

-- Sample data manipulation example
ALTER TABLE products DROP COLUMN IF EXISTS unit_price;

-- Drop unnecessary columns from product_orders table
ALTER TABLE product_orders
    DROP COLUMN IF EXISTS total_amount,
    DROP COLUMN IF EXISTS status;

-- Adjust product_order_products table if necessary
ALTER TABLE invoice_line_items DROP COLUMN IF EXISTS unit_price;
ALTER TABLE invoice_line_items DROP COLUMN IF EXISTS total_amount;

-- Remove expirationDate from products if it exists
ALTER TABLE products DROP COLUMN IF EXISTS expiration_date;

-- Add expirationDate to product_order_products if it doesn't exist
ALTER TABLE product_order_products ADD COLUMN IF NOT EXISTS expiration_date DATE;

-- Create roles table
CREATE TABLE IF NOT EXISTS roles (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE
);

-- Create users table
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role_id INT,
    FOREIGN KEY (role_id) REFERENCES roles(id)
);
