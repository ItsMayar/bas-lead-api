const express = require("express");
const crypto = require("crypto");
const store = require("../data/store");

const router = express.Router();

const VALID_STAGES = [
  "New lead",
  "Contacted",
  "Discovery call",
  "Proposal sent",
  "Closed - won",
  "Closed - lost",
];
const VALID_PRODUCTS = ["Pulse", "Nawa", "Forward", "General"];

function validateLeadInput(body) {
  const errors = [];

  if (typeof body.name !== "string" || !body.name.trim()) {
    errors.push("name is required");
  } else if (body.name.length > 200) {
    errors.push("name must be 200 characters or fewer");
  }

  if (body.product !== undefined && !VALID_PRODUCTS.includes(body.product)) {
    errors.push(`product must be one of: ${VALID_PRODUCTS.join(", ")}`);
  }

  if (body.stage !== undefined && !VALID_STAGES.includes(body.stage)) {
    errors.push(`stage must be one of: ${VALID_STAGES.join(", ")}`);
  }

  if (body.notes !== undefined && typeof body.notes !== "string") {
    errors.push("notes must be a string");
  } else if (typeof body.notes === "string" && body.notes.length > 2000) {
    errors.push("notes must be 2000 characters or fewer");
  }

  return errors;
}

// GET /leads - list all leads, optional ?stage= filter
router.get("/", (req, res) => {
  let leads = store.list();
  const { stage } = req.query;
  if (stage) {
    leads = leads.filter((lead) => lead.stage === stage);
  }
  res.json(leads);
});

// GET /leads/:id
router.get("/:id", (req, res) => {
  const lead = store.get(req.params.id);
  if (!lead) {
    return res.status(404).json({ error: "Lead not found" });
  }
  res.json(lead);
});

// POST /leads - create a new lead
router.post("/", (req, res) => {
  const errors = validateLeadInput(req.body);
  if (errors.length) {
    return res.status(400).json({ errors });
  }

  const lead = {
    id: crypto.randomUUID(),
    name: req.body.name.trim(),
    product: req.body.product || "General",
    source: typeof req.body.source === "string" ? req.body.source.trim() : "",
    stage: req.body.stage || "New lead",
    next: typeof req.body.next === "string" ? req.body.next.trim() : "",
    owner: typeof req.body.owner === "string" ? req.body.owner.trim() : "",
    notes: typeof req.body.notes === "string" ? req.body.notes.trim() : "",
    createdAt: new Date().toISOString(),
  };

  store.create(lead);
  res.status(201).json(lead);
});

// PATCH /leads/:id - update an existing lead
router.patch("/:id", (req, res) => {
  const errors = validateLeadInput({ name: "placeholder", ...req.body });
  if (errors.length) {
    return res.status(400).json({ errors });
  }

  const updated = store.update(req.params.id, req.body);
  if (!updated) {
    return res.status(404).json({ error: "Lead not found" });
  }
  res.json(updated);
});

// DELETE /leads/:id
router.delete("/:id", (req, res) => {
  const removed = store.remove(req.params.id);
  if (!removed) {
    return res.status(404).json({ error: "Lead not found" });
  }
  res.status(204).send();
});

module.exports = router;
