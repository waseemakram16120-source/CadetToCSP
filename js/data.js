/* ============================================================
   CadetToCSP — Question Banks
   Plain <script> file (NO ES modules) so the site works from
   file:// as well as from any static host.
   Loaded BEFORE js/quiz.js. Exposes:
     window.CADET_QUESTION_BANK  — subject banks
     window.CADET_AI_TOPIC_BANK  — built-in AI topic bank
     window.CADET_SUBJECTS       — subject meta for the dashboard
   All questions are PPSC / FPSC past-paper style, each with a
   short, factual explanation.
   ============================================================ */

window.CADET_QUESTION_BANK = {
  "History": [
    {
      q: "Who presented the famous 'Delhi Proposals' in March 1927?",
      options: ["Allama Iqbal", "Quaid-e-Azam Muhammad Ali Jinnah", "Liaquat Ali Khan", "Sir Syed Ahmed Khan"],
      answer: 1,
      explanation: "Quaid-e-Azam presented the Delhi Proposals in March 1927, offering to give up separate electorates if Muslim demands (like separation of Sindh from Bombay) were accepted."
    },
    {
      q: "In which year was the Partition of Bengal annulled by the British Government?",
      options: ["1905", "1909", "1911", "1916"],
      answer: 2,
      explanation: "Partition of Bengal took place in 1905 under Lord Curzon and was annulled on 12 December 1911 by King George V at the Delhi Durbar."
    },
    {
      q: "The Objective Resolution was passed by the Constituent Assembly of Pakistan on:",
      options: ["12 March 1949", "23 March 1940", "14 August 1948", "24 October 1954"],
      answer: 0,
      explanation: "Prime Minister Liaquat Ali Khan presented the Objective Resolution on 7 March 1949, and it was passed on 12 March 1949."
    },
    {
      q: "Which battle marked the formal beginning of British rule in Bengal in 1757?",
      options: ["Battle of Buxar", "Battle of Plassey", "Third Battle of Panipat", "Battle of Seringapatam"],
      answer: 1,
      explanation: "In the Battle of Plassey (1757), Robert Clive defeated Nawab Siraj-ud-Daulah due to the betrayal of Mir Jafar."
    },
    {
      q: "What was the total number of princely states in British India at the time of Partition in 1947?",
      options: ["512", "562", "584", "600"],
      answer: 1,
      explanation: "There were 562 (sometimes cited as 565) princely states in British India at the time of independence in 1947."
    },
    {
      q: "Who presented the Lahore Resolution on 23 March 1940?",
      options: ["A.K. Fazlul Huq", "Quaid-e-Azam Muhammad Ali Jinnah", "Liaquat Ali Khan", "Sir Aga Khan"],
      answer: 0,
      explanation: "A.K. Fazlul Huq presented the Lahore Resolution on 23 March 1940 at the Muslim League session in Lahore, presided over by Quaid-e-Azam."
    },
    {
      q: "Who was the first Governor-General of Pakistan?",
      options: ["Quaid-e-Azam Muhammad Ali Jinnah", "Liaquat Ali Khan", "Khawaja Nazimuddin", "Ghulam Muhammad"],
      answer: 0,
      explanation: "Quaid-e-Azam Muhammad Ali Jinnah became the first Governor-General of Pakistan on 14 August 1947."
    },
    {
      q: "In which year did Pakistan become a Republic, when its first Constitution was enforced?",
      options: ["1949", "1956", "1962", "1973"],
      answer: 1,
      explanation: "Pakistan became a Republic on 23 March 1956, when the first Constitution of Pakistan was enforced."
    },
    {
      q: "Who wrote the lyrics of Pakistan's national anthem?",
      options: ["Hafeez Jalandhari", "Allama Iqbal", "Faiz Ahmed Faiz", "Ahmed Ghulam Ali Chagla"],
      answer: 0,
      explanation: "The lyrics were written by Abu Al-Asar Hafeez Jalandhari; the music was composed by Ahmed Ghulam Ali Chagla."
    },
    {
      q: "Which operation launched by Pakistan in August 1965 preceded the 1965 Indo-Pak War?",
      options: ["Operation Gibraltar", "Operation Grand Slam", "Operation Searchlight", "Operation Chengiz Khan"],
      answer: 0,
      explanation: "Operation Gibraltar, launched in August 1965, was followed by open war between Pakistan and India in September 1965."
    },
    {
      q: "Who was the first Prime Minister of Pakistan?",
      options: ["Liaquat Ali Khan", "Khawaja Nazimuddin", "Huseyn Shaheed Suhrawardy", "Feroz Khan Noon"],
      answer: 0,
      explanation: "Liaquat Ali Khan served as the first Prime Minister of Pakistan from 1947 until his assassination in 1951."
    },
    {
      q: "The Simla Agreement between Pakistan and India was signed in which year?",
      options: ["1971", "1972", "1974", "1976"],
      answer: 1,
      explanation: "The Simla Agreement was signed on 2 July 1972 by Zulfikar Ali Bhutto and Indira Gandhi after the 1971 war."
    },
    {
      q: "The All India Muslim League was founded in 1906 at:",
      options: ["Dhaka", "Lucknow", "Lahore", "Delhi"],
      answer: 0,
      explanation: "The All India Muslim League was founded on 30 December 1906 at Dhaka, with Sir Aga Khan as its first president."
    },
    {
      q: "Pakistan became a member of the United Nations on:",
      options: ["30 September 1947", "14 August 1947", "23 March 1956", "1 January 1948"],
      answer: 0,
      explanation: "Pakistan joined the United Nations on 30 September 1947, about six weeks after independence."
    },
    {
      q: "Who was the Viceroy of India at the time of Partition in 1947?",
      options: ["Lord Mountbatten", "Lord Wavell", "Lord Irwin", "Lord Curzon"],
      answer: 0,
      explanation: "Lord Mountbatten was the last Viceroy of India; he oversaw the transfer of power and Partition in August 1947."
    }
  ],

  "General Knowledge": [
    {
      q: "Where is the permanent headquarters of the International Court of Justice (ICJ) located?",
      options: ["Geneva, Switzerland", "New York, USA", "The Hague, Netherlands", "Vienna, Austria"],
      answer: 2,
      explanation: "The ICJ (Peace Palace) is the only principal UN organ not located in New York; it is in The Hague, Netherlands."
    },
    {
      q: "Which strait separates Asia from North America?",
      options: ["Strait of Malacca", "Bering Strait", "Strait of Gibraltar", "Hormuz Strait"],
      answer: 1,
      explanation: "The Bering Strait separates Russia (Asia) from Alaska, USA (North America)."
    },
    {
      q: "What is the official currency of Turkey?",
      options: ["Rial", "Dinar", "Lira", "Dirham"],
      answer: 2,
      explanation: "The Turkish Lira (TRY) is the official currency of Turkey."
    },
    {
      q: "How many non-permanent members does the UN Security Council (UNSC) have?",
      options: ["5", "10", "15", "20"],
      answer: 1,
      explanation: "The UNSC has 15 total members: 5 Permanent (veto power) and 10 Non-Permanent elected for 2-year terms."
    },
    {
      q: "Which mountain range forms the natural boundary between Europe and Asia?",
      options: ["Andes Mountains", "Alps", "Ural Mountains", "Rocky Mountains"],
      answer: 2,
      explanation: "The Ural Mountains and Ural River in Russia form the traditional boundary between Europe and Asia."
    },
    {
      q: "Which is the largest hot desert in the world?",
      options: ["Sahara Desert", "Gobi Desert", "Kalahari Desert", "Arabian Desert"],
      answer: 0,
      explanation: "The Sahara in North Africa covers about 9.2 million sq km, making it the largest hot desert in the world."
    },
    {
      q: "Where is the headquarters of the World Bank located?",
      options: ["New York, USA", "Washington D.C., USA", "Geneva, Switzerland", "London, UK"],
      answer: 1,
      explanation: "The World Bank is headquartered in Washington D.C., USA, like the International Monetary Fund (IMF)."
    },
    {
      q: "Which country is known as the 'Land of the Rising Sun'?",
      options: ["Japan", "China", "Thailand", "South Korea"],
      answer: 0,
      explanation: "Japan is called the Land of the Rising Sun because it lies to the east, where the sun rises first."
    },
    {
      q: "What is the currency of Japan?",
      options: ["Won", "Yuan", "Yen", "Ringgit"],
      answer: 2,
      explanation: "The Yen (JPY) is the official currency of Japan."
    },
    {
      q: "Most of the Great Wall of China standing today was built during which dynasty?",
      options: ["Ming Dynasty", "Han Dynasty", "Qin Dynasty", "Tang Dynasty"],
      answer: 0,
      explanation: "Although earlier walls existed, most of the Great Wall visible today was built or rebuilt under the Ming Dynasty (1368–1644)."
    },
    {
      q: "Which is the longest river in the world?",
      options: ["Nile", "Amazon", "Yangtze", "Mississippi"],
      answer: 0,
      explanation: "The Nile, at about 6,650 km, is generally regarded as the longest river in the world."
    },
    {
      q: "How many countries are members of SAARC?",
      options: ["7", "8", "9", "10"],
      answer: 1,
      explanation: "SAARC has 8 member states: Afghanistan, Bangladesh, Bhutan, India, Maldives, Nepal, Pakistan and Sri Lanka."
    },
    {
      q: "The headquarters of UNESCO is located in:",
      options: ["Paris, France", "Geneva, Switzerland", "Vienna, Austria", "Rome, Italy"],
      answer: 0,
      explanation: "UNESCO (United Nations Educational, Scientific and Cultural Organization) is headquartered in Paris, France."
    },
    {
      q: "Which is the smallest country in the world by area?",
      options: ["Monaco", "Vatican City", "San Marino", "Maldives"],
      answer: 1,
      explanation: "Vatican City, at about 0.44 sq km, is the smallest independent state in the world by area."
    },
    {
      q: "What is the capital of Australia?",
      options: ["Sydney", "Melbourne", "Canberra", "Perth"],
      answer: 2,
      explanation: "Canberra is the capital of Australia; Sydney is its largest city but not the capital."
    }
  ],

  "Everyday Science": [
    {
      q: "Deficiency of which vitamin causes 'Night Blindness'?",
      options: ["Vitamin A", "Vitamin B12", "Vitamin C", "Vitamin D"],
      answer: 0,
      explanation: "Vitamin A (Retinol) is essential for eye health; its deficiency causes Night Blindness (Nyctalopia)."
    },
    {
      q: "Which gas is mainly responsible for the depletion of the Ozone Layer?",
      options: ["Carbon Dioxide", "Chlorofluorocarbons (CFCs)", "Methane", "Nitrogen"],
      answer: 1,
      explanation: "CFCs released from aerosols and refrigerants break down ozone (O3) molecules in the stratosphere."
    },
    {
      q: "What is the normal pH value of human blood?",
      options: ["6.4", "7.0", "7.4", "8.2"],
      answer: 2,
      explanation: "Human blood is slightly alkaline with a tightly regulated pH range of 7.35 to 7.45 (average 7.4)."
    },
    {
      q: "Which instrument is used to measure atmospheric pressure?",
      options: ["Hygrometer", "Barometer", "Anemometer", "Lactometer"],
      answer: 1,
      explanation: "A Barometer measures atmospheric pressure, while a Hygrometer measures humidity and a Lactometer checks milk purity."
    },
    {
      q: "Which planet in our Solar System is known as the 'Morning Star' or 'Evening Star'?",
      options: ["Mars", "Venus", "Jupiter", "Mercury"],
      answer: 1,
      explanation: "Venus is the brightest planet in the night sky and is called the Morning/Evening Star."
    },
    {
      q: "Which organ in the human body produces insulin?",
      options: ["Liver", "Pancreas", "Kidney", "Spleen"],
      answer: 1,
      explanation: "The pancreas produces insulin, the hormone that controls blood sugar levels."
    },
    {
      q: "What is the chemical symbol for gold?",
      options: ["Ag", "Au", "Gd", "Go"],
      answer: 1,
      explanation: "Gold has the chemical symbol Au, from its Latin name 'aurum'. Ag is the symbol for silver."
    },
    {
      q: "How many bones are there in the adult human body?",
      options: ["196", "206", "216", "226"],
      answer: 1,
      explanation: "An adult human has 206 bones. Babies are born with about 300 bones, many of which fuse as they grow."
    },
    {
      q: "Which vitamin is produced in the skin by sunlight?",
      options: ["Vitamin A", "Vitamin B12", "Vitamin C", "Vitamin D"],
      answer: 3,
      explanation: "Sunlight (UV rays) helps the skin produce Vitamin D, which is needed for strong bones."
    },
    {
      q: "What is the SI unit of electric current?",
      options: ["Volt", "Ampere", "Ohm", "Watt"],
      answer: 1,
      explanation: "The Ampere (A) is the SI unit of electric current. Volt measures voltage, Ohm measures resistance and Watt measures power."
    },
    {
      q: "Which gas do plants absorb from the atmosphere for photosynthesis?",
      options: ["Oxygen", "Nitrogen", "Carbon dioxide", "Hydrogen"],
      answer: 2,
      explanation: "Plants absorb carbon dioxide (CO2) and release oxygen during photosynthesis."
    },
    {
      q: "The boiling point of water at sea level is:",
      options: ["90°C", "100°C", "110°C", "120°C"],
      answer: 1,
      explanation: "At standard atmospheric pressure (sea level), pure water boils at 100°C (212°F)."
    },
    {
      q: "Which blood cells carry oxygen in the human body?",
      options: ["White blood cells", "Platelets", "Red blood cells", "Plasma cells"],
      answer: 2,
      explanation: "Red blood cells contain haemoglobin, which binds oxygen and carries it from the lungs to the body tissues."
    },
    {
      q: "Which part of the cell is known as its 'powerhouse'?",
      options: ["Nucleus", "Ribosome", "Mitochondria", "Golgi body"],
      answer: 2,
      explanation: "Mitochondria produce most of the cell's energy (ATP), so they are called the powerhouse of the cell."
    },
    {
      q: "Which instrument is used to measure temperature?",
      options: ["Barometer", "Thermometer", "Ammeter", "Speedometer"],
      answer: 1,
      explanation: "A Thermometer measures temperature. A Barometer measures air pressure and an Ammeter measures electric current."
    }
  ],

  "English": [
    {
      q: "Choose the synonym of 'Brave':",
      options: ["Cowardly", "Courageous", "Timid", "Weak"],
      answer: 1,
      explanation: "'Courageous' means the same as 'brave'. 'Cowardly' and 'timid' are antonyms."
    },
    {
      q: "Choose the antonym of 'Ancient':",
      options: ["Old", "Modern", "Antique", "Aged"],
      answer: 1,
      explanation: "'Ancient' means very old, so its opposite is 'modern'. 'Old', 'antique' and 'aged' are synonyms."
    },
    {
      q: "Choose the correctly spelled word:",
      options: ["Occurence", "Occurance", "Occurrence", "Ocurrance"],
      answer: 2,
      explanation: "'Occurrence' is the correct spelling — double 'c' and double 'r'."
    },
    {
      q: "He ___ to school every day.",
      options: ["go", "goes", "going", "gone"],
      answer: 1,
      explanation: "With the third-person singular subject 'he', the present simple verb takes '-es': 'He goes to school every day.'"
    },
    {
      q: "Which sentence is in the passive voice?",
      options: ["The letter was written by Ali.", "Ali wrote the letter.", "Ali is writing the letter.", "Ali has written the letter."],
      answer: 0,
      explanation: "'The letter was written by Ali' is passive — the subject (letter) receives the action. The other options are active voice."
    },
    {
      q: "One who can use both hands equally well is called:",
      options: ["Ambidextrous", "Versatile", "Ambiguous", "Dexterous"],
      answer: 0,
      explanation: "'Ambidextrous' describes a person equally skilled with both hands. 'Ambiguous' means unclear, and 'versatile' means adaptable."
    },
    {
      q: "Choose the correct sentence:",
      options: ["Neither of the answers are correct.", "Neither of the answers is correct.", "Neither of the answer is correct.", "Neither of answers are correct."],
      answer: 1,
      explanation: "'Neither' is singular, so it takes a singular verb: 'Neither of the answers is correct.'"
    },
    {
      q: "Choose the synonym of 'Abandon':",
      options: ["Keep", "Leave", "Hold", "Support"],
      answer: 1,
      explanation: "'Abandon' means to leave completely, so 'leave' is its synonym. 'Keep' and 'hold' are near-antonyms."
    },
    {
      q: "The idiom 'to bite the dust' means:",
      options: ["To eat dirt", "To be defeated", "To work hard", "To run fast"],
      answer: 1,
      explanation: "'To bite the dust' is an idiom meaning to be defeated or to fail."
    },
    {
      q: "Which of the following is a proper noun?",
      options: ["city", "Lahore", "river", "book"],
      answer: 1,
      explanation: "'Lahore' is a proper noun (the name of a specific place). 'City', 'river' and 'book' are common nouns."
    }
  ],

  "Islamiat": [
    {
      q: "How many Surahs are there in the Holy Quran?",
      options: ["110", "114", "116", "120"],
      answer: 1,
      explanation: "The Holy Quran contains 114 Surahs, beginning with Surah Al-Fatiha and ending with Surah An-Nas."
    },
    {
      q: "The first revelation (Wahi) was revealed to the Holy Prophet (PBUH) in which cave?",
      options: ["Cave Thawr", "Cave Hira", "Cave Uhud", "Cave Badr"],
      answer: 1,
      explanation: "The first revelation came to the Holy Prophet (PBUH) in Cave Hira, near Makkah, in 610 AD."
    },
    {
      q: "Zakat is payable on wealth above the Nisab at the rate of:",
      options: ["2.5%", "5%", "7.5%", "10%"],
      answer: 0,
      explanation: "Zakat is 2.5% of wealth held above the Nisab for a full lunar year."
    },
    {
      q: "Who was the first Caliph of Islam?",
      options: ["Hazrat Abu Bakr (RA)", "Hazrat Umar (RA)", "Hazrat Usman (RA)", "Hazrat Ali (RA)"],
      answer: 0,
      explanation: "Hazrat Abu Bakr Siddique (RA) was the first Caliph, serving from 632 to 634 AD."
    },
    {
      q: "The Battle of Badr was fought in which Hijri year?",
      options: ["1 AH", "2 AH", "3 AH", "5 AH"],
      answer: 1,
      explanation: "The Battle of Badr, the first major battle of Islam, was fought in Ramadan 2 AH (624 AD)."
    },
    {
      q: "Which is the longest Surah of the Holy Quran?",
      options: ["Surah Al-Baqarah", "Surah Aal-e-Imran", "Surah An-Nisa", "Surah Al-Maidah"],
      answer: 0,
      explanation: "Surah Al-Baqarah (286 verses) is the longest Surah of the Holy Quran."
    },
    {
      q: "Pakistan's national animal is the:",
      options: ["Lion", "Markhor", "Snow leopard", "Ibex"],
      answer: 1,
      explanation: "The Markhor, a wild goat found in the northern mountains, is the national animal of Pakistan."
    },
    {
      q: "The national flower of Pakistan is:",
      options: ["Rose", "Jasmine", "Tulip", "Sunflower"],
      answer: 1,
      explanation: "The Jasmine (Chameli) is the national flower of Pakistan."
    },
    {
      q: "Who composed the music of Pakistan's national anthem?",
      options: ["Hafeez Jalandhari", "Ahmed Ghulam Ali Chagla", "Allama Iqbal", "Faiz Ahmed Faiz"],
      answer: 1,
      explanation: "Ahmed Ghulam Ali Chagla composed the music of the national anthem in 1949; Hafeez Jalandhari wrote the lyrics."
    },
    {
      q: "Which was the first mosque built in Islam?",
      options: ["Masjid Quba", "Masjid Nabawi", "Masjid Al-Haram", "Masjid Al-Aqsa"],
      answer: 0,
      explanation: "Masjid Quba, built by the Holy Prophet (PBUH) on arrival at Quba during the Hijrah, is the first mosque of Islam."
    }
  ]
};

/* ---------- Built-in AI Topic Bank (8 topics x 5 questions) ---------- */
window.CADET_AI_TOPIC_BANK = {
  "Mughal Empire": [
    {
      q: "Who founded the Mughal Empire after winning the First Battle of Panipat in 1526?",
      options: ["Akbar", "Zahir-ud-Din Babur", "Humayun", "Sher Shah Suri"],
      answer: 1,
      explanation: "Zahir-ud-Din Muhammad Babur defeated Ibrahim Lodi in the First Battle of Panipat (1526) to establish the Mughal Empire."
    },
    {
      q: "Which Mughal Emperor built the Badshahi Mosque in Lahore in 1673?",
      options: ["Shah Jahan", "Jahangir", "Aurangzeb Alamgir", "Akbar"],
      answer: 2,
      explanation: "Emperor Aurangzeb Alamgir constructed the Badshahi Mosque in Lahore between 1671 and 1673."
    },
    {
      q: "Who wrote the famous biography 'Humayun-nama'?",
      options: ["Abul Fazl", "Gulbadan Begum", "Badauni", "Faizi"],
      answer: 1,
      explanation: "Gulbadan Begum, the sister of Emperor Humayun, wrote Humayun-nama on the request of Emperor Akbar."
    },
    {
      q: "During which Mughal Emperor's reign did Sir Thomas Roe visit India as British Ambassador?",
      options: ["Akbar", "Jahangir", "Shah Jahan", "Aurangzeb"],
      answer: 1,
      explanation: "Sir Thomas Roe visited the court of Mughal Emperor Jahangir in 1615 to seek trade concessions for the British East India Company."
    },
    {
      q: "Who was the last Mughal Emperor, exiled to Rangoon after the 1857 War of Independence?",
      options: ["Bahadur Shah Zafar II", "Shah Alam II", "Akbar Shah II", "Farrukhsiyar"],
      answer: 0,
      explanation: "Bahadur Shah Zafar II was the last Mughal ruler; the British exiled him to Rangoon (Myanmar) where he died in 1862."
    }
  ],
  "1973 Constitution": [
    {
      q: "On which date was the 1973 Constitution of Pakistan enforced?",
      options: ["23 March 1973", "10 April 1973", "14 August 1973", "25 December 1973"],
      answer: 2,
      explanation: "The 1973 Constitution was passed by the National Assembly on 10 April 1973 and enforced on 14 August 1973."
    },
    {
      q: "How many total Articles are there in the 1973 Constitution of Pakistan?",
      options: ["250 Articles", "280 Articles", "295 Articles", "310 Articles"],
      answer: 1,
      explanation: "The 1973 Constitution consists of 280 Articles divided into 12 Parts and 5 Schedules."
    },
    {
      q: "Which Article of the 1973 Constitution guarantees the Right to Free and Compulsory Education (ages 5 to 16)?",
      options: ["Article 19-A", "Article 25-A", "Article 10-A", "Article 6"],
      answer: 1,
      explanation: "Inserted via the 18th Amendment, Article 25-A makes education from age 5 to 16 a fundamental constitutional right."
    },
    {
      q: "What is the minimum age required to become the President of Pakistan under the 1973 Constitution?",
      options: ["35 Years", "40 Years", "45 Years", "50 Years"],
      answer: 2,
      explanation: "Under Article 41(2) of the 1973 Constitution, a candidate for President must be a Muslim and not less than 45 years of age."
    },
    {
      q: "Which Amendment merged the Federally Administered Tribal Areas (FATA) with Khyber Pakhtunkhwa?",
      options: ["18th Amendment", "21st Amendment", "25th Amendment", "26th Amendment"],
      answer: 2,
      explanation: "The 25th Constitutional Amendment (2018) officially merged FATA into the province of Khyber Pakhtunkhwa."
    }
  ],
  "Human Vitamins": [
    {
      q: "Which of the following groups represents Water-Soluble vitamins?",
      options: ["Vitamins A & D", "Vitamins B & C", "Vitamins E & K", "Vitamins A & K"],
      answer: 1,
      explanation: "Vitamins B-complex and C are water-soluble, whereas Vitamins A, D, E, and K are fat-soluble."
    },
    {
      q: "Rickets in children is caused by the deficiency of which vitamin?",
      options: ["Vitamin A", "Vitamin C", "Vitamin D", "Vitamin E"],
      answer: 2,
      explanation: "Vitamin D (Calciferol) helps absorb calcium; its deficiency leads to weak bones and Rickets in children."
    },
    {
      q: "Which vitamin plays an essential role in blood clotting?",
      options: ["Vitamin K", "Vitamin B6", "Vitamin C", "Vitamin A"],
      answer: 0,
      explanation: "Vitamin K is required for the synthesis of prothrombin, a protein crucial for blood coagulation (clotting)."
    },
    {
      q: "What is the chemical name of Vitamin C?",
      options: ["Retinol", "Ascorbic Acid", "Tocopherol", "Thiamine"],
      answer: 1,
      explanation: "Vitamin C is chemically known as Ascorbic Acid; its deficiency causes Scurvy (bleeding gums)."
    },
    {
      q: "Beri-Beri disease is caused by the deficiency of:",
      options: ["Vitamin B1 (Thiamine)", "Vitamin B2 (Riboflavin)", "Vitamin B9 (Folic Acid)", "Vitamin B12"],
      answer: 0,
      explanation: "Deficiency of Vitamin B1 (Thiamine) affects the nervous and cardiovascular systems, causing Beri-Beri."
    }
  ],
  "Pakistan Movement": [
    {
      q: "The Lahore Resolution was passed on:",
      options: ["23 March 1940", "23 March 1941", "14 August 1947", "3 June 1947"],
      answer: 0,
      explanation: "The Lahore Resolution, demanding separate states for Muslims, was passed on 23 March 1940."
    },
    {
      q: "Who presided over the Lahore session of the Muslim League in 1940?",
      options: ["Quaid-e-Azam Muhammad Ali Jinnah", "Liaquat Ali Khan", "A.K. Fazlul Huq", "Sir Aga Khan"],
      answer: 0,
      explanation: "Quaid-e-Azam presided over the historic 1940 Lahore session; A.K. Fazlul Huq presented the Lahore Resolution."
    },
    {
      q: "The 3rd June Plan (Mountbatten Plan) announced the partition of India in which year?",
      options: ["1946", "1947", "1948", "1945"],
      answer: 1,
      explanation: "Lord Mountbatten announced the 3rd June Plan in 1947, setting out the partition of British India into Pakistan and India."
    },
    {
      q: "Who was the first President of the All India Muslim League (1906)?",
      options: ["Sir Aga Khan", "Mohsin-ul-Mulk", "Quaid-e-Azam Muhammad Ali Jinnah", "Liaquat Ali Khan"],
      answer: 0,
      explanation: "Sir Sultan Muhammad Shah (Aga Khan III) was elected the first president of the All India Muslim League at its founding in Dhaka in 1906."
    },
    {
      q: "The Lucknow Pact between the Congress and the Muslim League was signed in:",
      options: ["1906", "1916", "1920", "1928"],
      answer: 1,
      explanation: "The Lucknow Pact of 1916 brought the Congress and the Muslim League together; the League accepted separate electorates and the Congress accepted Muslim representation."
    }
  ],
  "Islamic History": [
    {
      q: "The Holy Prophet (PBUH) was born in the Year of the Elephant in:",
      options: ["570 AD", "571 AD", "572 AD", "610 AD"],
      answer: 1,
      explanation: "The Holy Prophet (PBUH) was born in Makkah in 571 AD, known as the Year of the Elephant (Aam-ul-Feel)."
    },
    {
      q: "The Hijrah (migration to Madina) took place in:",
      options: ["610 AD", "619 AD", "622 AD", "630 AD"],
      answer: 2,
      explanation: "The Hijrah took place in 622 AD, which marks the start of the Islamic (Hijri) calendar."
    },
    {
      q: "The first mosque built by the Holy Prophet (PBUH) in Madina was:",
      options: ["Masjid Quba", "Masjid Nabawi", "Masjid Al-Haram", "Masjid Al-Aqsa"],
      answer: 1,
      explanation: "Masjid-e-Nabawi was built in Madina after the Hijrah. Masjid Quba was built earlier, on the way, at Quba."
    },
    {
      q: "Hazrat Umar (RA) was the ___ Caliph of Islam.",
      options: ["First", "Second", "Third", "Fourth"],
      answer: 1,
      explanation: "Hazrat Umar Farooq (RA) was the second Caliph, serving from 634 to 644 AD."
    },
    {
      q: "The conquest of Makkah (Fath-e-Makkah) took place in:",
      options: ["6 AH", "8 AH", "10 AH", "2 AH"],
      answer: 1,
      explanation: "Makkah was conquered peacefully in Ramadan 8 AH (630 AD)."
    }
  ],
  "Geography of Pakistan": [
    {
      q: "Which is the largest province of Pakistan by area?",
      options: ["Punjab", "Sindh", "Khyber Pakhtunkhwa", "Balochistan"],
      answer: 3,
      explanation: "Balochistan is the largest province of Pakistan by area, covering about 44% of the country's land."
    },
    {
      q: "K2, the second-highest mountain in the world, is located in which range?",
      options: ["Himalayas", "Karakoram", "Hindu Kush", "Pamir"],
      answer: 1,
      explanation: "K2 (8,611 m) stands in the Karakoram range in Gilgit-Baltistan."
    },
    {
      q: "Which is the longest river of Pakistan?",
      options: ["Ravi", "Chenab", "Indus", "Jhelum"],
      answer: 2,
      explanation: "The Indus River, about 3,180 km long, is the longest river of Pakistan."
    },
    {
      q: "The Thar Desert is located in which province of Pakistan?",
      options: ["Punjab", "Sindh", "Balochistan", "Khyber Pakhtunkhwa"],
      answer: 1,
      explanation: "The Thar Desert lies mainly in the Tharparkar district of Sindh, extending into India."
    },
    {
      q: "Which is the largest dam of Pakistan by water storage capacity?",
      options: ["Mangla Dam", "Tarbela Dam", "Diamer-Bhasha Dam", "Warsak Dam"],
      answer: 1,
      explanation: "Tarbela Dam on the Indus River is Pakistan's largest dam by storage capacity."
    }
  ],
  "Computer & IT Basics": [
    {
      q: "What does CPU stand for?",
      options: ["Central Program Unit", "Central Processing Unit", "Computer Personal Unit", "Central Peripheral Unit"],
      answer: 1,
      explanation: "CPU stands for Central Processing Unit — the 'brain' of the computer."
    },
    {
      q: "Which of the following is an input device?",
      options: ["Monitor", "Printer", "Keyboard", "Speaker"],
      answer: 2,
      explanation: "A keyboard is an input device. Monitor, printer and speaker are output devices."
    },
    {
      q: "1 kilobyte (KB) equals how many bytes?",
      options: ["100", "1000", "1024", "512"],
      answer: 2,
      explanation: "In computing, 1 KB = 1024 bytes (2^10)."
    },
    {
      q: "What does HTTP stand for?",
      options: ["HyperText Transfer Protocol", "HighText Transfer Program", "HyperText Transmission Process", "Host Transfer Protocol"],
      answer: 0,
      explanation: "HTTP stands for HyperText Transfer Protocol — the foundation of data exchange on the web."
    },
    {
      q: "Which of the following is an example of secondary storage?",
      options: ["RAM", "Cache memory", "Hard Disk Drive", "Register"],
      answer: 2,
      explanation: "A Hard Disk Drive is secondary storage — it keeps data permanently. RAM and cache are primary (temporary) memory."
    }
  ],
  "World Geography": [
    {
      q: "Which is the largest ocean in the world?",
      options: ["Atlantic Ocean", "Indian Ocean", "Pacific Ocean", "Arctic Ocean"],
      answer: 2,
      explanation: "The Pacific Ocean is the largest and deepest ocean, covering about one-third of the Earth's surface."
    },
    {
      q: "Which is the largest country in the world by area?",
      options: ["Canada", "China", "USA", "Russia"],
      answer: 3,
      explanation: "Russia, at about 17 million sq km, is the largest country in the world by area."
    },
    {
      q: "The Sahara Desert is located on which continent?",
      options: ["Asia", "Africa", "Australia", "South America"],
      answer: 1,
      explanation: "The Sahara is the world's largest hot desert, covering much of North Africa."
    },
    {
      q: "Which is the longest river in the world?",
      options: ["Amazon", "Nile", "Yangtze", "Danube"],
      answer: 1,
      explanation: "The Nile, at about 6,650 km, is generally regarded as the longest river in the world."
    },
    {
      q: "Mount Everest lies on the border of Nepal and which country?",
      options: ["India", "China", "Bhutan", "Pakistan"],
      answer: 1,
      explanation: "Mount Everest (8,849 m) sits on the Nepal–China (Tibet) border."
    }
  ]
};

/* ---------- Subject meta (dashboard / landing) ---------- */
window.CADET_SUBJECTS = [
  { key: "History", name: "History & Pak Studies", icon: "📜", tagline: "Indo-Pak History (712–1947), Constitutional History, Wars & Movements." },
  { key: "General Knowledge", name: "General Knowledge", icon: "🌍", tagline: "World Capitals, Currencies, International Organizations (UNO, OIC, SAARC), Geography." },
  { key: "Everyday Science", name: "Everyday Science", icon: "🔬", tagline: "Vitamins & Deficiencies, Solar System, SI Units, Human Anatomy & Inventions." },
  { key: "English", name: "English & Grammar", icon: "✍️", tagline: "Vocabulary, Synonyms & Antonyms, Spelling, Tenses, Voice & Idioms." },
  { key: "Islamiat", name: "Islamiat & Pakistan Affairs", icon: "☪️", tagline: "Quran & Seerah, Pillars of Islam, National Symbols & Anthem." }
];
