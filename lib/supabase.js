import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://npmufrdvincxfukxjizg.supabase.co'
const supabaseAnonKey = 'sb_publishable_owKbG_XMw8xsp3K-pBSRDQ_IxAYvYZS'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
