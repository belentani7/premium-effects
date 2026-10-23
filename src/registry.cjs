"use strict";
const fs = require("node:fs");
const path = require("node:path");

const DEFAULT_CATALOG = path.resolve(__dirname, "..", "catalog.json");
const repoPattern = /^[A-Za-z0-9_.-]+\/[A-Za-z0-9_.-]+$/;

function normalize(value) {
  return String(value ?? "").normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim();
}

function validateCatalog(data) {
  if (!data || data.schemaVersion !== 1 || !Array.isArray(data.entries)) {
    throw new TypeError("Invalid premium-effects catalog schema");
  }
  const ids = new Set();
  for (const entry of data.entries) {
    if (!entry || typeof entry.id !== "string" || !/^[a-z0-9-]+$/.test(entry.id) ||
        typeof entry.name !== "string" || !repoPattern.test(entry.repo) ||
        typeof entry.category !== "string" || !Array.isArray(entry.tags) ||
        entry.tags.some(tag => typeof tag !== "string") ||
        typeof entry.useFor !== "string" || ids.has(entry.id)) {
      throw new TypeError("Invalid or duplicate catalog entry");
    }
    ids.add(entry.id);
  }
  return data;
}

function loadCatalog(file = DEFAULT_CATALOG) {
  return validateCatalog(JSON.parse(fs.readFileSync(file, "utf8")));
}

function searchEntries(entries, query = "", options = {}) {
  if (!Array.isArray(entries)) throw new TypeError("Expected entries array");
  const q = normalize(query);
  if (q.length > 200) throw new RangeError("Query exceeds 200 characters");
  const tokens = q.split(/\s+/).filter(Boolean);
  const category = options.category ? normalize(options.category) : "";
  const limit = options.limit ?? 10;
  if (!Number.isSafeInteger(limit) || limit < 1 || limit > 100) {
    throw new RangeError("Limit must be an integer from 1 to 100");
  }
  return entries
    .filter(entry => !category || normalize(entry.category) === category)
    .map(entry => {
      const normalizedTags = entry.tags.map(normalize);
      const display = normalize([entry.name, entry.repo, entry.category, entry.useFor, ...entry.tags].join(" "));
      if (tokens.some(token => !display.includes(token))) return null;
      const score = tokens.reduce((total, token) => {
        return total + (normalizedTags.includes(token) ? 5 : 0) +
          (normalize(entry.name).includes(token) ? 3 : 0) +
          (normalize(entry.category).includes(token) ? 2 : 0) +
          (normalize(entry.repo).includes(token) ? 1 : 0);
      }, 0);
      return { ...entry, url: `https://github.com/${entry.repo}`, score };
    })
    .filter(Boolean)
    .sort((a,b) => b.score - a.score || a.id.localeCompare(b.id))
    .slice(0, limit);
}

function categories(entries) {
  const count = new Map();
  for (const entry of entries) count.set(entry.category, (count.get(entry.category) || 0) + 1);
  return [...count].sort(([a],[b])=>a.localeCompare(b)).map(([name,total])=>({name,total}));
}

module.exports = { normalize, validateCatalog, loadCatalog, searchEntries, categories };
