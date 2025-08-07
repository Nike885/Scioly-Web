-- Sample Science Olympiad Quiz Questions
-- Copy and paste this into your Supabase SQL Editor to add sample questions

INSERT INTO public.daily_quiz_questions (question, choices, correct_index, explanation) VALUES
('What is the study of fossils called?', ARRAY['Paleontology', 'Archaeology', 'Geology', 'Biology'], 0, 'Paleontology is the scientific study of fossils and ancient life forms.'),
('Which planet is known as the Red Planet?', ARRAY['Venus', 'Mars', 'Jupiter', 'Saturn'], 1, 'Mars is called the Red Planet due to its reddish appearance caused by iron oxide on its surface.'),
('What is the chemical symbol for gold?', ARRAY['Ag', 'Au', 'Fe', 'Cu'], 1, 'Au comes from the Latin word "aurum" meaning gold.'),
('What is the largest organ in the human body?', ARRAY['Heart', 'Brain', 'Liver', 'Skin'], 3, 'The skin is the largest organ, covering about 20 square feet in adults.'),
('Which gas do plants absorb from the atmosphere during photosynthesis?', ARRAY['Oxygen', 'Carbon Dioxide', 'Nitrogen', 'Hydrogen'], 1, 'Plants absorb carbon dioxide and release oxygen during photosynthesis.'),
('What is the atomic number of carbon?', ARRAY['4', '6', '8', '12'], 1, 'Carbon has 6 protons, giving it an atomic number of 6.'),
('Which of these is NOT a state of matter?', ARRAY['Solid', 'Liquid', 'Gas', 'Energy'], 3, 'Energy is not a state of matter. The three main states are solid, liquid, and gas.'),
('What is the speed of light in a vacuum?', ARRAY['299,792 km/s', '199,792 km/s', '399,792 km/s', '499,792 km/s'], 0, 'The speed of light in a vacuum is approximately 299,792 kilometers per second.'),
('Which element is most abundant in the Earth''s crust?', ARRAY['Iron', 'Oxygen', 'Silicon', 'Aluminum'], 1, 'Oxygen is the most abundant element in the Earth''s crust, making up about 46% by weight.'),
('What is the process by which water changes from liquid to gas?', ARRAY['Condensation', 'Evaporation', 'Sublimation', 'Freezing'], 1, 'Evaporation is the process by which water changes from liquid to gas at temperatures below boiling point.'),
('Which of these is a renewable energy source?', ARRAY['Coal', 'Natural Gas', 'Solar Power', 'Nuclear Power'], 2, 'Solar power is a renewable energy source that harnesses energy from the sun.'),
('What is the main function of the mitochondria?', ARRAY['Protein synthesis', 'Energy production', 'Waste removal', 'Cell division'], 1, 'Mitochondria are known as the powerhouse of the cell, producing energy through cellular respiration.'),
('Which gas is responsible for the greenhouse effect?', ARRAY['Oxygen', 'Nitrogen', 'Carbon Dioxide', 'Helium'], 2, 'Carbon dioxide is a major greenhouse gas that traps heat in the Earth''s atmosphere.'),
('What is the study of earthquakes called?', ARRAY['Meteorology', 'Seismology', 'Volcanology', 'Geology'], 1, 'Seismology is the scientific study of earthquakes and seismic waves.'),
('Which planet has the most moons in our solar system?', ARRAY['Jupiter', 'Saturn', 'Uranus', 'Neptune'], 1, 'Saturn has the most moons, with over 80 confirmed moons orbiting the planet.'); 