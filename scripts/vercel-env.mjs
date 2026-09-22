#!/usr/bin/env node
// Sync environment variables from a local env file into a Vercel project.
// Values are piped to the Vercel CLI over stdin and are never printed or logged.
//
//   node scripts/vercel-env.mjs                      push .env to all 3 environments
//   node scripts/vercel-env.mjs --env production     push to production only
//   node scripts/vercel-env.mjs --file .env.local    push a different file
//   node scripts/vercel-env.mjs --dry-run            list the keys, change nothing
//   node scripts/vercel-env.mjs --self-test          check the parser

import { existsSync, readFileSync } from "node:fs";
import { spawnSync } from "node:child_process";

const ENVIRONMENTS = ["production", "preview", "development"];
const VERCEL = process.env.VERCEL_BIN || "vercel";

// KEY=value, with optional surrounding quotes. Comments and blank lines are skipped.
export function parseEnvFile(text) {
  const entries = [];
  for (const line of text.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;

    const match = trimmed.match(/^(?:export\s+)?([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)$/);
    if (!match) continue;

    const [, key, rawValue] = match;
    const value = rawValue.replace(/^(['"])(.*)\1$/, "$2");
    if (value) entries.push({ key, value });
  }
  return entries;
}

function flag(name, fallback) {
  const index = process.argv.indexOf(name);
  return index === -1 ? fallback : process.argv[index + 1];
}

function run(args, input) {
  // shell: true is needed for vercel.cmd on Windows. Values travel on stdin, never in argv.
  return spawnSync(VERCEL, args, { input, shell: true, encoding: "utf8" });
}

function selfTest() {
  const parsed = parseEnvFile(
    ["# comment", "", "PLAIN=value", 'QUOTED="has=equals"', "export EXPORTED=ok", "EMPTY=", "not a var"].join("\n")
  );
  const asString = parsed.map((e) => `${e.key}:${e.value}`).join(",");
  const expected = "PLAIN:value,QUOTED:has=equals,EXPORTED:ok";
  if (asString !== expected) throw new Error(`parser broken: got ${asString}`);
  console.log("parser ok");
}

function main() {
  if (process.argv.includes("--self-test")) return selfTest();

  const file = flag("--file", ".env");
  const targets = flag("--env", ENVIRONMENTS.join(",")).split(",");
  const dryRun = process.argv.includes("--dry-run");

  const unknown = targets.filter((t) => !ENVIRONMENTS.includes(t));
  if (unknown.length) {
    console.error(`Unknown environment: ${unknown.join(", ")}. Use ${ENVIRONMENTS.join(", ")}.`);
    process.exit(1);
  }

  if (!existsSync(file)) {
    console.error(`${file} not found. Copy .env.example to ${file} and fill it in first.`);
    process.exit(1);
  }

  const entries = parseEnvFile(readFileSync(file, "utf8"));
  if (!entries.length) {
    console.error(`${file} holds no variables with a value.`);
    process.exit(1);
  }

  console.log(`${entries.length} variables from ${file} -> ${targets.join(", ")}`);

  if (dryRun) {
    for (const { key } of entries) console.log(`  ${key}`);
    return;
  }

  let failed = 0;
  for (const { key, value } of entries) {
    for (const target of targets) {
      // Remove first: vercel env add refuses a name that already exists in that environment.
      run(["env", "rm", key, target, "--yes"]);
      const added = run(["env", "add", key, target], value);

      if (added.status === 0) {
        console.log(`  ${key} -> ${target}`);
      } else {
        failed++;
        // stderr can echo the value back, so it is redacted before anything is printed.
        const reason = (added.stderr || added.stdout || "no output from the CLI")
          .split(value).join("***")
          .trim()
          .split(/\r?\n/)
          .slice(0, 3)
          .join(" ");
        console.error(`  ${key} -> ${target} FAILED: ${reason}`);
      }
    }
  }

  if (failed) {
    console.error(`${failed} variable(s) failed. Run "${VERCEL} link" if the project is not linked yet.`);
    process.exit(1);
  }
  console.log("Done. Redeploy for the new values to take effect.");
}

main();
