const test = require("node:test");
const assert = require("node:assert");
const fs = require("fs");
const path = require("path");

// Point the store at a throwaway test data file before requiring the app.
const TEST_DATA_FILE = path.join(__dirname, "..", "data", "leads.json");

test.beforeEach(() => {
  fs.writeFileSync(TEST_DATA_FILE, "[]", "utf8");
});

test.after(() => {
  fs.writeFileSync(TEST_DATA_FILE, "[]", "utf8");
});

const app = require("../server");

async function request(method, path, body) {
  // Minimal in-process request helper (no external HTTP needed for these checks).
  const http = require("http");
  const server = app.listen(0);
  const { port } = server.address();
  try {
    const res = await fetch(`http://127.0.0.1:${port}${path}`, {
      method,
      headers: body ? { "Content-Type": "application/json" } : undefined,
      body: body ? JSON.stringify(body) : undefined,
    });
    const text = await res.text();
    return { status: res.status, body: text ? JSON.parse(text) : null };
  } finally {
    server.close();
  }
}

test("GET /health returns ok", async () => {
  const res = await request("GET", "/health");
  assert.strictEqual(res.status, 200);
  assert.strictEqual(res.body.status, "ok");
});

test("POST /leads rejects a missing name", async () => {
  const res = await request("POST", "/leads", { product: "Pulse" });
  assert.strictEqual(res.status, 400);
  assert.ok(res.body.errors.some((e) => e.includes("name")));
});

test("POST /leads creates a lead and GET /leads lists it", async () => {
  const create = await request("POST", "/leads", {
    name: "Al Faisal Trading Co.",
    product: "Pulse",
    stage: "New lead",
  });
  assert.strictEqual(create.status, 201);
  assert.strictEqual(create.body.name, "Al Faisal Trading Co.");

  const list = await request("GET", "/leads");
  assert.strictEqual(list.status, 200);
  assert.strictEqual(list.body.length, 1);
});

test("POST /leads rejects an invalid stage", async () => {
  const res = await request("POST", "/leads", {
    name: "Test Co",
    stage: "Not A Real Stage",
  });
  assert.strictEqual(res.status, 400);
});

test("DELETE /leads/:id on an unknown id returns 404", async () => {
  const res = await request("DELETE", "/leads/does-not-exist");
  assert.strictEqual(res.status, 404);
});
