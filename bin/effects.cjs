#!/usr/bin/env node
"use strict";
const { loadCatalog, searchEntries, categories } = require("../src/registry.cjs");

function usage() {
  return [
    "Premium Effects Registry — offline lookup of verified public GitHub projects",
    "Usage: effects [query words] [--category name] [--limit N] [--json]",
    "       effects --categories [--json] | --help",
    "       effects -- [literal query starting with a dash]",
    "Examples: effects liquid metal; effects glsl --json; effects --category shaders",
  ].join("\n");
}

function parse(args) {
  let category, limit = 10, json = false, showCategories = false, hasLimit = false;
  let literalQuery = false;
  const query = [];
  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    if (literalQuery) query.push(arg);
    else if (arg === "--") literalQuery = true;
    else if (arg === "--json") json = true;
    else if (arg === "--categories") showCategories = true;
    else if (arg === "--help" || arg === "-h") return { help: true };
    else if (arg === "--category") {
      const next = args[i + 1];
      if (!next || next.startsWith("-")) throw new Error("--category requires a category");
      category = next;
      i++;
    }
    else if (arg === "--limit") {
      const next = args[i + 1];
      if (!next || !/^[0-9]+$/.test(next)) throw new Error("--limit requires a positive integer");
      limit = Number(next);
      if (!Number.isSafeInteger(limit) || limit < 1 || limit > 100) {
        throw new RangeError("Limit must be an integer from 1 to 100");
      }
      hasLimit = true;
      i++;
    }
    else if (arg.startsWith("-")) throw new Error(`Unknown option: ${arg}`);
    else query.push(arg);
  }
  if (showCategories && (query.length || category !== undefined || hasLimit)) {
    throw new Error("--categories cannot be combined with query or filters");
  }
  return { query: query.join(" "), category, limit, json, showCategories };
}

function main(args=process.argv.slice(2)) {
  try {
    const options=parse(args);
    if (options.help) { console.log(usage()); return 0; }
    const data=loadCatalog();
    if (options.showCategories) {
      const list=categories(data.entries);
      console.log(options.json ? JSON.stringify(list,null,2) : list.map(({name,total})=>`${name}: ${total}`).join("\n"));
      return 0;
    }
    const matches=searchEntries(data.entries,options.query,options);
    if (options.json) console.log(JSON.stringify(matches,null,2));
    else if (!matches.length) console.log("No verified matching references.");
    else console.log(matches.map(item=>`${item.name} [${item.category}]\n  ${item.url}\n  ${item.useFor}`).join("\n\n"));
    return 0;
  } catch(error) {
    console.error(`effects: ${error.message}`);
    console.error(usage());
    return 2;
  }
}

if (require.main === module) process.exitCode=main();
module.exports={ parse, main };
