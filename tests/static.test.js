const test = require("node:test");
const assert = require("node:assert");
const fs = require("node:fs");
const path = require("node:path");

test("404 page exists", () => {
  const filePath = path.join(__dirname, "../public/404.html");
  assert.ok(fs.existsSync(filePath));
});

test("404 page contains expected text", () => {
  const filePath = path.join(__dirname, "../public/404.html");
  const html = fs.readFileSync(filePath, "utf8");
  assert.match(html, /404/i);
});
