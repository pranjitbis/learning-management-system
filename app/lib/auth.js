// lib/auth.js
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

export async function getCurrentUser() {
  const cookieStore = cookies()
  const token = cookieStore.get('auth-token')?.value

  if (!token) {
    return null
  }

  try {
    // Verify token (replace with your actual authentication logic)
    const response = await fetch(`${process.env.NEXTAUTH_URL}/api/auth/verify`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })

    if (response.ok) {
      return await response.json()
    }
    
    return null
  } catch (error) {
    console.error('Auth error:', error)
    return null
  }
}

export async function requireAuth(requiredRole) {
  const user = await getCurrentUser()
  
  if (!user) {
    redirect('/login')
  }

  if (requiredRole && user.role !== requiredRole) {
    redirect('/unauthorized')
  }

  return user
}

export async function logout() {
  cookies().delete('auth-token')
  redirect('/login')
}