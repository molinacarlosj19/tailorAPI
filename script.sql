-- Create a table for managing product orders
CREATE TABLE product_orders (
    order_id SERIAL PRIMARY KEY,
    order_date DATE NOT NULL,
    total_amount DECIMAL(10, 2) NOT NULL,
    status VARCHAR(20) NOT NULL
);

-- Create a table for managing products
CREATE TABLE products (
    product_id SERIAL PRIMARY KEY,
    product_name VARCHAR(100) NOT NULL,
    unit_price DECIMAL(10, 2) NOT NULL,
    expiration_date DATE NOT NULL,
    CONSTRAINT unique_product_name UNIQUE (product_name),
    CONSTRAINT positive_unit_price CHECK (unit_price >= 0)
);

-- Create a table for managing product orders and products relationship
CREATE TABLE product_order_products (
    order_id INTEGER REFERENCES product_orders(order_id),
    product_id INTEGER REFERENCES products(product_id),
    quantity INTEGER NOT NULL,
    PRIMARY KEY (order_id, product_id),
    CONSTRAINT positive_quantity CHECK (quantity >= 0)
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

-- Invoice Line Items Table
CREATE TABLE invoice_line_items (
    line_item_id SERIAL PRIMARY KEY,
    invoice_id INT REFERENCES invoices(invoice_id) ON DELETE CASCADE,
    product_code VARCHAR(255) NOT NULL,
    product_name VARCHAR(255) NOT NULL,
    quantity INT NOT NULL,
    product_order_id INT REFERENCES product_orders(order_id) ON DELETE CASCADE
);

-- Create new table to track product sources for invoices
CREATE TABLE invoice_product_sources (
    invoice_product_source_id SERIAL PRIMARY KEY,
    invoice_id INT REFERENCES invoices(invoice_id),
    product_order_id INT REFERENCES product_orders(order_id),
    product_id INT REFERENCES products(product_id),
    quantity INT NOT NULL
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


