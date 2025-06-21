'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export interface CreateUserData {
  email: string
  password: string
  fullName?: string
  role: 'admin' | 'organiser'
}

export async function createUserAction(data: CreateUserData) {
  const supabase = await createClient()
  
  try {
    // Check if user already exists
    const { data: existingUser } = await supabase
      .from('profiles')
      .select('id')
      .eq('email', data.email)
      .single()
    
    if (existingUser) {
      return { error: 'A user with this email already exists' }
    }
    
    // Use regular sign up instead of admin.createUser
    const { data: authUser, error: authError } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
      options: {
        data: {
          full_name: data.fullName || '',
          role: data.role
        }
      }
    })
    
    if (authError || !authUser.user) {
      return { error: authError?.message || 'Failed to create user account' }
    }
    
    // The profile should be created automatically via a database trigger
    // But let's also try to create it manually if it doesn't exist
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .upsert({
        id: authUser.user.id,
        email: data.email,
        full_name: data.fullName || null,
        role: data.role
      })
      .select()
      .single()
    
    if (profileError) {
      console.error('Profile creation error:', profileError)
      return { error: 'User account created but profile setup failed. The user may need to complete setup on first login.' }
    }
    
    revalidatePath('/dashboard/users')
    return { 
      success: true, 
      data: profile,
      message: authUser.user.email_confirmed_at 
        ? 'User created successfully' 
        : 'User created successfully. They will need to verify their email before logging in.'
    }
    
  } catch (error) {
    console.error('Error creating user:', error)
    return { error: 'An unexpected error occurred' }
  }
}

export async function deleteUserAction(userId: string) {
  const supabase = await createClient()
  
  try {
    // First delete the profile (this will also delete auth user due to CASCADE)
    const { error: profileError } = await supabase
      .from('profiles')
      .delete()
      .eq('id', userId)
    
    if (profileError) {
      return { error: 'Failed to delete user profile' }
    }
    
    // Also delete from auth (though CASCADE should handle this)
    const { error: authError } = await supabase.auth.admin.deleteUser(userId)
    
    if (authError) {
      console.warn('Auth user deletion failed, but profile was deleted:', authError)
    }
    
    revalidatePath('/dashboard/users')
    return { success: true }
    
  } catch (error) {
    console.error('Error deleting user:', error)
    return { error: 'An unexpected error occurred' }
  }
}