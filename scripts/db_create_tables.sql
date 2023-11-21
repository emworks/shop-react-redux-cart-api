-- Create carts table
CREATE TABLE carts (
    id UUID PRIMARY KEY,
    user_id UUID NOT NULL,
    created_at DATE NOT NULL,
    updated_at DATE NOT NULL,
    status VARCHAR(10) CHECK (status IN ('OPEN', 'ORDERED')) NOT NULL
);

-- Create cart_items table
CREATE TABLE cart_items (
    cart_id UUID,
    product_id UUID,
    count INTEGER,
    FOREIGN KEY (cart_id) REFERENCES carts(id) ON DELETE CASCADE
);