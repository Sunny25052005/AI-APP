// test.mjs v2 — covers all v2 improvements
// Run with: node test.mjs

const BASE = 'http://localhost:3001';

const c = {
  cyan:   (s) => `\x1b[36m${s}\x1b[0m`,
  green:  (s) => `\x1b[32m${s}\x1b[0m`,
  yellow: (s) => `\x1b[33m${s}\x1b[0m`,
  red:    (s) => `\x1b[31m${s}\x1b[0m`,
  bold:   (s) => `\x1b[1m${s}\x1b[0m`,
  dim:    (s) => `\x1b[2m${s}\x1b[0m`,
};

let passed = 0, failed = 0;

async function req(method, path, body) {
  const opts = { method, headers: { 'Content-Type': 'application/json' } };
  if (body !== undefined) opts.body = JSON.stringify(body);
  const res = await fetch(`${BASE}${path}`, opts);
  const json = await res.json().catch(() => ({}));
  return { status: res.status, json };
}

function assert(label, actual, expected) {
  const ok = actual === expected;
  if (ok) {
    console.log(c.green(`    ✅ ${label}`));
    passed++;
  } else {
    console.log(c.red(`    ❌ ${label}`));
    console.log(c.dim(`       expected: ${JSON.stringify(expected)}`));
    console.log(c.dim(`       received: ${JSON.stringify(actual)}`));
    failed++;
  }
}

function section(title) {
  console.log(c.cyan(`\n  ◆ ${title}`));
}

async function run() {
  console.log(c.bold('\n══════════════════════════════════════════════'));
  console.log(c.bold('  Config-Driven Backend — Test Suite v2'));
  console.log(c.bold('══════════════════════════════════════════════'));

  // ── HEALTH ─────────────────────────────────────────────────────────────────
  section('Health Check');
  const h = await req('GET', '/health');
  assert('status 200', h.status, 200);
  assert('has users',    h.json.entities?.includes('users'),    true);
  assert('has products', h.json.entities?.includes('products'), true);
  assert('has orders',   h.json.entities?.includes('orders'),   true);

  // ── HAPPY PATH: CREATE ─────────────────────────────────────────────────────
  section('POST /api/users — valid body');
  const cr = await req('POST', '/api/users', { name: 'Alice', email: 'alice@test.com' });
  assert('status 201',       cr.status,              201);
  assert('name set',         cr.json.name,            'Alice');
  assert('email set',        cr.json.email,           'alice@test.com');
  assert('id is string',     typeof cr.json.id,       'string');
  assert('has createdAt',    typeof cr.json.createdAt, 'string');
  const userId = cr.json.id;

  // ── HAPPY PATH: READ ───────────────────────────────────────────────────────
  section('GET /api/users — list');
  const lst = await req('GET', '/api/users');
  assert('status 200',  lst.status,        200);
  assert('count 1',     lst.json.count,    1);

  section('GET /api/users/:id — by id');
  const one = await req('GET', `/api/users/${userId}`);
  assert('status 200',  one.status,        200);
  assert('id matches',  one.json.id,       userId);

  // ── HAPPY PATH: FULL UPDATE ────────────────────────────────────────────────
  section('PUT /api/users/:id — full update');
  const put = await req('PUT', `/api/users/${userId}`, { name: 'Alice Updated', email: 'alice@test.com' });
  assert('status 200',       put.status,          200);
  assert('name updated',     put.json.name,       'Alice Updated');
  assert('id preserved',     put.json.id,         userId);
  assert('updatedAt changed',put.json.updatedAt !== put.json.createdAt, true);

  // ── HAPPY PATH: PATCH ──────────────────────────────────────────────────────
  section('PATCH /api/users/:id — partial update (name only)');
  const patch = await req('PATCH', `/api/users/${userId}`, { name: 'Alice Patched' });
  assert('status 200',        patch.status,          200);
  assert('name patched',      patch.json.name,       'Alice Patched');
  assert('email untouched',   patch.json.email,      'alice@test.com');

  // ── HAPPY PATH: PRODUCT (typed fields) ────────────────────────────────────
  section('POST /api/products — full-form entity with types');
  const prod = await req('POST', '/api/products', { title: 'Widget', price: 9.99 });
  assert('status 201',   prod.status,        201);
  assert('title set',    prod.json.title,    'Widget');
  assert('price set',    prod.json.price,    9.99);
  const prodId = prod.json.id;

  // ── EDGE: UNKNOWN FIELD → rejected ────────────────────────────────────────
  section('POST /api/users — unknown field "age" → 400');
  const unk = await req('POST', '/api/users', { name: 'Bob', email: 'b@b.com', age: 30 });
  assert('status 400',                unk.status,                     400);
  assert('error is Validation Error', unk.json.error,                 'Validation Error');
  assert('detail mentions "age"',     unk.json.details?.[0]?.field,   'age');

  // ── EDGE: MISSING REQUIRED FIELD ──────────────────────────────────────────
  section('POST /api/users — missing "email" → 400');
  const miss = await req('POST', '/api/users', { name: 'Bob' });
  assert('status 400',              miss.status,                    400);
  assert('error is Validation Error', miss.json.error,              'Validation Error');
  assert('detail mentions email',   miss.json.details?.[0]?.field,  'email');

  // ── EDGE: WRONG TYPE ──────────────────────────────────────────────────────
  section('POST /api/products — price as string instead of number → 400');
  const wrongType = await req('POST', '/api/products', { title: 'Bad', price: 'free' });
  assert('status 400',                  wrongType.status,                   400);
  assert('error is Validation Error',   wrongType.json.error,               'Validation Error');
  assert('detail mentions "price"',     wrongType.json.details?.[0]?.field, 'price');

  // ── EDGE: MULTIPLE ERRORS IN ONE RESPONSE ─────────────────────────────────
  section('POST /api/products — multiple errors returned at once');
  const multi = await req('POST', '/api/products', { title: 123, hack: true });
  assert('status 400',       multi.status,            400);
  // expects: title wrong type, price missing, hack unknown = 3 errors
  assert('3 errors returned', multi.json.details?.length, 3);

  // ── EDGE: EMPTY PATCH BODY ────────────────────────────────────────────────
  section('PATCH /api/users/:id — empty body → 400');
  const emptyPatch = await req('PATCH', `/api/users/${userId}`, {});
  assert('status 400',       emptyPatch.status,       400);
  assert('error Bad Request', emptyPatch.json.error,  'Bad Request');

  // ── EDGE: PATCH unknown field → 400 ──────────────────────────────────────
  section('PATCH /api/users/:id — unknown field in patch → 400');
  const patchUnk = await req('PATCH', `/api/users/${userId}`, { role: 'admin' });
  assert('status 400',               patchUnk.status,                   400);
  assert('detail mentions "role"',   patchUnk.json.details?.[0]?.field, 'role');

  // ── EDGE: NOT FOUND ───────────────────────────────────────────────────────
  section('GET /api/users/bad-id → 404');
  const nf = await req('GET', '/api/users/bad-id-999');
  assert('status 404',       nf.status,    404);
  assert('error Not Found',  nf.json.error,'Not Found');

  // ── EDGE: UNKNOWN ENTITY ──────────────────────────────────────────────────
  section('GET /api/doesnotexist → 404');
  const ue = await req('GET', '/api/doesnotexist');
  assert('status 404',   ue.status,   404);

  // ── HAPPY PATH: DELETE ─────────────────────────────────────────────────────
  section('DELETE /api/users/:id → 200');
  const del = await req('DELETE', `/api/users/${userId}`);
  assert('status 200',     del.status,   200);
  assert('id matches',     del.json.id,  userId);

  section('GET /api/users/:id after delete → 404');
  const gone = await req('GET', `/api/users/${userId}`);
  assert('status 404',     gone.status,  404);

  // ── SCHEMA RETURNED ON VALIDATION ERROR ───────────────────────────────────
  section('Validation error response includes schema hint');
  const hint = await req('POST', '/api/products', {});
  assert('has schema array',  Array.isArray(hint.json.schema),   true);
  assert('schema has title',  hint.json.schema?.some(f => f.name === 'title'), true);
  assert('schema has price',  hint.json.schema?.some(f => f.name === 'price'), true);

  // ── DELETE PRODUCT ────────────────────────────────────────────────────────
  section('DELETE /api/products/:id');
  const delProd = await req('DELETE', `/api/products/${prodId}`);
  assert('status 200',   delProd.status,   200);

  // ── SUMMARY ───────────────────────────────────────────────────────────────
  console.log(c.bold('\n══════════════════════════════════════════════'));
  const total = passed + failed;
  if (failed === 0) {
    console.log(c.green(`  All ${total} tests passed ✅`));
  } else {
    console.log(c.red(`  ${failed}/${total} tests FAILED ❌`));
  }
  console.log(c.bold('══════════════════════════════════════════════\n'));
  if (failed > 0) process.exit(1);
}

run().catch((err) => {
  console.error(c.red('\n💥 Test runner crashed:'), err.message);
  process.exit(1);
});
