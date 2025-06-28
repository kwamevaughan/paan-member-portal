-- Dummy data for access_hubs table
-- Insert test data with multiple images to test the ImageGallery component

INSERT INTO access_hubs (
  title,
  description,
  is_available,
  images,
  amenities,
  country,
  pricing_per_day,
  city,
  capacity,
  space_type,
  tier_restriction,
  created_at,
  updated_at,
  created_by
) VALUES 
(
  'Lagos Innovation Hub',
  'A modern coworking space in the heart of Victoria Island, perfect for startups and entrepreneurs. Features high-speed internet, meeting rooms, and a vibrant community of innovators.',
  true,
  '[
    "https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&h=600&fit=crop",
    "https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=800&h=600&fit=crop",
    "https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=800&h=600&fit=crop",
    "https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&h=600&fit=crop"
  ]'::jsonb,
  '["WiFi", "Coffee", "Printing", "Meeting Rooms", "Parking", "Kitchen", "Security", "24/7 Access"]'::jsonb,
  'Nigeria',
  75,
  'Lagos',
  50,
  'Coworking Space',
  'Premium Member',
  NOW(),
  NOW(),
  '00000000-0000-0000-0000-000000000001'::uuid
),
(
  'Nairobi Tech Campus',
  'State-of-the-art technology lab with advanced equipment, perfect for hardware startups and research teams. Includes 3D printers, laser cutters, and prototyping tools.',
  true,
  '[
    "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800&h=600&fit=crop",
    "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800&h=600&fit=crop",
    "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800&h=600&fit=crop"
  ]'::jsonb,
  '["WiFi", "3D Printing", "Laser Cutting", "Prototyping Tools", "Workshops", "Mentorship", "Funding", "Networking"]'::jsonb,
  'Kenya',
  120,
  'Nairobi',
  25,
  'Tech Lab',
  'Premium Member',
  NOW(),
  NOW(),
  '00000000-0000-0000-0000-000000000001'::uuid
),
(
  'Cape Town Creative Studio',
  'Spacious loft-style studio perfect for creative professionals, designers, and artists. Features natural lighting, flexible workspace, and inspiration everywhere.',
  true,
  '[
    "https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&h=600&fit=crop",
    "https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=800&h=600&fit=crop"
  ]'::jsonb,
  '["WiFi", "Natural Lighting", "Flexible Workspace", "Storage", "Events", "Networking", "Phone Booths", "Lounge"]'::jsonb,
  'South Africa',
  95,
  'Cape Town',
  30,
  'Creative Studio',
  'Premium Member',
  NOW(),
  NOW(),
  '00000000-0000-0000-0000-000000000001'::uuid
),
(
  'Johannesburg Business Center',
  'Professional business center with private offices and conference facilities. Ideal for established companies and remote teams needing a professional environment.',
  true,
  '[
    "https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=800&h=600&fit=crop",
    "https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&h=600&fit=crop",
    "https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=800&h=600&fit=crop",
    "https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=800&h=600&fit=crop",
    "https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&h=600&fit=crop"
  ]'::jsonb,
  '["WiFi", "Private Offices", "Conference Rooms", "Reception", "Mail Services", "Security", "Parking", "Kitchen"]'::jsonb,
  'South Africa',
  150,
  'Johannesburg',
  40,
  'Business Center',
  'Premium Member',
  NOW(),
  NOW(),
  '00000000-0000-0000-0000-000000000001'::uuid
),
(
  'Accra Community Hub',
  'Community-focused innovation hub designed to bring together local entrepreneurs, students, and professionals. Features collaborative spaces and educational programs.',
  true,
  '[
    "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800&h=600&fit=crop"
  ]'::jsonb,
  '["WiFi", "Collaborative Spaces", "Educational Programs", "Mentorship", "Workshops", "Events", "Networking", "Funding"]'::jsonb,
  'Ghana',
  45,
  'Accra',
  60,
  'Community Hub',
  'Free Member',
  NOW(),
  NOW(),
  '00000000-0000-0000-0000-000000000001'::uuid
),
(
  'Cairo Startup Incubator',
  'Dedicated startup incubator with mentorship programs, funding opportunities, and networking events. Perfect for early-stage startups looking to grow.',
  true,
  '[
    "https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&h=600&fit=crop",
    "https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=800&h=600&fit=crop",
    "https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=800&h=600&fit=crop"
  ]'::jsonb,
  '["WiFi", "Mentorship", "Funding", "Workshops", "Networking", "Meeting Rooms", "Events", "Phone Booths"]'::jsonb,
  'Egypt',
  85,
  'Cairo',
  35,
  'Incubator',
  'Premium Member',
  NOW(),
  NOW(),
  '00000000-0000-0000-0000-000000000001'::uuid
),
(
  'Dar es Salaam Remote Work Space',
  'Peaceful remote work space with private pods, quiet zones, and wellness amenities. Perfect for digital nomads and remote workers seeking focus and productivity.',
  true,
  '[
    "https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=800&h=600&fit=crop",
    "https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&h=600&fit=crop"
  ]'::jsonb,
  '["WiFi", "Private Pods", "Quiet Zones", "Wellness Room", "Gym", "Shower", "Kitchen", "24/7 Access"]'::jsonb,
  'Tanzania',
  65,
  'Dar es Salaam',
  45,
  'Remote Work Space',
  'Premium Member',
  NOW(),
  NOW(),
  '00000000-0000-0000-0000-000000000001'::uuid
),
(
  'Addis Ababa University Center',
  'University-affiliated innovation center connecting students, faculty, and industry partners. Features research labs, startup programs, and academic collaboration spaces.',
  true,
  '[
    "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800&h=600&fit=crop",
    "https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&h=600&fit=crop",
    "https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=800&h=600&fit=crop",
    "https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=800&h=600&fit=crop",
    "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800&h=600&fit=crop"
  ]'::jsonb,
  '["WiFi", "Research Labs", "Academic Collaboration", "Startup Programs", "Mentorship", "Workshops", "Events", "Networking"]'::jsonb,
  'Ethiopia',
  55,
  'Addis Ababa',
  80,
  'University Center',
  'Free Member',
  NOW(),
  NOW(),
  '00000000-0000-0000-0000-000000000001'::uuid
),
(
  'Casablanca Corporate Lab',
  'Corporate innovation lab designed for enterprise teams, startups, and research partnerships. Features advanced technology and collaborative workspaces.',
  true,
  '[
    "https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=800&h=600&fit=crop",
    "https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=800&h=600&fit=crop"
  ]'::jsonb,
  '["WiFi", "Advanced Technology", "Collaborative Workspaces", "Meeting Rooms", "Security", "Parking", "Reception", "Events"]'::jsonb,
  'Morocco',
  200,
  'Casablanca',
  30,
  'Corporate Lab',
  'Premium Member',
  NOW(),
  NOW(),
  '00000000-0000-0000-0000-000000000001'::uuid
),
(
  'Kigali Artisan Workshop',
  'Specialized workshop space for artisans, craftspeople, and makers. Features specialized equipment, storage, and collaborative areas for creative projects.',
  true,
  '[
    "https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&h=600&fit=crop",
    "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800&h=600&fit=crop",
    "https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=800&h=600&fit=crop"
  ]'::jsonb,
  '["WiFi", "Specialized Equipment", "Storage", "Collaborative Areas", "Workshops", "Events", "Networking", "Mentorship"]'::jsonb,
  'Rwanda',
  70,
  'Kigali',
  25,
  'Workshop',
  'Premium Member',
  NOW(),
  NOW(),
  '00000000-0000-0000-0000-000000000001'::uuid
); 