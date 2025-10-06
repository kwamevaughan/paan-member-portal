-- Create masterclasses table
CREATE TABLE IF NOT EXISTS masterclasses (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    format VARCHAR(100),
    date VARCHAR(50),
    time VARCHAR(50),
    member_price DECIMAL(10,2),
    member_original_price DECIMAL(10,2),
    non_member_price DECIMAL(10,2),
    non_member_original_price DECIMAL(10,2),
    currency VARCHAR(10) DEFAULT 'USD',
    category VARCHAR(100),
    level VARCHAR(50),
    instructor VARCHAR(255),
    instructor_title TEXT,
    instructor_bio TEXT,
    image_url TEXT,
    benefits TEXT[], -- Array of benefits
    partnership TEXT,
    status VARCHAR(20) DEFAULT 'upcoming', -- upcoming, live, completed, cancelled
    max_participants INTEGER,
    current_participants INTEGER DEFAULT 0,
    is_featured BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create masterclass categories table
CREATE TABLE IF NOT EXISTS masterclass_categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    slug VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create masterclass registrations table
CREATE TABLE IF NOT EXISTS masterclass_registrations (
    id SERIAL PRIMARY KEY,
    masterclass_id INTEGER REFERENCES masterclasses(id) ON DELETE CASCADE,
    user_id INTEGER, -- References candidates table
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(50),
    organization VARCHAR(255),
    pricing_type VARCHAR(20) NOT NULL, -- 'member' or 'non_member'
    amount_paid DECIMAL(10,2) NOT NULL,
    currency VARCHAR(10) DEFAULT 'USD',
    payment_reference VARCHAR(255),
    payment_status VARCHAR(20) DEFAULT 'pending', -- pending, completed, failed, refunded
    seat_count INTEGER DEFAULT 1,
    registration_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    payment_date TIMESTAMP WITH TIME ZONE,
    attendance_status VARCHAR(20) DEFAULT 'registered', -- registered, attended, no_show
    certificate_issued BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert default categories
INSERT INTO masterclass_categories (name, slug, description) VALUES
('Business Development', 'business-development', 'Strategies for growing your agency business'),
('Client Management', 'client-management', 'Building and maintaining strong client relationships'),
('Account Management', 'account-management', 'Managing client accounts effectively'),
('Financial Management', 'financial-management', 'Financial planning and management for agencies'),
('Leadership', 'leadership', 'Leadership skills for agency owners and managers'),
('Creative Strategy', 'creative-strategy', 'Developing effective creative strategies'),
('Digital Marketing', 'digital-marketing', 'Digital marketing techniques and trends')
ON CONFLICT (slug) DO NOTHING;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_masterclasses_status ON masterclasses(status);
CREATE INDEX IF NOT EXISTS idx_masterclasses_category ON masterclasses(category);
CREATE INDEX IF NOT EXISTS idx_masterclasses_date ON masterclasses(date);
CREATE INDEX IF NOT EXISTS idx_masterclass_registrations_masterclass_id ON masterclass_registrations(masterclass_id);
CREATE INDEX IF NOT EXISTS idx_masterclass_registrations_user_id ON masterclass_registrations(user_id);
CREATE INDEX IF NOT EXISTS idx_masterclass_registrations_email ON masterclass_registrations(email);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_masterclasses_updated_at BEFORE UPDATE ON masterclasses FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_masterclass_registrations_updated_at BEFORE UPDATE ON masterclass_registrations FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Enable RLS (Row Level Security)
ALTER TABLE masterclasses ENABLE ROW LEVEL SECURITY;
ALTER TABLE masterclass_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE masterclass_registrations ENABLE ROW LEVEL SECURITY;

-- Create policies for masterclasses (public read, admin write)
CREATE POLICY "Anyone can view masterclasses" ON masterclasses FOR SELECT USING (true);
CREATE POLICY "Only authenticated users can insert masterclasses" ON masterclasses FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Only authenticated users can update masterclasses" ON masterclasses FOR UPDATE USING (auth.role() = 'authenticated');

-- Create policies for categories (public read)
CREATE POLICY "Anyone can view categories" ON masterclass_categories FOR SELECT USING (true);

-- Create policies for registrations (users can view their own, admins can view all)
CREATE POLICY "Users can view their own registrations" ON masterclass_registrations FOR SELECT USING (
    auth.uid()::text = user_id::text OR 
    email = auth.jwt() ->> 'email'
);
CREATE POLICY "Users can insert their own registrations" ON masterclass_registrations FOR INSERT WITH CHECK (
    auth.uid()::text = user_id::text OR 
    email = auth.jwt() ->> 'email'
);