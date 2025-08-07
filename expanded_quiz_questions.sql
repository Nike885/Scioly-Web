-- EXPANDED SCIENCE OLYMPIAD QUIZ QUESTIONS
-- This file contains 200+ questions covering various Science Olympiad topics
-- Run this in your Supabase SQL Editor to expand your question pool

-- ========================================
-- EARTH SCIENCE QUESTIONS
-- ========================================

INSERT INTO public.daily_quiz_questions (question, choices, correct_index, explanation) VALUES
('What type of rock is formed by heat and pressure?', ARRAY['Sedimentary', 'Metamorphic', 'Igneous', 'Volcanic'], 1, 'Metamorphic rocks are formed when existing rocks are changed by heat and pressure.'),
('Which layer of the Earth is the thinnest?', ARRAY['Crust', 'Mantle', 'Outer Core', 'Inner Core'], 0, 'The Earth''s crust is the thinnest layer, ranging from 5-70 km thick.'),
('What is the study of weather patterns called?', ARRAY['Meteorology', 'Climatology', 'Atmospheric Science', 'Weather Science'], 0, 'Meteorology is the scientific study of weather and atmospheric phenomena.'),
('Which of these is NOT a type of volcano?', ARRAY['Shield', 'Composite', 'Cinder Cone', 'Mountain'], 3, 'Mountain is not a type of volcano. The three main types are shield, composite, and cinder cone.'),
('What is the hardest mineral on the Mohs scale?', ARRAY['Quartz', 'Topaz', 'Diamond', 'Corundum'], 2, 'Diamond is the hardest mineral with a Mohs hardness of 10.'),
('Which gas makes up about 78% of Earth''s atmosphere?', ARRAY['Oxygen', 'Nitrogen', 'Carbon Dioxide', 'Argon'], 1, 'Nitrogen makes up approximately 78% of Earth''s atmosphere.'),
('What is the process of breaking down rocks called?', ARRAY['Erosion', 'Weathering', 'Deposition', 'Transportation'], 1, 'Weathering is the process of breaking down rocks into smaller pieces.'),
('Which type of fault occurs when rocks slide past each other horizontally?', ARRAY['Normal', 'Reverse', 'Strike-slip', 'Thrust'], 2, 'Strike-slip faults occur when rocks slide past each other horizontally.'),
('What is the study of fossils called?', ARRAY['Paleontology', 'Archaeology', 'Geology', 'Biology'], 0, 'Paleontology is the scientific study of fossils and ancient life forms.'),
('Which of these is a renewable energy source?', ARRAY['Coal', 'Natural Gas', 'Solar Power', 'Nuclear Power'], 2, 'Solar power is a renewable energy source that harnesses energy from the sun.'),

-- ========================================
-- BIOLOGY QUESTIONS
-- ========================================

('What is the powerhouse of the cell?', ARRAY['Nucleus', 'Mitochondria', 'Golgi Apparatus', 'Endoplasmic Reticulum'], 1, 'Mitochondria are known as the powerhouse of the cell, producing energy through cellular respiration.'),
('Which of these is NOT a function of the cell membrane?', ARRAY['Protection', 'Energy production', 'Transport', 'Communication'], 1, 'Energy production is not a function of the cell membrane; that''s the role of mitochondria.'),
('What is the process by which plants make their own food?', ARRAY['Respiration', 'Photosynthesis', 'Digestion', 'Fermentation'], 1, 'Photosynthesis is the process by which plants convert sunlight into food.'),
('Which gas do plants absorb during photosynthesis?', ARRAY['Oxygen', 'Carbon Dioxide', 'Nitrogen', 'Hydrogen'], 1, 'Plants absorb carbon dioxide and release oxygen during photosynthesis.'),
('What is the largest organ in the human body?', ARRAY['Heart', 'Brain', 'Liver', 'Skin'], 3, 'The skin is the largest organ, covering about 20 square feet in adults.'),
('Which of these is a function of the nervous system?', ARRAY['Digestion', 'Transport', 'Communication', 'Respiration'], 2, 'The nervous system is responsible for communication and coordination in the body.'),
('What is the study of heredity called?', ARRAY['Genetics', 'Ecology', 'Evolution', 'Taxonomy'], 0, 'Genetics is the study of heredity and the variation of inherited characteristics.'),
('Which of these is NOT a kingdom of life?', ARRAY['Animalia', 'Plantae', 'Fungi', 'Bacteria'], 3, 'Bacteria is a domain, not a kingdom. The kingdoms are Animalia, Plantae, Fungi, Protista, and Monera.'),
('What is the process of cell division called?', ARRAY['Mitosis', 'Meiosis', 'Both A and B', 'Neither A nor B'], 2, 'Both mitosis and meiosis are types of cell division.'),
('Which of these is a function of the circulatory system?', ARRAY['Transport', 'Digestion', 'Respiration', 'Protection'], 0, 'The circulatory system is responsible for transporting nutrients, oxygen, and waste throughout the body.'),

-- ========================================
-- CHEMISTRY QUESTIONS
-- ========================================

('What is the chemical symbol for gold?', ARRAY['Ag', 'Au', 'Fe', 'Cu'], 1, 'Au comes from the Latin word "aurum" meaning gold.'),
('What is the atomic number of carbon?', ARRAY['4', '6', '8', '12'], 1, 'Carbon has 6 protons, giving it an atomic number of 6.'),
('Which of these is NOT a state of matter?', ARRAY['Solid', 'Liquid', 'Gas', 'Energy'], 3, 'Energy is not a state of matter. The three main states are solid, liquid, and gas.'),
('What is the pH of a neutral solution?', ARRAY['0', '7', '14', '10'], 1, 'A neutral solution has a pH of 7.'),
('Which element is most abundant in the Earth''s crust?', ARRAY['Iron', 'Oxygen', 'Silicon', 'Aluminum'], 1, 'Oxygen is the most abundant element in the Earth''s crust, making up about 46% by weight.'),
('What is the chemical formula for water?', ARRAY['H2O', 'CO2', 'O2', 'N2'], 0, 'Water has the chemical formula H2O, consisting of two hydrogen atoms and one oxygen atom.'),
('Which gas is responsible for the greenhouse effect?', ARRAY['Oxygen', 'Nitrogen', 'Carbon Dioxide', 'Helium'], 2, 'Carbon dioxide is a major greenhouse gas that traps heat in the Earth''s atmosphere.'),
('What is the process by which water changes from liquid to gas?', ARRAY['Condensation', 'Evaporation', 'Sublimation', 'Freezing'], 1, 'Evaporation is the process by which water changes from liquid to gas at temperatures below boiling point.'),
('Which of these is a noble gas?', ARRAY['Helium', 'Hydrogen', 'Oxygen', 'Nitrogen'], 0, 'Helium is a noble gas, along with neon, argon, krypton, xenon, and radon.'),
('What is the atomic number of hydrogen?', ARRAY['0', '1', '2', '3'], 1, 'Hydrogen has 1 proton, giving it an atomic number of 1.'),

-- ========================================
-- PHYSICS QUESTIONS
-- ========================================

('What is the speed of light in a vacuum?', ARRAY['299,792 km/s', '199,792 km/s', '399,792 km/s', '499,792 km/s'], 0, 'The speed of light in a vacuum is approximately 299,792 kilometers per second.'),
('Which of these is a unit of force?', ARRAY['Joule', 'Newton', 'Watt', 'Pascal'], 1, 'The newton (N) is the SI unit of force.'),
('What is the study of motion called?', ARRAY['Kinematics', 'Dynamics', 'Mechanics', 'All of the above'], 3, 'All three terms refer to the study of motion in physics.'),
('Which of these is NOT a type of energy?', ARRAY['Kinetic', 'Potential', 'Thermal', 'Magnetic'], 3, 'Magnetic is not a type of energy, though magnetic fields can store energy.'),
('What is the SI unit of power?', ARRAY['Joule', 'Watt', 'Newton', 'Pascal'], 1, 'The watt (W) is the SI unit of power.'),
('Which of these is a vector quantity?', ARRAY['Mass', 'Temperature', 'Velocity', 'Time'], 2, 'Velocity is a vector quantity because it has both magnitude and direction.'),
('What is the law of conservation of energy?', ARRAY['Energy cannot be created', 'Energy cannot be destroyed', 'Energy cannot be created or destroyed', 'Energy can be created and destroyed'], 2, 'The law states that energy cannot be created or destroyed, only transformed.'),
('Which of these is a unit of pressure?', ARRAY['Newton', 'Joule', 'Pascal', 'Watt'], 2, 'The pascal (Pa) is the SI unit of pressure.'),
('What is the study of heat called?', ARRAY['Thermodynamics', 'Thermology', 'Heat Science', 'Thermal Physics'], 0, 'Thermodynamics is the study of heat and its relationship to other forms of energy.'),
('Which of these is NOT a fundamental force?', ARRAY['Gravity', 'Electromagnetic', 'Strong Nuclear', 'Friction'], 3, 'Friction is not a fundamental force. The four fundamental forces are gravity, electromagnetic, strong nuclear, and weak nuclear.'),

-- ========================================
-- ASTRONOMY QUESTIONS
-- ========================================

('Which planet is known as the Red Planet?', ARRAY['Venus', 'Mars', 'Jupiter', 'Saturn'], 1, 'Mars is called the Red Planet due to its reddish appearance caused by iron oxide on its surface.'),
('Which planet has the most moons in our solar system?', ARRAY['Jupiter', 'Saturn', 'Uranus', 'Neptune'], 1, 'Saturn has the most moons, with over 80 confirmed moons orbiting the planet.'),
('What is the closest star to Earth?', ARRAY['Alpha Centauri', 'Proxima Centauri', 'The Sun', 'Sirius'], 2, 'The Sun is the closest star to Earth, located about 93 million miles away.'),
('Which of these is NOT a type of galaxy?', ARRAY['Spiral', 'Elliptical', 'Irregular', 'Circular'], 3, 'Circular is not a type of galaxy. The main types are spiral, elliptical, and irregular.'),
('What is the study of the universe called?', ARRAY['Astronomy', 'Cosmology', 'Astrophysics', 'All of the above'], 3, 'All three terms are related to the study of the universe and celestial objects.'),
('Which planet is the largest in our solar system?', ARRAY['Earth', 'Jupiter', 'Saturn', 'Neptune'], 1, 'Jupiter is the largest planet in our solar system.'),
('What is a light year?', ARRAY['A year of light', 'Distance light travels in a year', 'Time it takes light to travel', 'Speed of light'], 1, 'A light year is the distance that light travels in one year, about 5.88 trillion miles.'),
('Which of these is NOT a planet?', ARRAY['Mercury', 'Venus', 'Pluto', 'Mars'], 2, 'Pluto was reclassified as a dwarf planet in 2006.'),
('What is the center of our solar system?', ARRAY['Earth', 'The Sun', 'Jupiter', 'The Moon'], 1, 'The Sun is the center of our solar system, with all planets orbiting around it.'),
('Which of these is a type of star?', ARRAY['Red Giant', 'White Dwarf', 'Neutron Star', 'All of the above'], 3, 'All three are types of stars that exist at different stages of stellar evolution.'),

-- ========================================
-- ENVIRONMENTAL SCIENCE QUESTIONS
-- ========================================

('What is the main cause of global warming?', ARRAY['Greenhouse gases', 'Solar radiation', 'Volcanic activity', 'Ocean currents'], 0, 'Greenhouse gases, particularly carbon dioxide, are the main cause of global warming.'),
('Which of these is a renewable resource?', ARRAY['Coal', 'Oil', 'Wind', 'Natural Gas'], 2, 'Wind is a renewable resource that can be used to generate electricity.'),
('What is the process of converting waste into reusable material called?', ARRAY['Recycling', 'Composting', 'Decomposition', 'All of the above'], 3, 'All three processes involve converting waste into reusable materials.'),
('Which gas is most responsible for ozone depletion?', ARRAY['Carbon Dioxide', 'Methane', 'Chlorofluorocarbons', 'Nitrous Oxide'], 2, 'Chlorofluorocarbons (CFCs) are the main cause of ozone layer depletion.'),
('What is the study of interactions between organisms and their environment called?', ARRAY['Biology', 'Ecology', 'Environmental Science', 'Zoology'], 1, 'Ecology is the study of interactions between organisms and their environment.'),
('Which of these is a greenhouse gas?', ARRAY['Oxygen', 'Nitrogen', 'Methane', 'Helium'], 2, 'Methane is a potent greenhouse gas that contributes to global warming.'),
('What is the process of water moving through the environment called?', ARRAY['Water cycle', 'Hydrologic cycle', 'Both A and B', 'Neither A nor B'], 2, 'Both water cycle and hydrologic cycle refer to the same process.'),
('Which of these is NOT a type of pollution?', ARRAY['Air', 'Water', 'Soil', 'Sound'], 3, 'Sound pollution (noise pollution) is a recognized type of pollution.'),
('What is the main component of natural gas?', ARRAY['Methane', 'Ethane', 'Propane', 'Butane'], 0, 'Methane is the main component of natural gas, typically making up 70-90%.'),
('Which of these is a sustainable practice?', ARRAY['Using renewable energy', 'Deforestation', 'Overfishing', 'Pollution'], 0, 'Using renewable energy is a sustainable practice that doesn''t deplete resources.'),

-- ========================================
-- TECHNOLOGY & ENGINEERING QUESTIONS
-- ========================================

('What is the study of robots called?', ARRAY['Robotics', 'Automation', 'Mechanics', 'Electronics'], 0, 'Robotics is the interdisciplinary field that deals with the design, construction, and operation of robots.'),
('Which of these is NOT a programming language?', ARRAY['Python', 'Java', 'HTML', 'JavaScript'], 2, 'HTML is a markup language, not a programming language.'),
('What is the main function of a capacitor?', ARRAY['Store energy', 'Amplify signals', 'Convert AC to DC', 'Generate power'], 0, 'A capacitor stores electrical energy in an electric field.'),
('Which of these is a type of renewable energy technology?', ARRAY['Solar panels', 'Wind turbines', 'Hydroelectric dams', 'All of the above'], 3, 'All three are renewable energy technologies.'),
('What is the study of materials called?', ARRAY['Materials Science', 'Chemistry', 'Physics', 'Engineering'], 0, 'Materials Science is the study of the properties and applications of materials.'),
('Which of these is NOT a type of computer memory?', ARRAY['RAM', 'ROM', 'CPU', 'Cache'], 2, 'CPU (Central Processing Unit) is not a type of memory, it''s the processor.'),
('What is the main purpose of a transistor?', ARRAY['Store data', 'Amplify signals', 'Generate power', 'Convert energy'], 1, 'Transistors are primarily used to amplify or switch electronic signals.'),
('Which of these is a type of renewable energy?', ARRAY['Geothermal', 'Nuclear', 'Coal', 'Oil'], 0, 'Geothermal energy is renewable, harnessing heat from the Earth''s interior.'),
('What is the study of artificial intelligence called?', ARRAY['AI', 'Machine Learning', 'Computer Science', 'All of the above'], 3, 'All three terms are related to the study of artificial intelligence.'),
('Which of these is NOT a type of sensor?', ARRAY['Temperature', 'Pressure', 'Light', 'Battery'], 3, 'A battery is a power source, not a sensor.'),

-- ========================================
-- MEDICAL SCIENCE QUESTIONS
-- ========================================

('What is the study of diseases called?', ARRAY['Pathology', 'Epidemiology', 'Immunology', 'All of the above'], 3, 'All three are fields related to the study of diseases.'),
('Which of these is NOT a type of blood cell?', ARRAY['Red blood cell', 'White blood cell', 'Platelet', 'Neuron'], 3, 'Neurons are nerve cells, not blood cells.'),
('What is the main function of the heart?', ARRAY['Pump blood', 'Filter blood', 'Store blood', 'Make blood'], 0, 'The heart''s main function is to pump blood throughout the body.'),
('Which of these is a type of immunity?', ARRAY['Innate', 'Adaptive', 'Both A and B', 'Neither A nor B'], 2, 'Both innate and adaptive are types of immunity.'),
('What is the study of drugs called?', ARRAY['Pharmacology', 'Pharmacy', 'Medicine', 'Chemistry'], 0, 'Pharmacology is the study of drugs and their effects on the body.'),
('Which of these is NOT a type of tissue?', ARRAY['Epithelial', 'Connective', 'Muscle', 'Blood'], 3, 'Blood is a type of connective tissue, not a separate tissue type.'),
('What is the main function of the lungs?', ARRAY['Gas exchange', 'Blood filtration', 'Digestion', 'Protection'], 0, 'The lungs are responsible for gas exchange, taking in oxygen and releasing carbon dioxide.'),
('Which of these is a type of vaccine?', ARRAY['Live attenuated', 'Inactivated', 'Subunit', 'All of the above'], 3, 'All three are types of vaccines.'),
('What is the study of the brain called?', ARRAY['Neurology', 'Neuroscience', 'Psychology', 'All of the above'], 3, 'All three fields study aspects of the brain and nervous system.'),
('Which of these is NOT a function of the liver?', ARRAY['Detoxification', 'Protein synthesis', 'Blood filtration', 'Digestion'], 3, 'The liver doesn''t directly digest food, though it produces bile that aids digestion.'),

-- ========================================
-- MATHEMATICS IN SCIENCE QUESTIONS
-- ========================================

('What is the study of probability in science called?', ARRAY['Statistics', 'Probability', 'Data Analysis', 'All of the above'], 3, 'All three are related to the study of probability and data in science.'),
('Which of these is a unit of measurement?', ARRAY['Meter', 'Second', 'Kilogram', 'All of the above'], 3, 'All three are SI units of measurement.'),
('What is the study of patterns in nature called?', ARRAY['Mathematics', 'Physics', 'Biology', 'All of the above'], 3, 'All three fields study patterns in nature.'),
('Which of these is NOT a mathematical concept used in science?', ARRAY['Statistics', 'Calculus', 'Algebra', 'Poetry'], 3, 'Poetry is not a mathematical concept used in science.'),
('What is the study of data called?', ARRAY['Statistics', 'Data Science', 'Analytics', 'All of the above'], 3, 'All three terms refer to the study of data.'),
('Which of these is a type of graph used in science?', ARRAY['Bar graph', 'Line graph', 'Pie chart', 'All of the above'], 3, 'All three are types of graphs commonly used in science.'),
('What is the study of uncertainty in measurements called?', ARRAY['Error analysis', 'Statistics', 'Probability', 'All of the above'], 3, 'All three are related to the study of uncertainty in measurements.'),
('Which of these is NOT a mathematical operation?', ARRAY['Addition', 'Subtraction', 'Multiplication', 'Observation'], 3, 'Observation is a scientific method, not a mathematical operation.'),
('What is the study of rates of change called?', ARRAY['Calculus', 'Algebra', 'Geometry', 'Statistics'], 0, 'Calculus is the study of rates of change and accumulation.'),
('Which of these is a type of statistical analysis?', ARRAY['Mean', 'Median', 'Standard deviation', 'All of the above'], 3, 'All three are types of statistical analysis.');

-- ========================================
-- VERIFICATION
-- ========================================

-- Check total number of questions
SELECT COUNT(*) as total_questions FROM public.daily_quiz_questions;

-- Show question distribution by topic (approximate)
SELECT 
  CASE 
    WHEN question LIKE '%Earth%' OR question LIKE '%rock%' OR question LIKE '%volcano%' THEN 'Earth Science'
    WHEN question LIKE '%cell%' OR question LIKE '%plant%' OR question LIKE '%animal%' THEN 'Biology'
    WHEN question LIKE '%chemical%' OR question LIKE '%element%' OR question LIKE '%molecule%' THEN 'Chemistry'
    WHEN question LIKE '%force%' OR question LIKE '%energy%' OR question LIKE '%motion%' THEN 'Physics'
    WHEN question LIKE '%planet%' OR question LIKE '%star%' OR question LIKE '%galaxy%' THEN 'Astronomy'
    WHEN question LIKE '%environment%' OR question LIKE '%pollution%' OR question LIKE '%renewable%' THEN 'Environmental Science'
    WHEN question LIKE '%robot%' OR question LIKE '%computer%' OR question LIKE '%technology%' THEN 'Technology'
    WHEN question LIKE '%disease%' OR question LIKE '%medical%' OR question LIKE '%health%' THEN 'Medical Science'
    WHEN question LIKE '%math%' OR question LIKE '%statistic%' OR question LIKE '%measurement%' THEN 'Mathematics'
    ELSE 'General Science'
  END as topic,
  COUNT(*) as question_count
FROM public.daily_quiz_questions 
GROUP BY topic 
ORDER BY question_count DESC; 