import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://your-project.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'your-anon-key'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Business Dashboard API Integration
export class BusinessDashboardAPI {
  static async processCSV(csvData: string, fileName?: string) {
    const { data: { user } } = await supabase.auth.getUser()
    
    const response = await supabase.functions.invoke('business-dashboard', {
      body: {
        action: 'process_csv',
        data: csvData,
        user_id: user?.id,
        file_name: fileName
      }
    })
    
    if (response.error) throw new Error(response.error.message)
    return response.data
  }
  
  static async generateInsights(data: any[]) {
    const response = await supabase.functions.invoke('business-dashboard', {
      body: {
        action: 'generate_insights',
        data: JSON.stringify(data)
      }
    })
    
    if (response.error) throw new Error(response.error.message)
    return response.data
  }
  
  static async getSampleData() {
    const response = await supabase.functions.invoke('business-dashboard', {
      body: { action: 'get_sample_data' }
    })
    
    if (response.error) throw new Error(response.error.message)
    return response.data
  }
  
  static async healthCheck() {
    const response = await supabase.functions.invoke('business-dashboard', {
      body: { action: 'health_check' }
    })
    
    return response.data
  }
}

// Authentication utilities
export async function signInAnonymously() {
  const { data, error } = await supabase.auth.signInAnonymously()
  if (error) throw error
  return data.user
}

export async function getCurrentUser() {
  const { data: { user } } = await supabase.auth.getUser()
  return user
}

export async function signOut() {
  const { error } = await supabase.auth.signOut()
  if (error) throw error
}

// Database utilities for saved analyses
export async function getSavedAnalyses() {
  const { data, error } = await supabase
    .from('dashboard_analyses')
    .select('*')
    .order('created_at', { ascending: false })
  
  if (error) throw error
  return data
}

export async function saveAnalysis(analysis: any) {
  const { data, error } = await supabase
    .from('dashboard_analyses')
    .insert(analysis)
    .select()
  
  if (error) throw error
  return data[0]
}

export async function deleteAnalysis(id: string) {
  const { error } = await supabase
    .from('dashboard_analyses')
    .delete()
    .eq('id', id)
  
  if (error) throw error
} 