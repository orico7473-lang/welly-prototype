import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.76.1'

const headers = { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Headers': 'authorization, apikey, content-type, x-client-info', 'Access-Control-Allow-Methods': 'POST, OPTIONS', 'Content-Type': 'application/json' }
const reply = (status: number, error?: string) => new Response(JSON.stringify(error ? { error } : { success: true }), { status, headers })

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers })
  if (req.method !== 'POST') return reply(405, 'Method not allowed')
  try {
    const auth = req.headers.get('Authorization') || ''
    if (!auth.startsWith('Bearer ')) return reply(401, 'Please sign in again.')
    const url = Deno.env.get('SUPABASE_URL')!
    const anon = Deno.env.get('SUPABASE_ANON_KEY')!
    const service = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const userClient = createClient(url, anon, { global: { headers: { Authorization: auth } }, auth: { persistSession: false } })
    const { data: { user }, error: authError } = await userClient.auth.getUser(auth.slice(7))
    if (authError || !user) return reply(401, 'Please sign in again.')
    const input = await req.json().catch(() => ({}))
    if (input.confirmation !== 'DELETE') return reply(400, 'Type DELETE to confirm.')
    const signedIn = Date.parse(user.last_sign_in_at || '')
    if (!Number.isFinite(signedIn) || Date.now() - signedIn > 15 * 60 * 1000) return reply(403, 'Please sign out and sign in again before deleting your account.')
    const { data: isAdmin, error: adminError } = await userClient.rpc('is_welly_admin')
    if (adminError) return reply(500, 'Unable to check account permissions.')
    if (isAdmin) return reply(403, 'Administrator accounts cannot be deleted here. Please contact the site owner.')
    const { data: objects, error: listError } = await userClient.rpc('account_deletion_objects')
    if (listError || !Array.isArray(objects)) return reply(500, 'Unable to check account files.')
    const allowed = new Set(['welly-reviews', 'welly-avatars'])
    if (objects.some(o => !allowed.has(o.bucket_id) || !o.name.startsWith(user.id + '/'))) return reply(409, 'This account owns shared files. Please contact the site owner for help deleting it.')
    const admin = createClient(url, service, { auth: { persistSession: false } })
    for (const bucket of allowed) {
      const paths = objects.filter(o => o.bucket_id === bucket).map(o => o.name)
      for (let i = 0; i < paths.length; i += 100) {
        const { error } = await admin.storage.from(bucket).remove(paths.slice(i, i + 100))
        if (error) return reply(500, 'Could not remove all account files. Please try again or contact the site owner.')
      }
    }
    const { error } = await admin.auth.admin.deleteUser(user.id)
    if (error) return reply(500, 'Could not delete the account. Some account files may already have been removed; please contact the site owner.')
    return reply(200)
  } catch (_error) {
    return reply(500, 'Unable to delete the account. Please try again or contact the site owner.')
  }
})

