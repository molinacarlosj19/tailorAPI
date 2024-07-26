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
CREATE TABLE product_order_products (
    product_order_product_id SERIAL PRIMARY KEY,
    order_id INTEGER NOT NULL,
    product_id INTEGER NOT NULL,
    quantity INTEGER NOT NULL,
    expiration_date DATE NOT NULL,
    FOREIGN KEY (order_id) REFERENCES product_orders (order_id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products (product_id) ON DELETE CASCADE
);

-- Create the invoices table
CREATE TABLE invoices (
    invoice_id SERIAL PRIMARY KEY,
    invoice_date DATE NOT NULL,
    selector VARCHAR(255) NOT NULL,
    checker VARCHAR(255) NOT NULL,
    driver VARCHAR(255) NOT NULL,
    received_by VARCHAR(255) NOT NULL
);

-- Create the invoice line items table
CREATE TABLE invoice_line_items (
    invoice_line_item_id SERIAL PRIMARY KEY,
    invoice_id INTEGER NOT NULL,
    product_id INTEGER NOT NULL,
    quantity INTEGER NOT NULL,
    FOREIGN KEY (invoice_id) REFERENCES invoices (invoice_id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products (product_id) ON DELETE CASCADE
);

-- Create the invoice product sources table
CREATE TABLE invoice_product_sources (
    invoice_product_source_id SERIAL PRIMARY KEY,
    invoice_line_item_id INTEGER NOT NULL,
    product_order_product_id INTEGER NOT NULL,
    quantity INTEGER NOT NULL,
    expiration_date DATE NOT NULL,
    FOREIGN KEY (invoice_line_item_id) REFERENCES invoice_line_items (invoice_line_item_id),
    FOREIGN KEY (product_order_product_id) REFERENCES product_order_products (product_order_product_id)
);

-- Insert sample data
INSERT INTO products (product_code, product_name) VALUES 
('9602802', 'Product A'),
('9602803', 'Product B');

INSERT INTO product_orders (order_date, order_number, time_in, time_out) VALUES 
('2024-07-20', '123', '08:00:00', '17:00:00'),
('2024-07-21', '456', '08:00:00', '17:00:00');

INSERT INTO product_order_products (order_id, product_id, quantity, expiration_date) VALUES 
(1, 1, 10, '2024-10-15'),
(2, 1, 2, '2024-10-12'),
(1, 2, 5, '2024-11-01');
