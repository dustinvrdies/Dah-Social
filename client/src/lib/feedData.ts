import { Post, ListingCategory, Store } from "./postTypes";
import { initializeBotEcosystem, maybeGenerateNewBotPost, getBotPosts } from "./botUsers";

const picsum = (id: number, w = 600, h = 600) => `https://picsum.photos/id/${id}/${w}/${h}`;

const sampleVideos = [
  "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
  "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
  "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4",
  "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4",
  "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4",
  "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/SubaruOutbackOnStreetAndDirt.mp4",
  "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/VolkswagenGTIReview.mp4",
  "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WeAreGoingOnBullrun.mp4",
  "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WhatCarCanYouGetForAGrand.mp4",
  "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
  "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
  "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4",
  "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4",
];

export const initialFeed: Post[] = [
  { id: "p1", type: "text", user: "dah", content: "Welcome to DAH Social. Build your profile. Post your world.", media: picsum(1015, 800, 600) },

  // --- jessica_m (mom / lifestyle) ---
  { id: "jessica_m_1", type: "text", user: "jessica_m", content: "Finally got the kids to bed before 8pm. This is my Super Bowl.", media: picsum(1011, 800, 800) },
  { id: "jessica_m_2", type: "text", user: "jessica_m", content: "Tried a new crockpot recipe tonight and the whole family actually ate it without complaining. Miracles do happen." },
  { id: "jessica_m_3", type: "text", user: "jessica_m", content: "Target run was supposed to be 10 minutes. It was not 10 minutes.", media: picsum(1033, 800, 600) },
  { id: "jessica_m_4", type: "text", user: "jessica_m", content: "Anyone else feel like laundry is a full time job or just me" },
  { id: "jessica_m_5", type: "text", user: "jessica_m", content: "My daughter told me I look tired today. Thanks babe I know.", media: picsum(1027, 800, 800) },
  { id: "jessica_m_6", type: "video", user: "jessica_m", src: sampleVideos[0], caption: "The chaos of getting three kids out the door in the morning" },
  { id: "jessica_m_7", type: "text", user: "jessica_m", content: "Date night for the first time in 3 months. We went to Olive Garden and it was perfect." },

  // --- marcus_t (tech / gaming) ---
  { id: "marcus_t_1", type: "text", user: "marcus_t", content: "Just built my first PC from scratch. Cable management could use some work but she runs like a dream.", media: picsum(180, 800, 600) },
  { id: "marcus_t_2", type: "text", user: "marcus_t", content: "Been coding for 12 hours straight. Don't even know what day it is anymore." },
  { id: "marcus_t_3", type: "video", user: "marcus_t", src: sampleVideos[1], caption: "Unboxing the new RTX 5090. This thing is a beast." },
  { id: "marcus_t_4", type: "text", user: "marcus_t", content: "Finally hit Immortal in Valorant. Only took me 2000 hours lol", media: picsum(96, 800, 800) },
  { id: "marcus_t_5", type: "text", user: "marcus_t", content: "Hot take: tabs are better than spaces and I will die on this hill." },
  { id: "marcus_t_6", type: "text", user: "marcus_t", content: "My mechanical keyboard just arrived and my roommate already hates me", media: picsum(1, 800, 600) },
  { id: "marcus_t_7", type: "text", user: "marcus_t", content: "WiFi went out during a ranked match. Pain." },
  { id: "marcus_t_8", type: "text", user: "marcus_t", content: "The new season of that show everyone's talking about is actually mid. There I said it." },

  // --- sarah_b (fitness / wellness) ---
  { id: "sarah_b_1", type: "text", user: "sarah_b", content: "5am gym session hit different today. New PR on deadlifts!", media: picsum(1048, 800, 800) },
  { id: "sarah_b_2", type: "text", user: "sarah_b", content: "Meal prep Sunday! 20 containers done and ready for the week.", media: picsum(292, 800, 800) },
  { id: "sarah_b_3", type: "text", user: "sarah_b", content: "Rest days are important too. Repeat that to yourself." },
  { id: "sarah_b_4", type: "video", user: "sarah_b", src: sampleVideos[2], caption: "Full body workout you can do at home with no equipment" },
  { id: "sarah_b_5", type: "text", user: "sarah_b", content: "6 month transformation. Consistency over perfection every single time.", media: picsum(1062, 800, 800) },
  { id: "sarah_b_6", type: "text", user: "sarah_b", content: "Tried yoga for the first time and I am NOT flexible lol but I'll keep going" },
  { id: "sarah_b_7", type: "text", user: "sarah_b", content: "The gym at 6am on a Monday is a different breed of human" },

  // --- dave_cooks (food / cooking) ---
  { id: "dave_cooks_1", type: "text", user: "dave_cooks", content: "Homemade sourdough attempt #4. This one actually looks like bread!", media: picsum(312, 800, 800) },
  { id: "dave_cooks_2", type: "text", user: "dave_cooks", content: "Unpopular opinion: ketchup on eggs is perfectly acceptable" },
  { id: "dave_cooks_3", type: "text", user: "dave_cooks", content: "Made pad thai from scratch tonight. My apartment smells incredible.", media: picsum(292, 800, 600) },
  { id: "dave_cooks_4", type: "video", user: "dave_cooks", src: sampleVideos[3], caption: "One pan dinner that takes 15 minutes. Trust me on this one." },
  { id: "dave_cooks_5", type: "text", user: "dave_cooks", content: "When the recipe says a pinch of salt I use a handful. No regrets." },
  { id: "dave_cooks_6", type: "text", user: "dave_cooks", content: "Sunday brunch spread for the squad. Nobody's leaving hungry.", media: picsum(425, 800, 800) },
  { id: "dave_cooks_7", type: "text", user: "dave_cooks", content: "Bought an air fryer last week and I genuinely don't know how I lived without one" },
  { id: "dave_cooks_8", type: "text", user: "dave_cooks", content: "If Gordon Ramsay saw my risotto he'd probably call me a donut but I think it slaps" },
  { id: "dave_cooks_9", type: "text", user: "dave_cooks", content: "Grocery haul for the week. Trying to eat at home more instead of ordering DoorDash every night.", media: picsum(102, 800, 600) },

  // --- alex_photos (photography) ---
  { id: "alex_photos_1", type: "text", user: "alex_photos", content: "Golden hour never misses.", media: picsum(1016, 800, 600) },
  { id: "alex_photos_2", type: "text", user: "alex_photos", content: "City skyline at midnight. There's something about empty streets.", media: picsum(1044, 800, 600) },
  { id: "alex_photos_3", type: "text", user: "alex_photos", content: "Got up at 4am for this sunrise shot. Worth every lost minute of sleep.", media: picsum(1018, 800, 600) },
  { id: "alex_photos_4", type: "video", user: "alex_photos", src: sampleVideos[4], caption: "Behind the scenes of a street photography walk" },
  { id: "alex_photos_5", type: "text", user: "alex_photos", content: "New lens just came in. Can't wait to test this thing out.", media: picsum(250, 800, 800) },
  { id: "alex_photos_6", type: "text", user: "alex_photos", content: "Rainy day vibes. Shot this from under an awning downtown.", media: picsum(1013, 800, 600) },
  { id: "alex_photos_7", type: "text", user: "alex_photos", content: "Photography tip: the best camera is the one you have with you. Took this on my phone.", media: picsum(1036, 800, 800) },

  // --- mia_travels (travel) ---
  { id: "mia_travels_1", type: "text", user: "mia_travels", content: "Just landed. New city, new adventures. Let's gooo!", media: picsum(1040, 800, 600) },
  { id: "mia_travels_2", type: "text", user: "mia_travels", content: "This hostel has the most incredible rooftop view I've ever seen", media: picsum(1019, 800, 800) },
  { id: "mia_travels_3", type: "text", user: "mia_travels", content: "Missed my connecting flight and ended up exploring a random city for 8 hours. Best accident ever." },
  { id: "mia_travels_4", type: "video", user: "mia_travels", src: sampleVideos[5], caption: "Driving through the mountains at sunset. No filter needed." },
  { id: "mia_travels_5", type: "text", user: "mia_travels", content: "The street food here is unreal. I've eaten 4 times today and I'm not sorry.", media: picsum(493, 800, 800) },
  { id: "mia_travels_6", type: "text", user: "mia_travels", content: "Packing tip: roll your clothes, don't fold. You're welcome." },
  { id: "mia_travels_7", type: "text", user: "mia_travels", content: "If you ever get the chance to travel solo, do it. Changed my whole perspective.", media: picsum(1047, 800, 600) },
  { id: "mia_travels_8", type: "text", user: "mia_travels", content: "Airport WiFi is never fast enough. Never." },

  // --- jay_music (music / DJ) ---
  { id: "jay_music_1", type: "text", user: "jay_music", content: "Studio session went until 3am. New track is sounding crazy.", media: picsum(1060, 800, 600) },
  { id: "jay_music_2", type: "text", user: "jay_music", content: "500 people showed up last night. Energy was unmatched.", media: picsum(1057, 800, 800) },
  { id: "jay_music_3", type: "video", user: "jay_music", src: sampleVideos[6], caption: "Crowd reaction when the beat drops. This is why I do it." },
  { id: "jay_music_4", type: "text", user: "jay_music", content: "New album dropping next month. Been working on this for a year." },
  { id: "jay_music_5", type: "text", user: "jay_music", content: "What's everyone listening to right now? Need new music for my playlist" },
  { id: "jay_music_6", type: "text", user: "jay_music", content: "Set list for tonight is absolutely stacked. See y'all at 10pm.", media: picsum(1067, 800, 600) },

  // --- emma_reads (books / reading) ---
  { id: "emma_reads_1", type: "text", user: "emma_reads", content: "Just finished this book in one sitting. Could not put it down. 10/10 recommend.", media: picsum(24, 800, 800) },
  { id: "emma_reads_2", type: "text", user: "emma_reads", content: "My TBR pile is getting out of control but I keep buying more books" },
  { id: "emma_reads_3", type: "text", user: "emma_reads", content: "Book club meeting tonight. We're discussing the new release everyone's talking about." },
  { id: "emma_reads_4", type: "text", user: "emma_reads", content: "Rainy day + coffee + a good book = perfection", media: picsum(1069, 800, 600) },
  { id: "emma_reads_5", type: "text", user: "emma_reads", content: "The plot twist in chapter 12 had me audibly gasp on the train. People looked at me." },
  { id: "emma_reads_6", type: "text", user: "emma_reads", content: "Library haul! Got 6 books and I plan to read all of them this month.", media: picsum(1073, 800, 800) },

  // --- tony_builds (construction / DIY) ---
  { id: "tony_builds_1", type: "text", user: "tony_builds", content: "Built this bookshelf from scratch. No instructions, just vibes.", media: picsum(1084, 800, 800) },
  { id: "tony_builds_2", type: "text", user: "tony_builds", content: "Home Depot run #3 this week. I basically live there now." },
  { id: "tony_builds_3", type: "video", user: "tony_builds", src: sampleVideos[7], caption: "Full kitchen renovation timelapse. 6 weeks of work in 60 seconds." },
  { id: "tony_builds_4", type: "text", user: "tony_builds", content: "Measure twice, cut once. Unless you're me, then measure three times and still mess up." },
  { id: "tony_builds_5", type: "text", user: "tony_builds", content: "The deck is finally done! Just in time for summer.", media: picsum(1076, 800, 600) },
  { id: "tony_builds_6", type: "text", user: "tony_builds", content: "Nothing beats the feeling of building something with your own hands" },
  { id: "tony_builds_7", type: "text", user: "tony_builds", content: "Who needs a contractor when you have YouTube tutorials and determination" },

  // --- nina_style (fashion) ---
  { id: "nina_style_1", type: "text", user: "nina_style", content: "OOTD. Thrifted this entire outfit for under $20.", media: picsum(1005, 800, 800) },
  { id: "nina_style_2", type: "text", user: "nina_style", content: "Sustainable fashion doesn't have to be boring. Proof right here.", media: picsum(1025, 800, 800) },
  { id: "nina_style_3", type: "video", user: "nina_style", src: sampleVideos[8], caption: "GRWM for a night out. Hair, makeup, outfit - the whole thing." },
  { id: "nina_style_4", type: "text", user: "nina_style", content: "When the fit hits right you just know.", media: picsum(1012, 800, 800) },
  { id: "nina_style_5", type: "text", user: "nina_style", content: "Closet cleanout revealed clothes I forgot I even had" },
  { id: "nina_style_6", type: "text", user: "nina_style", content: "Fall fashion is the best fashion and I will not be taking questions at this time" },
  { id: "nina_style_7", type: "text", user: "nina_style", content: "New drops at Zara have me rethinking my entire wardrobe" },

  // --- mike_runs (running / outdoor) ---
  { id: "mike_runs_1", type: "text", user: "mike_runs", content: "5K personal best today! Shaved 2 minutes off my time.", media: picsum(1054, 800, 600) },
  { id: "mike_runs_2", type: "text", user: "mike_runs", content: "Trail running in the fall is a whole vibe. The colors are insane right now.", media: picsum(1015, 800, 600) },
  { id: "mike_runs_3", type: "text", user: "mike_runs", content: "Marathon training week 8. My knees have opinions about this." },
  { id: "mike_runs_4", type: "text", user: "mike_runs", content: "6am run crew never misses. Even in the rain. Especially in the rain.", media: picsum(1039, 800, 800) },
  { id: "mike_runs_5", type: "video", user: "mike_runs", src: sampleVideos[9], caption: "Morning run through the park. Sometimes you just need to clear your head." },
  { id: "mike_runs_6", type: "text", user: "mike_runs", content: "Post-run smoothie is my religion" },

  // --- lisa_plants (plants / gardening) ---
  { id: "lisa_plants_1", type: "text", user: "lisa_plants", content: "My monstera put out a new leaf!! Plant parents understand this excitement.", media: picsum(1040, 800, 800) },
  { id: "lisa_plants_2", type: "text", user: "lisa_plants", content: "I own 47 plants. My apartment is basically a jungle. No I'm not getting more. Okay maybe one more." },
  { id: "lisa_plants_3", type: "text", user: "lisa_plants", content: "Garden update: tomatoes are finally turning red!", media: picsum(146, 800, 600) },
  { id: "lisa_plants_4", type: "text", user: "lisa_plants", content: "PSA: stop overwatering your succulents. They literally want to be left alone." },
  { id: "lisa_plants_5", type: "text", user: "lisa_plants", content: "Propagation station is thriving. Free plants from plants is the best hack.", media: picsum(365, 800, 800) },
  { id: "lisa_plants_6", type: "video", user: "lisa_plants", src: sampleVideos[10], caption: "Repotting day! Giving all my babies new homes." },
  { id: "lisa_plants_7", type: "text", user: "lisa_plants", content: "Someone told me I talk to my plants too much. They're thriving so clearly it works." },

  // --- chris_ball (sports) ---
  { id: "chris_ball_1", type: "text", user: "chris_ball", content: "Game day! Let's gooo!! Nobody pick up the phone today.", media: picsum(398, 800, 600) },
  { id: "chris_ball_2", type: "text", user: "chris_ball", content: "That ref was absolutely blind tonight. I'm heated." },
  { id: "chris_ball_3", type: "text", user: "chris_ball", content: "Pickup basketball at the park. Nothing beats it on a Saturday morning.", media: picsum(1058, 800, 800) },
  { id: "chris_ball_4", type: "text", user: "chris_ball", content: "Fantasy football lineup looking STRONG this week. Championship incoming." },
  { id: "chris_ball_5", type: "text", user: "chris_ball", content: "Just got tickets to the game next weekend!! Who's coming with me??" },
  { id: "chris_ball_6", type: "video", user: "chris_ball", src: sampleVideos[11], caption: "Crazy finish to tonight's game. Couldn't believe my eyes." },
  { id: "chris_ball_7", type: "text", user: "chris_ball", content: "Sunday football food spread is ready. Wings, nachos, the works.", media: picsum(431, 800, 800) },

  // --- rachel_art (art / creative) ---
  { id: "rachel_art_1", type: "text", user: "rachel_art", content: "Finished this piece at 2am. The creative flow just wouldn't stop.", media: picsum(1019, 800, 800) },
  { id: "rachel_art_2", type: "text", user: "rachel_art", content: "Art block is real y'all. Haven't touched my brushes in a week." },
  { id: "rachel_art_3", type: "text", user: "rachel_art", content: "Commission work in progress. Can't wait to show the final result.", media: picsum(1080, 800, 800) },
  { id: "rachel_art_4", type: "video", user: "rachel_art", src: sampleVideos[12], caption: "Painting process from blank canvas to finished piece" },
  { id: "rachel_art_5", type: "text", user: "rachel_art", content: "Museum trip today was exactly the inspiration I needed.", media: picsum(1074, 800, 600) },
  { id: "rachel_art_6", type: "text", user: "rachel_art", content: "When people ask me to draw them for free I send them my rate card" },

  // --- jordan_dev (software dev) ---
  { id: "jordan_dev_1", type: "text", user: "jordan_dev", content: "Deployed to production on a Friday. Yes I live dangerously." },
  { id: "jordan_dev_2", type: "text", user: "jordan_dev", content: "Spent 4 hours debugging only to find it was a missing semicolon. Classic." },
  { id: "jordan_dev_3", type: "text", user: "jordan_dev", content: "My IDE setup is finally perfect. Don't touch it. Nobody touch it.", media: picsum(366, 800, 600) },
  { id: "jordan_dev_4", type: "text", user: "jordan_dev", content: "Started learning Rust. My brain hurts but in a good way I think." },
  { id: "jordan_dev_5", type: "text", user: "jordan_dev", content: "Code review comments be like: 'nit: add a space here'. Thanks for the critical feedback." },
  { id: "jordan_dev_6", type: "text", user: "jordan_dev", content: "Working from home means I haven't put on real pants in 3 days and I'm thriving" },
  { id: "jordan_dev_7", type: "video", user: "jordan_dev", src: sampleVideos[0], caption: "What my desk looks like during a deployment. Chaos." },

  // --- amanda_pets (pets / animals) ---
  { id: "amanda_pets_1", type: "text", user: "amanda_pets", content: "This face right here is the reason I can't be mad for more than 5 seconds.", media: picsum(169, 800, 800) },
  { id: "amanda_pets_2", type: "text", user: "amanda_pets", content: "Took the dogs to the park and they made about 10 new friends. I made zero." },
  { id: "amanda_pets_3", type: "text", user: "amanda_pets", content: "Cat knocked my coffee off the desk again. Looked me right in the eye while doing it." },
  { id: "amanda_pets_4", type: "text", user: "amanda_pets", content: "Vet says she's perfectly healthy! Best news I've gotten all week.", media: picsum(200, 800, 800) },
  { id: "amanda_pets_5", type: "video", user: "amanda_pets", src: sampleVideos[1], caption: "My dog learned a new trick! Well... kind of." },
  { id: "amanda_pets_6", type: "text", user: "amanda_pets", content: "Foster kittens update: all 4 have been adopted!! My heart is full.", media: picsum(40, 800, 800) },
  { id: "amanda_pets_7", type: "text", user: "amanda_pets", content: "The amount of money I spend on pet toys is alarming and I do not care" },

  // --- ben_finance (finance bro) ---
  { id: "ben_finance_1", type: "text", user: "ben_finance", content: "Markets are wild today. Stay calm and think long term." },
  { id: "ben_finance_2", type: "text", user: "ben_finance", content: "The best time to start investing was 10 years ago. The second best time is now." },
  { id: "ben_finance_3", type: "text", user: "ben_finance", content: "Morning routine: coffee, check portfolio, pretend everything is fine." },
  { id: "ben_finance_4", type: "text", user: "ben_finance", content: "Just finished a great book on personal finance. Biggest takeaway: spend less than you make. Revolutionary." },
  { id: "ben_finance_5", type: "text", user: "ben_finance", content: "Emergency fund complete. 6 months of expenses saved. Feels incredible.", media: picsum(1005, 800, 600) },

  // --- diana_nurse (healthcare worker) ---
  { id: "diana_nurse_1", type: "text", user: "diana_nurse", content: "12 hour shift done. My feet have never been this tired." },
  { id: "diana_nurse_2", type: "text", user: "diana_nurse", content: "A patient told me I was the nicest nurse they've had. Made my entire week." },
  { id: "diana_nurse_3", type: "text", user: "diana_nurse", content: "Night shift snack game is unmatched.", media: picsum(431, 800, 800) },
  { id: "diana_nurse_4", type: "text", user: "diana_nurse", content: "To all my fellow healthcare workers: drink water and take your breaks. Please." },
  { id: "diana_nurse_5", type: "text", user: "diana_nurse", content: "3 days off in a row feels like a vacation. I'm doing absolutely nothing and loving it." },
  { id: "diana_nurse_6", type: "text", user: "diana_nurse", content: "Flu season is coming. Get your shots people!" },

  // --- omar_eats (foodie / restaurant reviews) ---
  { id: "omar_eats_1", type: "text", user: "omar_eats", content: "Found the best tacos in the city and I'm not sharing the location. Okay fine DM me.", media: picsum(429, 800, 800) },
  { id: "omar_eats_2", type: "text", user: "omar_eats", content: "This ramen spot has a 2 hour wait and honestly? Worth it.", media: picsum(292, 800, 600) },
  { id: "omar_eats_3", type: "text", user: "omar_eats", content: "Controversial: pineapple on pizza is actually delicious. Fight me." },
  { id: "omar_eats_4", type: "text", user: "omar_eats", content: "Brunch places that charge $18 for two eggs and toast have lost their minds" },
  { id: "omar_eats_5", type: "video", user: "omar_eats", src: sampleVideos[2], caption: "This restaurant does the craziest tableside prep. Had to record it." },
  { id: "omar_eats_6", type: "text", user: "omar_eats", content: "Home cooked meal > restaurant food 9 times out of 10. Tonight was that 1 time though.", media: picsum(312, 800, 800) },
  { id: "omar_eats_7", type: "text", user: "omar_eats", content: "Food truck festival this weekend. My body is ready." },

  // --- kate_yoga (yoga / mindfulness) ---
  { id: "kate_yoga_1", type: "text", user: "kate_yoga", content: "Sunrise yoga on the beach. This is what peace feels like.", media: picsum(1043, 800, 600) },
  { id: "kate_yoga_2", type: "text", user: "kate_yoga", content: "Reminder: it's okay to say no. Your energy is precious." },
  { id: "kate_yoga_3", type: "text", user: "kate_yoga", content: "Finally nailed the crow pose!! Only took 6 months of face planting.", media: picsum(1048, 800, 800) },
  { id: "kate_yoga_4", type: "text", user: "kate_yoga", content: "Morning meditation done. 10 minutes of silence changes your whole day." },
  { id: "kate_yoga_5", type: "video", user: "kate_yoga", src: sampleVideos[3], caption: "15 minute morning stretch routine. Your body will thank you." },
  { id: "kate_yoga_6", type: "text", user: "kate_yoga", content: "Gratitude list: coffee, sunshine, my yoga mat, and you guys. That's it." },

  // --- tyler_cars (car enthusiast) ---
  { id: "tyler_cars_1", type: "text", user: "tyler_cars", content: "Washed and detailed the car today. She's shining.", media: picsum(111, 800, 600) },
  { id: "tyler_cars_2", type: "text", user: "tyler_cars", content: "Cars and coffee this morning was packed. Saw a mint '67 Mustang.", media: picsum(133, 800, 800) },
  { id: "tyler_cars_3", type: "video", user: "tyler_cars", src: sampleVideos[5], caption: "Quick rip through the canyon roads. Nothing like it." },
  { id: "tyler_cars_4", type: "text", user: "tyler_cars", content: "Oil change done. Basic maintenance saves you thousands in the long run people." },
  { id: "tyler_cars_5", type: "text", user: "tyler_cars", content: "Gas prices are making me consider a bicycle honestly" },
  { id: "tyler_cars_6", type: "text", user: "tyler_cars", content: "Road trip playlist is locked in. 8 hours of driving, 0 complaints.", media: picsum(1071, 800, 600) },

  // --- sam_comedy (funny / memes) ---
  { id: "sam_comedy_1", type: "text", user: "sam_comedy", content: "Me: I'll go to bed early tonight. Also me at 2am: I wonder what the deepest lake in the world is." },
  { id: "sam_comedy_2", type: "text", user: "sam_comedy", content: "My bank account and my Amazon cart are in a constant war and my bank account is losing" },
  { id: "sam_comedy_3", type: "text", user: "sam_comedy", content: "Adulting is just googling how to do stuff and hoping for the best" },
  { id: "sam_comedy_4", type: "text", user: "sam_comedy", content: "I put my headphones in at work so nobody talks to me. The music isn't even playing." },
  { id: "sam_comedy_5", type: "text", user: "sam_comedy", content: "My phone battery and my will to function both die at exactly 3pm every day" },
  { id: "sam_comedy_6", type: "text", user: "sam_comedy", content: "Went to the grocery store hungry and came back with $200 worth of snacks and no actual meals" },
  { id: "sam_comedy_7", type: "text", user: "sam_comedy", content: "Social battery at 2%. Do not approach." },
  { id: "sam_comedy_8", type: "video", user: "sam_comedy", src: sampleVideos[4], caption: "Trying to explain my job to my parents. They still don't get it." },
  { id: "sam_comedy_9", type: "text", user: "sam_comedy", content: "The weekend goes by in 2 seconds but a Monday takes approximately 47 hours" },
  { id: "sam_comedy_10", type: "text", user: "sam_comedy", content: "Autocorrect just changed 'on my way' to 'on my waffle' and honestly that's more accurate" },

  // --- priya_design (graphic design) ---
  { id: "priya_design_1", type: "text", user: "priya_design", content: "New logo design just dropped. Client loved it first try. That never happens.", media: picsum(1084, 800, 800) },
  { id: "priya_design_2", type: "text", user: "priya_design", content: "Can you make the logo bigger? The four words every designer dreads." },
  { id: "priya_design_3", type: "text", user: "priya_design", content: "Color palette for the new project. Feeling these earth tones.", media: picsum(1019, 800, 800) },
  { id: "priya_design_4", type: "text", user: "priya_design", content: "Typography matters more than people think. The right font changes everything." },
  { id: "priya_design_5", type: "text", user: "priya_design", content: "Portfolio update coming soon. Been working on some really cool projects." },
  { id: "priya_design_6", type: "video", user: "priya_design", src: sampleVideos[6], caption: "Speed design challenge. Brand identity in 30 minutes. Let's see what happens." },

  // --- rob_dad (dad jokes / family) ---
  { id: "rob_dad_1", type: "text", user: "rob_dad", content: "My kid asked me where babies come from and I panicked and said Amazon Prime" },
  { id: "rob_dad_2", type: "text", user: "rob_dad", content: "Finally assembled the IKEA shelf. Only took 4 hours and 3 leftover screws. It's fine. Probably.", media: picsum(1076, 800, 600) },
  { id: "rob_dad_3", type: "text", user: "rob_dad", content: "Soccer practice pickup, piano lesson, birthday party. I need a personal assistant." },
  { id: "rob_dad_4", type: "text", user: "rob_dad", content: "The thermostat is set where I set it. End of discussion." },
  { id: "rob_dad_5", type: "text", user: "rob_dad", content: "Family movie night! Kids picked the movie. It's the same movie they picked last week.", media: picsum(1033, 800, 800) },
  { id: "rob_dad_6", type: "text", user: "rob_dad", content: "Grilling season is officially open. Stand back, Dad's in charge.", media: picsum(493, 800, 600) },
  { id: "rob_dad_7", type: "text", user: "rob_dad", content: "WiFi went out for 10 minutes and my kids acted like the world was ending" },
  { id: "rob_dad_8", type: "text", user: "rob_dad", content: "I don't snore. I dream I'm a motorcycle." },

  // --- zoe_college (college student) ---
  { id: "zoe_college_1", type: "text", user: "zoe_college", content: "Finals week. Haven't slept in 2 days. Coffee is the only thing keeping me alive." },
  { id: "zoe_college_2", type: "text", user: "zoe_college", content: "Submitted my paper 3 minutes before the deadline. Living on the edge.", media: picsum(367, 800, 800) },
  { id: "zoe_college_3", type: "text", user: "zoe_college", content: "Ramen noodles for dinner again. The college experience is glamorous." },
  { id: "zoe_college_4", type: "text", user: "zoe_college", content: "Library at midnight hits different during finals. Everyone's a little unhinged." },
  { id: "zoe_college_5", type: "text", user: "zoe_college", content: "Got an A on that paper I wrote at 4am. Maybe panic is my superpower." },
  { id: "zoe_college_6", type: "text", user: "zoe_college", content: "Dorm room makeover! Fairy lights fix everything.", media: picsum(1035, 800, 800) },
  { id: "zoe_college_7", type: "video", user: "zoe_college", src: sampleVideos[7], caption: "A day in my life as a college student. It's chaos." },
  { id: "zoe_college_8", type: "text", user: "zoe_college", content: "My professor extended the deadline. There IS a God." },

  // --- carlos_barber (barber / grooming) ---
  { id: "carlos_barber_1", type: "text", user: "carlos_barber", content: "Fresh cut. Clean lines. Book your appointment.", media: picsum(1005, 800, 800) },
  { id: "carlos_barber_2", type: "text", user: "carlos_barber", content: "A good haircut changes your whole mood. Facts.", media: picsum(1027, 800, 800) },
  { id: "carlos_barber_3", type: "video", user: "carlos_barber", src: sampleVideos[8], caption: "Transformation Tuesday. Before and after fade." },
  { id: "carlos_barber_4", type: "text", user: "carlos_barber", content: "Saturdays fully booked again. Grateful for the support." },
  { id: "carlos_barber_5", type: "text", user: "carlos_barber", content: "New clippers just arrived. These are a game changer.", media: picsum(60, 800, 600) },

  // --- tanya_teacher (teacher) ---
  { id: "tanya_teacher_1", type: "text", user: "tanya_teacher", content: "A student told me I'm their favorite teacher today. I'm not crying you're crying." },
  { id: "tanya_teacher_2", type: "text", user: "tanya_teacher", content: "Summer break countdown: 23 days. Not that I'm counting." },
  { id: "tanya_teacher_3", type: "text", user: "tanya_teacher", content: "Classroom setup is complete! Ready for the new school year.", media: picsum(180, 800, 600) },
  { id: "tanya_teacher_4", type: "text", user: "tanya_teacher", content: "Parent teacher conferences are a marathon not a sprint" },
  { id: "tanya_teacher_5", type: "text", user: "tanya_teacher", content: "Spending my own money on classroom supplies again. Just teacher things." },
  { id: "tanya_teacher_6", type: "text", user: "tanya_teacher", content: "Field trip today went surprisingly smooth. Nobody got lost. That's a win." },
  { id: "tanya_teacher_7", type: "text", user: "tanya_teacher", content: "Grading 150 essays this weekend. Send help. Or wine. Or both." },

  // --- leo_crypto (crypto / web3) ---
  { id: "leo_crypto_1", type: "text", user: "leo_crypto", content: "Charts looking interesting today. Not financial advice." },
  { id: "leo_crypto_2", type: "text", user: "leo_crypto", content: "DCA and chill. Stop trying to time the market." },
  { id: "leo_crypto_3", type: "text", user: "leo_crypto", content: "Everyone's a genius in a bull market. Stay humble." },
  { id: "leo_crypto_4", type: "text", user: "leo_crypto", content: "Portfolio update: still holding. Diamond hands." },
  { id: "leo_crypto_5", type: "text", user: "leo_crypto", content: "The technology behind blockchain is genuinely fascinating whether you invest or not" },

  // --- maria_coffee (coffee enthusiast) ---
  { id: "maria_coffee_1", type: "text", user: "maria_coffee", content: "Morning pour over ritual. The process is just as important as the cup.", media: picsum(425, 800, 800) },
  { id: "maria_coffee_2", type: "text", user: "maria_coffee", content: "Found a new roaster downtown and I think I'm in love", media: picsum(766, 800, 600) },
  { id: "maria_coffee_3", type: "text", user: "maria_coffee", content: "Latte art attempt #47. Getting closer... I think?", media: picsum(1060, 800, 800) },
  { id: "maria_coffee_4", type: "text", user: "maria_coffee", content: "Iced coffee in December. Don't judge me." },
  { id: "maria_coffee_5", type: "text", user: "maria_coffee", content: "Life is too short for bad coffee. That's my philosophy." },
  { id: "maria_coffee_6", type: "video", user: "maria_coffee", src: sampleVideos[9], caption: "My entire coffee setup. Yes I have a problem. No I won't stop." },

  // --- kevin_gamer (gaming) ---
  { id: "kevin_gamer_1", type: "text", user: "kevin_gamer", content: "Just pulled an all-nighter gaming. No regrets. Okay maybe some regrets.", media: picsum(96, 800, 800) },
  { id: "kevin_gamer_2", type: "text", user: "kevin_gamer", content: "The new update broke everything. Devs please fix." },
  { id: "kevin_gamer_3", type: "text", user: "kevin_gamer", content: "Looking for squad members for ranked tonight. Must have comms and a good attitude." },
  { id: "kevin_gamer_4", type: "text", user: "kevin_gamer", content: "My K/D ratio is my personality at this point" },
  { id: "kevin_gamer_5", type: "video", user: "kevin_gamer", src: sampleVideos[10], caption: "Clutched a 1v4 and my hands are literally shaking" },
  { id: "kevin_gamer_6", type: "text", user: "kevin_gamer", content: "Controller drift is ruining my life. Just bought my third controller this year." },

  // --- ash_hiker (hiking / nature) ---
  { id: "ash_hiker_1", type: "text", user: "ash_hiker", content: "Summit reached! 8 miles and 3000ft of elevation. The view was worth every step.", media: picsum(1018, 800, 600) },
  { id: "ash_hiker_2", type: "text", user: "ash_hiker", content: "Nature doesn't need a filter.", media: picsum(1015, 800, 600) },
  { id: "ash_hiker_3", type: "text", user: "ash_hiker", content: "Got lost on the trail for 20 minutes but honestly it led to the best viewpoint", media: picsum(1039, 800, 800) },
  { id: "ash_hiker_4", type: "text", user: "ash_hiker", content: "Camping this weekend. No cell service. See y'all Monday." },
  { id: "ash_hiker_5", type: "video", user: "ash_hiker", src: sampleVideos[11], caption: "Waterfall we stumbled onto during today's hike. Magical." },
  { id: "ash_hiker_6", type: "text", user: "ash_hiker", content: "Trail snacks are a love language. Someone brought homemade trail mix and I almost cried.", media: picsum(1047, 800, 600) },
  { id: "ash_hiker_7", type: "text", user: "ash_hiker", content: "Sunrise from the ridge this morning. I live for moments like this.", media: picsum(1013, 800, 600) },

  // --- jenny_mom (second mom account) ---
  { id: "jenny_mom_1", type: "text", user: "jenny_mom", content: "First day of school!! Where did the time go?? My baby is growing up.", media: picsum(1033, 800, 800) },
  { id: "jenny_mom_2", type: "text", user: "jenny_mom", content: "Wine after bedtime is self care. Change my mind." },
  { id: "jenny_mom_3", type: "text", user: "jenny_mom", content: "My toddler said 'no' 847 times today. I counted." },
  { id: "jenny_mom_4", type: "text", user: "jenny_mom", content: "Play date at the park. They played for 5 minutes then wanted snacks for an hour." },
  { id: "jenny_mom_5", type: "text", user: "jenny_mom", content: "Baked cookies with the kids. The kitchen looks like a war zone but the cookies are good.", media: picsum(312, 800, 800) },
  { id: "jenny_mom_6", type: "text", user: "jenny_mom", content: "Mom brain is real. I put my phone in the fridge and couldn't find it for 30 minutes." },

  // --- derek_fit (crossfit / gym bro) ---
  { id: "derek_fit_1", type: "text", user: "derek_fit", content: "New PR on clean and jerk! 225lbs felt light today.", media: picsum(1062, 800, 800) },
  { id: "derek_fit_2", type: "text", user: "derek_fit", content: "Leg day is the best day and if you skip it we can't be friends" },
  { id: "derek_fit_3", type: "text", user: "derek_fit", content: "Pre-workout hit different today. Could run through a wall right now." },
  { id: "derek_fit_4", type: "text", user: "derek_fit", content: "Protein shake game: strong. Taste: questionable.", media: picsum(1048, 800, 600) },
  { id: "derek_fit_5", type: "video", user: "derek_fit", src: sampleVideos[12], caption: "Full workout breakdown. Chest and back superset." },
  { id: "derek_fit_6", type: "text", user: "derek_fit", content: "Rest day tomorrow. My body has requested it." },

  // --- sophie_bakes (baking) ---
  { id: "sophie_bakes_1", type: "text", user: "sophie_bakes", content: "Chocolate chip cookies fresh out of the oven. Come get some.", media: picsum(312, 800, 800) },
  { id: "sophie_bakes_2", type: "text", user: "sophie_bakes", content: "Wedding cake commission complete! 3 tiers of chocolate and vanilla marble.", media: picsum(1080, 800, 800) },
  { id: "sophie_bakes_3", type: "text", user: "sophie_bakes", content: "Sourdough starter is finally alive after 7 days. Named her Bertha." },
  { id: "sophie_bakes_4", type: "text", user: "sophie_bakes", content: "Baking at midnight because I suddenly needed brownies. Normal behavior." },
  { id: "sophie_bakes_5", type: "text", user: "sophie_bakes", content: "My macarons actually have feet!! After like 20 failed batches. We did it.", media: picsum(429, 800, 800) },
  { id: "sophie_bakes_6", type: "video", user: "sophie_bakes", src: sampleVideos[0], caption: "Satisfying frosting swirl on 24 cupcakes. Watch to the end." },

  // --- ray_teacher (college professor) ---
  { id: "ray_teacher_1", type: "text", user: "ray_teacher", content: "If you cite Wikipedia as your primary source one more time I swear..." },
  { id: "ray_teacher_2", type: "text", user: "ray_teacher", content: "The look on students' faces when they actually understand the concept. That's why I teach." },
  { id: "ray_teacher_3", type: "text", user: "ray_teacher", content: "Office hours: where students come to tell me they haven't started the assignment due tomorrow" },
  { id: "ray_teacher_4", type: "text", user: "ray_teacher", content: "Published my research paper today! Two years of work finally out in the world." },
  { id: "ray_teacher_5", type: "text", user: "ray_teacher", content: "Grading on a curve because I believe in second chances and also this test was too hard" },

  // --- nat_skincare (skincare / beauty) ---
  { id: "nat_skincare_1", type: "text", user: "nat_skincare", content: "Skin is GLOWING today. The new serum is working.", media: picsum(1027, 800, 800) },
  { id: "nat_skincare_2", type: "text", user: "nat_skincare", content: "SPF every single day. Rain or shine. Non-negotiable." },
  { id: "nat_skincare_3", type: "text", user: "nat_skincare", content: "Sunscreen is the best anti-aging product money can buy. That's it. That's the post." },
  { id: "nat_skincare_4", type: "text", user: "nat_skincare", content: "Night routine: double cleanse, toner, serum, moisturizer, eye cream. Yes it takes 20 minutes. Yes it's worth it." },
  { id: "nat_skincare_5", type: "video", user: "nat_skincare", src: sampleVideos[1], caption: "Full skincare routine - morning edition. Products linked in my profile." },
  { id: "nat_skincare_6", type: "text", user: "nat_skincare", content: "Drink water. That's my skincare advice for today.", media: picsum(1036, 800, 800) },

  // --- will_tattoo (tattoo artist) ---
  { id: "will_tattoo_1", type: "text", user: "will_tattoo", content: "Finished this sleeve today. 20 hours of work. Client sat like a champ.", media: picsum(1084, 800, 800) },
  { id: "will_tattoo_2", type: "text", user: "will_tattoo", content: "Books are open for March! Limited spots available. DM me." },
  { id: "will_tattoo_3", type: "text", user: "will_tattoo", content: "Clean lines are everything. Practice makes permanent.", media: picsum(1019, 800, 800) },
  { id: "will_tattoo_4", type: "text", user: "will_tattoo", content: "No I can't tattoo your face. Yes I'm serious. No this is not negotiable." },
  { id: "will_tattoo_5", type: "video", user: "will_tattoo", src: sampleVideos[2], caption: "Tattooing process from stencil to finished piece. Satisfying." },

  // --- ava_dance (dancer) ---
  { id: "ava_dance_1", type: "text", user: "ava_dance", content: "Rehearsal for 6 hours straight. My legs are jelly but the routine is clean.", media: picsum(1062, 800, 800) },
  { id: "ava_dance_2", type: "text", user: "ava_dance", content: "Dancing is cheaper than therapy. Also more fun." },
  { id: "ava_dance_3", type: "video", user: "ava_dance", src: sampleVideos[3], caption: "New choreo to this song that's been stuck in my head. Nailed it." },
  { id: "ava_dance_4", type: "text", user: "ava_dance", content: "Show tonight! Nervous but excited. If you're in the area come support!", media: picsum(1060, 800, 600) },
  { id: "ava_dance_5", type: "text", user: "ava_dance", content: "Stretching is not optional. My hamstrings told me this the hard way." },
  { id: "ava_dance_6", type: "text", user: "ava_dance", content: "When the music hits and your body just moves. That's the feeling I live for." },

  // --- pete_trucker (trucker / road life) ---
  { id: "pete_trucker_1", type: "text", user: "pete_trucker", content: "2000 miles this week. The open road is my office.", media: picsum(1071, 800, 600) },
  { id: "pete_trucker_2", type: "text", user: "pete_trucker", content: "Sunset from the cab tonight. Not a bad view for work.", media: picsum(1013, 800, 600) },
  { id: "pete_trucker_3", type: "text", user: "pete_trucker", content: "Truck stop coffee is an acquired taste. I've acquired it." },
  { id: "pete_trucker_4", type: "text", user: "pete_trucker", content: "Home for the weekend! Kids ran to the door. Best feeling in the world." },
  { id: "pete_trucker_5", type: "text", user: "pete_trucker", content: "If you see a trucker flash their lights at you it means you're clear to merge. The more you know." },

  // --- lena_nurse2 (ER nurse) ---
  { id: "lena_nurse2_1", type: "text", user: "lena_nurse2", content: "ER shift from midnight to noon. The things I've seen cannot be unseen." },
  { id: "lena_nurse2_2", type: "text", user: "lena_nurse2", content: "Hospital cafeteria food gets a bad rap but that grilled cheese hits at 3am" },
  { id: "lena_nurse2_3", type: "text", user: "lena_nurse2", content: "Back to back doubles this week. I deserve a vacation. And a raise." },
  { id: "lena_nurse2_4", type: "text", user: "lena_nurse2", content: "Scrub shopping is my version of retail therapy.", media: picsum(1005, 800, 800) },
  { id: "lena_nurse2_5", type: "text", user: "lena_nurse2", content: "Coworkers who bring snacks to the break room are the real MVPs" },

  // --- jake_music2 (indie musician) ---
  { id: "jake_music2_1", type: "text", user: "jake_music2", content: "Wrote 3 songs today. Sometimes the creativity just flows.", media: picsum(1060, 800, 600) },
  { id: "jake_music2_2", type: "text", user: "jake_music2", content: "Open mic tonight at the coffee shop downtown. Come through!", media: picsum(1067, 800, 800) },
  { id: "jake_music2_3", type: "text", user: "jake_music2", content: "Guitar strings broke mid-practice. Classic." },
  { id: "jake_music2_4", type: "text", user: "jake_music2", content: "Working on an EP. 4 tracks done, 2 more to go." },
  { id: "jake_music2_5", type: "video", user: "jake_music2", src: sampleVideos[4], caption: "Acoustic cover of that song everyone loves. Let me know what you think." },
  { id: "jake_music2_6", type: "text", user: "jake_music2", content: "Music doesn't pay the bills yet but it feeds my soul" },

  // --- kim_realtor (real estate) ---
  { id: "kim_realtor_1", type: "text", user: "kim_realtor", content: "SOLD! So proud of my clients. First time homebuyers!!", media: picsum(1029, 800, 600) },
  { id: "kim_realtor_2", type: "text", user: "kim_realtor", content: "Open house today! Beautiful 3 bed 2 bath in a great neighborhood.", media: picsum(1076, 800, 600) },
  { id: "kim_realtor_3", type: "text", user: "kim_realtor", content: "The housing market is wild right now but don't give up on your dream." },
  { id: "kim_realtor_4", type: "text", user: "kim_realtor", content: "Just listed a new property and I'm obsessed with this kitchen", media: picsum(1080, 800, 800) },
  { id: "kim_realtor_5", type: "text", user: "kim_realtor", content: "Another closing! That's 15 this year. Grateful for every single one." },

  // --- dan_golf (golf) ---
  { id: "dan_golf_1", type: "text", user: "dan_golf", content: "Shot a 78 today. Best round of the season.", media: picsum(1054, 800, 600) },
  { id: "dan_golf_2", type: "text", user: "dan_golf", content: "Golf is 90% mental and 10% also mental." },
  { id: "dan_golf_3", type: "text", user: "dan_golf", content: "New driver just arrived. Can't wait to slice it into the trees like I do with every driver." },
  { id: "dan_golf_4", type: "text", user: "dan_golf", content: "Sunrise tee time is the move. No crowds, beautiful light.", media: picsum(1039, 800, 600) },
  { id: "dan_golf_5", type: "text", user: "dan_golf", content: "My putting is either amazing or embarrassing. There is no in between." },

  // --- rita_grandma (older user / grandma) ---
  { id: "rita_grandma_1", type: "text", user: "rita_grandma", content: "My grandson showed me how to use this app. Hello everyone!", media: picsum(1074, 800, 600) },
  { id: "rita_grandma_2", type: "text", user: "rita_grandma", content: "Made my famous apple pie today. Recipe has been in the family for 4 generations." },
  { id: "rita_grandma_3", type: "text", user: "rita_grandma", content: "Grandkids visited this weekend. The house feels so quiet now that they're gone." },
  { id: "rita_grandma_4", type: "text", user: "rita_grandma", content: "Learned how to video call today! Technology is amazing.", media: picsum(1033, 800, 800) },
  { id: "rita_grandma_5", type: "text", user: "rita_grandma", content: "Garden is looking beautiful this spring. Roses are coming in nicely.", media: picsum(146, 800, 600) },

  // --- troy_sneakers (sneaker culture) ---
  { id: "troy_sneakers_1", type: "text", user: "troy_sneakers", content: "W on the drop this morning! These are going straight to feet, not resale.", media: picsum(21, 800, 800) },
  { id: "troy_sneakers_2", type: "text", user: "troy_sneakers", content: "Sneaker rotation this week is immaculate.", media: picsum(1005, 800, 800) },
  { id: "troy_sneakers_3", type: "text", user: "troy_sneakers", content: "L on the raffle again. The sneaker gods are testing me." },
  { id: "troy_sneakers_4", type: "text", user: "troy_sneakers", content: "Collection update: 43 pairs and counting. Don't tell my partner.", media: picsum(1025, 800, 800) },
  { id: "troy_sneakers_5", type: "text", user: "troy_sneakers", content: "Cleaning day. Every pair getting the spa treatment.", media: picsum(399, 800, 600) },
  { id: "troy_sneakers_6", type: "video", user: "troy_sneakers", src: sampleVideos[5], caption: "Unboxing the most hyped release of the year. Did NOT disappoint." },

  // --- mel_writer (freelance writer) ---
  { id: "mel_writer_1", type: "text", user: "mel_writer", content: "Wrote 3000 words today. My fingers hurt but my word count looks beautiful." },
  { id: "mel_writer_2", type: "text", user: "mel_writer", content: "Writers block is just your brain telling you to go for a walk" },
  { id: "mel_writer_3", type: "text", user: "mel_writer", content: "Coffee shop writing session. The background noise helps me think.", media: picsum(766, 800, 600) },
  { id: "mel_writer_4", type: "text", user: "mel_writer", content: "Just got published in a major magazine! Pinch me.", media: picsum(24, 800, 800) },
  { id: "mel_writer_5", type: "text", user: "mel_writer", content: "Freelancing means I'm my own boss. It also means I'm terrible at telling myself to take breaks." },
  { id: "mel_writer_6", type: "text", user: "mel_writer", content: "Every first draft is garbage. That's not a flaw, that's the process." },

  // --- hugo_chef (professional chef) ---
  { id: "hugo_chef_1", type: "text", user: "hugo_chef", content: "Full house tonight. Kitchen was slammed but we crushed it.", media: picsum(431, 800, 800) },
  { id: "hugo_chef_2", type: "text", user: "hugo_chef", content: "New seasonal menu drops tomorrow. Been testing recipes for weeks.", media: picsum(292, 800, 600) },
  { id: "hugo_chef_3", type: "video", user: "hugo_chef", src: sampleVideos[6], caption: "Plating this dessert is an art form. Watch closely." },
  { id: "hugo_chef_4", type: "text", user: "hugo_chef", content: "Mise en place. Always. Everything in its place before you start." },
  { id: "hugo_chef_5", type: "text", user: "hugo_chef", content: "If you think being a chef is glamorous, come work a Saturday dinner rush" },
  { id: "hugo_chef_6", type: "text", user: "hugo_chef", content: "Farmers market haul for this week's specials. Everything is fresh and local.", media: picsum(102, 800, 600) },

  // --- quinn_astro (astrology / spiritual) ---
  { id: "quinn_astro_1", type: "text", user: "quinn_astro", content: "Mercury is in retrograde and honestly it explains everything happening right now" },
  { id: "quinn_astro_2", type: "text", user: "quinn_astro", content: "Full moon tonight. Time to set intentions and let go of what no longer serves you.", media: picsum(1043, 800, 600) },
  { id: "quinn_astro_3", type: "text", user: "quinn_astro", content: "Your daily reminder that you are exactly where you need to be." },
  { id: "quinn_astro_4", type: "text", user: "quinn_astro", content: "Crystal collection growing. This amethyst is calling to me.", media: picsum(1080, 800, 800) },
  { id: "quinn_astro_5", type: "text", user: "quinn_astro", content: "Journaling every morning has genuinely changed my life. Even 5 minutes helps." },

  // --- nate_startup (startup founder) ---
  { id: "nate_startup_1", type: "text", user: "nate_startup", content: "Company just hit 10K users! Started this in my garage 8 months ago." },
  { id: "nate_startup_2", type: "text", user: "nate_startup", content: "Startup life: working 80 hours a week so you don't have to work 40 hours for someone else." },
  { id: "nate_startup_3", type: "text", user: "nate_startup", content: "Investor meeting went great today. Big things coming soon." },
  { id: "nate_startup_4", type: "text", user: "nate_startup", content: "Hiring is the hardest part of building a company. Good people are everything." },
  { id: "nate_startup_5", type: "text", user: "nate_startup", content: "Failed 3 times before this one worked. Failure is just data." },
  { id: "nate_startup_6", type: "video", user: "nate_startup", src: sampleVideos[7], caption: "Office tour! From garage to actual office. We made it." },

  // --- ivy_vintage (vintage collector) ---
  { id: "ivy_vintage_1", type: "text", user: "ivy_vintage", content: "Estate sale find of the year. This lamp is gorgeous.", media: picsum(1076, 800, 800) },
  { id: "ivy_vintage_2", type: "text", user: "ivy_vintage", content: "Thrifting is a sport and I am an Olympic athlete", media: picsum(399, 800, 800) },
  { id: "ivy_vintage_3", type: "text", user: "ivy_vintage", content: "90s aesthetic forever. Found the perfect denim jacket today.", media: picsum(996, 800, 800) },
  { id: "ivy_vintage_4", type: "text", user: "ivy_vintage", content: "One person's junk is another person's treasure. Literally my entire apartment." },
  { id: "ivy_vintage_5", type: "text", user: "ivy_vintage", content: "Vinyl records, old cameras, vintage clothing. My happy place.", media: picsum(250, 800, 800) },
  { id: "ivy_vintage_6", type: "video", user: "ivy_vintage", src: sampleVideos[8], caption: "Come thrift with me! This store is a goldmine." },

  // --- max_skate (skateboarding) ---
  { id: "max_skate_1", type: "text", user: "max_skate", content: "Finally landed the kickflip after 3 weeks of trying. Let's gooo!", media: picsum(1058, 800, 800) },
  { id: "max_skate_2", type: "text", user: "max_skate", content: "Skatepark at sunset is undefeated.", media: picsum(1044, 800, 600) },
  { id: "max_skate_3", type: "video", user: "max_skate", src: sampleVideos[9], caption: "Full session at the park. Got some clean clips." },
  { id: "max_skate_4", type: "text", user: "max_skate", content: "Ate it HARD on the half pipe today. My elbow has a different opinion about skating now." },
  { id: "max_skate_5", type: "text", user: "max_skate", content: "New deck day! This graphic is fire.", media: picsum(119, 800, 800) },

  // --- ruby_nails (nail artist) ---
  { id: "ruby_nails_1", type: "text", user: "ruby_nails", content: "Set of the day! These chrome nails are everything.", media: picsum(823, 800, 800) },
  { id: "ruby_nails_2", type: "text", user: "ruby_nails", content: "Fully booked for Valentine's Day already! Book early people." },
  { id: "ruby_nails_3", type: "text", user: "ruby_nails", content: "Self care starts at the fingertips.", media: picsum(1019, 800, 800) },
  { id: "ruby_nails_4", type: "text", user: "ruby_nails", content: "Nail art is my meditation. 3 hours of focus and beauty at the end." },
  { id: "ruby_nails_5", type: "video", user: "ruby_nails", src: sampleVideos[10], caption: "Full set timelapse. From bare nails to art." },

  // --- greg_bbq (BBQ / grilling) ---
  { id: "greg_bbq_1", type: "text", user: "greg_bbq", content: "Brisket has been smoking for 14 hours. The bark on this thing is beautiful.", media: picsum(431, 800, 800) },
  { id: "greg_bbq_2", type: "text", user: "greg_bbq", content: "Low and slow. That's the only way.", media: picsum(493, 800, 600) },
  { id: "greg_bbq_3", type: "text", user: "greg_bbq", content: "Ribs fell off the bone today. We're eating good tonight." },
  { id: "greg_bbq_4", type: "text", user: "greg_bbq", content: "BBQ competition this weekend. Wish me luck!", media: picsum(429, 800, 800) },
  { id: "greg_bbq_5", type: "text", user: "greg_bbq", content: "The secret ingredient is patience. And a ridiculous amount of paprika." },
  { id: "greg_bbq_6", type: "video", user: "greg_bbq", src: sampleVideos[11], caption: "The reveal. 16 hours of smoke. Was it worth it? Always." },

  // --- fiona_cat (cat lady) ---
  { id: "fiona_cat_1", type: "text", user: "fiona_cat", content: "My cat has claimed the new box as his throne. The expensive bed I bought? Untouched.", media: picsum(40, 800, 800) },
  { id: "fiona_cat_2", type: "text", user: "fiona_cat", content: "3am zoomies. Every. Single. Night." },
  { id: "fiona_cat_3", type: "text", user: "fiona_cat", content: "She knocked my water glass off the table while maintaining direct eye contact. Power move.", media: picsum(169, 800, 800) },
  { id: "fiona_cat_4", type: "text", user: "fiona_cat", content: "Foster kitten update: all adopted! My heart hurts but I'm so happy.", media: picsum(200, 800, 800) },
  { id: "fiona_cat_5", type: "text", user: "fiona_cat", content: "They say you don't choose the cat, the cat chooses you. She chose chaos." },

  // --- ivan_chess (chess player) ---
  { id: "ivan_chess_1", type: "text", user: "ivan_chess", content: "Hit 1800 rating on chess com. The grind continues." },
  { id: "ivan_chess_2", type: "text", user: "ivan_chess", content: "Lost to a 12 year old at the park today. Humbling." },
  { id: "ivan_chess_3", type: "text", user: "ivan_chess", content: "Chess is the only game where you can checkmate someone and they still shake your hand. Respect." },
  { id: "ivan_chess_4", type: "text", user: "ivan_chess", content: "Studying openings at midnight. The Sicilian Defense is keeping me up.", media: picsum(24, 800, 800) },
  { id: "ivan_chess_5", type: "text", user: "ivan_chess", content: "Tournament this Saturday. Focused and ready." },

  // --- grace_swim (swimmer) ---
  { id: "grace_swim_1", type: "text", user: "grace_swim", content: "5am pool session before work. The water was freezing but my times were fast.", media: picsum(1043, 800, 600) },
  { id: "grace_swim_2", type: "text", user: "grace_swim", content: "Chlorine is my perfume at this point" },
  { id: "grace_swim_3", type: "text", user: "grace_swim", content: "New goggles. New cap. Same determination.", media: picsum(1054, 800, 800) },
  { id: "grace_swim_4", type: "text", user: "grace_swim", content: "Open water swimming is terrifying and exhilarating at the same time" },
  { id: "grace_swim_5", type: "text", user: "grace_swim", content: "PR in the 200m freestyle! Coach was pumped.", media: picsum(1048, 800, 800) },

  // --- oscar_film (filmmaker) ---
  { id: "oscar_film_1", type: "text", user: "oscar_film", content: "Short film wrapped! 3 days of shooting, zero sleep, one amazing final product.", media: picsum(1067, 800, 600) },
  { id: "oscar_film_2", type: "text", user: "oscar_film", content: "Editing is where the real magic happens. Been in front of this screen for 10 hours." },
  { id: "oscar_film_3", type: "video", user: "oscar_film", src: sampleVideos[12], caption: "Behind the scenes of our latest shoot. The crew went above and beyond." },
  { id: "oscar_film_4", type: "text", user: "oscar_film", content: "Submitted to 5 film festivals. Now we wait.", media: picsum(1084, 800, 800) },
  { id: "oscar_film_5", type: "text", user: "oscar_film", content: "Every great director started with a terrible first film. Mine was REALLY terrible." },

  // --- bella_wine (wine / sommelier) ---
  { id: "bella_wine_1", type: "text", user: "bella_wine", content: "This Pinot Noir is giving autumn in a glass. Notes of cherry, earth, and happiness.", media: picsum(1069, 800, 600) },
  { id: "bella_wine_2", type: "text", user: "bella_wine", content: "Wine tasting this weekend! 12 different vineyards. My liver is preparing." },
  { id: "bella_wine_3", type: "text", user: "bella_wine", content: "You don't need expensive wine to enjoy good wine. $12 bottles that taste like $50 do exist." },
  { id: "bella_wine_4", type: "text", user: "bella_wine", content: "Pairing tonight's dinner with a Malbec. Chef's kiss.", media: picsum(429, 800, 800) },
  { id: "bella_wine_5", type: "text", user: "bella_wine", content: "Wine is just grape juice that believed in itself" },

  // --- henry_retire (retiree) ---
  { id: "henry_retire_1", type: "text", user: "henry_retire", content: "Retired last month. First time in 40 years I don't set an alarm. It's glorious." },
  { id: "henry_retire_2", type: "text", user: "henry_retire", content: "Took up woodworking. Made a birdhouse. The birds seem to approve.", media: picsum(1076, 800, 800) },
  { id: "henry_retire_3", type: "text", user: "henry_retire", content: "Grandkids came over and taught me how to use this thing. I think I'm doing it right?" },
  { id: "henry_retire_4", type: "text", user: "henry_retire", content: "Morning walks with the dog. Simple pleasures are the best pleasures.", media: picsum(169, 800, 600) },
  { id: "henry_retire_5", type: "text", user: "henry_retire", content: "Joined a bowling league. Turns out I'm terrible but everyone's nice about it." },

  // --- luna_witch (cottagecore / witchy aesthetic) ---
  { id: "luna_witch_1", type: "text", user: "luna_witch", content: "Made my own candles today. Lavender and sage. The vibes are immaculate.", media: picsum(1080, 800, 800) },
  { id: "luna_witch_2", type: "text", user: "luna_witch", content: "Forest walk at dawn. Found some wild mushrooms. No I did not eat them.", media: picsum(1015, 800, 600) },
  { id: "luna_witch_3", type: "text", user: "luna_witch", content: "Herbal tea recipe for stress: chamomile, lavender, and honey. You're welcome." },
  { id: "luna_witch_4", type: "text", user: "luna_witch", content: "Rainy days are for reading, tea, and pretending you live in a cottage in the woods", media: picsum(1069, 800, 800) },
  { id: "luna_witch_5", type: "text", user: "luna_witch", content: "Tarot reading for myself today. The cards said rest. So I rest." },
  { id: "luna_witch_6", type: "video", user: "luna_witch", src: sampleVideos[0], caption: "Cozy autumn morning routine. Candles, tea, and journaling." },

  // --- chad_sales (sales / corporate) ---
  { id: "chad_sales_1", type: "text", user: "chad_sales", content: "Closed the biggest deal of Q4. Hard work pays off." },
  { id: "chad_sales_2", type: "text", user: "chad_sales", content: "Monday morning motivation: your competition is already working. Get up." },
  { id: "chad_sales_3", type: "text", user: "chad_sales", content: "Conference in Vegas next week. Time to network.", media: picsum(1029, 800, 600) },
  { id: "chad_sales_4", type: "text", user: "chad_sales", content: "Pipeline is looking STRONG heading into the new quarter. Let's eat." },
  { id: "chad_sales_5", type: "text", user: "chad_sales", content: "Sales is a mindset not a job. You're always selling something." },

  // --- vera_yoga2 (yoga instructor) ---
  { id: "vera_yoga2_1", type: "text", user: "vera_yoga2", content: "Today's class was all about letting go. Namaste.", media: picsum(1043, 800, 600) },
  { id: "vera_yoga2_2", type: "text", user: "vera_yoga2", content: "Your breath is the bridge between your body and mind. Use it." },
  { id: "vera_yoga2_3", type: "text", user: "vera_yoga2", content: "Outdoor yoga session this Saturday morning. Bring your mat and good energy!", media: picsum(1039, 800, 800) },
  { id: "vera_yoga2_4", type: "text", user: "vera_yoga2", content: "Progress is not linear. Some days you can touch your toes, some days you can't. Both are okay." },
  { id: "vera_yoga2_5", type: "video", user: "vera_yoga2", src: sampleVideos[1], caption: "30 minute evening wind-down flow. Perfect before bed." },

  // --- nick_photo2 (phone photographer) ---
  { id: "nick_photo2_1", type: "text", user: "nick_photo2", content: "Phone cameras these days are insane. Shot this on my phone.", media: picsum(1044, 800, 600) },
  { id: "nick_photo2_2", type: "text", user: "nick_photo2", content: "Puddles after rain make the best reflections.", media: picsum(1036, 800, 800) },
  { id: "nick_photo2_3", type: "text", user: "nick_photo2", content: "Black and white photography hits different. Less distraction, more emotion.", media: picsum(1011, 800, 600) },
  { id: "nick_photo2_4", type: "text", user: "nick_photo2", content: "Everyone's a photographer now but that's not a bad thing. Art should be accessible." },
  { id: "nick_photo2_5", type: "text", user: "nick_photo2", content: "Chasing light. That's basically my whole job description.", media: picsum(1016, 800, 600) },

  // --- dot_garden (community garden) ---
  { id: "dot_garden_1", type: "text", user: "dot_garden", content: "First harvest of the season! Tomatoes, peppers, and herbs.", media: picsum(146, 800, 600) },
  { id: "dot_garden_2", type: "text", user: "dot_garden", content: "Composting is not gross, it's science. And it makes your garden amazing." },
  { id: "dot_garden_3", type: "text", user: "dot_garden", content: "The community garden brought together people who would never have met otherwise. Love this.", media: picsum(365, 800, 800) },
  { id: "dot_garden_4", type: "text", user: "dot_garden", content: "Sunflowers taller than me! These grew from seeds I planted in March.", media: picsum(1040, 800, 800) },
  { id: "dot_garden_5", type: "text", user: "dot_garden", content: "Getting my hands in the dirt is the best therapy money can't buy" },

  // --- matt_pizza (pizza obsessed) ---
  { id: "matt_pizza_1", type: "text", user: "matt_pizza", content: "Homemade pizza night! Dough from scratch, obviously.", media: picsum(312, 800, 800) },
  { id: "matt_pizza_2", type: "text", user: "matt_pizza", content: "NY style vs Chicago deep dish. There's only one right answer and it's NY." },
  { id: "matt_pizza_3", type: "text", user: "matt_pizza", content: "Found the best slice in Brooklyn. I will fight anyone who disagrees.", media: picsum(429, 800, 800) },
  { id: "matt_pizza_4", type: "text", user: "matt_pizza", content: "Pizza is a breakfast food. This is a fact not an opinion." },
  { id: "matt_pizza_5", type: "video", user: "matt_pizza", src: sampleVideos[2], caption: "Making Neapolitan pizza in my backyard oven. 90 seconds at 900 degrees." },

  // --- elena_lang (language learner) ---
  { id: "elena_lang_1", type: "text", user: "elena_lang", content: "Day 100 of learning Japanese! Kanji still makes my brain hurt but we keep going." },
  { id: "elena_lang_2", type: "text", user: "elena_lang", content: "Had my first conversation entirely in French today! It was clunky but I did it!" },
  { id: "elena_lang_3", type: "text", user: "elena_lang", content: "Language learning tip: talk to yourself in the mirror. Yes you will feel insane. Yes it works." },
  { id: "elena_lang_4", type: "text", user: "elena_lang", content: "Watching shows with subtitles in the language you're learning is a game changer" },
  { id: "elena_lang_5", type: "text", user: "elena_lang", content: "My pronunciation in Mandarin is getting better! My Chinese coworker only laughed a little bit today." },

  // --- wade_fish (fishing) ---
  { id: "wade_fish_1", type: "text", user: "wade_fish", content: "Caught a 5lb bass this morning. Best day on the lake in months.", media: picsum(1039, 800, 600) },
  { id: "wade_fish_2", type: "text", user: "wade_fish", content: "Fishing is 95% waiting and 5% pure adrenaline. I love every second." },
  { id: "wade_fish_3", type: "text", user: "wade_fish", content: "Sunrise on the water. Nothing else matters out here.", media: picsum(1013, 800, 600) },
  { id: "wade_fish_4", type: "text", user: "wade_fish", content: "Teaching my nephew how to fish today. He caught his first one! The smile on his face.", media: picsum(1015, 800, 800) },
  { id: "wade_fish_5", type: "text", user: "wade_fish", content: "A bad day fishing is still better than a good day at the office" },

  // --- cleo_fashion2 (fashion blogger) ---
  { id: "cleo_fashion2_1", type: "text", user: "cleo_fashion2", content: "Fashion week recap! Three shows in one day. My feet are broken but the looks were incredible.", media: picsum(1025, 800, 800) },
  { id: "cleo_fashion2_2", type: "text", user: "cleo_fashion2", content: "Mixing high and low. This outfit is $400 designer top and $15 thrifted jeans.", media: picsum(1012, 800, 800) },
  { id: "cleo_fashion2_3", type: "text", user: "cleo_fashion2", content: "Closet organization is an art form and I just painted a masterpiece", media: picsum(1005, 800, 800) },
  { id: "cleo_fashion2_4", type: "text", user: "cleo_fashion2", content: "Style is about confidence, not price tags. Wear what makes YOU feel good." },
  { id: "cleo_fashion2_5", type: "video", user: "cleo_fashion2", src: sampleVideos[3], caption: "5 outfit ideas for fall. All under $50." },
  { id: "cleo_fashion2_6", type: "text", user: "cleo_fashion2", content: "New season, new wardrobe mood. Obsessing over this color palette.", media: picsum(1027, 800, 800) },

  // Additional users with fewer posts to reach 200 users ---

  { id: "rico_surf_1", type: "text", user: "rico_surf", content: "Dawn patrol! Waves were pumping this morning.", media: picsum(1043, 800, 600) },
  { id: "rico_surf_2", type: "text", user: "rico_surf", content: "Wax on, worries off. The ocean fixes everything.", media: picsum(1054, 800, 800) },
  { id: "rico_surf_3", type: "text", user: "rico_surf", content: "Board got dinged. Repair day before the next swell.", media: picsum(119, 800, 600) },
  { id: "rico_surf_4", type: "text", user: "rico_surf", content: "Saltwater is the cure for everything. Sweat, tears, or the sea." },
  { id: "rico_surf_5", type: "video", user: "rico_surf", src: sampleVideos[4], caption: "Best wave of my life. Rode it for what felt like forever." },

  { id: "tina_sew_1", type: "text", user: "tina_sew", content: "Finished this dress from a pattern I found online. So happy with how it turned out!", media: picsum(1005, 800, 800) },
  { id: "tina_sew_2", type: "text", user: "tina_sew", content: "Sewing machine jammed again. We're in a complicated relationship." },
  { id: "tina_sew_3", type: "text", user: "tina_sew", content: "Fabric haul from the craft store. My stash is getting out of hand.", media: picsum(399, 800, 800) },
  { id: "tina_sew_4", type: "text", user: "tina_sew", content: "Making my own clothes is cheaper... is what I told myself before buying $200 in fabric." },
  { id: "tina_sew_5", type: "text", user: "tina_sew", content: "Halloween costume is going to be 100% handmade this year. Wish me luck." },

  { id: "paul_bike_1", type: "text", user: "paul_bike", content: "50 mile ride this morning. Legs are done but the endorphins are real.", media: picsum(1054, 800, 600) },
  { id: "paul_bike_2", type: "text", user: "paul_bike", content: "New bike day!! Carbon frame, Shimano groupset. I'm in love.", media: picsum(111, 800, 800) },
  { id: "paul_bike_3", type: "text", user: "paul_bike", content: "Cycling > driving. Better for you, better for the planet, more fun." },
  { id: "paul_bike_4", type: "text", user: "paul_bike", content: "Got caught in the rain 20 miles from home. Arrived looking like a drowned rat.", media: picsum(1039, 800, 600) },
  { id: "paul_bike_5", type: "video", user: "paul_bike", src: sampleVideos[5], caption: "Mountain biking through the trails. GoPro footage is wild." },

  { id: "sage_tarot_1", type: "text", user: "sage_tarot", content: "Energy check: how are you REALLY doing today? Be honest with yourself." },
  { id: "sage_tarot_2", type: "text", user: "sage_tarot", content: "New moon, new beginnings. What are you manifesting this month?" },
  { id: "sage_tarot_3", type: "text", user: "sage_tarot", content: "Your intuition is louder than your anxiety. Listen to it." },
  { id: "sage_tarot_4", type: "text", user: "sage_tarot", content: "Did a reading for a friend today and the accuracy made us both emotional." },
  { id: "sage_tarot_5", type: "text", user: "sage_tarot", content: "Cleansing the apartment with sage. Fresh energy only.", media: picsum(1080, 800, 800) },

  { id: "bo_climb_1", type: "text", user: "bo_climb", content: "Sent my first V6 today! Took me 3 months of projecting but we got it.", media: picsum(1058, 800, 800) },
  { id: "bo_climb_2", type: "text", user: "bo_climb", content: "Climbing gym after work is my therapy session. Cheaper than actual therapy too." },
  { id: "bo_climb_3", type: "text", user: "bo_climb", content: "Forearms are so pumped I can barely hold my phone to type this" },
  { id: "bo_climb_4", type: "text", user: "bo_climb", content: "Outdoor climbing season is approaching and I cannot wait to get on real rock.", media: picsum(1018, 800, 600) },
  { id: "bo_climb_5", type: "video", user: "bo_climb", src: sampleVideos[6], caption: "Full send on this overhang. Almost fell twice but stuck the top." },

  { id: "iris_paint_1", type: "text", user: "iris_paint", content: "Watercolor experiment. Letting the paint do what it wants.", media: picsum(1019, 800, 800) },
  { id: "iris_paint_2", type: "text", user: "iris_paint", content: "Bob Ross was right. There are no mistakes, only happy accidents." },
  { id: "iris_paint_3", type: "text", user: "iris_paint", content: "Art supply shopping is dangerous. I went in for brushes and left with everything.", media: picsum(1084, 800, 800) },
  { id: "iris_paint_4", type: "text", user: "iris_paint", content: "Painted for 4 hours straight and didn't look at my phone once. That's peace." },
  { id: "iris_paint_5", type: "text", user: "iris_paint", content: "Gallery showing next month! Nervous but so excited to share my work.", media: picsum(1074, 800, 600) },

  { id: "duke_bbq2_1", type: "text", user: "duke_bbq2", content: "Smoked chicken today. Simple but perfect.", media: picsum(431, 800, 800) },
  { id: "duke_bbq2_2", type: "text", user: "duke_bbq2", content: "Charcoal vs gas. The answer is charcoal. Always." },
  { id: "duke_bbq2_3", type: "text", user: "duke_bbq2", content: "The neighbors can smell what's cooking and they're all conveniently stopping by to chat." },
  { id: "duke_bbq2_4", type: "text", user: "duke_bbq2", content: "Pulled pork sandwiches for the block party. Made 10 pounds. Gone in an hour.", media: picsum(493, 800, 600) },
  { id: "duke_bbq2_5", type: "text", user: "duke_bbq2", content: "Rain can't stop the grill. That's what umbrellas are for." },

  { id: "pearl_knit_1", type: "text", user: "pearl_knit", content: "Finished this scarf just in time for the cold weather!", media: picsum(399, 800, 800) },
  { id: "pearl_knit_2", type: "text", user: "pearl_knit", content: "Knitting while watching TV. Maximum productivity.", media: picsum(1033, 800, 800) },
  { id: "pearl_knit_3", type: "text", user: "pearl_knit", content: "Yarn sale at the craft store. I do not have a problem. I have a collection." },
  { id: "pearl_knit_4", type: "text", user: "pearl_knit", content: "Making Christmas gifts by hand because I'm either really thoughtful or really broke. Both." },
  { id: "pearl_knit_5", type: "text", user: "pearl_knit", content: "Dropped a stitch 30 rows back. Guess who's starting over. This girl." },

  { id: "rex_diy_1", type: "text", user: "rex_diy", content: "Built a coffee table from pallets. YouTube University degree paying off.", media: picsum(1076, 800, 800) },
  { id: "rex_diy_2", type: "text", user: "rex_diy", content: "DIY tip: measure everything twice. Ask me how I know.", media: picsum(1084, 800, 600) },
  { id: "rex_diy_3", type: "text", user: "rex_diy", content: "The bathroom renovation is done!! Only went $500 over budget. I call that a win.", media: picsum(1029, 800, 800) },
  { id: "rex_diy_4", type: "text", user: "rex_diy", content: "Staining the deck today. It's the most satisfying before and after." },
  { id: "rex_diy_5", type: "video", user: "rex_diy", src: sampleVideos[7], caption: "Turning an old dresser into a bathroom vanity. Full transformation." },

  { id: "joy_bake2_1", type: "text", user: "joy_bake2", content: "Croissants from scratch! 3 days of laminating butter but look at those layers.", media: picsum(312, 800, 800) },
  { id: "joy_bake2_2", type: "text", user: "joy_bake2", content: "The smell of fresh bread baking is the best smell in the entire world. Fight me." },
  { id: "joy_bake2_3", type: "text", user: "joy_bake2", content: "Bake sale for charity raised $800! Thanks to everyone who contributed." },
  { id: "joy_bake2_4", type: "text", user: "joy_bake2", content: "My oven broke mid-bake. Rushed the cookies to my neighbor's house. We made it work." },
  { id: "joy_bake2_5", type: "text", user: "joy_bake2", content: "Decorating a 4-tier cake for my friend's wedding. No pressure at all.", media: picsum(1080, 800, 800) },

  { id: "al_jazz_1", type: "text", user: "al_jazz", content: "Late night jazz session at the club downtown. The sax player was unreal.", media: picsum(1060, 800, 600) },
  { id: "al_jazz_2", type: "text", user: "al_jazz", content: "Practicing scales for 2 hours. Not glamorous but necessary." },
  { id: "al_jazz_3", type: "text", user: "al_jazz", content: "Miles Davis was right. Don't play what's there, play what's not there." },
  { id: "al_jazz_4", type: "text", user: "al_jazz", content: "Jam session tonight. Bring your instrument and your soul.", media: picsum(1067, 800, 800) },
  { id: "al_jazz_5", type: "video", user: "al_jazz", src: sampleVideos[8], caption: "Playing at the jazz bar. This one's for Coltrane." },

  { id: "dee_marathon_1", type: "text", user: "dee_marathon", content: "Marathon #5 in the books! Finished in 3:42. Personal best!!", media: picsum(1054, 800, 800) },
  { id: "dee_marathon_2", type: "text", user: "dee_marathon", content: "18 mile training run done. My legs have filed a formal complaint." },
  { id: "dee_marathon_3", type: "text", user: "dee_marathon", content: "Carb loading tonight! Pasta party before race day.", media: picsum(292, 800, 800) },
  { id: "dee_marathon_4", type: "text", user: "dee_marathon", content: "The wall at mile 20 is real. But so is the finish line." },
  { id: "dee_marathon_5", type: "text", user: "dee_marathon", content: "Rest week. No running. Just stretching and existing.", media: picsum(1039, 800, 600) },

  { id: "stan_comic_1", type: "text", user: "stan_comic", content: "New comic page finished! This arc is getting intense.", media: picsum(96, 800, 800) },
  { id: "stan_comic_2", type: "text", user: "stan_comic", content: "Comic con in 2 weeks! Table is booked, prints are ordered. Let's do this." },
  { id: "stan_comic_3", type: "text", user: "stan_comic", content: "Writer's block on the storyline. Going to go touch grass and come back to it." },
  { id: "stan_comic_4", type: "text", user: "stan_comic", content: "Inking by hand > digital inking. I said what I said.", media: picsum(1019, 800, 800) },
  { id: "stan_comic_5", type: "text", user: "stan_comic", content: "Character design session. This villain is looking menacing.", media: picsum(1084, 800, 800) },

  { id: "val_vegan_1", type: "text", user: "val_vegan", content: "This plant-based burger actually tastes amazing. Not 'good for vegan.' Actually amazing.", media: picsum(429, 800, 800) },
  { id: "val_vegan_2", type: "text", user: "val_vegan", content: "3 years plant-based and I've never felt better. Not preaching, just sharing." },
  { id: "val_vegan_3", type: "text", user: "val_vegan", content: "Meal prepped Buddha bowls for the whole week. Easy, cheap, delicious.", media: picsum(102, 800, 600) },
  { id: "val_vegan_4", type: "text", user: "val_vegan", content: "The 'where do you get your protein' question. Beans. Lentils. Tofu. Next question." },
  { id: "val_vegan_5", type: "text", user: "val_vegan", content: "Vegan chocolate cake for my birthday. Nobody could tell the difference.", media: picsum(312, 800, 800) },

  { id: "norm_camp_1", type: "text", user: "norm_camp", content: "Campfire under the stars. This is living.", media: picsum(1013, 800, 600) },
  { id: "norm_camp_2", type: "text", user: "norm_camp", content: "Forgot the tent poles. Slept in the car. Still calling it camping." },
  { id: "norm_camp_3", type: "text", user: "norm_camp", content: "S'mores are the peak of human culinary achievement", media: picsum(493, 800, 800) },
  { id: "norm_camp_4", type: "text", user: "norm_camp", content: "Woke up to a deer 10 feet from the tent. She looked at me like I was trespassing. She's right." },
  { id: "norm_camp_5", type: "video", user: "norm_camp", src: sampleVideos[9], caption: "Setting up camp before sunset. Time lapse of the whole process." },

  { id: "faye_dance2_1", type: "text", user: "faye_dance2", content: "Ballet class at 7am. My body wakes up in positions it didn't agree to.", media: picsum(1062, 800, 800) },
  { id: "faye_dance2_2", type: "text", user: "faye_dance2", content: "Recital went perfectly! Months of practice paid off." },
  { id: "faye_dance2_3", type: "text", user: "faye_dance2", content: "New pointe shoes! Breaking them in is always painful but necessary.", media: picsum(21, 800, 800) },
  { id: "faye_dance2_4", type: "text", user: "faye_dance2", content: "Dance is the hidden language of the soul." },
  { id: "faye_dance2_5", type: "video", user: "faye_dance2", src: sampleVideos[10], caption: "Contemporary piece I choreographed. Performed it solo tonight." },

  { id: "gus_wood_1", type: "text", user: "gus_wood", content: "Hand-carved this bowl from a single piece of walnut. 12 hours of work.", media: picsum(1076, 800, 800) },
  { id: "gus_wood_2", type: "text", user: "gus_wood", content: "The smell of fresh sawdust is the best aromatherapy." },
  { id: "gus_wood_3", type: "text", user: "gus_wood", content: "New lathe arrived! Time to turn some wood.", media: picsum(60, 800, 600) },
  { id: "gus_wood_4", type: "text", user: "gus_wood", content: "Woodworking teaches patience. Every cut matters." },
  { id: "gus_wood_5", type: "text", user: "gus_wood", content: "Finished a cutting board for my wife's birthday. She loved it.", media: picsum(1084, 800, 800) },

  { id: "mona_sing_1", type: "text", user: "mona_sing", content: "Vocal warmups at 6am. My neighbors love me.", media: picsum(1060, 800, 600) },
  { id: "mona_sing_2", type: "text", user: "mona_sing", content: "Karaoke night! Killed it on Don't Stop Believin'. As one does." },
  { id: "mona_sing_3", type: "text", user: "mona_sing", content: "Recording session went amazing. New single dropping next month!" },
  { id: "mona_sing_4", type: "text", user: "mona_sing", content: "Singing in the shower is practice. I'm always practicing." },
  { id: "mona_sing_5", type: "video", user: "mona_sing", src: sampleVideos[11], caption: "Cover of that song everyone's been requesting. Here you go." },

  { id: "zack_brew_1", type: "text", user: "zack_brew", content: "Home brew #12 is fermenting. This IPA is going to be my best one yet.", media: picsum(766, 800, 600) },
  { id: "zack_brew_2", type: "text", user: "zack_brew", content: "Bottling day! 50 bottles of amber ale ready in 2 weeks." },
  { id: "zack_brew_3", type: "text", user: "zack_brew", content: "Craft beer tasting at the new brewery downtown. Every single one was amazing.", media: picsum(425, 800, 800) },
  { id: "zack_brew_4", type: "text", user: "zack_brew", content: "The hop shortage is real and my wallet can confirm" },
  { id: "zack_brew_5", type: "text", user: "zack_brew", content: "Home brewing is basically cooking but you have to wait 3 weeks to eat." },

  { id: "wren_bird_1", type: "text", user: "wren_bird", content: "Spotted a Great Blue Heron at the lake this morning! Life list growing.", media: picsum(200, 800, 600) },
  { id: "wren_bird_2", type: "text", user: "wren_bird", content: "Bird watching is just adult Pokemon Go. Gotta spot 'em all." },
  { id: "wren_bird_3", type: "text", user: "wren_bird", content: "New binoculars make such a difference. Can finally see details I was missing.", media: picsum(169, 800, 800) },
  { id: "wren_bird_4", type: "text", user: "wren_bird", content: "5am in the wetlands. Cold, muddy, and absolutely magical." },
  { id: "wren_bird_5", type: "text", user: "wren_bird", content: "Cardinals in the backyard again. They're my favorite regulars.", media: picsum(40, 800, 800) },

  { id: "opal_tea_1", type: "text", user: "opal_tea", content: "Matcha latte to start the day. The color alone makes me happy.", media: picsum(766, 800, 800) },
  { id: "opal_tea_2", type: "text", user: "opal_tea", content: "Tea ceremony at the new Japanese garden. Beautifully peaceful.", media: picsum(1043, 800, 600) },
  { id: "opal_tea_3", type: "text", user: "opal_tea", content: "Hot take: tea > coffee. I will not be taking questions." },
  { id: "opal_tea_4", type: "text", user: "opal_tea", content: "Loose leaf only. Bags are for emergencies.", media: picsum(425, 800, 800) },
  { id: "opal_tea_5", type: "text", user: "opal_tea", content: "Chamomile before bed is the only sleep hack you need." },

  { id: "axel_moto_1", type: "text", user: "axel_moto", content: "Sunday ride through the canyon. Nothing beats two wheels and an open road.", media: picsum(1071, 800, 600) },
  { id: "axel_moto_2", type: "text", user: "axel_moto", content: "Gear up every time. No exceptions.", media: picsum(133, 800, 800) },
  { id: "axel_moto_3", type: "text", user: "axel_moto", content: "Bike wash day. She's gleaming.", media: picsum(111, 800, 800) },
  { id: "axel_moto_4", type: "text", user: "axel_moto", content: "Motorcycle wave to every rider I pass. It's the law." },
  { id: "axel_moto_5", type: "video", user: "axel_moto", src: sampleVideos[12], caption: "Group ride with 20 bikes. The sound alone is incredible." },

  { id: "pip_crochet_1", type: "text", user: "pip_crochet", content: "Finished this blanket! 3 months of work but the result is so cozy.", media: picsum(399, 800, 800) },
  { id: "pip_crochet_2", type: "text", user: "pip_crochet", content: "Crocheting while binge watching shows. Peak productivity." },
  { id: "pip_crochet_3", type: "text", user: "pip_crochet", content: "Made a little amigurumi frog. He's my son now.", media: picsum(40, 800, 800) },
  { id: "pip_crochet_4", type: "text", user: "pip_crochet", content: "Yarn haul! Got way more than I needed but that's normal right?" },
  { id: "pip_crochet_5", type: "text", user: "pip_crochet", content: "Teaching my daughter to crochet. She made a very enthusiastic rectangle." },

  { id: "finn_camp2_1", type: "text", user: "finn_camp2", content: "First night in the new tent. Fits the whole family!", media: picsum(1047, 800, 600) },
  { id: "finn_camp2_2", type: "text", user: "finn_camp2", content: "Lake is crystal clear. Swimming all day, campfire all night.", media: picsum(1043, 800, 600) },
  { id: "finn_camp2_3", type: "text", user: "finn_camp2", content: "The kids saw a bear from a safe distance. It was the highlight of their entire year." },
  { id: "finn_camp2_4", type: "text", user: "finn_camp2", content: "Forgot the marshmallows. The children are rioting." },
  { id: "finn_camp2_5", type: "text", user: "finn_camp2", content: "Disconnecting from everything for 4 days. See y'all on the other side." },

  { id: "rosa_craft_1", type: "text", user: "rosa_craft", content: "Resin art experiment! This one actually turned out pretty cool.", media: picsum(1019, 800, 800) },
  { id: "rosa_craft_2", type: "text", user: "rosa_craft", content: "Crafternoon with the girls. Wine + crafts = best Saturday ever." },
  { id: "rosa_craft_3", type: "text", user: "rosa_craft", content: "Hot glue gun is the most powerful tool in existence. Change my mind." },
  { id: "rosa_craft_4", type: "text", user: "rosa_craft", content: "Made earrings from scratch today. Polymer clay is so addictive.", media: picsum(823, 800, 800) },
  { id: "rosa_craft_5", type: "video", user: "rosa_craft", src: sampleVideos[0], caption: "Making custom phone cases with pressed flowers. Satisfying process." },

  { id: "kai_skydive_1", type: "text", user: "kai_skydive", content: "Jump #200 today! Still get butterflies every single time.", media: picsum(1018, 800, 600) },
  { id: "kai_skydive_2", type: "text", user: "kai_skydive", content: "The view from 14,000 feet never gets old. Ever.", media: picsum(1015, 800, 600) },
  { id: "kai_skydive_3", type: "text", user: "kai_skydive", content: "People ask if I'm scared. Yes. That's the point." },
  { id: "kai_skydive_4", type: "text", user: "kai_skydive", content: "Tandem student today was SO nervous on the way up. By landing she was booking her next jump.", media: picsum(1039, 800, 800) },
  { id: "kai_skydive_5", type: "video", user: "kai_skydive", src: sampleVideos[1], caption: "Freefall from 15K. Camera doesn't do it justice but here's a glimpse." },

  { id: "eve_bonsai_1", type: "text", user: "eve_bonsai", content: "This juniper has been in training for 3 years. Patience is everything.", media: picsum(365, 800, 800) },
  { id: "eve_bonsai_2", type: "text", user: "eve_bonsai", content: "Bonsai is a lifelong conversation between you and a tree." },
  { id: "eve_bonsai_3", type: "text", user: "eve_bonsai", content: "New pot for the maple. The presentation matters as much as the tree.", media: picsum(146, 800, 600) },
  { id: "eve_bonsai_4", type: "text", user: "eve_bonsai", content: "Workshop this weekend! Teaching beginners the basics of bonsai care." },
  { id: "eve_bonsai_5", type: "text", user: "eve_bonsai", content: "Wired and styled this one today. Sometimes less is more.", media: picsum(1040, 800, 800) },

  { id: "nico_drone_1", type: "text", user: "nico_drone", content: "Aerial shot of the coastline at sunset. Drone photography is a whole different world.", media: picsum(1013, 800, 600) },
  { id: "nico_drone_2", type: "text", user: "nico_drone", content: "New drone arrived! First flight was smooth. GPS lock is incredible on this thing.", media: picsum(60, 800, 600) },
  { id: "nico_drone_3", type: "text", user: "nico_drone", content: "FAA Part 107 certified! Now I can legally do commercial drone work." },
  { id: "nico_drone_4", type: "text", user: "nico_drone", content: "Mountain flyover footage from this weekend. The fall colors are breathtaking.", media: picsum(1015, 800, 600) },
  { id: "nico_drone_5", type: "video", user: "nico_drone", src: sampleVideos[2], caption: "Cinematic drone footage over the national park. No filter needed." },

  { id: "ada_code_1", type: "text", user: "ada_code", content: "Hackathon this weekend! 48 hours of coding, pizza, and no sleep. Let's go.", media: picsum(180, 800, 600) },
  { id: "ada_code_2", type: "text", user: "ada_code", content: "Women in tech meetup was amazing tonight. So much talent in one room." },
  { id: "ada_code_3", type: "text", user: "ada_code", content: "Imposter syndrome is lying to you. You belong here." },
  { id: "ada_code_4", type: "text", user: "ada_code", content: "Open source contribution merged! My code is officially part of the project." },
  { id: "ada_code_5", type: "text", user: "ada_code", content: "Stack overflow saved me again today. That site deserves a monument." },

  { id: "bea_quilt_1", type: "text", user: "bea_quilt", content: "Queen size quilt done! Only took... 4 months. But it's gorgeous.", media: picsum(399, 800, 800) },
  { id: "bea_quilt_2", type: "text", user: "bea_quilt", content: "Cutting fabric is 50% of quilting and 90% of the frustration." },
  { id: "bea_quilt_3", type: "text", user: "bea_quilt", content: "Quilt guild meeting tonight. These ladies are so talented and inspiring.", media: picsum(1033, 800, 800) },
  { id: "bea_quilt_4", type: "text", user: "bea_quilt", content: "Every stitch tells a story. This one tells the story of 3am and determination." },
  { id: "bea_quilt_5", type: "text", user: "bea_quilt", content: "Baby quilt for my niece. She won't appreciate it for years but I made it with love.", media: picsum(1035, 800, 800) },

  { id: "lou_podcast_1", type: "text", user: "lou_podcast", content: "New episode just dropped! This guest was incredible. Link in my profile." },
  { id: "lou_podcast_2", type: "text", user: "lou_podcast", content: "Recording setup is finally dialed in. No more echo!", media: picsum(366, 800, 600) },
  { id: "lou_podcast_3", type: "text", user: "lou_podcast", content: "Hit 10K downloads this month! Started this as a hobby 6 months ago." },
  { id: "lou_podcast_4", type: "text", user: "lou_podcast", content: "Editing audio for 3 hours. My ears are done but the episode sounds clean." },
  { id: "lou_podcast_5", type: "video", user: "lou_podcast", src: sampleVideos[3], caption: "Behind the scenes of the podcast studio. It's a closet. But it works." },

  { id: "amy_vet_1", type: "text", user: "amy_vet", content: "Saved a little kitten today that was stuck under a porch. She's getting the full spa treatment at the clinic now.", media: picsum(169, 800, 800) },
  { id: "amy_vet_2", type: "text", user: "amy_vet", content: "Reminder to get your pets' teeth checked. Dental health matters!" },
  { id: "amy_vet_3", type: "text", user: "amy_vet", content: "12 surgeries today. Long day but every animal is doing great." },
  { id: "amy_vet_4", type: "text", user: "amy_vet", content: "The joy of seeing a pet go home healthy after treatment never gets old." },
  { id: "amy_vet_5", type: "text", user: "amy_vet", content: "Clinic holiday photos with all the pets in Santa hats. My heart is full.", media: picsum(200, 800, 800) },

  { id: "drew_ride_1", type: "text", user: "drew_ride", content: "Night shift driving. The city looks so different at 2am.", media: picsum(1044, 800, 600) },
  { id: "drew_ride_2", type: "text", user: "drew_ride", content: "Someone left their phone in my car again. Third time this month." },
  { id: "drew_ride_3", type: "text", user: "drew_ride", content: "Best passenger today tipped me $20 and told me about their grandkids. Made my night." },
  { id: "drew_ride_4", type: "text", user: "drew_ride", content: "Gas prices got me questioning my life choices but here we are." },
  { id: "drew_ride_5", type: "text", user: "drew_ride", content: "500 rides this month. Milestone reached." },

  { id: "liz_yoga3_1", type: "text", user: "liz_yoga3", content: "Morning flow by the river. The sounds of nature are the best soundtrack.", media: picsum(1043, 800, 600) },
  { id: "liz_yoga3_2", type: "text", user: "liz_yoga3", content: "Handstand progress! Only fell 3 times today instead of 10.", media: picsum(1062, 800, 800) },
  { id: "liz_yoga3_3", type: "text", user: "liz_yoga3", content: "Breathe in. Breathe out. That's it. That's the post." },
  { id: "liz_yoga3_4", type: "text", user: "liz_yoga3", content: "Teaching a kids yoga class tomorrow. Prepare for adorable chaos." },
  { id: "liz_yoga3_5", type: "text", user: "liz_yoga3", content: "New yoga pants and I feel invincible.", media: picsum(1005, 800, 800) },

  { id: "hank_fix_1", type: "text", user: "hank_fix", content: "Fixed the neighbor's leaky faucet. Payment: homemade cookies. Fair trade.", media: picsum(1076, 800, 600) },
  { id: "hank_fix_2", type: "text", user: "hank_fix", content: "Pro tip: WD-40 solves 90% of problems. Duct tape solves the other 10%." },
  { id: "hank_fix_3", type: "text", user: "hank_fix", content: "Replaced the garbage disposal today. YouTube tutorial + determination = success." },
  { id: "hank_fix_4", type: "text", user: "hank_fix", content: "The toolbox I inherited from my grandpa is still the best one I own." },
  { id: "hank_fix_5", type: "text", user: "hank_fix", content: "Ceiling fan installation complete. Only one minor electrical incident.", media: picsum(1084, 800, 800) },

  { id: "olive_read2_1", type: "text", user: "olive_read2", content: "Started a book at 10pm. It's now 4am. I regret nothing.", media: picsum(24, 800, 800) },
  { id: "olive_read2_2", type: "text", user: "olive_read2", content: "BookTok made me buy 12 books this month. My shelf is screaming." },
  { id: "olive_read2_3", type: "text", user: "olive_read2", content: "Re-reading my favorite series for the 4th time. Still cried at the same parts." },
  { id: "olive_read2_4", type: "text", user: "olive_read2", content: "Hot take: audiobooks count as reading. End of debate." },
  { id: "olive_read2_5", type: "text", user: "olive_read2", content: "Library card is the most powerful thing in my wallet." },

  { id: "russ_truck2_1", type: "text", user: "russ_truck2", content: "Hauled 40 tons across 3 states today. These wheels don't stop.", media: picsum(1071, 800, 600) },
  { id: "russ_truck2_2", type: "text", user: "russ_truck2", content: "Truck stop breakfast at 5am hits different. Pancakes the size of my head." },
  { id: "russ_truck2_3", type: "text", user: "russ_truck2", content: "The sunset from I-40 tonight was unreal. Love this view.", media: picsum(1013, 800, 600) },
  { id: "russ_truck2_4", type: "text", user: "russ_truck2", content: "Finally home. Kids knocked me over at the door. Best feeling ever." },
  { id: "russ_truck2_5", type: "text", user: "russ_truck2", content: "New audiobook for the next haul. 20 hours of driving goes fast with a good story." },

  { id: "viv_nails2_1", type: "text", user: "viv_nails2", content: "French tips but make them neon. Client loved it.", media: picsum(823, 800, 800) },
  { id: "viv_nails2_2", type: "text", user: "viv_nails2", content: "Nail art competition this weekend. Wish me luck!", media: picsum(1019, 800, 800) },
  { id: "viv_nails2_3", type: "text", user: "viv_nails2", content: "3D nail art is the future and I'm here for it." },
  { id: "viv_nails2_4", type: "text", user: "viv_nails2", content: "Appointment books are FULL through next month. So grateful." },
  { id: "viv_nails2_5", type: "text", user: "viv_nails2", content: "New gel polish colors just arrived. I'm like a kid on Christmas.", media: picsum(399, 800, 800) },

  { id: "lars_sail_1", type: "text", user: "lars_sail", content: "Out on the water before sunrise. Just me and the wind.", media: picsum(1043, 800, 600) },
  { id: "lars_sail_2", type: "text", user: "lars_sail", content: "Sailing lesson today with beginners. Their faces when the sails caught the wind!", media: picsum(1054, 800, 800) },
  { id: "lars_sail_3", type: "text", user: "lars_sail", content: "Dolphins spotted off the bow today. Best commute to nowhere." },
  { id: "lars_sail_4", type: "text", user: "lars_sail", content: "Boat maintenance day. Not glamorous but necessary." },
  { id: "lars_sail_5", type: "text", user: "lars_sail", content: "Sunset from the cockpit. Anchored in a quiet cove. Peace.", media: picsum(1013, 800, 600) },

  { id: "terri_camp3_1", type: "text", user: "terri_camp3", content: "Car camping setup is getting better every trip. Almost comfortable now.", media: picsum(1047, 800, 600) },
  { id: "terri_camp3_2", type: "text", user: "terri_camp3", content: "Stars out here are incredible. No light pollution for miles." },
  { id: "terri_camp3_3", type: "text", user: "terri_camp3", content: "Coffee made over a campfire just tastes better. Science can't explain it." },
  { id: "terri_camp3_4", type: "text", user: "terri_camp3", content: "Bear canister packed. Can't let the raccoons win this time." },
  { id: "terri_camp3_5", type: "text", user: "terri_camp3", content: "Back to civilization. Already planning the next trip.", media: picsum(1039, 800, 800) },

  { id: "stu_cook2_1", type: "text", user: "stu_cook2", content: "Taco Tuesday is a lifestyle not just a day of the week.", media: picsum(429, 800, 800) },
  { id: "stu_cook2_2", type: "text", user: "stu_cook2", content: "Smoked wings for the game tonight. They're gone in 15 minutes every time." },
  { id: "stu_cook2_3", type: "text", user: "stu_cook2", content: "My chili recipe is a family secret. And by family secret I mean I googled it 5 years ago." },
  { id: "stu_cook2_4", type: "text", user: "stu_cook2", content: "Bought a cast iron skillet. Everything I cook now is somehow better.", media: picsum(431, 800, 800) },
  { id: "stu_cook2_5", type: "text", user: "stu_cook2", content: "Breakfast burritos for the crew this morning. Fed 8 people for $20. That's efficiency." },

  { id: "jill_run2_1", type: "text", user: "jill_run2", content: "Couch to 5K complete! 8 weeks ago I couldn't run a block.", media: picsum(1054, 800, 800) },
  { id: "jill_run2_2", type: "text", user: "jill_run2", content: "Running in the rain is honestly my favorite. Fight me." },
  { id: "jill_run2_3", type: "text", user: "jill_run2", content: "New running shoes day! My feet are thanking me already.", media: picsum(21, 800, 800) },
  { id: "jill_run2_4", type: "text", user: "jill_run2", content: "Runner's high is real. Just finished 8 miles and I feel like I can fly." },
  { id: "jill_run2_5", type: "text", user: "jill_run2", content: "Signed up for a half marathon. What have I done." },

  { id: "cruz_photo3_1", type: "text", user: "cruz_photo3", content: "Street photography in the rain. Reflections on wet pavement are magical.", media: picsum(1044, 800, 600) },
  { id: "cruz_photo3_2", type: "text", user: "cruz_photo3", content: "Golden hour is the only hour that matters.", media: picsum(1016, 800, 600) },
  { id: "cruz_photo3_3", type: "text", user: "cruz_photo3", content: "Old buildings tell the best stories. This wall has seen things.", media: picsum(1029, 800, 800) },
  { id: "cruz_photo3_4", type: "text", user: "cruz_photo3", content: "Shot 1000 photos today. Maybe 3 are good. That's photography." },
  { id: "cruz_photo3_5", type: "text", user: "cruz_photo3", content: "Black and white film has a soul that digital can't replicate.", media: picsum(1011, 800, 600) },

  { id: "maggie_cook3_1", type: "text", user: "maggie_cook3", content: "Meal prep for the week done in 2 hours. 28 containers. We're organized.", media: picsum(102, 800, 600) },
  { id: "maggie_cook3_2", type: "text", user: "maggie_cook3", content: "Freezer meals are the ultimate cheat code for busy weeks." },
  { id: "maggie_cook3_3", type: "text", user: "maggie_cook3", content: "Instapot changed my life. 30 minute pot roast? Yes please.", media: picsum(431, 800, 800) },
  { id: "maggie_cook3_4", type: "text", user: "maggie_cook3", content: "Kids want chicken nuggets again. Homemade ones this time though." },
  { id: "maggie_cook3_5", type: "text", user: "maggie_cook3", content: "Sheet pan dinners are proof that God loves us and wants us to eat well." },

  { id: "earl_fish2_1", type: "text", user: "earl_fish2", content: "Early morning on the pier. Line in the water. Not a care in the world.", media: picsum(1039, 800, 600) },
  { id: "earl_fish2_2", type: "text", user: "earl_fish2", content: "The one that got away was THIS big. I swear." },
  { id: "earl_fish2_3", type: "text", user: "earl_fish2", content: "Father son fishing trip. He caught more than me. I'm proud and also jealous." },
  { id: "earl_fish2_4", type: "text", user: "earl_fish2", content: "New tackle box is stocked and ready for Saturday.", media: picsum(60, 800, 600) },
  { id: "earl_fish2_5", type: "text", user: "earl_fish2", content: "Ice fishing this weekend. It's 20 degrees and I'm excited about it." },

  { id: "paz_art2_1", type: "text", user: "paz_art2", content: "Digital illustration finished after 20 hours. Every pixel was worth it.", media: picsum(1084, 800, 800) },
  { id: "paz_art2_2", type: "text", user: "paz_art2", content: "Art is never finished, only abandoned. But this one I'm actually happy with.", media: picsum(1019, 800, 800) },
  { id: "paz_art2_3", type: "text", user: "paz_art2", content: "Drawing tablet pen broke. Working with the backup until the replacement arrives." },
  { id: "paz_art2_4", type: "text", user: "paz_art2", content: "Character design commission done. Client wanted a warrior princess and she looks amazing." },
  { id: "paz_art2_5", type: "text", user: "paz_art2", content: "Art school was worth it. Not for the degree, for the friends I made." },

  { id: "bri_mom2_1", type: "text", user: "bri_mom2", content: "My toddler drew on the wall with a sharpie. We're going for that 'modern art' look now." },
  { id: "bri_mom2_2", type: "text", user: "bri_mom2", content: "Successfully grocery shopped with all 3 kids. I deserve a medal.", media: picsum(1033, 800, 800) },
  { id: "bri_mom2_3", type: "text", user: "bri_mom2", content: "School drop off in pajamas? Absolutely. No shame." },
  { id: "bri_mom2_4", type: "text", user: "bri_mom2", content: "Silence in the house. They're either sleeping or destroying something. Either way I'm sitting." },
  { id: "bri_mom2_5", type: "text", user: "bri_mom2", content: "Mom hack: frozen grapes. You're welcome." },

  { id: "skip_boat_1", type: "text", user: "skip_boat", content: "Kayaking at sunrise. The lake is glass.", media: picsum(1043, 800, 600) },
  { id: "skip_boat_2", type: "text", user: "skip_boat", content: "New paddleboard! First time standing up without falling took... a while." },
  { id: "skip_boat_3", type: "text", user: "skip_boat", content: "River float this weekend. Cooler packed. Good to go." },
  { id: "skip_boat_4", type: "text", user: "skip_boat", content: "Canoe camping trip was everything. 3 days on the water.", media: picsum(1015, 800, 600) },
  { id: "skip_boat_5", type: "text", user: "skip_boat", content: "Saw an eagle catch a fish right in front of us. Nature is wild." },

  { id: "tara_dance3_1", type: "text", user: "tara_dance3", content: "Hip hop class was fire tonight. New choreo dropped and we killed it.", media: picsum(1060, 800, 600) },
  { id: "tara_dance3_2", type: "text", user: "tara_dance3", content: "Dancing in the kitchen while cooking > going to a club" },
  { id: "tara_dance3_3", type: "text", user: "tara_dance3", content: "Choreographed my friend's first dance for their wedding. Happy tears everywhere." },
  { id: "tara_dance3_4", type: "text", user: "tara_dance3", content: "Dance practice until my legs gave out. Tomorrow is rest day. Mandatory." },
  { id: "tara_dance3_5", type: "text", user: "tara_dance3", content: "Competition results: 2nd place! So close but we'll get em next time." },

  { id: "cliff_hike2_1", type: "text", user: "cliff_hike2", content: "14er number 8 done! Altitude headache but the summit view was perfection.", media: picsum(1018, 800, 600) },
  { id: "cliff_hike2_2", type: "text", user: "cliff_hike2", content: "Trail running in the fall. The colors are unbelievable this year.", media: picsum(1015, 800, 600) },
  { id: "cliff_hike2_3", type: "text", user: "cliff_hike2", content: "Hiking boots finally broke in. Only took 3 months of blisters." },
  { id: "cliff_hike2_4", type: "text", user: "cliff_hike2", content: "Leave no trace. Pack it in, pack it out. Always." },
  { id: "cliff_hike2_5", type: "text", user: "cliff_hike2", content: "Found a trail nobody's written about online. Keeping this one secret.", media: picsum(1047, 800, 800) },

  { id: "jan_write2_1", type: "text", user: "jan_write2", content: "Chapter 12 done. This novel is finally taking shape.", media: picsum(24, 800, 800) },
  { id: "jan_write2_2", type: "text", user: "jan_write2", content: "Writer's block solution: go outside. It works every time." },
  { id: "jan_write2_3", type: "text", user: "jan_write2", content: "My characters are arguing with me about the plot. I created them and now they won't listen." },
  { id: "jan_write2_4", type: "text", user: "jan_write2", content: "Editing is where the magic happens. First drafts are just word vomit." },
  { id: "jan_write2_5", type: "text", user: "jan_write2", content: "Query letters sent to 10 agents. Now the hardest part: waiting." },

  { id: "teo_climb2_1", type: "text", user: "teo_climb2", content: "Lead climbing practice today. Falling is part of the process.", media: picsum(1058, 800, 800) },
  { id: "teo_climb2_2", type: "text", user: "teo_climb2", content: "Outdoor climbing trip this weekend. Psych level: maximum." },
  { id: "teo_climb2_3", type: "text", user: "teo_climb2", content: "New chalk bag. Does it climb better? No. Does it look cool? Absolutely." },
  { id: "teo_climb2_4", type: "text", user: "teo_climb2", content: "Bouldering at the gym at 6am. Nobody else is here. Just me and the wall." },
  { id: "teo_climb2_5", type: "text", user: "teo_climb2", content: "Finger strength is everything. Hangboard training is paying off." },

  { id: "sue_quilt2_1", type: "text", user: "sue_quilt2", content: "Hand quilting while listening to podcasts. This is my happy place.", media: picsum(399, 800, 800) },
  { id: "sue_quilt2_2", type: "text", user: "sue_quilt2", content: "Quilt show this weekend and I entered 2 pieces. Fingers crossed!" },
  { id: "sue_quilt2_3", type: "text", user: "sue_quilt2", content: "Every quilt tells a story. This one is about my grandmother's garden." },
  { id: "sue_quilt2_4", type: "text", user: "sue_quilt2", content: "Fabric shopping is a contact sport. Got the last bolt of that floral print." },
  { id: "sue_quilt2_5", type: "text", user: "sue_quilt2", content: "Teaching my granddaughter to sew. She made a potholder and was SO proud." },

  { id: "ed_sport2_1", type: "text", user: "ed_sport2", content: "Flag football league starts next week. We're going undefeated. Calling it now." },
  { id: "ed_sport2_2", type: "text", user: "ed_sport2", content: "Watched the game with the boys. Pizza ordered. Life is good." },
  { id: "ed_sport2_3", type: "text", user: "ed_sport2", content: "March Madness bracket is done. I have zero confidence in my picks." },
  { id: "ed_sport2_4", type: "text", user: "ed_sport2", content: "New cleats for the season. Fresh kicks on the field.", media: picsum(21, 800, 800) },
  { id: "ed_sport2_5", type: "text", user: "ed_sport2", content: "Coach said I had the best play of practice today. I'm riding that high all week." },

  { id: "fern_garden2_1", type: "text", user: "fern_garden2", content: "Planted 50 tulip bulbs today. My back hurts but spring is going to be beautiful.", media: picsum(146, 800, 600) },
  { id: "fern_garden2_2", type: "text", user: "fern_garden2", content: "Herb garden is thriving. Fresh basil and rosemary for tonight's dinner." },
  { id: "fern_garden2_3", type: "text", user: "fern_garden2", content: "Composting update: the worms are happy and so am I." },
  { id: "fern_garden2_4", type: "text", user: "fern_garden2", content: "First zucchini of the season! It's huge. Zucchini bread time.", media: picsum(365, 800, 800) },
  { id: "fern_garden2_5", type: "text", user: "fern_garden2", content: "Butterfly garden is attracting monarchs. Mission accomplished.", media: picsum(1040, 800, 800) },

  { id: "hal_game2_1", type: "text", user: "hal_game2", content: "Board game night! Settlers of Catan got heated. Friendships were tested." },
  { id: "hal_game2_2", type: "text", user: "hal_game2", content: "New tabletop game arrived. Reading the rules is basically a PhD thesis." },
  { id: "hal_game2_3", type: "text", user: "hal_game2", content: "D&D session last night went off the rails in the best way. My DM is a genius." },
  { id: "hal_game2_4", type: "text", user: "hal_game2", content: "Painted my miniatures all weekend. These tiny details are going to take my eyesight.", media: picsum(96, 800, 800) },
  { id: "hal_game2_5", type: "text", user: "hal_game2", content: "Game store found a first edition. My wallet is crying but my shelf is happy." },

  { id: "cora_bake3_1", type: "text", user: "cora_bake3", content: "Cinnamon rolls from scratch. The whole house smells amazing.", media: picsum(312, 800, 800) },
  { id: "cora_bake3_2", type: "text", user: "cora_bake3", content: "Baking bread is my meditation. Kneading dough is therapy." },
  { id: "cora_bake3_3", type: "text", user: "cora_bake3", content: "Holiday cookies for the whole office. 200 cookies. Send help." },
  { id: "cora_bake3_4", type: "text", user: "cora_bake3", content: "Pie crust from scratch is NOT as easy as Martha Stewart makes it look." },
  { id: "cora_bake3_5", type: "text", user: "cora_bake3", content: "Cake decorating class was so fun! Mine looked nothing like the example but it tasted great.", media: picsum(1080, 800, 800) },

  { id: "miles_dj2_1", type: "text", user: "miles_dj2", content: "Set at the rooftop bar tonight went OFF. The vibe was immaculate.", media: picsum(1060, 800, 600) },
  { id: "miles_dj2_2", type: "text", user: "miles_dj2", content: "New track finished at 3am. Couldn't stop vibing with it." },
  { id: "miles_dj2_3", type: "text", user: "miles_dj2", content: "Vinyl collection growing. Found some rare ones at the flea market.", media: picsum(145, 800, 800) },
  { id: "miles_dj2_4", type: "text", user: "miles_dj2", content: "Festival lineup announced and I'm on it! Dreams becoming reality." },
  { id: "miles_dj2_5", type: "text", user: "miles_dj2", content: "Music is the universal language and the dance floor is where we all speak it." },

  { id: "yara_mom3_1", type: "text", user: "yara_mom3", content: "Packed 3 different lunches because everyone wanted something different. Chef hat on." },
  { id: "yara_mom3_2", type: "text", user: "yara_mom3", content: "School play tonight! My kid has 2 lines and I'm already crying." },
  { id: "yara_mom3_3", type: "text", user: "yara_mom3", content: "Found my keys in the freezer. Don't ask me how they got there." },
  { id: "yara_mom3_4", type: "text", user: "yara_mom3", content: "Family bike ride through the neighborhood. Everyone survived. Victory.", media: picsum(111, 800, 600) },
  { id: "yara_mom3_5", type: "text", user: "yara_mom3", content: "Bath bombs and silence. Mom's night off." },

  { id: "kirk_auto_1", type: "text", user: "kirk_auto", content: "Brake job done in the driveway. Saved $400 doing it myself.", media: picsum(133, 800, 600) },
  { id: "kirk_auto_2", type: "text", user: "kirk_auto", content: "Check engine light came on. Turns out it was the gas cap. Classic." },
  { id: "kirk_auto_3", type: "text", user: "kirk_auto", content: "Detailing the car for 4 hours. She's showroom ready.", media: picsum(111, 800, 800) },
  { id: "kirk_auto_4", type: "text", user: "kirk_auto", content: "Oil change in 20 minutes flat. Getting faster every time." },
  { id: "kirk_auto_5", type: "text", user: "kirk_auto", content: "Cars are just adult LEGOs. Expensive, sometimes frustrating, always satisfying." },

  { id: "dani_photo4_1", type: "text", user: "dani_photo4", content: "Polaroid collection growing. There's something about physical photos.", media: picsum(1036, 800, 800) },
  { id: "dani_photo4_2", type: "text", user: "dani_photo4", content: "Shot a wedding this weekend. The couple was so in love. Beautiful day.", media: picsum(1033, 800, 600) },
  { id: "dani_photo4_3", type: "text", user: "dani_photo4", content: "Editing 500 photos from the event. Coffee is my best friend right now." },
  { id: "dani_photo4_4", type: "text", user: "dani_photo4", content: "The look on a client's face when they see their photos for the first time. That's why I do this." },
  { id: "dani_photo4_5", type: "text", user: "dani_photo4", content: "New camera body arrived and I'm giddy.", media: picsum(250, 800, 800) },

  { id: "walt_retire2_1", type: "text", user: "walt_retire2", content: "Retirement day 30. Still wake up at 6am. Old habits.", media: picsum(1074, 800, 600) },
  { id: "walt_retire2_2", type: "text", user: "walt_retire2", content: "Joined a walking group. We walk 3 miles every morning and solve the world's problems." },
  { id: "walt_retire2_3", type: "text", user: "walt_retire2", content: "My grandson is teaching me to play video games. I'm terrible but he's patient." },
  { id: "walt_retire2_4", type: "text", user: "walt_retire2", content: "Made my wife's favorite dinner tonight. 40 years of marriage and she still smiled." },
  { id: "walt_retire2_5", type: "text", user: "walt_retire2", content: "Volunteer work at the food bank. Giving back feels right." },

  { id: "nell_swim2_1", type: "text", user: "nell_swim2", content: "Masters swim team practice at 5am. We're insane and we know it.", media: picsum(1043, 800, 600) },
  { id: "nell_swim2_2", type: "text", user: "nell_swim2", content: "Open water swim in the lake. No lane lines, no walls, just you and the water." },
  { id: "nell_swim2_3", type: "text", user: "nell_swim2", content: "Swim meet this Saturday! Taper week starts now." },
  { id: "nell_swim2_4", type: "text", user: "nell_swim2", content: "Goggle tan lines are my summer accessory." },
  { id: "nell_swim2_5", type: "text", user: "nell_swim2", content: "100 fly is the hardest event and nobody can convince me otherwise." },

  { id: "cal_comic2_1", type: "text", user: "cal_comic2", content: "New webcomic page dropped! Link in my profile.", media: picsum(96, 800, 800) },
  { id: "cal_comic2_2", type: "text", user: "cal_comic2", content: "Drawing backgrounds is the part nobody tells you about in comic making." },
  { id: "cal_comic2_3", type: "text", user: "cal_comic2", content: "Fan art of my favorite character. Took 6 hours but I'm happy with it.", media: picsum(1084, 800, 800) },
  { id: "cal_comic2_4", type: "text", user: "cal_comic2", content: "Ink spill on a nearly finished page. Cool cool cool everything's fine." },
  { id: "cal_comic2_5", type: "text", user: "cal_comic2", content: "Convention prep! Printing 200 copies of the first issue." },

  { id: "una_craft2_1", type: "text", user: "una_craft2", content: "Candle making day! Soy wax and essential oils. My house smells like a spa.", media: picsum(1080, 800, 800) },
  { id: "una_craft2_2", type: "text", user: "una_craft2", content: "Tried tie-dye for the first time. Everything I own is now rainbow." },
  { id: "una_craft2_3", type: "text", user: "una_craft2", content: "Craft fair booth is set up! Fingers crossed for good sales today.", media: picsum(399, 800, 800) },
  { id: "una_craft2_4", type: "text", user: "una_craft2", content: "Macrame plant hanger complete. Boho vibes achieved." },
  { id: "una_craft2_5", type: "text", user: "una_craft2", content: "Kids craft time got glitter everywhere. We'll be finding glitter in 2030." },

  { id: "abe_bbq3_1", type: "text", user: "abe_bbq3", content: "Pellet smoker vs offset. Controversial topic at the cookout today." },
  { id: "abe_bbq3_2", type: "text", user: "abe_bbq3", content: "Dry rub recipe perfected after 2 years of tweaking. This is the one.", media: picsum(493, 800, 600) },
  { id: "abe_bbq3_3", type: "text", user: "abe_bbq3", content: "Smoking a whole turkey for Thanksgiving. Family said it was the best yet." },
  { id: "abe_bbq3_4", type: "text", user: "abe_bbq3", content: "BBQ sauce from scratch. Store bought can't compete.", media: picsum(431, 800, 800) },
  { id: "abe_bbq3_5", type: "text", user: "abe_bbq3", content: "The smoke ring on this brisket is perfect. I need a moment.", media: picsum(429, 800, 800) },

  { id: "wendy_nurse3_1", type: "text", user: "wendy_nurse3", content: "Night shift crew is the best crew. We're delirious but we're a team." },
  { id: "wendy_nurse3_2", type: "text", user: "wendy_nurse3", content: "Patient brought me homemade cookies today. Healthcare has its perks." },
  { id: "wendy_nurse3_3", type: "text", user: "wendy_nurse3", content: "4 days off starts NOW. Sleeping for the first 2." },
  { id: "wendy_nurse3_4", type: "text", user: "wendy_nurse3", content: "New scrubs that actually have pockets. Game changer.", media: picsum(1005, 800, 800) },
  { id: "wendy_nurse3_5", type: "text", user: "wendy_nurse3", content: "This job is hard but I wouldn't trade it for anything." },

  { id: "otto_chess2_1", type: "text", user: "otto_chess2", content: "4-hour chess marathon at the park. Won 3, lost 2. Not bad for a Sunday." },
  { id: "otto_chess2_2", type: "text", user: "otto_chess2", content: "Studying endgame theory. King and pawn vs king. Sounds simple. It is not." },
  { id: "otto_chess2_3", type: "text", user: "otto_chess2", content: "Online tournament tonight. Nerves are real." },
  { id: "otto_chess2_4", type: "text", user: "otto_chess2", content: "The Scandinavian Defense is underrated and I'm tired of pretending it's not." },
  { id: "otto_chess2_5", type: "text", user: "otto_chess2", content: "Got my kid interested in chess. We play every night before bed now. Best part of my day." },

  { id: "maya_creates_1", type: "text", user: "maya_creates", content: "New series of paintings started. Theme: inner peace in chaos.", media: picsum(1019, 800, 800) },
  { id: "maya_creates_2", type: "text", user: "maya_creates", content: "Art studio cleanup turned into rediscovering old pieces I forgot about.", media: picsum(1084, 800, 800) },
  { id: "maya_creates_3", type: "text", user: "maya_creates", content: "Golden hour in the studio. Best time to create.", media: picsum(1016, 800, 800) },
  { id: "maya_creates_4", type: "video", user: "maya_creates", src: sampleVideos[4], caption: "Creative process behind my latest piece. Start to finish." },
  { id: "maya_creates_5", type: "text", user: "maya_creates", content: "Gallery opening tonight! So nervous but grateful for the opportunity." },

  { id: "blake_photo5_1", type: "text", user: "blake_photo5", content: "Nature macro photography is revealing a world most people miss.", media: picsum(365, 800, 800) },
  { id: "blake_photo5_2", type: "text", user: "blake_photo5", content: "Frost on leaves this morning. Mother nature is the best artist.", media: picsum(146, 800, 600) },
  { id: "blake_photo5_3", type: "text", user: "blake_photo5", content: "Photo walk with the camera club today. Good company, great shots.", media: picsum(1011, 800, 600) },
  { id: "blake_photo5_4", type: "text", user: "blake_photo5", content: "Long exposure of the waterfall. 30 second shot on a tripod. Silky smooth.", media: picsum(1039, 800, 800) },
  { id: "blake_photo5_5", type: "text", user: "blake_photo5", content: "Photography is seeing what others walk past." },

  { id: "quinn_college2_1", type: "text", user: "quinn_college2", content: "Library all day. Midterms are coming and I am not ready." },
  { id: "quinn_college2_2", type: "text", user: "quinn_college2", content: "Free pizza at the campus event. College student instincts activated." },
  { id: "quinn_college2_3", type: "text", user: "quinn_college2", content: "Professor curved the exam. We love a generous grader." },
  { id: "quinn_college2_4", type: "text", user: "quinn_college2", content: "Study group at the coffee shop. We studied for 20 minutes and talked for 3 hours." },
  { id: "quinn_college2_5", type: "text", user: "quinn_college2", content: "Roommate and I decorated the dorm for the holidays. It actually looks cute.", media: picsum(1035, 800, 800) },

  { id: "luca_film2_1", type: "text", user: "luca_film2", content: "Editing the short film all night. This cut is finally feeling right." },
  { id: "luca_film2_2", type: "text", user: "luca_film2", content: "Location scouting for the new project. Found the perfect abandoned warehouse.", media: picsum(1029, 800, 600) },
  { id: "luca_film2_3", type: "text", user: "luca_film2", content: "Film school taught me 20% of what I know. YouTube taught me the other 80%." },
  { id: "luca_film2_4", type: "text", user: "luca_film2", content: "Sound design is 50% of a film and 90% of people don't realize it." },
  { id: "luca_film2_5", type: "text", user: "luca_film2", content: "Screening night with friends. They actually liked it. I can breathe again." },

  { id: "sage_tea2_1", type: "text", user: "sage_tea2", content: "Afternoon tea with scones. Channeling my inner British grandmother.", media: picsum(425, 800, 800) },
  { id: "sage_tea2_2", type: "text", user: "sage_tea2", content: "Tea collection update: 47 varieties. Is it too many? No." },
  { id: "sage_tea2_3", type: "text", user: "sage_tea2", content: "Oolong at midnight. The calm I needed after today." },
  { id: "sage_tea2_4", type: "text", user: "sage_tea2", content: "Green tea ice cream > every other flavor. Final answer." },
  { id: "sage_tea2_5", type: "text", user: "sage_tea2", content: "Tea tasting event at the Asian market. Tried 12 different teas. Found 5 new favorites." },

  { id: "finn_skate2_1", type: "text", user: "finn_skate2", content: "Skate or die. Today I almost did both.", media: picsum(1058, 800, 800) },
  { id: "finn_skate2_2", type: "text", user: "finn_skate2", content: "New trick unlocked: heelflip. Only took me 2 months of eating concrete." },
  { id: "finn_skate2_3", type: "text", user: "finn_skate2", content: "Session at the DIY spot under the bridge. Raw concrete, real skating." },
  { id: "finn_skate2_4", type: "text", user: "finn_skate2", content: "Filming all day for the homie's video part. He's going to go pro, mark my words." },
  { id: "finn_skate2_5", type: "video", user: "finn_skate2", src: sampleVideos[5], caption: "Line at the skatepark. Front lip, kickflip, tre flip out. Clean." },
];

import { getPosts } from "./posts";

export const videoOnlyFeed = initialFeed.filter((p) => p.type === "video");

export function getAllPosts(): Post[] {
  initializeBotEcosystem();
  maybeGenerateNewBotPost();

  const userPosts = getPosts(initialFeed);
  const botPosts = getBotPosts();

  const allPosts = [...userPosts, ...botPosts];

  allPosts.sort((a, b) => {
    const aTime = (a as any).timestamp || 0;
    const bTime = (b as any).timestamp || 0;
    return bTime - aTime;
  });

  return allPosts;
}

export const mallOnlyFeed: Post[] = [];

export function getListingsByCategory(category: ListingCategory | null, purchasableOnly = true): Post[] {
  return [];
}

export const stores: Store[] = [];

export function getStoreById(storeId: string): Store | undefined {
  return undefined;
}

export function getListingsByStore(storeOwner: string): Post[] {
  return [];
}

export function getFeaturedStores(): Store[] {
  return [];
}
