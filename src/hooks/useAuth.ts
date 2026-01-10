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
    try {
      const redirectUrl = `${window.location.origin}/`;
      
      const { data, error: authError } = await supabase.auth.signUp({
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

      if (authError) {
        console.error('Auth error:', authError);
        return { data, error: authError };
      }

      if (!data.user) {
        return { data, error: { message: 'User creation failed' } };
      }

      // Wait a bit for the user to be properly created
      await new Promise(resolve => setTimeout(resolve, 100));

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
        return { data, error: profileError };
      }

      // Get the created profile ID
      const { data: profileResult, error: profileFetchError } = await supabase
        .from('profiles')
        .select('id')
        .eq('user_id', data.user.id)
        .single();

      if (profileFetchError || !profileResult) {
        console.error('Profile fetch error:', profileFetchError);
        return { data, error: profileFetchError || { message: 'Failed to fetch created profile' } };
      }

      // Create type-specific profile
      if (userType === 'farmer') {
        const { error: farmerError } = await supabase
          .from('farmer_profiles')
          .insert({
            profile_id: profileResult.id,
            farm_name: profileData.farm_name,
            farm_location: profileData.farm_location,
            farm_size_acres: parseFloat(profileData.farm_size_acres)
          });

        if (farmerError) {
          console.error('Farmer profile creation error:', farmerError);
          return { data, error: farmerError };
        }
      } else if (userType === 'buyer') {
        const { error: buyerError } = await supabase
          .from('buyer_profiles')
          .insert({
            profile_id: profileResult.id,
            company_name: profileData.company_name
          });

        if (buyerError) {
          console.error('Buyer profile creation error:', buyerError);
          return { data, error: buyerError };
        }
      }

      return { data, error: null };
    } catch (error) {
      console.error('Unexpected error during signup:', error);
      return { data: null, error: { message: 'An unexpected error occurred during registration' } };
    }
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