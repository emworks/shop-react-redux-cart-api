-- Insert sample data into carts table
INSERT INTO carts (id, user_id, created_at, updated_at, status) VALUES
    ('6ba7b810-9dad-11d1-80b4-00c04fd430c8', '6ba7b810-9dad-11d1-80b4-00c04fd430c9', '2023-01-15', '2023-01-15', 'OPEN'),
    ('6ba7b811-9dad-11d1-80b4-00c04fd430c8', '6ba7b810-9dad-11d1-80b4-00c04fd430c9', '2023-02-20', '2023-02-20', 'ORDERED'),
    -- Add more sample data here...

-- Insert sample data into cart_items table
INSERT INTO cart_items (cart_id, product_id, count) VALUES
    ('6ba7b810-9dad-11d1-80b4-00c04fd430c8', '6ba7b810-9dad-11d1-80b4-00c04fd430ca', 3),
    ('6ba7b810-9dad-11d1-80b4-00c04fd430c8', '6ba7b810-9dad-11d1-80b4-00c04fd430cb', 1),
    -- Add more sample data here...