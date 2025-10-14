#! /usr/bin/env node

require("dotenv").config()

const { Client } = require("pg")

const localConnectionString = process.env.LOCAL_CONNECTION_STRING
const prodConnectionString = process.env.NEON_CONNECTION_STRING

const SQL = `

-- Tables
DROP TABLE IF EXISTS item_categories;
DROP TABLE IF EXISTS items;
DROP TABLE IF EXISTS categories;
DROP TABLE IF EXISTS icons;

CREATE TABLE IF NOT EXISTS items (
    id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    name VARCHAR ( 255 ) NOT NULL,
    price INTEGER DEFAULT 1 NOT NULL,
    quantity INTEGER DEFAULT 1 NOT NULL
);

CREATE TABLE IF NOT EXISTS icons (
    id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    svg TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS categories (
    id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    name VARCHAR ( 255 ) NOT NULL,
    icon_id INT REFERENCES icons(id) ON DELETE SET NULL DEFAULT NULL
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

-- Uncategorized 
INSERT INTO items (name, price, quantity) VALUES
  ('Gold', 1, 100);

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

-- Icons
INSERT INTO icons (svg) VALUES
('<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e3e3e3"><path d="M762-96 645-212l-88 88-28-28q-23-23-23-57t23-57l169-169q23-23 57-23t57 23l28 28-88 88 116 117q12 12 12 28t-12 28l-50 50q-12 12-28 12t-28-12Zm118-628L426-270l5 4q23 23 23 57t-23 57l-28 28-88-88L198-96q-12 12-28 12t-28-12l-50-50q-12-12-12-28t12-28l116-117-88-88 28-28q23-23 57-23t57 23l4 5 454-454h160v160ZM334-583l24-23 23-24-23 24-24 23Zm-56 57L80-724v-160h160l198 198-57 56-174-174h-47v47l174 174-56 57Zm92 199 430-430v-47h-47L323-374l47 47Zm0 0-24-23-23-24 23 24 24 23Z"/></svg>'),
('<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e3e3e3"><path d="M480-80q-139-35-229.5-159.5T160-516v-244l320-120 320 120v244q0 152-90.5 276.5T480-80Zm0-84q104-33 172-132t68-220v-189l-240-90-240 90v189q0 121 68 220t172 132Zm0-316Z"/></svg>'),
('<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e3e3e3"><path d="M754-81q-8 0-15-2.5T726-92L522-296q-6-6-8.5-13t-2.5-15q0-8 2.5-15t8.5-13l85-85q6-6 13-8.5t15-2.5q8 0 15 2.5t13 8.5l204 204q6 6 8.5 13t2.5 15q0 8-2.5 15t-8.5 13l-85 85q-6 6-13 8.5T754-81Zm0-95 29-29-147-147-29 29 147 147ZM205-80q-8 0-15.5-3T176-92l-84-84q-6-6-9-13.5T80-205q0-8 3-15t9-13l212-212h85l34-34-165-165h-57L80-765l113-113 121 121v57l165 165 116-116-43-43 56-56H495l-28-28 142-142 28 28v113l56-56 142 142q17 17 26 38.5t9 45.5q0 24-9 46t-26 39l-85-85-56 56-42-42-207 207v84L233-92q-6 6-13 9t-15 3Zm0-96 170-170v-29h-29L176-205l29 29Zm0 0-29-29 15 14 14 15Zm549 0 29-29-29 29Z"/></svg>'),
('<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e3e3e3"><path d="M120-640h720v360q0 50-35 85t-85 35H240q-50 0-85-35t-35-85v-360Zm80 80v280q0 17 11.5 28.5T240-240h480q17 0 28.5-11.5T760-280v-280H200Zm-80-120v-80h240v-40q0-17 11.5-28.5T400-840h160q17 0 28.5 11.5T600-800v40h240v80H120Zm360 280Z"/></svg>'),
('<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e3e3e3"><path d="M607-520H393q-5 12-12 23.5T364-477l29 317h214l29-317q-10-9-17-20t-12-23ZM382-680l-11 44q7 8 12.5 17t9.5 19h214q4-10 9.5-19t12.5-17l-11-44H382Zm11 600q-31 0-54-20.5T313-152l-31-346q-1-10 3.5-18.5T299-530q8-5 14-12t6-17q0-9-4-16.5T303-588q-10-5-15-15.5t-2-21.5l26-105q3-14 14-22t25-8h109v-40h-60v-80h200v80h-60v40h109q14 0 24.5 8t13.5 22l27 105q3 11-2 21.5T697-588q-8 4-12.5 11t-4.5 16q0 11 5.5 18.5T700-530q9 5 14 13.5t4 18.5l-31 345q-3 31-26 52t-54 21H393Zm107-440Zm0-80Z"/></svg>'),
('<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e3e3e3"><path d="M480-120 80-600l120-240h560l120 240-400 480Zm-95-520h190l-60-120h-70l-60 120Zm55 347v-267H218l222 267Zm80 0 222-267H520v267Zm144-347h106l-60-120H604l60 120Zm-474 0h106l60-120H250l-60 120Z"/></svg>'),
('<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e3e3e3"><path d="M300-80q-58 0-99-41t-41-99v-520q0-58 41-99t99-41h500v600q-25 0-42.5 17.5T740-220q0 25 17.5 42.5T800-160v80H300Zm-60-267q14-7 29-10t31-3h20v-440h-20q-25 0-42.5 17.5T240-740v393Zm160-13h320v-440H400v440Zm-160 13v-453 453Zm60 187h373q-6-14-9.5-28.5T660-220q0-16 3-31t10-29H300q-26 0-43 17.5T240-220q0 26 17 43t43 17Z"/></svg>');

-- Associate icons to categories by ID
UPDATE categories SET icon_id = 1 WHERE name = 'Weapons';
UPDATE categories SET icon_id = 2 WHERE name = 'Armor';
UPDATE categories SET icon_id = 3 WHERE name = 'Materials';
UPDATE categories SET icon_id = 4 WHERE name = 'Food';
UPDATE categories SET icon_id = 5 WHERE name = 'Potions';
UPDATE categories SET icon_id = 6 WHERE name = 'Jewellery';
UPDATE categories SET icon_id = 7 WHERE name = 'Books';

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
