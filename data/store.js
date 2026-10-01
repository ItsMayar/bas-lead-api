// Simple JSON-file-backed data store for leads.
// A real deployment would swap this for a proper database, but the
// interface (list/get/create/update/remove) stays the same either way.

const fs = require("fs");
const path = require("path");

const DATA_FILE = path.join(__dirname, "leads.json");

function readAll() {
  if (!fs.existsSync(DATA_FILE)) {
    return [];
  }
  const raw = fs.readFileSync(DATA_FILE, "utf8");
  if (!raw.trim()) return [];
  return JSON.parse(raw);
}

function writeAll(leads) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(leads, null, 2), "utf8");
}

function list() {
  return readAll();
}

function get(id) {
  return readAll().find((lead) => lead.id === id) || null;
}

function create(lead) {
  const leads = readAll();
  leads.push(lead);
  writeAll(leads);
  return lead;
}

function update(id, patch) {
  const leads = readAll();
  const idx = leads.findIndex((lead) => lead.id === id);
  if (idx === -1) return null;
  leads[idx] = { ...leads[idx], ...patch };
  writeAll(leads);
  return leads[idx];
}

function remove(id) {
  const leads = readAll();
  const next = leads.filter((lead) => lead.id !== id);
  const removed = next.length !== leads.length;
  writeAll(next);
  return removed;
}

module.exports = { list, get, create, update, remove };
