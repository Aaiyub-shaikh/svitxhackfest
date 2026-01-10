// Replaced Supabase with SQL-based backend API
import { useState, useEffect } from 'react';
import { authApi } from '@/services/api';

// Types compatible with Supabase format for frontend compatibility
interface User {
  id: string;
  email: string;
  user_metadata?: {
    user_type?: 'farmer' | 'buyer';
    [key: string]: any;
  };
}

interface Session {
  access_token: string;
  token_type: string;
  user: User;
}

export const useAuth = () => {
  // Initialize from localStorage to avoid UI flashes and make redirects deterministic
  const storedUser = typeof window !== 'undefined' ? localStorage.getItem('user_data') : null;
  const storedToken = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;

  const [user, setUser] = useState<User | null>(storedUser ? JSON.parse(storedUser) : null);
  const [session, setSession] = useState<Session | null>(
    storedToken
      ? { access_token: storedToken, token_type: 'bearer', user: storedUser ? JSON.parse(storedUser) : null }
      : null
  );
  const [loading, setLoading] = useState<boolean>(!storedToken);

  // Load session on mount
  useEffect(() => {
    // Validate session with server when a token exists, otherwise mark as not loading
    const loadSession = async () => {
      try {
        const response = await authApi.getSession();
        if (response.data?.session) {
          const sessionData = response.data.session;
          const token = localStorage.getItem('auth_token');
          setSession({
            access_token: token || '',
            token_type: 'bearer',
            user: sessionData.user
          });
          setUser(sessionData.user);
        } else {
          // No valid session on server — clear local state and storage
          setSession(null);
          setUser(null);
          localStorage.removeItem('auth_token');
          localStorage.removeItem('user_data');
        }
      } catch (err) {
        console.error('getSession error:', err);
        setSession(null);
        setUser(null);
        localStorage.removeItem('auth_token');
        localStorage.removeItem('user_data');
      } finally {
        setLoading(false);
      }
    };

    // Only validate with server if we have a stored token
    if (storedToken) {
      loadSession();
    } else {
      // No token found — not loading
      setLoading(false);
    }

    // Check for auth changes periodically (simulating Supabase's onAuthStateChange)
    const interval = setInterval(() => {
      const token = localStorage.getItem('auth_token');
      if (!token) {
        // Token was removed, clear state
        setSession((prevSession) => {
          if (prevSession) {
            setUser(null);
            return null;
          }
          return prevSession;
        });
      }
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  const signUp = async (email: string, password: string, userType: 'farmer' | 'buyer', profileData: any) => {
    const response = await authApi.signUp(email, password, userType, profileData);
    
    if (response.data) {
      setSession(response.data.session);
      setUser(response.data.user);
    }
    
    return response;
  };

  const signIn = async (email: string, password: string) => {
    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/4851355a-993a-4a63-a581-a0e249f20adf',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'useAuth.ts:90',message:'signIn called',data:{email},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'C'})}).catch(()=>{});
    // #endregion
    
    const response = await authApi.signIn(email, password);
    
    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/4851355a-993a-4a63-a581-a0e249f20adf',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'useAuth.ts:95',message:'signIn response',data:{hasData:!!response.data,hasError:!!response.error,userType:response.data?.user?.user_metadata?.user_type},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'C'})}).catch(()=>{});
    // #endregion
    
    if (response.data) {
      setSession(response.data.session);
      setUser(response.data.user);
      
      // #region agent log
      fetch('http://127.0.0.1:7242/ingest/4851355a-993a-4a63-a581-a0e249f20adf',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'useAuth.ts:102',message:'User state updated',data:{userId:response.data.user?.id,userType:response.data.user?.user_metadata?.user_type},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'C'})}).catch(()=>{});
      // #endregion
    }
    
    return response;
  };

  const signOut = async () => {
    await authApi.signOut();
    setSession(null);
    setUser(null);
    return { error: null };
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