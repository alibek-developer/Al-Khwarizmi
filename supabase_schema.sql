-- ==========================================================
-- 1. JADVALLARNI TOZALASH (TARTIB BILAN)
-- ==========================================================
DROP TABLE IF EXISTS game_results CASCADE;
DROP TABLE IF EXISTS certificates CASCADE;
DROP TABLE IF EXISTS homework_submissions CASCADE;
DROP TABLE IF EXISTS attendance CASCADE;
DROP TABLE IF EXISTS materials CASCADE;
DROP TABLE IF EXISTS homeworks CASCADE;
DROP TABLE IF EXISTS group_enrollments CASCADE;
DROP TABLE IF EXISTS groups CASCADE;
DROP TABLE IF EXISTS students CASCADE;
DROP TABLE IF EXISTS reviews CASCADE;
DROP TABLE IF EXISTS courses CASCADE;
DROP TABLE IF EXISTS mentors CASCADE;
DROP TABLE IF EXISTS categories CASCADE;

-- ==========================================================
-- 2. ASOSIY STRUKTURA (KATEGORIYA, MENTOR, KURS)
-- ==========================================================

CREATE TABLE categories (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE mentors (
    id SERIAL PRIMARY KEY,
    full_name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,    -- Mentor login uchun
    password TEXT NOT NULL,         -- Mentor parol
    specialty_en TEXT,
    specialty_uz TEXT,
    experience TEXT,
    former_company TEXT,
    about_en TEXT,
    about_uz TEXT,
    skills TEXT[],
    total_students INTEGER DEFAULT 0,
    rating DECIMAL DEFAULT 5.0,
    image_url TEXT,
    phone TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE courses (
    id SERIAL PRIMARY KEY,
    category_id INTEGER REFERENCES categories(id) ON DELETE SET NULL,
    mentor_id INTEGER REFERENCES mentors(id) ON DELETE SET NULL,
    title_en TEXT NOT NULL,
    title_uz TEXT NOT NULL,
    duration TEXT,
    level TEXT,
    lessons_count INTEGER DEFAULT 0,
    total_students INTEGER DEFAULT 0,
    price DECIMAL DEFAULT 0,
    image_url TEXT,
    badge TEXT,
    rating DECIMAL DEFAULT 5.0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ==========================================================
-- 3. TALABALAR JADVALI (LOGIN VA REYTING BALLARI BILAN)
-- ==========================================================

CREATE TABLE students (
    id SERIAL PRIMARY KEY,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    father_name TEXT,
    email TEXT UNIQUE,                      -- Email ixtiyoriy (nullable) qilindi
    password TEXT NOT NULL DEFAULT '123456', -- O'quvchi parol
    phone TEXT,
    parent_phone TEXT,
    birth_date TEXT,
    pinfl TEXT,
    total_points INTEGER DEFAULT 0,         -- O'yin va darslar uchun umumiy ball
    status TEXT DEFAULT 'active',
    avatar TEXT,
    color TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    certificate_id INTEGER,                 -- To'g'ridan-to'g'ri jadvalga qo'shildi
    course_id INTEGER REFERENCES courses(id) ON DELETE SET NULL, -- Kurs ID qo'shildi
    payment_amount DECIMAL DEFAULT 0        -- Kurs narxi / to'lov miqdori qo'shildi
);

-- ==========================================================
-- 4. O'QUV JARAYONI (GURUH, A'ZOLIK, DAVOMAT)
-- ==========================================================

CREATE TABLE groups (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    course_id INTEGER REFERENCES courses(id) ON DELETE CASCADE,
    mentor_id INTEGER REFERENCES mentors(id) ON DELETE SET NULL,
    price DECIMAL DEFAULT 0,
    duration TEXT,
    duration_type TEXT,
    schedule_days TEXT,
    class_time TEXT,
    start_date TEXT,
    max_students INTEGER DEFAULT 20,
    status TEXT DEFAULT 'active',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE group_enrollments (
    id SERIAL PRIMARY KEY,
    group_id INTEGER REFERENCES groups(id) ON DELETE CASCADE,
    student_id INTEGER REFERENCES students(id) ON DELETE CASCADE,
    enrolled_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(group_id, student_id)
);

CREATE TABLE attendance (
    id SERIAL PRIMARY KEY,
    group_id INTEGER REFERENCES groups(id) ON DELETE CASCADE,
    student_id INTEGER REFERENCES students(id) ON DELETE CASCADE,
    date TEXT DEFAULT CURRENT_DATE::TEXT,
    status TEXT CHECK (status IN ('present', 'absent', 'late', 'excused')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ==========================================================
-- 5. O'QUVCHI UCHUN MATERIALLAR VA VAZIFALAR
-- ==========================================================

CREATE TABLE materials (
    id SERIAL PRIMARY KEY,
    group_id INTEGER REFERENCES groups(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    file_url TEXT,
    link_url TEXT,
    category TEXT DEFAULT 'other',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE homeworks (
    id SERIAL PRIMARY KEY,
    group_id INTEGER REFERENCES groups(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    due_date TEXT,
    file_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE homework_submissions (
    id SERIAL PRIMARY KEY,
    homework_id INTEGER REFERENCES homeworks(id) ON DELETE CASCADE,
    student_id INTEGER REFERENCES students(id) ON DELETE CASCADE,
    file_url TEXT,
    comment TEXT,
    status TEXT DEFAULT 'pending', -- 'pending', 'accepted', 'rejected'
    grade INTEGER,                 -- Mentor qo'yadigan ball
    submitted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ==========================================================
-- 6. O'YINLAR, REYTING VA SERTIFIKATLAR
-- ==========================================================

CREATE TABLE game_results (
    id SERIAL PRIMARY KEY,
    student_id INTEGER REFERENCES students(id) ON DELETE CASCADE,
    game_name TEXT NOT NULL,
    points_earned INTEGER DEFAULT 0,
    played_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE certificates (
    id SERIAL PRIMARY KEY,
    student_id INTEGER REFERENCES students(id) ON DELETE CASCADE,
    course_id INTEGER REFERENCES courses(id) ON DELETE CASCADE,
    certificate_url TEXT NOT NULL,
    issue_date DATE DEFAULT CURRENT_DATE,
    UNIQUE(student_id, course_id)
);

CREATE TABLE reviews (
    id SERIAL PRIMARY KEY,
    student_name TEXT NOT NULL,
    course_id INTEGER REFERENCES courses(id) ON DELETE CASCADE,
    rating INTEGER DEFAULT 5,
    comment TEXT,
    is_approved BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ==========================================================
-- 7. TO'LOVLAR JADVALI
-- ==========================================================

CREATE TABLE payments (
    id SERIAL PRIMARY KEY,
    student_id INTEGER REFERENCES students(id) ON DELETE CASCADE,
    amount DECIMAL NOT NULL DEFAULT 0,
    method TEXT NOT NULL DEFAULT 'Karta',
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed')),
    description TEXT,
    paid_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ==========================================================
-- 8. XAVFSIZLIK (RLS) O'CHIRISH
-- ==========================================================

ALTER TABLE categories DISABLE ROW LEVEL SECURITY;
ALTER TABLE mentors DISABLE ROW LEVEL SECURITY;
ALTER TABLE courses DISABLE ROW LEVEL SECURITY;
ALTER TABLE groups DISABLE ROW LEVEL SECURITY;
ALTER TABLE students DISABLE ROW LEVEL SECURITY;
ALTER TABLE group_enrollments DISABLE ROW LEVEL SECURITY;
ALTER TABLE attendance DISABLE ROW LEVEL SECURITY;
ALTER TABLE reviews DISABLE ROW LEVEL SECURITY;
ALTER TABLE homeworks DISABLE ROW LEVEL SECURITY;
ALTER TABLE materials DISABLE ROW LEVEL SECURITY;
ALTER TABLE homework_submissions DISABLE ROW LEVEL SECURITY;
ALTER TABLE game_results DISABLE ROW LEVEL SECURITY;
ALTER TABLE certificates DISABLE ROW LEVEL SECURITY;
ALTER TABLE payments DISABLE ROW LEVEL SECURITY;
