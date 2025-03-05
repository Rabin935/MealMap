-- Create users table
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    is_admin BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create admin user
INSERT INTO users (username, email, password, is_admin) 
VALUES ('admin', 'admin@recipefinder.com', '$2a$10$XFDk9K2LPkGa2PeKnZvR8.4h1wHNXkIC0/ZGWZzwPcJqd9PTcXRbi', TRUE);

-- Create recipes table
CREATE TABLE recipes (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    ingredients TEXT[] NOT NULL,
    instructions TEXT[] NOT NULL,
    cooking_time INTEGER DEFAULT 0,
    servings INTEGER DEFAULT 1,
    difficulty_level VARCHAR(20) DEFAULT 'medium',
    image_url TEXT,
    status VARCHAR(20) DEFAULT 'draft',
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create categories table
CREATE TABLE categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create recipe_categories junction table
CREATE TABLE recipe_categories (
    recipe_id INTEGER REFERENCES recipes(id) ON DELETE CASCADE,
    category_id INTEGER REFERENCES categories(id) ON DELETE CASCADE,
    PRIMARY KEY (recipe_id, category_id)
);

-- Insert default categories
INSERT INTO categories (name) VALUES
    ('Breakfast'),
    ('Lunch'),
    ('Dinner'),
    ('Dessert'),
    ('Appetizer'),
    ('Snack'),
    ('Vegetarian'),
    ('Vegan'),
    ('Gluten-Free'),
    ('Quick & Easy');

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for recipes table
CREATE TRIGGER update_recipes_updated_at
    BEFORE UPDATE ON recipes
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Create favorites table
CREATE TABLE favorites (
    user_id INTEGER REFERENCES users(id),
    recipe_id INTEGER REFERENCES recipes(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (user_id, recipe_id)
); 