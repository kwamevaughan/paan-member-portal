// Custom hook for masterclasses management in member portal
import { useState, useEffect, useCallback, useRef } from 'react';
import { supabaseClient as supabase } from '@/lib/supabase';
import { useAuth } from './useAuth';

export const useMasterclasses = (filters = {}) => {
  const { user, loading: authLoading } = useAuth();
  
  console.log('[useMasterclasses] Initializing with filters:', filters);
  console.log('[useMasterclasses] Auth state:', { 
    hasUser: !!user,
    userId: user?.id,
    userEmail: user?.email,
    authLoading
  });
  const [masterclasses, setMasterclasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0
  });
  
  // Use a ref to track mounted state to prevent state updates after unmount
  const isMounted = useRef(true);
  
  // Log when the user changes or auth loading state changes
  useEffect(() => {
    console.log('[useMasterclasses] Auth state changed:', { 
      userId: user?.id,
      userEmail: user?.email,
      authLoading
    });
  }, [user, authLoading]);

  const fetchMasterclasses = useCallback(async (signal) => {
    // Don't fetch if auth is still loading
    if (authLoading) {
      console.log('[useMasterclasses] Auth still loading, skipping fetch');
      return;
    }
    
    // Don't fetch if user is not authenticated
    if (!user) {
      console.log('[useMasterclasses] User not authenticated, clearing data');
      setMasterclasses([]);
      setPagination({
        page: 1,
        limit: 10,
        total: 0,
        totalPages: 0
      });
      setLoading(false);
      return;
    }
    console.log('[useMasterclasses] fetchMasterclasses called with filters:', filters);
    
    // Don't fetch if we don't have all required filters
    if (filters.status === undefined) {
      console.log('[useMasterclasses] Setting default status to published');
      filters.status = 'published';
    }
    
    // Ensure upcoming_only is set for published masterclasses
    if (filters.status === 'published' && filters.upcoming_only === undefined) {
      console.log('[useMasterclasses] Setting upcoming_only to true for published masterclasses');
      filters.upcoming_only = 'true';
    }
    
    // Log the final filters being used
    console.log('[useMasterclasses] Final filters:', JSON.stringify(filters, null, 2));
    setLoading(true);
    setError(null);
    console.log('[useMasterclasses] Starting fetch with filters:', filters);

    try {
      console.log('[useMasterclasses] Starting API request...');
      
      const params = new URLSearchParams();
      
      // Add filters to params
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          params.append(key, value);
        }
      });
      
      // Add pagination
      params.append('page', pagination.page);
      params.append('limit', pagination.limit);
      
      console.log('[useMasterclasses] Getting session...');
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError) {
        console.error('[useMasterclasses] Session error:', sessionError);
        throw sessionError;
      }
      
      if (!session) {
        const error = new Error('Not authenticated');
        console.error('[useMasterclasses] No active session found');
        throw error;
      }
      
      console.log('[useMasterclasses] Session found, user:', session.user?.email);
      
      if (!session) {
        console.log('[useMasterclasses] No active session, setting empty data');
        setMasterclasses([]);
        setPagination({
          page: 1,
          limit: 10,
          total: 0,
          totalPages: 0
        });
        setLoading(false);
        return;
      }
      
      const url = `/api/masterclasses?${params.toString()}`;
      console.log('[useMasterclasses] Fetching masterclasses from:', url);
      
      console.log('[useMasterclasses] Making request to:', url);
      console.log('[useMasterclasses] Using access token:', 
        session.access_token ? `[${session.access_token.substring(0, 10)}...]` : 'MISSING');
      
      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
          'Content-Type': 'application/json'
        },
        signal // Pass the AbortSignal to the fetch request
      });
      
      // Check if component is still mounted
      if (!isMounted.current) {
        console.log('[useMasterclasses] Component unmounted, aborting');
        return;
      }
      
      console.log('[useMasterclasses] Response status:', response.status);
      
      console.log('[useMasterclasses] Response status:', response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('[useMasterclasses] API Error:', {
          url,
          status: response.status,
          statusText: response.statusText,
          errorText
        });
        
        let errorData;
        try {
          errorData = errorText ? JSON.parse(errorText) : {};
        } catch (e) {
          console.error('[useMasterclasses] Error parsing error response:', e);
        }
        throw new Error(errorData.error || 'Failed to fetch masterclasses');
      }
      
      const result = await response.json();
      const newMasterclasses = result.data || [];
      const newPagination = {
        ...pagination,
        ...(result.pagination || {})
      };
      
      console.log('[useMasterclasses] Updating masterclasses:', {
        previousCount: masterclasses.length,
        newCount: newMasterclasses.length
      });
      console.log('[useMasterclasses] Updating pagination:', newPagination);
      
      // Only update state if component is still mounted
      if (isMounted.current) {
        setMasterclasses(newMasterclasses);
        setPagination(newPagination);
      }
      
      return result;
      
    } catch (error) {
      console.error('[useMasterclasses] Fetch error:', {
        error,
        message: error.message,
        stack: error.stack
      });
      throw error;
    } finally {
      console.log('[useMasterclasses] Fetch completed, setting loading to false');
      setLoading(false);
    }
  }, [filters.status, filters.category, filters.search, filters.page, filters.limit]);

  useEffect(() => {
    console.log('[useMasterclasses] useEffect triggered, setting up fetch');
    
    // Don't proceed if auth is still loading
    if (authLoading) {
      console.log('[useMasterclasses] Auth loading, waiting...');
      return;
    }
    
    // Don't proceed if user is not authenticated
    if (!user) {
      console.log('[useMasterclasses] User not authenticated, skipping fetch setup');
      setLoading(false);
      return;
    }
    
    // Create an AbortController to cancel the fetch if the component unmounts
    const controller = new AbortController();
    const { signal } = controller;
    
    // Set mounted to true when component mounts
    isMounted.current = true;
    
    // Initial fetch
    console.log('[useMasterclasses] Starting initial fetch');
    fetchMasterclasses(signal).catch(error => {
      console.error('[useMasterclasses] Error in initial fetch:', error);
      if (isMounted.current) {
        setError(error);
        setLoading(false);
      }
    });
    
    // Set up a refetch interval (every 30 seconds)
    const refetchInterval = setInterval(() => {
      if (isMounted.current && user) {
        console.log('[useMasterclasses] Refreshing data...');
        fetchMasterclasses(signal).catch(console.error);
      }
    }, 30000);
    
    // Cleanup function
    return () => {
      console.log('[useMasterclasses] Cleaning up');
      isMounted.current = false;
      controller.abort();
      clearInterval(refetchInterval);
    };
  }, [user, authLoading, JSON.stringify(filters)]); // Re-run when user, authLoading or filters change

  console.log('[useMasterclasses] Rendering with state:', {
    masterclassesCount: masterclasses.length,
    loading,
    error: error?.message || null,
    pagination
  });
  
  return {
    masterclasses,
    loading,
    error,
    pagination,
    refetch: fetchMasterclasses,
  };
};

export const useMasterclass = (id) => {
  const [masterclass, setMasterclass] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchMasterclass = useCallback(async () => {
    if (!id) return;

    setLoading(true);
    setError(null);

    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      const response = await fetch(`/api/masterclasses/${id}`, {
        headers: {
          'Authorization': `Bearer ${session?.access_token}`
        }
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to fetch masterclass');
      }
      
      const result = await response.json();

      if (response.ok) {
        setMasterclass(result.data);
      } else {
        setError(result.error || 'Failed to fetch masterclass');
      }
    } catch (err) {
      setError('Network error occurred');
      console.error('Error fetching masterclass:', err);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchMasterclass();
  }, [fetchMasterclass]);

  return {
    masterclass,
    loading,
    error,
    refetch: fetchMasterclass,
  };
};

export const useMasterclassRegistrations = (filters = {}) => {
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0
  });

  const fetchRegistrations = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      // If no session, don't throw an error, just return empty data
      if (!session) {
        setRegistrations([]);
        setPagination({
          page: 1,
          limit: 10,
          total: 0,
          totalPages: 0
        });
        return;
      }
      
      // Add the rest of your fetch logic here
      // For example:
      // const response = await fetch(...);
      // const data = await response.json();
      // setRegistrations(data);
      
    } catch (err) {
      console.error('Error fetching registrations:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [filters, pagination]);
  
  // Call fetchRegistrations when the component mounts or when fetchRegistrations changes
  useEffect(() => {
    fetchRegistrations();
  }, [fetchRegistrations]);

  const createRegistration = async (registrationData) => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        return { success: false, error: 'Not authenticated' };
      }

      const response = await fetch('/api/masterclasses/registrations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`
        },
        body: JSON.stringify(registrationData),
      });

      const result = await response.json();
      
      if (response.ok) {
        await fetchRegistrations(); // Refresh the list
        return { success: true, data: result.data };
      } else {
        return { success: false, error: result.error };
      }
    } catch (err) {
      return { success: false, error: 'Network error occurred' };
    }
  };

  return {
    registrations,
    loading,
    error,
    pagination,
    createRegistration,
    refetch: fetchRegistrations,
  };
};

export const useMasterclassCategories = () => {
  console.log('[useMasterclassCategories] Initializing');
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchCategories = useCallback(async () => {
    console.log('[useMasterclassCategories] fetchCategories called');
    setLoading(true);
    setError(null);

    try {
      console.log('[useMasterclassCategories] Getting session...');
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError) {
        console.error('[useMasterclassCategories] Error getting session:', sessionError);
        throw sessionError;
      }
      
      if (!session) {
        console.log('[useMasterclassCategories] No active session, skipping fetch');
        setLoading(false);
        return;
      }
      
      console.log('[useMasterclassCategories] Fetching categories...');
      const response = await fetch(`/api/masterclasses/categories`, {
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
          'Content-Type': 'application/json'
        }
      });
      
      console.log('[useMasterclassCategories] Response status:', response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('[useMasterclassCategories] API Error:', {
          status: response.status,
          statusText: response.statusText,
          errorText
        });
        let errorData;
        try {
          errorData = JSON.parse(errorText);
        } catch (e) {
          throw new Error(`Failed to fetch categories: ${response.status} ${response.statusText}`);
        }
        throw new Error(errorData.error || 'Failed to fetch categories');
      }
      
      const result = await response.json();
      console.log('[useMasterclassCategories] Received categories:', {
        count: result.data?.length
      });
      
      setCategories(prev => {
        const newCategories = result.data || [];
        console.log('[useMasterclassCategories] Updating categories:', {
          previousCount: prev.length,
          newCount: newCategories.length
        });
        return newCategories;
      });
    } catch (err) {
      console.error('[useMasterclassCategories] Error in fetchCategories:', err);
      setError(err.message || 'Network error occurred');
    } finally {
      console.log('[useMasterclassCategories] Fetch completed, setting loading to false');
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    console.log('[useMasterclassCategories] useEffect triggered, calling fetchCategories');
    fetchCategories();
    
    // Cleanup function
    return () => {
      console.log('[useMasterclassCategories] Cleaning up');
    };
  }, [fetchCategories]);

  console.log('[useMasterclassCategories] Rendering with state:', {
    categoriesCount: categories.length,
    loading,
    error: error?.message || null
  });

  return {
    categories,
    loading,
    error,
    refetch: fetchCategories,
  };
};