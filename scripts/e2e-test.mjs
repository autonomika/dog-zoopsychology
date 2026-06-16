#!/usr/bin/env node
/**
 * E2E smoke test — запуск: npm run test:e2e
 * Требует dev-сервер на BASE_URL (по умолчанию http://localhost:3000)
 */

const BASE = process.env.BASE_URL || "http://localhost:3000";
const cookieJar = new Map();

function parseSetCookie(headers) {
  const raw = headers.getSetCookie?.() ?? [];
  for (const line of raw) {
    const [pair] = line.split(";");
    const eq = pair.indexOf("=");
    if (eq > 0) cookieJar.set(pair.slice(0, eq), pair.slice(eq + 1));
  }
}

function cookieHeader() {
  return [...cookieJar.entries()].map(([k, v]) => `${k}=${v}`).join("; ");
}

async function req(method, path, body) {
  const res = await fetch(`${BASE}${path}`, {
    method,
    headers: {
      "Content-Type": "application/json",
      ...(cookieJar.size ? { Cookie: cookieHeader() } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
    redirect: "manual",
  });
  parseSetCookie(res.headers);
  let data = null;
  const text = await res.text();
  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    data = text;
  }
  return { status: res.status, data };
}

function assert(cond, msg) {
  if (!cond) throw new Error(`FAIL: ${msg}`);
}

function ok(msg) {
  console.log(`  ✓ ${msg}`);
}

async function main() {
  console.log(`\n🐕 E2E test → ${BASE}\n`);
  const email = `e2e-${Date.now()}@test.local`;
  const password = "test123456";

  // Pages
  for (const path of ["/", "/register", "/login"]) {
    const r = await fetch(`${BASE}${path}`);
    assert(r.status === 200, `GET ${path} → ${r.status}`);
    ok(`GET ${path} → 200`);
  }

  // Register
  let r = await req("POST", "/api/auth/register", {
    email,
    password,
    name: "E2E User",
  });
  assert(r.status === 200 && r.data.ok, `register → ${JSON.stringify(r.data)}`);
  ok("register");

  // Dashboard redirects to /assessment if no profile yet
  r = await req("GET", "/dashboard");
  assert(r.status === 307 || r.status === 200, `dashboard/new user → ${r.status}`);
  ok("dashboard (new user → assessment redirect or ok)");

  // Assessment page
  r = await req("GET", "/assessment");
  assert(r.status === 200, `assessment → ${r.status}`);
  ok("assessment page");

  // Submit assessment
  r = await req("POST", "/api/assessment/submit", {
    dogName: "Барсик",
    dogBreed: "Метис",
    dogAge: "3 года",
    answers: { q1: "a", q2: "b", q3: "c", q4: "d", q5: "a", q6: "b", q7: "c", q8: "d" },
  });
  assert(r.status === 200 && r.data.primaryType, `assessment submit → ${JSON.stringify(r.data)}`);
  ok(`behavior type: ${r.data.primaryType.title}`);

  // Intro test
  r = await req("POST", "/api/test/submit", {
    moduleId: "intro",
    answers: { q1: "b", q2: "b", q3: "b", q4: "b", q5: "b" },
  });
  assert(r.status === 200 && r.data.score === 5, `intro score → ${r.data?.score}`);
  ok("intro test 5/5");

  // Locked module
  r = await req("POST", "/api/test/submit", {
    moduleId: "stress",
    answers: { q1: "b", q2: "b", q3: "b", q4: "b", q5: "b" },
  });
  assert(r.status === 403, `stress locked → ${r.status}`);
  ok("stress blocked without payment");

  // Demo unlock
  r = await req("POST", "/api/demo-unlock");
  assert(r.status === 200 && r.data.ok, `demo-unlock → ${JSON.stringify(r.data)}`);
  ok("demo-unlock");

  // After unlock — spot-check first paid module
  r = await req("POST", "/api/test/submit", {
    moduleId: "stress",
    answers: { q1: "b", q2: "b", q3: "b", q4: "b", q5: "b" },
  });
  assert(r.status === 200, `stress after unlock → ${r.status}`);
  ok(`stress test ${r.data.score}/${r.data.maxScore}`);

  // Logout
  r = await req("POST", "/api/auth/logout");
  assert(r.status === 200, `logout → ${r.status}`);
  ok("logout");

  // Dashboard redirect
  r = await req("GET", "/dashboard");
  assert(r.status === 307 || r.status === 302, `dashboard after logout → ${r.status}`);
  ok("dashboard redirects when logged out");

  // Login
  cookieJar.clear();
  r = await req("POST", "/api/auth/login", { email, password });
  assert(r.status === 200 && r.data.ok, `login → ${JSON.stringify(r.data)}`);
  ok("login");

  // Duplicate register (generic error, no email enumeration)
  r = await req("POST", "/api/auth/register", { email, password, name: "Dup" });
  assert(r.status === 400, `duplicate → ${r.status}`);
  ok("duplicate email rejected");

  // Bad login
  cookieJar.clear();
  r = await req("POST", "/api/auth/login", { email: "x@y.z", password: "wrong1" });
  assert(r.status === 401, `bad login → ${r.status}`);
  ok("bad login rejected");

  console.log("\n✅ All tests passed\n");
}

main().catch((e) => {
  console.error(`\n❌ ${e.message}\n`);
  process.exit(1);
});
