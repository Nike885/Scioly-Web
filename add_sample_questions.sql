-- Add Sample Quiz Questions to Supabase
-- Copy and paste this into your Supabase SQL Editor

INSERT INTO public.daily_quiz_questions (question, choices, correct_index, explanation) VALUES
('What is the study of fossils called?', ARRAY['Paleontology', 'Archaeology', 'Geology', 'Biology'], 0, 'Paleontology is the scientific study of fossils and ancient life forms.'),
('Which planet is known as the Red Planet?', ARRAY['Venus', 'Mars', 'Jupiter', 'Saturn'], 1, 'Mars is called the Red Planet due to its reddish appearance caused by iron oxide on its surface.'),
('What is the chemical symbol for gold?', ARRAY['Ag', 'Au', 'Fe', 'Cu'], 1, 'Au comes from the Latin word "aurum" meaning gold.'),
('What is the largest organ in the human body?', ARRAY['Heart', 'Brain', 'Liver', 'Skin'], 3, 'The skin is the largest organ, covering about 20 square feet in adults.'),
('Which gas do plants absorb from the atmosphere during photosynthesis?', ARRAY['Oxygen', 'Carbon Dioxide', 'Nitrogen', 'Hydrogen'], 1, 'Plants absorb carbon dioxide and release oxygen during photosynthesis.'); 