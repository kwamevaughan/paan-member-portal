// Script to create a test masterclass
import { createClient } from '@supabase/supabase-js';
import 'dotenv/config';

// Get Supabase credentials from environment variables
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing required environment variables: SUPABASE_URL and SUPABASE_SERVICE_KEY');
  console.error('Please make sure to set these in your .env file');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);
console.log('Connected to Supabase');

async function createTestMasterclass() {
  console.log('Creating test masterclass...');
  
  // First, check if we have any categories
  const { data: categories, error: categoryError } = await supabase
    .from('masterclass_categories')
    .select('id')
    .limit(1);

  if (categoryError) {
    console.error('Error fetching categories:', categoryError);
    return;
  }

  let categoryId = categories?.[0]?.id;

  // If no categories exist, create one
  if (!categoryId) {
    console.log('No categories found, creating a test category...');
    const { data: newCategory, error: createCategoryError } = await supabase
      .from('masterclass_categories')
      .insert([{
        name: 'Test Category',
        slug: 'test-category',
        description: 'A test category for development',
        is_active: true
      }])
      .select('id')
      .single();

    if (createCategoryError) {
      console.error('Error creating category:', createCategoryError);
      return;
    }
    
    categoryId = newCategory.id;
    console.log(`Created category with ID: ${categoryId}`);
  }

  // Create a test masterclass with minimal required fields
  const startDate = new Date();
  startDate.setDate(startDate.getDate() + 7); // One week from now
  
  const endDate = new Date(startDate);
  endDate.setHours(endDate.getHours() + 2); // 2 hours duration

  const testMasterclass = {
    title: 'Test Masterclass',
    description: 'This is a test masterclass created for development purposes.',
    status: 'published',
    category_id: categoryId,
    start_date: startDate.toISOString(),
    end_date: endDate.toISOString(),
    is_featured: false,
    image_url: 'https://placehold.co/600x400?text=Masterclass',
    member_price: 0,  // Required field
    non_member_price: 0,  // Required field
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };
  
  console.log('Creating masterclass with data:', testMasterclass);

  const { data: masterclass, error } = await supabase
    .from('masterclasses')
    .insert([testMasterclass])
    .select()
    .single();

  if (error) {
    console.error('Error creating test masterclass:', error);
    return;
  }

  console.log('Successfully created test masterclass:');
  console.log(masterclass);
  
  // Create a test instructor if needed
  const { data: instructors } = await supabase
    .from('masterclass_instructors')
    .select('id')
    .limit(1);

  if (!instructors?.length) {
    console.log('Creating test instructor...');
    const { data: instructor } = await supabase
      .from('masterclass_instructors')
      .insert([{
        name: 'Test Instructor',
        title: 'Lead Developer',
        bio: 'Test instructor for development',
        profile_image_url: 'https://placehold.co/200x200?text=Instructor',
        is_active: true
      }])
      .select('id')
      .single();

    if (instructor) {
      console.log(`Created instructor with ID: ${instructor.id}`);
      
      // Link instructor to masterclass
      const { error: linkError } = await supabase
        .from('masterclass_instructor_assignments')
        .insert([{
          masterclass_id: masterclass.id,
          instructor_id: instructor.id,
          is_primary: true
        }]);

      if (linkError) {
        console.error('Error linking instructor to masterclass:', linkError);
      } else {
        console.log('Successfully linked instructor to masterclass');
      }
    }
  }
}

createTestMasterclass()
  .then(() => {
    console.log('Test data creation completed');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Error in test data creation:', error);
    process.exit(1);
  });
