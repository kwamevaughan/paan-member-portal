// API endpoint for masterclasses in member portal
import { supabase } from '@/lib/supabase';

export default async function handler(req, res) {
  const { method } = req;

  try {
    switch (method) {
      case 'GET':
        return await getMasterclasses(req, res);
      default:
        res.setHeader('Allow', ['GET']);
        return res.status(405).json({ error: `Method ${method} Not Allowed` });
    }
  } catch (error) {
    console.error('Masterclasses API error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

async function getMasterclasses(req, res) {
  console.log('=== Masterclasses API Request ===');
  console.log('Query params:', req.query);
  console.log('Headers:', {
    authorization: req.headers.authorization ? 'present' : 'missing',
    'content-type': req.headers['content-type']
  });

  const { 
    status = 'published', 
    category, 
    search,
    upcoming_only,
    page = 1, 
    limit = 10
  } = req.query;

  const offset = (page - 1) * limit;

  try {
    let query = supabase
      .from('masterclasses')
      .select(`
        *,
        category:masterclass_categories(id, name, slug),
        instructor:masterclass_instructors(id, name, title, profile_image_url),
        registrations_count:masterclass_registrations(count)
      `, { count: 'exact' })
      .eq('status', status)
      .order('start_date', { ascending: true })
      .range(offset, offset + limit - 1);

    // Apply additional filters
    if (category) {
      query = query.eq('category_id', category);
    }

    if (search) {
      query = query.ilike('title', `%${search}%`);
    }

    if (upcoming_only === 'true') {
      const now = new Date().toISOString();
      console.log('Filtering upcoming masterclasses. Now:', now);
      console.log('Masterclass end_date will be compared to:', now);
      query = query.gte('end_date', now);
    }

    console.log('Executing query with params:', {
      status,
      category,
      search,
      upcoming_only,
      page,
      limit,
      offset
    });

    const { data, error, count } = await query;

    if (error) {
      console.error('Supabase query error:', error);
      throw error;
    }

    console.log(`Query returned ${data?.length || 0} masterclasses`);
    if (data?.length > 0) {
      console.log('First masterclass sample:', {
        id: data[0]?.id,
        title: data[0]?.title,
        start_date: data[0]?.start_date,
        end_date: data[0]?.end_date,
        status: data[0]?.status
      });
    }

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
    console.error('Error fetching masterclasses:', {
      message: error.message,
      stack: error.stack,
      code: error.code,
      details: error.details,
      hint: error.hint
    });
    return res.status(500).json({ 
      error: 'Failed to fetch masterclasses',
      message: error.message,
      details: process.env.NODE_ENV === 'development' ? error.details : undefined
    });
  }
}
