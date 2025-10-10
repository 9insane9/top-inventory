#! /usr/bin/env node

require("dotenv").config()

const { Client } = require("pg")

const localConnectionString = process.env.LOCAL_CONNECTION_STRING
const prodConnectionString = process.env.NEON_CONNECTION_STRING

const SQL = `
DROP TABLE IF EXISTS item_categories;
DROP TABLE IF EXISTS items;
DROP TABLE IF EXISTS categories;

CREATE TABLE IF NOT EXISTS items (
    id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    name VARCHAR ( 255 ) NOT NULL,
    price INTEGER DEFAULT 1 NOT NULL,
    quantity INTEGER DEFAULT 1 NOT NULL
);

CREATE TABLE IF NOT EXISTS categories (
    id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    name VARCHAR ( 255 ) NOT NULL
);

CREATE TABLE item_categories ( 
    item_id INT REFERENCES items(id) ON DELETE CASCADE, 
    category_id INT REFERENCES categories(id) ON DELETE CASCADE, 
    PRIMARY KEY (item_id, category_id)
);

-- Categories
INSERT INTO categories (name) VALUES
  ('Weapons'),
  ('Armor'),
  ('Materials'),
  ('Food'),
  ('Potions'),
  ('Jewellery'),
  ('Books');

-- Weapons
INSERT INTO items (name, price, quantity) VALUES
  ('Short Sword', 50, 10),
  ('Long Bow', 70, 5),
  ('Battle Axe', 80, 3);

-- Armor
INSERT INTO items (name, price, quantity) VALUES
  ('Leather Armor', 60, 5),
  ('Chainmail', 120, 2),
  ('Iron Helmet', 40, 8);

-- Materials
INSERT INTO items (name, price, quantity) VALUES
  ('Iron Ore', 10, 50),
  ('Leather Hide', 15, 30),
  ('Magic Crystal', 100, 2);

-- Food
INSERT INTO items (name, price, quantity) VALUES
  ('Loaf of Bread', 5, 20),
  ('Cheese Wheel', 8, 15),
  ('Dried Meat', 12, 10);

-- Potions
INSERT INTO items (name, price, quantity) VALUES
  ('Health Potion', 25, 10),
  ('Mana Potion', 30, 8),
  ('Stamina Elixir', 35, 5);

-- Jewellery
INSERT INTO items (name, price, quantity) VALUES
  ('Silver Ring', 50, 4),
  ('Gold Necklace', 150, 2),
  ('Emerald Bracelet', 200, 1);

-- Books
INSERT INTO items (name, price, quantity) VALUES
  ('Book of Spells', 120, 3),
  ('Tome of History', 80, 5),
  ('Adventurer''s Guide', 60, 7);

-- Weapons = 1
INSERT INTO item_categories (item_id, category_id) VALUES
  (1, 1), (2, 1), (3, 1);

-- Armor = 2
INSERT INTO item_categories (item_id, category_id) VALUES
  (4, 2), (5, 2), (6, 2);

-- Materials = 3
INSERT INTO item_categories (item_id, category_id) VALUES
  (7, 3), (8, 3), (9, 3);

-- Food = 4
INSERT INTO item_categories (item_id, category_id) VALUES
  (10, 4), (11, 4), (12, 4);

-- Potions = 5
INSERT INTO item_categories (item_id, category_id) VALUES
  (13, 5), (14, 5), (15, 5);

-- Jewellery = 6
INSERT INTO item_categories (item_id, category_id) VALUES
  (16, 6), (17, 6), (18, 6);

-- Books = 7
INSERT INTO item_categories (item_id, category_id) VALUES
  (19, 7), (20, 7), (21, 7);
`

async function resetDb(isProd = true) {
  const connectionString = isProd ? prodConnectionString : localConnectionString

  console.log("Resetting database...")
  const client = new Client({ connectionString })
  await client.connect()

  try {
    await client.query(SQL)
  } finally {
    await client.end()
  }

  console.log("Done!")
}

module.exports = resetDb

if (require.main === module) {
  resetDb(false)
}
