const fs = require('node:fs');
const vm = require('node:vm');
const ts = require('typescript');
const assert = require('node:assert/strict');
const source = fs.readFileSync('supabase/functions/delete-own-account/index.ts', 'utf8').replace(/^import .*\n/, '');
const compiled = ts.transpileModule(source, { compilerOptions: { target: ts.ScriptTarget.ES2022 } }).outputText;

async function run(options = {}) {
  let handler, removed = [], deleted = [];
  const user = { id: 'user-1', last_sign_in_at: new Date().toISOString(), ...options.user };
  const client = { auth: { getUser: async () => options.invalid ? { data: { user: null }, error: true } : { data: { user }, error: null } }, rpc: async name => name === 'is_welly_admin' ? { data: !!options.admin, error: null } : { data: options.objects || [], error: null } };
  const admin = { storage: { from: bucket => ({ remove: async paths => { removed.push({ bucket, paths }); return { error: options.storageError || null }; } }) }, auth: { admin: { deleteUser: async id => { deleted.push(id); return { error: null }; } } } };
  const context = { Response, Set, Date, JSON, Number, Deno: { env: { get: key => key }, serve: fn => { handler = fn; } }, createClient: (_url, key) => key === 'SUPABASE_SERVICE_ROLE_KEY' ? admin : client };
  vm.runInNewContext(compiled, context);
  const request = { method: 'POST', headers: new Headers(options.noAuth ? {} : { Authorization: 'Bearer test' }), json: async () => ({ confirmation: options.confirmation ?? 'DELETE' }) };
  const result = await handler(request);
  return { status: result.status, removed, deleted };
}
(async () => {
  assert.equal((await run({ noAuth: true })).status, 401);
  assert.equal((await run({ invalid: true })).status, 401);
  assert.equal((await run({ confirmation: 'no' })).status, 400);
  assert.equal((await run({ user: { last_sign_in_at: '2020-01-01T00:00:00Z' } })).status, 403);
  assert.equal((await run({ admin: true })).status, 403);
  assert.equal((await run({ objects: [{ bucket_id: 'site-media', name: 'user-1/shared.jpg' }] })).status, 409);
  assert.equal((await run({ objects: [{ bucket_id: 'welly-reviews', name: 'other/person.jpg' }] })).status, 409);
  const good = await run({ objects: [{ bucket_id: 'welly-reviews', name: 'user-1/photo.jpg' }] });
  assert.equal(good.status, 200); assert.deepEqual(good.deleted, ['user-1']); assert.equal(good.removed.length, 1);
  const failure = await run({ objects: [{ bucket_id: 'welly-reviews', name: 'user-1/photo.jpg' }], storageError: true });
  assert.equal(failure.status, 500); assert.equal(failure.deleted.length, 0);
  console.log('Account deletion authorization and safeguards passed.');
})().catch(error => { console.error(error); process.exitCode = 1; });

