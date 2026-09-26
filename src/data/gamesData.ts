import { GameId, PartyDare } from '../types/party';

export interface GameMetadata {
  id: GameId;
  title: string;
  tagline: string;
  icon: string;
  badge: string;
  description: string;
  minPlayers: number;
  estMinutes: string;
  color: string;
}

export const GAMES_CATALOG: GameMetadata[] = [
  {
    id: 'rapid_fire',
    title: 'Rapid Fire Questions',
    tagline: 'Answer fast before the buzzer rings!',
    icon: '⚡',
    badge: 'Fast Paced',
    description: 'Quick-witted questions where players must blurt out their first thought in 15 seconds. Pure entertainment!',
    minPlayers: 2,
    estMinutes: '3-5 min',
    color: 'from-amber-400 to-pink-500',
  },
  {
    id: 'guess_word',
    title: 'Guess the Word',
    tagline: 'Crack the mystery word with 3 progressive clues',
    icon: '💡',
    badge: 'Brainy Fun',
    description: 'Clues are revealed one by one. The earlier your team guesses the secret word, the more bonus points you score!',
    minPlayers: 2,
    estMinutes: '4-6 min',
    color: 'from-purple-500 to-indigo-600',
  },
  {
    id: 'emoji_quiz',
    title: 'Emoji Quiz',
    tagline: 'Decode movies, songs, foods and party slang',
    icon: '😍',
    badge: 'Popular',
    description: 'Can you decipher what these emojis represent? Test your pop culture and movie trivia speed!',
    minPlayers: 2,
    estMinutes: '3-5 min',
    color: 'from-pink-500 to-rose-500',
  },
  {
    id: 'memory_match',
    title: 'Memory Challenge',
    tagline: 'Memorize party gems and match all pairs',
    icon: '🧠',
    badge: 'Focus & Speed',
    description: 'A glamorous card grid where players flip and match tiaras, diamonds, stilettos and cupcakes against the clock.',
    minPlayers: 1,
    estMinutes: '2-4 min',
    color: 'from-emerald-400 to-teal-600',
  },
  {
    id: 'spin_wheel',
    title: 'Spin the Wheel',
    tagline: 'Take on lighthearted party dares & challenges',
    icon: '🎡',
    badge: 'Showstopper',
    description: 'Spin the animated lucky wheel! Sing a hook, pose for photos, or deliver a movie dialogue to win instant stars.',
    minPlayers: 2,
    estMinutes: '5-8 min',
    color: 'from-fuchsia-500 to-amber-500',
  },
  {
    id: 'would_you_rather',
    title: 'Would You Rather',
    tagline: 'Vote on hilarious dilemmas & see group percentages',
    icon: '⚖️',
    badge: 'Interactive Poll',
    description: 'Two outrageous choices. Everyone casts their secret vote to see who thinks alike and spark lively debates!',
    minPlayers: 2,
    estMinutes: '3-5 min',
    color: 'from-cyan-500 to-blue-600',
  },
  {
    id: 'guess_who',
    title: 'Guess Who',
    tagline: 'Identify iconic stars & characters from secret clues',
    icon: '🕵️‍♀️',
    badge: 'Trivia Clues',
    description: 'Step-by-step hints reveal famous queens, movie icons, and personalities. Guess before the final reveal!',
    minPlayers: 2,
    estMinutes: '4-6 min',
    color: 'from-violet-500 to-purple-600',
  },
  {
    id: 'picture_quiz',
    title: 'Picture Quiz',
    tagline: 'Spot the detail & answer visual riddles',
    icon: '🖼️',
    badge: 'Visual Fun',
    description: 'Sharp visual puzzles, close-up fashion items, and party riddles with multiple-choice options.',
    minPlayers: 2,
    estMinutes: '3-5 min',
    color: 'from-rose-400 to-amber-500',
  },
  {
    id: 'word_scramble',
    title: 'Word Scramble',
    tagline: 'Unscramble party, jewelry & kitty favorites',
    icon: '🔤',
    badge: 'Word Craft',
    description: 'Letters are mixed up into a jumble. Tap or type to arrange them in order before the timer expires.',
    minPlayers: 2,
    estMinutes: '3-4 min',
    color: 'from-orange-400 to-pink-500',
  },
  {
    id: 'lucky_number',
    title: 'Lucky Number Tambola',
    tagline: 'Pick your lucky balls & watch the golden drum draw',
    icon: '🎰',
    badge: 'Kitty Classic',
    description: 'The quintessential Kitty Party lottery! Pick 3 numbers, spin the golden drum, and win high-stakes jackpot points.',
    minPlayers: 2,
    estMinutes: '3-5 min',
    color: 'from-yellow-400 to-amber-600',
  },
];

// 1. Rapid Fire Questions
export interface RapidFireQuestion {
  id: number;
  question: string;
  category: string;
}

export const RAPID_FIRE_QUESTIONS: RapidFireQuestion[] = [
  { id: 1, question: "Who in your friend group takes the longest to get ready for a party?", category: "Friend Group" },
  { id: 2, question: "What is the one item in your purse you can NEVER leave home without?", category: "Lifestyle" },
  { id: 3, question: "If you won $10,000 right now, what is the very first thing you'd purchase?", category: "Dreams" },
  { id: 4, question: "What is your go-to excuse when you want to cancel plans at the last minute?", category: "Gossip & Fun" },
  { id: 5, question: "Which movie can you rewatch 100 times without ever getting bored?", category: "Entertainment" },
  { id: 6, question: "Name 3 toppings that should NEVER be allowed on a pizza in 5 seconds!", category: "Food Debate" },
  { id: 7, question: "Who was your very first celebrity crush in school or college?", category: "Throwback" },
  { id: 8, question: "What is your biggest shopping weakness: bags, shoes, jewelry, or skincare?", category: "Style" },
  { id: 9, question: "If your life were a Bollywood or Hollywood movie, what would the title be?", category: "Creative" },
  { id: 10, question: "What is the most bizarre food combination you actually secretly enjoy?", category: "Foodies" },
  { id: 11, question: "Who in this room is most likely to win a reality TV competition show?", category: "Group Fun" },
  { id: 12, question: "What is the funniest rumor or funny nickname you ever had?", category: "Hilarious" },
  { id: 13, question: "If you could trade closets with any celebrity for 24 hours, who would it be?", category: "Fashion" },
  { id: 14, question: "What is your instant mood booster when you're having an exhausting day?", category: "Wellness" },
  { id: 15, question: "Quick! Sing the first party song chorus that pops into your head right now!", category: "Musical" },
];

// 2. Guess the Word
export interface GuessWordItem {
  id: number;
  word: string;
  clues: [string, string, string];
  category: string;
  hints: string;
}

export const GUESS_WORD_ITEMS: GuessWordItem[] = [
  {
    id: 1,
    word: "SAREE",
    clues: [
      "Traditional elegance draped gracefully for grand celebrations",
      "Typically woven in 6 to 9 yards of silk, chiffon, or georgette",
      "Paired with a blouse and decorated with zari borders"
    ],
    category: "Festive Attire",
    hints: "5 Letters · S _ _ _ E"
  },
  {
    id: 2,
    word: "TAMBOLA",
    clues: [
      "The undisputed queen of Kitty Party games played with tickets",
      "Has calls like Early Five, Top Line, Middle Line, and Full House",
      "Players strike numbers as a caller shouts them out"
    ],
    category: "Party Games",
    hints: "7 Letters · T _ _ _ _ _ A"
  },
  {
    id: 3,
    word: "DIAMOND",
    clues: [
      "Said to be a girl's everlasting best friend",
      "Formed under extreme pressure deep within the Earth",
      "Measured in carats and sparkles brilliantly in rings"
    ],
    category: "Glamour",
    hints: "7 Letters · D _ _ _ _ _ D"
  },
  {
    id: 4,
    word: "MOCKTAIL",
    clues: [
      "A colorful, refreshing beverage served in fancy glasses with umbrellas",
      "Blended with fruit juices, mint leaves, soda, and crushed ice",
      "Contains zero alcohol so anyone can cheer with it"
    ],
    category: "Refreshments",
    hints: "8 Letters · M _ _ _ _ _ _ L"
  },
  {
    id: 5,
    word: "HIGH HEELS",
    clues: [
      "Gives you extra height and an instant posture boost",
      "Stilettos, wedges, and pumps belong to this family",
      "Looks gorgeous all evening, but your feet celebrate when you take them off"
    ],
    category: "Footwear",
    hints: "2 Words (4, 5 Letters) · H _ _ _  H _ _ _ S"
  },
  {
    id: 6,
    word: "CUPCAKE",
    clues: [
      "Sweet miniature pastry baked in a ruffled paper cup",
      "Swirled with luscious buttercream frosting and edible glitter",
      "Popular centerpiece for birthday parties and kitty tea"
    ],
    category: "Desserts",
    hints: "7 Letters · C _ _ _ _ _ E"
  },
  {
    id: 7,
    word: "SUNGLASSES",
    clues: [
      "Perched on your nose or styled on top of your head",
      "Shields your eyes while making you look effortlessly chic",
      "Aviator, cat-eye, and oversized are iconic silhouettes"
    ],
    category: "Accessories",
    hints: "10 Letters · S _ _ _ _ _ _ _ _ S"
  },
];

// 3. Emoji Quiz
export interface EmojiQuizItem {
  id: number;
  emojis: string;
  question: string;
  options: string[];
  correctIndex: number;
  category: string;
  explanation: string;
}

export const EMOJI_QUIZ_ITEMS: EmojiQuizItem[] = [
  {
    id: 1,
    emojis: "🦁 👑 🌅",
    question: "Which iconic movie is represented by these emojis?",
    options: ["The Jungle Book", "The Lion King", "Madagascar", "Life of Pi"],
    correctIndex: 1,
    category: "Blockbuster Movies",
    explanation: "Lion + Crown + Sunrise = The Lion King!"
  },
  {
    id: 2,
    emojis: "☕ 🍪 💬 👭",
    question: "What favorite pastime activity does this depict?",
    options: ["Library Study", "Chai, Gossip & Biscuits", "Midnight Baking", "Fast Food Run"],
    correctIndex: 1,
    category: "Party Vibes",
    explanation: "Chai and cookies with friends while chatting!"
  },
  {
    id: 3,
    emojis: "👰 💍 💃 🎶 🏰",
    question: "Which festive event is this combo describing?",
    options: ["Big Fat Wedding Sangeet", "Graduation Prom", "Office Gala", "Baby Shower"],
    correctIndex: 0,
    category: "Celebrations",
    explanation: "Bride + Ring + Dance + Music + Castle = Big Fat Sangeet!"
  },
  {
    id: 4,
    emojis: "🌶️ 🥘 🍚 🍗 😋",
    question: "Guess the beloved savory dish!",
    options: ["Hyderabadi Biryani", "Pasta Alfredo", "Sushi Roll", "Chicken Burger"],
    correctIndex: 0,
    category: "Delicious Food",
    explanation: "Spices + Pot + Rice + Chicken = Royal Biryani!"
  },
  {
    id: 5,
    emojis: "👠 💄 👗 🛍️ ✨",
    question: "What is every party lover's dream day out?",
    options: ["Car Repair", "Girls' Shopping Spree", "Gardening", "Hiking Trip"],
    correctIndex: 1,
    category: "Lifestyle",
    explanation: "Heels + Lipstick + Dress + Bags = Shopping Spree!"
  },
  {
    id: 6,
    emojis: "🍿 🥤 🎬 🕶️",
    question: "What classic weekend plan is shown here?",
    options: ["Movie Theatre Date", "Theme Park Visit", "Beach Picnic", "Supermarket Run"],
    correctIndex: 0,
    category: "Entertainment",
    explanation: "Popcorn + Soda + Clapperboard = Movie Night!"
  },
  {
    id: 7,
    emojis: "💃 🎶 👠 🪩 🍾",
    question: "Decode this late-night celebration!",
    options: ["Sleepover PJs", "Dance Club Night", "Morning Yoga", "Board Meeting"],
    correctIndex: 1,
    category: "Party Slang",
    explanation: "Dancing with disco ball and party drinks!"
  },
  {
    id: 8,
    emojis: "✈️ 🏖️ 🥥 👙 📸",
    question: "What tropical holiday is this?",
    options: ["Skiing in the Alps", "Beach Vacation in Goa/Maldives", "Desert Safari", "City Museum Tour"],
    correctIndex: 1,
    category: "Travel",
    explanation: "Flight + Beach + Coconut + Swimwear = Tropical Vacation!"
  }
];

// 4. Memory Challenge Items
export const MEMORY_CARDS_DATA = [
  { id: 'tiara', symbol: '👑', label: 'Golden Tiara' },
  { id: 'diamond', symbol: '💎', label: 'Sparkling Gem' },
  { id: 'cocktail', symbol: '🍹', label: 'Party Mocktail' },
  { id: 'lipstick', symbol: '💄', label: 'Ruby Lipstick' },
  { id: 'cupcake', symbol: '🧁', label: 'Sweet Cupcake' },
  { id: 'stiletto', symbol: '👠', label: 'Party Stiletto' },
  { id: 'flower', symbol: '🌸', label: 'Blossom' },
  { id: 'gift', symbol: '🎁', label: 'Lucky Hamper' },
];

// 5. Spin the Wheel Dares
export const WHEEL_SEGMENTS = [
  { text: "Sing Song Chorus", color: "#EC4899", dare: "Sing the chorus of your favorite upbeat party or Bollywood song out loud!" },
  { text: "Dramatic Pose", color: "#8B5CF6", dare: "Strike 3 dramatic runway fashion poses in 10 seconds!" },
  { text: "Tell Best Joke", color: "#F59E0B", dare: "Tell your funniest joke or most comical real-life incident!" },
  { text: "Sweet Compliment", color: "#10B981", dare: "Give sincere, heartwarming compliments to the 2 players sitting beside you!" },
  { text: "10-Sec Dance", color: "#3B82F6", dare: "Show off your signature 10-second Bollywood/party dance step!" },
  { text: "Movie Dialogue", color: "#EF4444", dare: "Recite an iconic dramatic movie dialogue in an over-the-top accent!" },
  { text: "Funny Expression", color: "#F43F5E", dare: "Hold a super goofy surprised facial expression without laughing for 7 seconds!" },
  { text: "Tongue Twister", color: "#6366F1", dare: "Say: 'Khadag Singh ke khadakne se khadakti hain khidkiyan' 3 times fast!" },
  { text: "Secret Talent", color: "#D946EF", dare: "Demonstrate a quirky, fun hidden talent or sound imitation right now!" },
  { text: "Slow-Mo Walk", color: "#14B8A6", dare: "Do an ultra slow-motion royal entrance walk across the room!" },
];

// 6. Would You Rather
export interface WouldYouRatherItem {
  id: number;
  optionA: string;
  optionB: string;
  votesA: number;
  votesB: number;
}

export const WOULD_YOU_RATHER_ITEMS: WouldYouRatherItem[] = [
  {
    id: 1,
    optionA: "Have unlimited free designer shoes & bags forever",
    optionB: "Have unlimited free luxury salon & spa treatments forever",
    votesA: 64,
    votesB: 78
  },
  {
    id: 2,
    optionA: "Have to dance every time you hear music playing",
    optionB: "Have to sing your answers whenever someone asks you a question",
    votesA: 82,
    votesB: 41
  },
  {
    id: 3,
    optionA: "Show your entire unedited camera roll to everyone in this room",
    optionB: "Show your last 30 search queries on Google",
    votesA: 55,
    votesB: 72
  },
  {
    id: 4,
    optionA: "Host every single kitty party for the next 2 years",
    optionB: "Cook a 5-course gourmet dinner for 15 guests from scratch",
    votesA: 88,
    votesB: 35
  },
  {
    id: 5,
    optionA: "Travel back in time to your favorite college festival days",
    optionB: "Travel 15 years into the future to see where everyone is",
    votesA: 95,
    votesB: 50
  },
  {
    id: 6,
    optionA: "Win a 10-day all-expenses-paid trip to Paris with your besties",
    optionB: "Win a $15,000 jewelry gift card to your favorite boutique",
    votesA: 79,
    votesB: 83
  }
];

// 7. Guess Who
export interface GuessWhoItem {
  id: number;
  name: string;
  clues: [string, string, string];
  category: string;
  photoDescription: string;
}

export const GUESS_WHO_ITEMS: GuessWhoItem[] = [
  {
    id: 1,
    name: "Geet (Jab We Met)",
    clues: [
      "Famous for her infectious energy and never stopping her chatter on trains",
      "Coined the most iconic self-love motto: 'Main apni favorite hoon!'",
      "Ran away to Bhatinda wearing a long t-shirt with a patiala salwar"
    ],
    category: "Iconic Bollywood Character",
    photoDescription: "Bubbly energetic girl smiling brightly"
  },
  {
    id: 2,
    name: "Audrey Hepburn",
    clues: [
      "Legendary Hollywood fashion icon famous for timeless elegance",
      "Stunned the world wearing a little black dress and pearls in front of a jewelry store",
      "Starred in Roman Holiday and Breakfast at Tiffany's"
    ],
    category: "Classic Hollywood Queen",
    photoDescription: "Vintage elegance with tiara and pearls"
  },
  {
    id: 3,
    name: "Poo (Kabhi Khushi Kabhie Gham)",
    clues: [
      "Rates prom dates out of 10 with ruthless glamour: 'Minus!'",
      "Iconic entrance in red leather pants singing 'It's Raining Men'",
      "Asked the mirror: 'Tumhe koi haq nahi banta ki tum itni khoobsurat lago!'"
    ],
    category: "Glamour Diva",
    photoDescription: "Fashion diva posing with sunglasses"
  },
  {
    id: 4,
    name: "Mona Lisa",
    clues: [
      "Her enigmatic, subtle half-smile has puzzled art lovers for over 500 years",
      "Painted by Leonardo da Vinci in Florence during the Italian Renaissance",
      "Housed behind bulletproof glass in the famous Louvre museum in Paris"
    ],
    category: "Art & Mystery",
    photoDescription: "Historic portrait with mysterious smile"
  },
  {
    id: 5,
    name: "Taylor Swift",
    clues: [
      "Record-breaking global pop superstar whose fans are known as 'Swifties'",
      "Famed for songwriting about love, heartbreak, and 'Shake It Off'",
      "Her historic 'Eras Tour' became the highest-grossing concert tour in history"
    ],
    category: "Global Music Icon",
    photoDescription: "Pop singer with glittering microphone"
  }
];

// 8. Picture Quiz (Visual Riddles & Clever Puzzles)
export interface PictureQuizItem {
  id: number;
  question: string;
  imageVisual: {
    bgGradient: string;
    icon: string;
    caption: string;
  };
  options: string[];
  correctIndex: number;
  explanation: string;
}

export const PICTURE_QUIZ_ITEMS: PictureQuizItem[] = [
  {
    id: 1,
    question: "Which iconic fashion accessory is famous for the signature red lacquered sole?",
    imageVisual: {
      bgGradient: "from-rose-900 via-red-800 to-black",
      icon: "👠",
      caption: "Glossy black stiletto with unmistakable vibrant crimson sole"
    },
    options: ["Jimmy Choo", "Christian Louboutin", "Manolo Blahnik", "Gucci"],
    correctIndex: 1,
    explanation: "Christian Louboutin is internationally renowned for his signature glossy red soles!"
  },
  {
    id: 2,
    question: "This royal jewel cut has 57 or 58 facets designed to maximize light brilliance. What is it?",
    imageVisual: {
      bgGradient: "from-sky-900 via-indigo-950 to-purple-950",
      icon: "💎",
      caption: "Exquisite multi-faceted round gem refracting rainbow sparkles"
    },
    options: ["Emerald Cut", "Round Brilliant Cut", "Princess Cut", "Heart Cut"],
    correctIndex: 1,
    explanation: "The Round Brilliant cut features 57-58 precise facets engineered for supreme light reflection!"
  },
  {
    id: 3,
    question: "Which famous European city is globally celebrated as the capital of haute couture and perfume?",
    imageVisual: {
      bgGradient: "from-amber-800 via-rose-950 to-slate-900",
      icon: "🗼",
      caption: "Golden illuminated tower shimmering above romantic boulevard avenues"
    },
    options: ["Milan", "Paris", "London", "Vienna"],
    correctIndex: 1,
    explanation: "Paris, France is universally revered as the heart of haute couture fashion and perfume."
  },
  {
    id: 4,
    question: "What is this traditional layered dessert featuring ladyfinger biscuits soaked in espresso and mascarpone?",
    imageVisual: {
      bgGradient: "from-amber-950 via-stone-900 to-amber-900",
      icon: "☕🍰",
      caption: "Velvety cocoa-dusted creamy layered delicacy"
    },
    options: ["Cheesecake", "Tiramisu", "Panna Cotta", "Black Forest Cake"],
    correctIndex: 1,
    explanation: "Tiramisu (Italian for 'pick me up') is crafted with espresso-dipped ladyfingers and whipped mascarpone!"
  }
];

// 9. Word Scramble
export interface WordScrambleItem {
  id: number;
  scrambled: string;
  answer: string;
  hint: string;
  category: string;
}

export const WORD_SCRAMBLE_ITEMS: WordScrambleItem[] = [
  { id: 1, scrambled: "S R E A E", answer: "SAREE", hint: "6 yards of pure festive elegance", category: "Apparel" },
  { id: 2, scrambled: "P A R T Y", answer: "PARTY", hint: "Where friends gather to laugh and dance", category: "Social" },
  { id: 3, scrambled: "G S O S P I", answer: "GOSSIP", hint: "Juicy conversation over afternoon tea", category: "Fun" },
  { id: 4, scrambled: "B O N U S", answer: "BONUS", hint: "Extra reward points in your kitty wallet", category: "Games" },
  { id: 5, scrambled: "T A M B O L A", answer: "TAMBOLA", hint: "Strike the numbers for Early Five!", category: "Games" },
  { id: 6, scrambled: "S P A R K L E", answer: "SPARKLE", hint: "What happens when jewels catch the light", category: "Glam" },
  { id: 7, scrambled: "C U P C A K E", answer: "CUPCAKE", hint: "Frosted mini treat loved by everyone", category: "Sweets" },
  { id: 8, scrambled: "F A S H I O N", answer: "FASHION", hint: "Runway trends, outfits and couture", category: "Style" },
  { id: 9, scrambled: "M O C K T A I L", answer: "MOCKTAIL", hint: "Fruity chilled refreshment in a tall glass", category: "Drinks" },
  { id: 10, scrambled: "K I T T Y", answer: "KITTY", hint: "The name of our delightful monthly party!", category: "Celebration" },
];

// Fun Party Challenges / Dares Collection
export const PARTY_DARES_LIST: PartyDare[] = [
  {
    id: 'dare_1',
    title: 'Bollywood Disco Hook',
    icon: '💃',
    instruction: 'Perform the signature hook step of any popular Bollywood dance song for 10 seconds without stopping!',
    category: 'dance',
    timeSeconds: 20,
    pointsReward: 50,
  },
  {
    id: 'dare_2',
    title: 'Supermodel Runway',
    icon: '👠',
    instruction: 'Walk across the room like a Paris Fashion Week supermodel, complete with a dramatic hair flip and 3 fierce poses!',
    category: 'acting',
    timeSeconds: 25,
    pointsReward: 50,
  },
  {
    id: 'dare_3',
    title: 'Tongue Twister Queen',
    icon: '👅',
    instruction: 'Repeat 3 times in a row without fumbling: "She sells seashells on the sea shore, but the shells she sells are sea shells, I\'m sure!"',
    category: 'challenge',
    timeSeconds: 15,
    pointsReward: 40,
  },
  {
    id: 'dare_4',
    title: 'Compliment Shower',
    icon: '💖',
    instruction: 'Look at the host and two players and give each a heartwarming, non-appearance compliment from your heart!',
    category: 'compliment',
    timeSeconds: 30,
    pointsReward: 60,
  },
  {
    id: 'dare_5',
    title: 'Baby Voice Dialogue',
    icon: '👶',
    instruction: 'Say an angry dramatic dialogue (like "Don\'t mess with me!") in a cute 2-year-old baby voice!',
    category: 'comedy',
    timeSeconds: 20,
    pointsReward: 45,
  },
  {
    id: 'dare_6',
    title: 'Freeze Dance Challenge',
    icon: '🧊',
    instruction: 'Dance with full enthusiasm until the host says "FREEZE!", then hold the craziest statue pose for 10 seconds!',
    category: 'dance',
    timeSeconds: 25,
    pointsReward: 50,
  },
  {
    id: 'dare_7',
    title: 'Silent Charade Mime',
    icon: '🤐',
    instruction: 'Without making a single sound, act out "Trying to put mascara on inside a bumpy car" until someone guesses!',
    category: 'acting',
    timeSeconds: 30,
    pointsReward: 50,
  },
  {
    id: 'dare_8',
    title: 'Stand-up Comedian',
    icon: '🎤',
    instruction: 'Share the funniest thing that has ever happened to you in a market or while cooking!',
    category: 'comedy',
    timeSeconds: 40,
    pointsReward: 60,
  },
];

export const AVATAR_OPTIONS = [
  { emoji: '👑', label: 'Party Queen' },
  { emoji: '🐱', label: 'Cute Kitty' },
  { emoji: '💎', label: 'Diamond Diva' },
  { emoji: '🌸', label: 'Blossom' },
  { emoji: '💃', label: 'Bollywood Star' },
  { emoji: '🧁', label: 'Cupcake' },
  { emoji: '💅', label: 'Glam Chic' },
  { emoji: '🦚', label: 'Peacock Grace' },
  { emoji: '🍸', label: 'Sparkle Cheers' },
  { emoji: '🦋', label: 'Butterfly' },
];
