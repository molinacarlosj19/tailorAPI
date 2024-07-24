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
    product_code VARCHAR(50) NOT NULL,
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



-- Sample data manipulation example
-- Let's assume we have already existing tables and the necessary products and orders


ALTER TABLE products ADD COLUMN product_code VARCHAR(50) UNIQUE NOT NULL;

ALTER TABLE products DROP COLUMN unit_price;

-- Drop unnecessary columns from product_orders table
ALTER TABLE product_orders
    DROP COLUMN total_amount,
    DROP COLUMN status;

-- Add new columns to product_orders table
ALTER TABLE product_orders
    ADD COLUMN order_number VARCHAR(50) NOT NULL,
    ADD COLUMN time_in TIME NOT NULL,
    ADD COLUMN time_out TIME NOT NULL;

-- Adjust product_order_products table if necessary
-- (Assuming no changes needed for now)

ALTER TABLE invoice_line_items DROP COLUMN unit_price;
ALTER TABLE invoice_line_items DROP COLUMN total_amount;

-- Remove expirationDate from products if it exists
ALTER TABLE products DROP COLUMN IF EXISTS expiration_date;

-- Add expirationDate to product_order_products if it doesn't exist
ALTER TABLE product_order_products ADD COLUMN expiration_date DATE;

-- Create roles table
CREATE TABLE roles (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE
);

-- Create users table
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role_id INT,
    FOREIGN KEY (role_id) REFERENCES roles(id)
);

