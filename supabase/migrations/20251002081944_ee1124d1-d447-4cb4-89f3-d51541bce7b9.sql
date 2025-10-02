-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- App role enum
CREATE TYPE app_role AS ENUM ('user', 'admin');

-- User roles table (separate from profiles for security)
CREATE TABLE user_roles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL DEFAULT 'user',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, role)
);

-- User profiles
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  name TEXT NOT NULL,
  avatar_url TEXT,
  trip_count INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Stations
CREATE TABLE stations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  code TEXT NOT NULL UNIQUE,
  city TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Trains
CREATE TABLE trains (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  code TEXT NOT NULL UNIQUE,
  class TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Train schedules
CREATE TABLE train_schedules (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  train_id UUID REFERENCES trains(id) ON DELETE CASCADE NOT NULL,
  from_station_id UUID REFERENCES stations(id) NOT NULL,
  to_station_id UUID REFERENCES stations(id) NOT NULL,
  departure_time TIMESTAMPTZ NOT NULL,
  arrival_time TIMESTAMPTZ NOT NULL,
  price NUMERIC NOT NULL,
  available_seats INT DEFAULT 100,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Orders
CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  schedule_id UUID REFERENCES train_schedules(id) NOT NULL,
  passenger_count INT NOT NULL DEFAULT 1,
  total_price NUMERIC NOT NULL,
  status TEXT NOT NULL DEFAULT 'booked',
  booking_code TEXT NOT NULL UNIQUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Refunds
CREATE TABLE refunds (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE NOT NULL,
  amount NUMERIC NOT NULL,
  status TEXT NOT NULL DEFAULT 'requested',
  reason TEXT,
  admin_note TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Refund logs for audit trail
CREATE TABLE refund_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  refund_id UUID REFERENCES refunds(id) ON DELETE CASCADE NOT NULL,
  from_status TEXT NOT NULL,
  to_status TEXT NOT NULL,
  admin_id UUID REFERENCES auth.users(id),
  note TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Route notifications
CREATE TABLE route_notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  train_id UUID REFERENCES trains(id),
  route TEXT NOT NULL,
  delay_minutes INT,
  created_by UUID REFERENCES auth.users(id) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Forum posts
CREATE TABLE posts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  content TEXT NOT NULL,
  is_pinned BOOLEAN DEFAULT FALSE,
  like_count INT DEFAULT 0,
  reply_count INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Post replies
CREATE TABLE post_replies (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  post_id UUID REFERENCES posts(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Post likes
CREATE TABLE post_likes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  post_id UUID REFERENCES posts(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(post_id, user_id)
);

-- Enable RLS
ALTER TABLE user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE stations ENABLE ROW LEVEL SECURITY;
ALTER TABLE trains ENABLE ROW LEVEL SECURITY;
ALTER TABLE train_schedules ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE refunds ENABLE ROW LEVEL SECURITY;
ALTER TABLE refund_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE route_notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE post_replies ENABLE ROW LEVEL SECURITY;
ALTER TABLE post_likes ENABLE ROW LEVEL SECURITY;

-- Security definer function to check roles
CREATE OR REPLACE FUNCTION has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

-- RLS Policies for profiles
CREATE POLICY "Profiles viewable by everyone" ON profiles FOR SELECT USING (TRUE);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- RLS for user_roles
CREATE POLICY "Roles viewable by owner" ON user_roles FOR SELECT USING (user_id = auth.uid() OR has_role(auth.uid(), 'admin'));
CREATE POLICY "Only admins can manage roles" ON user_roles FOR ALL USING (has_role(auth.uid(), 'admin'));

-- RLS for stations (public read, admin write)
CREATE POLICY "Stations viewable by all" ON stations FOR SELECT USING (TRUE);
CREATE POLICY "Admins can manage stations" ON stations FOR ALL USING (has_role(auth.uid(), 'admin'));

-- RLS for trains (public read, admin write)
CREATE POLICY "Trains viewable by all" ON trains FOR SELECT USING (TRUE);
CREATE POLICY "Admins can manage trains" ON trains FOR ALL USING (has_role(auth.uid(), 'admin'));

-- RLS for train_schedules (public read, admin write)
CREATE POLICY "Schedules viewable by all" ON train_schedules FOR SELECT USING (TRUE);
CREATE POLICY "Admins can manage schedules" ON train_schedules FOR ALL USING (has_role(auth.uid(), 'admin'));

-- RLS for orders
CREATE POLICY "Users can view own orders" ON orders FOR SELECT USING (user_id = auth.uid() OR has_role(auth.uid(), 'admin'));
CREATE POLICY "Users can create orders" ON orders FOR INSERT WITH CHECK (user_id = auth.uid());
CREATE POLICY "Admins can update orders" ON orders FOR UPDATE USING (has_role(auth.uid(), 'admin'));

-- RLS for refunds
CREATE POLICY "Users view own refunds" ON refunds FOR SELECT USING (
  EXISTS (SELECT 1 FROM orders WHERE orders.id = order_id AND orders.user_id = auth.uid())
  OR has_role(auth.uid(), 'admin')
);
CREATE POLICY "Users can request refunds" ON refunds FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM orders WHERE orders.id = order_id AND orders.user_id = auth.uid())
);
CREATE POLICY "Admins can update refunds" ON refunds FOR UPDATE USING (has_role(auth.uid(), 'admin'));

-- RLS for refund_logs
CREATE POLICY "Refund logs viewable with refund access" ON refund_logs FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM refunds r
    JOIN orders o ON r.order_id = o.id
    WHERE r.id = refund_id AND (o.user_id = auth.uid() OR has_role(auth.uid(), 'admin'))
  )
);
CREATE POLICY "Admins create refund logs" ON refund_logs FOR INSERT WITH CHECK (has_role(auth.uid(), 'admin'));

-- RLS for route_notifications
CREATE POLICY "Notifications viewable by all" ON route_notifications FOR SELECT USING (TRUE);
CREATE POLICY "Admins can create notifications" ON route_notifications FOR INSERT WITH CHECK (has_role(auth.uid(), 'admin'));

-- RLS for posts
CREATE POLICY "Posts viewable by all" ON posts FOR SELECT USING (TRUE);
CREATE POLICY "Authenticated users can create posts" ON posts FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "Users can update own posts" ON posts FOR UPDATE USING (user_id = auth.uid());
CREATE POLICY "Users can delete own posts or admins" ON posts FOR DELETE USING (user_id = auth.uid() OR has_role(auth.uid(), 'admin'));

-- RLS for post_replies
CREATE POLICY "Replies viewable by all" ON post_replies FOR SELECT USING (TRUE);
CREATE POLICY "Authenticated users can reply" ON post_replies FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "Users can delete own replies" ON post_replies FOR DELETE USING (user_id = auth.uid());

-- RLS for post_likes
CREATE POLICY "Likes viewable by all" ON post_likes FOR SELECT USING (TRUE);
CREATE POLICY "Users can like posts" ON post_likes FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "Users can unlike posts" ON post_likes FOR DELETE USING (user_id = auth.uid());

-- Function to create profile on signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER
LANGUAGE PLPGSQL
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO profiles (id, email, name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1))
  );
  
  -- Assign default user role
  INSERT INTO user_roles (user_id, role)
  VALUES (NEW.id, 'user');
  
  RETURN NEW;
END;
$$;

-- Trigger for new user
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Function to update post counts
CREATE OR REPLACE FUNCTION update_post_reply_count()
RETURNS TRIGGER
LANGUAGE PLPGSQL
AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE posts SET reply_count = reply_count + 1 WHERE id = NEW.post_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE posts SET reply_count = reply_count - 1 WHERE id = OLD.post_id;
  END IF;
  RETURN NULL;
END;
$$;

CREATE TRIGGER update_reply_count
  AFTER INSERT OR DELETE ON post_replies
  FOR EACH ROW EXECUTE FUNCTION update_post_reply_count();

-- Function to update like counts
CREATE OR REPLACE FUNCTION update_post_like_count()
RETURNS TRIGGER
LANGUAGE PLPGSQL
AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE posts SET like_count = like_count + 1 WHERE id = NEW.post_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE posts SET like_count = like_count - 1 WHERE id = OLD.post_id;
  END IF;
  RETURN NULL;
END;
$$;

CREATE TRIGGER update_like_count
  AFTER INSERT OR DELETE ON post_likes
  FOR EACH ROW EXECUTE FUNCTION update_post_like_count();

-- Enable realtime for key tables
ALTER PUBLICATION supabase_realtime ADD TABLE refunds;
ALTER PUBLICATION supabase_realtime ADD TABLE route_notifications;
ALTER PUBLICATION supabase_realtime ADD TABLE posts;

-- Seed data
INSERT INTO stations (id, name, code, city) VALUES
  ('11111111-1111-1111-1111-111111111111', 'Gambir', 'GMR', 'Jakarta'),
  ('22222222-2222-2222-2222-222222222222', 'Jatinegara', 'JTG', 'Jakarta'),
  ('33333333-3333-3333-3333-333333333333', 'Bekasi', 'BKS', 'Bekasi'),
  ('44444444-4444-4444-4444-444444444444', 'Cikampek', 'CKP', 'Karawang'),
  ('55555555-5555-5555-5555-555555555555', 'Bandung', 'BD', 'Bandung'),
  ('66666666-6666-6666-6666-666666666666', 'Yogyakarta', 'YK', 'Yogyakarta'),
  ('77777777-7777-7777-7777-777777777777', 'Solo Balapan', 'SLO', 'Solo'),
  ('88888888-8888-8888-8888-888888888888', 'Semarang Tawang', 'SMT', 'Semarang');

INSERT INTO trains (id, name, code, class) VALUES
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Argo Parahyangan', 'AP', 'Eksekutif'),
  ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'Pramex', 'PX', 'Ekonomi'),
  ('cccccccc-cccc-cccc-cccc-cccccccccccc', 'Bima', 'BM', 'Eksekutif'),
  ('dddddddd-dddd-dddd-dddd-dddddddddddd', 'Argo Bromo Anggrek', 'ABA', 'Eksekutif'),
  ('eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', 'Gajayana', 'GY', 'Bisnis');

-- Sample schedules (next 3 days)
INSERT INTO train_schedules (train_id, from_station_id, to_station_id, departure_time, arrival_time, price, available_seats) VALUES
  -- Gambir to Bandung
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '11111111-1111-1111-1111-111111111111', '55555555-5555-5555-5555-555555555555', 
   NOW() + INTERVAL '1 day' + INTERVAL '6 hours', NOW() + INTERVAL '1 day' + INTERVAL '9 hours', 150000, 80),
  
  -- Bandung to Gambir
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '55555555-5555-5555-5555-555555555555', '11111111-1111-1111-1111-111111111111',
   NOW() + INTERVAL '1 day' + INTERVAL '15 hours', NOW() + INTERVAL '1 day' + INTERVAL '18 hours', 150000, 75),
  
  -- Gambir to Yogyakarta
  ('dddddddd-dddd-dddd-dddd-dddddddddddd', '11111111-1111-1111-1111-111111111111', '66666666-6666-6666-6666-666666666666',
   NOW() + INTERVAL '2 days' + INTERVAL '7 hours', NOW() + INTERVAL '2 days' + INTERVAL '15 hours', 300000, 60),
  
  -- Pramex commuter
  ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', '22222222-2222-2222-2222-222222222222', '33333333-3333-3333-3333-333333333333',
   NOW() + INTERVAL '1 day' + INTERVAL '8 hours', NOW() + INTERVAL '1 day' + INTERVAL '9 hours', 25000, 150);