"use strict";
const test = require("node:test");
const assert = require("node:assert/strict");
const { spawnSync } = require("node:child_process");
const path = require("node:path");
const { loadCatalog, validateCatalog, searchEntries, categories, normalize } = require("../src/registry.cjs");

const catalog = loadCatalog();
const entries = catalog.entries;
const cli = path.resolve(__dirname, "..", "bin", "effects.cjs");

test("real registry contains 11 unique, well-formed verified references", () => {
  assert.equal(entries.length, 11);
  assert.equal(new Set(entries.map(x=>x.id)).size, entries.length);
  assert.equal(catalog.schemaVersion, 1);
  assert.match(catalog.verifiedAt, /^\d{4}-\d{2}-\d{2}$/);
  entries.forEach(row => assert.match(row.repo,/^[A-Za-z0-9_.-]+\/[A-Za-z0-9_.-]+$/));
});

test("catalog rejects duplicate identifiers and malformed records", () => {
  assert.throws(() => validateCatalog({...catalog,entries:[...entries,entries[0]]}), /Invalid or duplicate/);
  assert.throws(() => validateCatalog({schemaVersion:2, entries:[]}), /Invalid/);
});

test("search understands Spanish accents, case and multiple words", () => {
  assert.ok(searchEntries(entries,"partículas").some(x=>x.id==="particlesjs"));
  assert.ok(searchEntries(entries,"GLSL noise").some(x=>x.id==="webgl-noise"));
  assert.ok(searchEntries(entries,"liquid metal").some(x=>x.id==="metal-flow"));
  assert.equal(normalize("Animación"),"animacion");
});

test("category and limit filters are deterministic", () => {
  const rows=searchEntries(entries,"",{category:"shaders",limit:1});
  assert.equal(rows.length,1);
  assert.equal(rows[0].category,"shaders");
  assert.throws(()=>searchEntries(entries,"",{limit:0}),/Limit/);
  assert.throws(()=>searchEntries(entries,"a".repeat(201)),/exceeds/);
  assert.equal(searchEntries(entries,"not-a-real-category").length,0);
});

test("categories include a count for every indexed entry", () => {
  assert.equal(categories(entries).reduce((sum,x)=>sum+x.total,0),entries.length);
});

test("CLI outputs JSON search results offline", () => {
  const p=spawnSync(process.execPath,[cli,"glsl","--json"],{encoding:"utf8"});
  assert.equal(p.status,0,p.stderr);
  const items=JSON.parse(p.stdout);
  assert.ok(items.some(x=>x.id==="webgl-noise"));
  assert.ok(items.every(x=>x.url.startsWith("https://github.com/")));
});

test("CLI fails closed on malformed flags", () => {
  const p=spawnSync(process.execPath,[cli,"--limit","0"],{encoding:"utf8"});
  assert.equal(p.status,2);
  assert.match(p.stderr,/Limit must be/);
});
