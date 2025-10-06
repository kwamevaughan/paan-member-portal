// API endpoint for masterclass registrations in member portal
import { supabase } from '@/lib/supabase';

export default async function handler(req, res) {
  const { method } = req;

  try {
    switch (method) {
      case 'GET':
        return await getRegistrations(req, res);
      case 'POST':
        return await createRegistration(req, res);
      default:
        res.setHeader('Allow', ['GET', 'POST']);
        return res.status(405).json({ error: `Method ${method} Not Allowed` });
    }
  } catch (error) {
    console.error('Registrations API error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

async function getRegistrations(req, res) {
  const { 
    user_id,
    status,
    page = 1,
    limit = 10
  } = req.query;

  const offset = (page - 1) * limit;

  try {
    // Verify user is authenticated
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const user = session.user;
    
    // Users can only see their own registrations
    if (user.id !== user_id) {
      return res.status(403).json({ error: 'Forbidden' });
    }

    let query = supabase
      .from('masterclass_registrations')
      .select(`
        *,
        masterclass:masterclasses!inner(
          id,
          title,
          description,
          start_date,
          end_date,
          image_url,
          status,
          category:masterclass_categories(name, slug)
        ),
        payments:masterclass_payments(id, amount, status, payment_method, created_at)
      `, { count: 'exact' })
      .eq('user_id', user_id)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (status) {
      query = query.eq('status', status);
    }

    const { data, error, count } = await query;

    if (error) throw error;

    return res.status(200).json({
      data: data || [],
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total: count || 0,
        totalPages: Math.ceil((count || 0) / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching registrations:', error);
    return res.status(500).json({ error: 'Failed to fetch registrations' });
  }
}

async function createRegistration(req, res) {
  const { masterclass_id, user_id, payment_method = 'free' } = req.body;

  try {
    // Verify user is authenticated
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    
    const user = session.user;
    
    // Users can only create registrations for themselves
    if (user.id !== user_id) {
      return res.status(403).json({ error: 'Forbidden' });
    }

    // Check if masterclass exists and is open for registration
    const { data: masterclass, error: masterclassError } = await supabase
      .from('masterclasses')
      .select('*')
      .eq('id', masterclass_id)
      .eq('status', 'published')
      .single();

    if (masterclassError || !masterclass) {
      return res.status(404).json({ error: 'Masterclass not found or not available for registration' });
    }

    // Check if user is already registered
    const { data: existingRegistration } = await supabase
      .from('masterclass_registrations')
      .select('id')
      .eq('user_id', user_id)
      .eq('masterclass_id', masterclass_id)
      .maybeSingle();

    if (existingRegistration) {
      return res.status(400).json({ error: 'You are already registered for this masterclass' });
    }

    // Create registration
    const registrationData = {
      user_id,
      masterclass_id,
      status: payment_method === 'free' ? 'confirmed' : 'pending_payment',
      registered_at: new Date().toISOString()
    };

    const { data: registration, error: registrationError } = await supabase
      .from('masterclass_registrations')
      .insert([registrationData])
      .select()
      .single();

    if (registrationError) throw registrationError;

    // If it's a free masterclass, create a payment record with status 'completed'
    if (payment_method === 'free') {
      await supabase
        .from('masterclass_payments')
        .insert([{
          registration_id: registration.id,
          amount: 0,
          status: 'completed',
          payment_method: 'free',
          user_id
        }]);
    }

    return res.status(201).json({
      data: registration,
      payment_required: payment_method !== 'free',
      payment_url: payment_method !== 'free' ? `/masterclasses/${masterclass_id}/payment` : null
    });
  } catch (error) {
    console.error('Error creating registration:', error);
    return res.status(500).json({ error: 'Failed to create registration' });
  }
}
