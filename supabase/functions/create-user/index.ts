import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    )

    // Get the authorization header from the request
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      throw new Error('No authorization header')
    }

    // Verify the user making the request
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? ''
    )

    const { data: { user }, error: authError } = await supabaseClient.auth.getUser(
      authHeader.replace('Bearer ', '')
    )

    if (authError || !user) {
      throw new Error('Unauthorized')
    }

    // Check if user has admin or manager role
    const { data: userRoles, error: roleError } = await supabaseAdmin
      .from('user_roles')
      .select('role')
      .eq('user_id', user.id)

    if (roleError) {
      throw new Error('Error checking user roles')
    }

    const hasPermission = userRoles?.some(r => r.role === 'admin' || r.role === 'manager')
    if (!hasPermission) {
      throw new Error('Insufficient permissions')
    }

    const { email, name, role, parentName, studentName, studentAge, eventId } = await req.json()

    if (!email || !name || !role) {
      throw new Error('Missing required fields')
    }

    if (role !== 'parent' && role !== 'student' && role !== 'parent-student') {
      throw new Error('Invalid role')
    }

    // Validate parent-student pair if creating one
    if (role === 'parent-student' && (!parentName || !studentName || !eventId)) {
      throw new Error('Parent name, student name and eventId are required for parent-student pairs')
    }

    // Generate simple password
    const generatePassword = () => {
      const chars = 'abcdefghijklmnopqrstuvwxyz0123456789'
      let password = ''
      for (let i = 0; i < 8; i++) {
        password += chars.charAt(Math.floor(Math.random() * chars.length))
      }
      return password
    }

    const password = generatePassword()

    // Create user in auth
    const { data: newUser, error: createError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: {
        full_name: name
      }
    })

    if (createError) {
      throw createError
    }

// Create or update profile (id is PK)
const { error: profileError } = await supabaseAdmin
  .from('profiles')
  .upsert(
    [
      {
        id: newUser.user.id,
        email: email,
        full_name: name
      }
    ],
    { onConflict: 'id' }
  )

if (profileError) {
  // Log but do not delete the auth user for id conflicts
  console.error('Profile upsert error:', profileError.message)
  throw profileError
}

// Assign roles
if (role === 'parent-student') {
  // Create both parent and student roles
  const { error: parentRoleError } = await supabaseAdmin
    .from('user_roles')
    .upsert(
      [
        {
          user_id: newUser.user.id,
          role: 'parent'
        }
      ],
      { onConflict: 'user_id,role' }
    )

  if (parentRoleError) {
    await supabaseAdmin.auth.admin.deleteUser(newUser.user.id)
    throw parentRoleError
  }

  const { error: studentRoleError } = await supabaseAdmin
    .from('user_roles')
    .upsert(
      [
        {
          user_id: newUser.user.id,
          role: 'student'
        }
      ],
      { onConflict: 'user_id,role' }
    )

  if (studentRoleError) {
    await supabaseAdmin.auth.admin.deleteUser(newUser.user.id)
    throw studentRoleError
  }

  // Create parent-student pair record
  const { error: pairError } = await supabaseAdmin
    .from('parent_student_pairs')
    .insert([
      {
        user_id: newUser.user.id,
        parent_name: parentName,
        student_name: studentName,
        student_age: studentAge,
        event_id: eventId
      }
    ])

  if (pairError) {
    await supabaseAdmin.auth.admin.deleteUser(newUser.user.id)
    throw pairError
  }
} else {
  // Assign single role (avoid duplicate on same role)
  const { error: roleInsertError } = await supabaseAdmin
    .from('user_roles')
    .upsert(
      [
        {
          user_id: newUser.user.id,
          role: role
        }
      ],
      { onConflict: 'user_id,role' }
    )

  if (roleInsertError) {
    // If role assignment fails, clean up auth user for consistency
    await supabaseAdmin.auth.admin.deleteUser(newUser.user.id)
    throw roleInsertError
  }
}

    return new Response(
      JSON.stringify({
        success: true,
        user: {
          id: newUser.user.id,
          email,
          name,
          role,
          password
        }
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    )

  } catch (error) {
    return new Response(
      JSON.stringify({
        error: error.message
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      },
    )
  }
})