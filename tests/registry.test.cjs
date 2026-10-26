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

test("catalog rejects unsafe GitHub paths, duplicate repos and terminal controls", () => {
  const sample = entries[0];
  const invalid = [
    { ...sample, repo: "../.." },
    { ...sample, repo: "owner/.." },
    { ...sample, repo: "-bad/repo" },
    { ...sample, name: "\x1b[31mSpoofed" },
    { ...sample, useFor: "line\nspoof" },
    { ...sample, tags: ["\u0007bell"] },
    { ...sample, category: "../shaders" },
    { ...sample, name: "  " },
  ];
  for (const entry of invalid) {
    assert.throws(() => validateCatalog({ schemaVersion: 1, entries: [entry] }), /Invalid or duplicate/);
  }
  assert.throws(() => validateCatalog({
    schemaVersion: 1,
    entries: [sample, { ...sample, id: "other", repo: sample.repo.toUpperCase() }],
  }), /Invalid or duplicate/);
});

test("CLI rejects missing category and conflicting modes instead of silently succeeding", () => {
  for (const args of [
    ["--category", "--json"],
    ["--category", "--limit", "2"],
    ["--categories", "shaders"],
    ["--categories", "--limit", "1"],
    ["--categories", "--category", "shaders"],
    ["--limit", "101"],
  ]) {
    const result = spawnSync(process.execPath, [cli, ...args], { encoding: "utf8" });
    assert.equal(result.status, 2, `${args.join(" ")} unexpectedly succeeded`);
    assert.match(result.stderr, /requires a category|cannot be combined|Limit must be/);
  }
});

test("CLI supports JSON category listing and literal dash-prefixed query", () => {
  const result = spawnSync(process.execPath, [cli, "--categories", "--json"], { encoding: "utf8" });
  assert.equal(result.status, 0, result.stderr);
  assert.equal(JSON.parse(result.stdout).reduce((sum, row) => sum + row.total, 0), entries.length);
  const literal = spawnSync(process.execPath, [cli, "--", "-shader"], { encoding: "utf8" });
  assert.equal(literal.status, 0, literal.stderr);
  assert.match(literal.stdout, /No verified matching references/);
});

test("package skill metadata does not advertise nonexistent 50+ entries", () => {
  const pkg = require("../package.json");
  assert.doesNotMatch(pkg.skills.description, /50\+/);
});
