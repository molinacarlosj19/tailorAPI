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

-- Create a table for managing invoices
CREATE TABLE invoices (
    invoice_id SERIAL PRIMARY KEY,
    product_order_id INTEGER REFERENCES product_orders(order_id),
    invoice_date DATE NOT NULL,
    total_amount DECIMAL(10, 2) NOT NULL,
    CONSTRAINT positive_total_amount CHECK (total_amount >= 0)
);

-- Create a table for managing invoice line items
CREATE TABLE invoice_line_items (
    line_item_id SERIAL PRIMARY KEY,
    invoice_id INTEGER REFERENCES invoices(invoice_id),
    product_id INTEGER REFERENCES products(product_id),
    quantity INTEGER NOT NULL,
    unit_price DECIMAL(10, 2) NOT NULL,
    total_amount DECIMAL(10, 2) NOT NULL,
    CONSTRAINT positive_quantity CHECK (quantity >= 0),
    CONSTRAINT positive_unit_price CHECK (unit_price >= 0),
    CONSTRAINT positive_total_amount CHECK (total_amount >= 0)
);

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

