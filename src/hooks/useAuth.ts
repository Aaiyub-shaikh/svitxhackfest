import { useState, useEffect } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Set up auth state listener first
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
      }
    );

    // Then check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signUp = async (email: string, password: string, userType: 'farmer' | 'buyer', profileData: any) => {
    const redirectUrl = `${window.location.origin}/`;
    
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: redirectUrl,
        data: {
          user_type: userType,
          ...profileData
        }
      }
    });

    if (data.user && !error) {
      // Create profile data
      const { error: profileError } = await supabase
        .from('profiles')
        .insert({
          user_id: data.user.id,
          user_type: userType,
          full_name: profileData.full_name,
          phone: profileData.phone
        });

      if (profileError) {
        console.error('Profile creation error:', profileError);
        return { error: profileError };
      }

      // Create type-specific profile
      if (userType === 'farmer') {
        const { data: profileResult } = await supabase
          .from('profiles')
          .select('id')
          .eq('user_id', data.user.id)
          .single();

        if (profileResult) {
          await supabase
            .from('farmer_profiles')
            .insert({
              profile_id: profileResult.id,
              farm_name: profileData.farm_name,
              farm_location: profileData.farm_location,
              farm_size_acres: parseFloat(profileData.farm_size_acres)
            });
        }
      } else if (userType === 'buyer') {
        const { data: profileResult } = await supabase
          .from('profiles')
          .select('id')
          .eq('user_id', data.user.id)
          .single();

        if (profileResult) {
          await supabase
            .from('buyer_profiles')
            .insert({
              profile_id: profileResult.id,
              company_name: profileData.company_name
            });
        }
      }
    }

    return { data, error };
  };

  const signIn = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    return { data, error };
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    return { error };
  };

  return {
    user,
    session,
    loading,
    signUp,
    signIn,
    signOut
  };
};