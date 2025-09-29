import type { CaptchaChallenge } from "./types.ts";

export const CAPTCHA_CHALLENGES: CaptchaChallenge[] = [
  {
    id: 'missing-button-3',
    type: 'impossible',
    question: 'Please click the button with the number 3 on it',
    instruction: 'Select the correct button to continue',
    options: [
      { id: 'btn1', text: '1', correct: false },
      { id: 'btn2', text: '2', correct: false },
      { id: 'btn4', text: '4', correct: false },
      { id: 'btn5', text: '5', correct: false }
    ],
    difficulty: 'elaborate'
  },
  {
    id: 'quantum-captcha',
    type: 'impossible',
    question: 'Click the button that exists only when you\'re not looking at it',
    instruction: 'Good luck with Schrödinger\'s button',
    options: [
      { id: 'btn1', text: '👁️ I see it', correct: false },
      { id: 'btn2', text: '🙈 Not looking', correct: false },
      { id: 'btn3', text: '🤔 Maybe?', correct: false },
      { id: 'btn4', text: '❓ Uncertain', correct: false }
    ],
    difficulty: 'elaborate'
  },
  {
    id: 'existential-dread',
    type: 'text-input',
    question: 'What is the meaning of life, the universe, and everything?',
    instruction: 'Enter the numerical answer (Douglas Adams fans will know)',
    correctAnswer: '42',
    difficulty: 'elaborate'
  },
  {
    id: 'backwards-day',
    type: 'math',
    question: 'What is 01 - 01?',
    instruction: 'Think backwards... the answer is definitely not 0',
    correctAnswer: 0,
    difficulty: 'elaborate'
  },
  {
    id: 'emotional-support',
    type: 'text-input',
    question: 'How are you feeling right now?',
    instruction: 'Type your current emotional state (hint: frustrated works)',
    correctAnswer: 'frustrated',
    difficulty: 'elaborate'
  },
  {
    id: 'time-travel',
    type: 'text-input',
    question: 'What year is it in the past?',
    instruction: 'Enter any year before 2024',
    correctAnswer: '1999',
    difficulty: 'elaborate'
  },
  {
    id: 'parallel-universe',
    type: 'button-selection',
    question: 'In which universe is this the correct answer?',
    instruction: 'Choose from alternate realities',
    options: [
      { id: 'universe-a', text: 'Universe A (where cats rule)', correct: false },
      { id: 'universe-b', text: 'Universe B (where pizza is currency)', correct: true },
      { id: 'universe-c', text: 'Universe C (where gravity is optional)', correct: false },
      { id: 'universe-d', text: 'Universe D (where this makes sense)', correct: false }
    ],
    difficulty: 'elaborate'
  },
  {
    id: 'impossible-math',
    type: 'math',
    question: 'What is the square root of -1 in real numbers?',
    instruction: 'Enter a real number (spoiler: it doesn\'t exist)',
    correctAnswer: 'impossible',
    difficulty: 'elaborate'
  },
  {
    id: 'recursive-captcha',
    type: 'text-input',
    question: 'To solve this CAPTCHA, you must first solve this CAPTCHA',
    instruction: 'Type "CAPTCHA" to solve the CAPTCHA about solving CAPTCHAs',
    correctAnswer: 'captcha',
    difficulty: 'elaborate'
  },
  {
    id: 'invisible-text',
    type: 'text-input',
    question: 'What does this invisible text say: ⠀⠀⠀⠀⠀⠀⠀',
    instruction: 'Type what you see (hint: nothing)',
    correctAnswer: 'nothing',
    difficulty: 'elaborate'
  },
  {
    id: 'paradox-selection',
    type: 'button-selection',
    question: 'This statement is false',
    instruction: 'Select the truth value',
    options: [
      { id: 'true', text: 'True', correct: false },
      { id: 'false', text: 'False', correct: false },
      { id: 'paradox', text: 'Paradox', correct: true },
      { id: 'error', text: 'System Error', correct: false }
    ],
    difficulty: 'elaborate'
  },
  {
    id: 'ai-consciousness',
    type: 'text-input',
    question: 'Are you a robot?',
    instruction: 'Answer honestly (robots always lie)',
    correctAnswer: 'yes',
    difficulty: 'elaborate'
  },
  {
    id: 'multidimensional-counting',
    type: 'math',
    question: 'Count these emojis across all dimensions: 🌀🔄🌀🔃🌀↩️🌀',
    instruction: 'Include interdimensional duplicates',
    correctAnswer: 'infinity',
    difficulty: 'elaborate'
  },
  {
    id: 'broken-keyboard',
    type: 'text-input',
    question: 'Type "hello" but your "l" key is broken',
    instruction: 'Use creative alternatives',
    correctAnswer: 'he110',
    difficulty: 'elaborate'
  },
  {
    id: 'time-zone-nightmare',
    type: 'text-input',
    question: 'What time is it on Mars during a solar eclipse viewed from Jupiter?',
    instruction: 'Format: Martian Standard Time',
    correctAnswer: 'undefined',
    difficulty: 'elaborate'
  },
  {
    id: 'emotional-buttons',
    type: 'impossible',
    question: 'Click the button that represents your will to continue',
    instruction: 'Choose based on your current mental state',
    options: [
      { id: 'despair', text: '😩 Mild Despair', correct: false },
      { id: 'confusion', text: '🤯 Pure Confusion', correct: false },
      { id: 'determination', text: '😤 Stubborn Determination', correct: false },
      { id: 'regret', text: '😭 Deep Regret', correct: false }
    ],
    difficulty: 'elaborate'
  },
  {
    id: 'fourth-wall',
    type: 'text-input',
    question: 'What is the name of the developer who created this ridiculous CAPTCHA?',
    instruction: 'Check the page source for clues',
    correctAnswer: 'michael',
    difficulty: 'elaborate'
  },
  {
    id: 'inception-captcha',
    type: 'button-selection',
    question: 'You are currently solving a CAPTCHA within a CAPTCHA. Which level are you on?',
    instruction: 'Choose your reality layer',
    options: [
      { id: 'level1', text: 'Level 1 (Surface Web)', correct: false },
      { id: 'level2', text: 'Level 2 (This CAPTCHA)', correct: true },
      { id: 'level3', text: 'Level 3 (CAPTCHA Dreams)', correct: false },
      { id: 'level4', text: 'Level 4 (CAPTCHA Limbo)', correct: false }
    ],
    difficulty: 'elaborate'
  },
  {
    id: 'nihilistic-math',
    type: 'math',
    question: 'If nothing matters, what is 5 × 0?',
    instruction: 'Consider the philosophical implications',
    correctAnswer: 0,
    difficulty: 'elaborate'
  },
  {
    id: 'language-confusion',
    type: 'text-input',
    question: 'Translate "captcha" into binary and then to emoji',
    instruction: 'Final answer should be emoji only',
    correctAnswer: '🤖',
    difficulty: 'elaborate'
  }
];

export const GREETINGS = [
  "Hi, I'm Michael",
  "Hi, I'm Mike",
  "Hi, I'm Mick",
  "Hi, I'm MC"
];

export const COOKING_ACTIONS = [
  "burning something (again) 👨‍🍳",
  "brewing coffee that's probably too strong ☕",
  "whipping up chaos in the kitchen 🥄",
  "simmering ideas that might boil over 🍲",
  "baking concepts that may not rise 🍞",
  "mixing ingredients I can't pronounce 🥣",
  "stirring trouble (and code) 🥄",
  "over-seasoning everything 🧂",
  "grilling something until it's crispy 🔥",
  "roasting marshmallows instead of working ☕",
  "fermenting ideas that smell funny 🍺",
  "marinating in my own confusion 🥩",
  "kneading dough like I know what I'm doing 🥖",
  "preparing disasters that taste surprisingly good 🍽️",
  "crafting recipes that definitely won't work 📝",
  "slow-cooking while fast-panicking 🍯",
  "blending things that shouldn't go together 🥤",
  "steaming up the windows (and my glasses) ♨️",
  "heating up leftovers from yesterday 🔥",
  "dicing onions and crying about it 🔪",
  "whisking frantically and hoping for the best 🥄",
  "caramelizing sugar (and probably the pan) 🍮",
  "flambéing my eyebrows off 🔥",
  "sous-vide cooking with a ziplock bag 🍖",
  "pressure-cooking anxiety 😰",
  "barbecuing optimistically 🍖",
  "sautéing while googling 'what is sauté' 🍳",
  "garnishing with whatever's in the fridge 🌿",
  "plating up something that looks... interesting 🍽️",
  "julienning vegetables into uneven chunks 🔪",
  "reducing wine (mostly into my glass) 🍷",
  "tempering chocolate and my expectations 🌡️",
  "poaching eggs that look like aliens 🥚",
  "braising meat and my ego 🍲",
  "blanching vegetables until they surrender 🥬",
  "flipping pancakes (and occasionally catching them) 🥞",
  "measuring ingredients with coffee mugs ☕",
  "following recipes like rough suggestions 📖",
  "improvising with whatever's not expired 🤷‍♂️",
  "taste-testing everything (quality control) 👅"
];

export const DEV_OPS_ACTIONS = [
  "configuring JIRA workflows ⚙️",
  "monitoring AWS CloudWatch metrics 📊",
  "orchestrating Docker containers 🐳",
  "deploying Lambda functions ⚡",
  "setting up Confluence documentation 📝",
  "managing Slack integrations 💬",
  "optimizing AWS Cognito authentication 🔐",
  "automating CI/CD pipelines 🔄",
  "scaling Kubernetes clusters ☸️",
  "tuning Terraform infrastructure 🏗️",
  "debugging Elasticsearch queries 🔍",
  "securing API Gateway endpoints 🛡️",
  "analyzing Datadog dashboards 📈",
  "configuring New Relic alerts 🚨",
  "managing GitHub Actions workflows 🚀",
  "optimizing Redis caching strategies ⚡",
  "architecting microservices with AWS ECS 🏢",
  "fine-tuning Jenkins build processes 🔨",
  "implementing SonarQube code quality checks ✅",
  "orchestrating AWS Step Functions 🪜"
];

export const HINT_MESSAGES = [
  "Connect with me on social media... if you can 😏",
  "Social links below... good luck clicking them 😉",
  "Feel free to follow me... if you can catch the buttons 🎯",
  "My social profiles await... patience required ⏰",
  "Ready to connect? It might take a few tries 🎲",
  "Social media links available... eventually 😄",
  "Click to connect... easier said than done 🎪",
  "Follow me on social media... persistence pays off 💪",
  "Social profiles below... may require ninja skills 🥷",
  "Want to connect? Hope you're quick! ⚡",
  "Links to my socials... they're a bit shy 🙈",
  "Connect with me... if you're up for a challenge 🏆",
  "Social media awaits... catch them if you can 🏃",
  "Ready to follow? Buttons might have other plans 🎭",
  "My profiles are just a click away... sort of 🎨",
  "Social links provided... terms and conditions apply 📜",
  "Feel free to connect... when the buttons let you 🎰",
  "Follow me online... it's an adventure 🗺️",
  "Social media links... they like to play hard to get 💝",
  "Click to connect... may the odds be in your favor 🎖️",
  "Links below... they're feeling playful today 🎈",
  "Want to follow? The buttons are feeling frisky 🐰",
  "Social profiles available... after a small game 🎮",
  "Connect with me... if you can handle the chase 🏃‍♂️",
  "My socials await... bring your A-game 🎯",
  "Ready to connect? Hope you like puzzles 🧩",
  "Social links here... somewhere 🔍",
  "Follow me... the buttons might follow you back 👀",
  "Click to connect... it's not you, it's them 🤷",
  "Social media links... currently playing hide and seek 🙈"
];

export const STEP_1_DESKTOP_MESSAGES = [
  'Just checking you were meant to click on the ${platform} button?',
  'Did you mean to click ${platform}?',
  'You clicked on ${platform} - was that intentional?',
  'Was clicking ${platform} what you intended?',
  'Just confirming - you meant to click ${platform}?',
  'You clicked ${platform} - is that correct?',
  'Did you intend to click on ${platform}?',
  'Just making sure - you clicked ${platform}?',
  'You clicked ${platform} - was that on purpose?',
  'Was ${platform} the button you meant to click?',
  'Confirming: you intended to click ${platform}?',
  'Just checking - clicking ${platform} was deliberate?',
  'You clicked ${platform} - intentional choice?',
  'Was clicking ${platform} what you wanted?',
  'Did you purposely click on ${platform}?',
  'Just verifying - you meant to click ${platform}?',
  '${platform} was clicked - is that right?',
  'You clicked ${platform} - was that the plan?',
  'Was clicking on ${platform} deliberate?',
  'Just double-checking - you clicked ${platform} on purpose?',
  'You clicked the ${platform} button - meant to do that?',
  'Confirming your ${platform} click - correct?',
  'Was clicking ${platform} what you wanted to do?',
  'Just making sure - you clicked ${platform} intentionally?',
  '${platform} button clicked - was that intentional?',
  'Did you mean to click the ${platform} button?',
  'You clicked ${platform} - deliberate choice?',
  'Was clicking ${platform} your intended action?',
  'Just confirming you meant to click ${platform}?',
  'Quick check - you clicked ${platform} on purpose?'
];

export const STEP_1_MOBILE_MESSAGES = [
  'Just checking you were meant to tap on the ${platform} button?',
  'Did you mean to tap ${platform}?',
  'You tapped on ${platform} - was that intentional?',
  'Was tapping ${platform} what you intended?',
  'Just confirming - you meant to tap ${platform}?',
  'You tapped ${platform} - is that correct?',
  'Did you intend to tap on ${platform}?',
  'Just making sure - you tapped ${platform}?',
  'You tapped ${platform} - was that on purpose?',
  'Was ${platform} the button you meant to tap?',
  'Confirming: you intended to tap ${platform}?',
  'Just checking - tapping ${platform} was deliberate?',
  'You tapped ${platform} - intentional choice?',
  'Was tapping ${platform} what you wanted?',
  'Did you purposely tap on ${platform}?',
  'Just verifying - you meant to tap ${platform}?',
  '${platform} was tapped - is that right?',
  'You tapped ${platform} - was that the plan?',
  'Was tapping on ${platform} deliberate?',
  'Just double-checking - you tapped ${platform} on purpose?',
  'You tapped the ${platform} button - meant to do that?',
  'Confirming your ${platform} tap - correct?',
  'Was tapping ${platform} what you wanted to do?',
  'Just making sure - you tapped ${platform} intentionally?',
  '${platform} button tapped - was that intentional?',
  'Did you mean to tap the ${platform} button?',
  'You tapped ${platform} - deliberate choice?',
  'Was tapping ${platform} your intended action?',
  'Just confirming you meant to tap ${platform}?',
  'Quick check - you tapped ${platform} on purpose?'
];

export const STEP_2_DOUBLE_NEGATIVES = [
  "Don't you think you shouldn't reconsider this decision?",
  "Wouldn't you rather not change your mind?",
  "Isn't it better to not think twice about ${platform}?",
  "Shouldn't you not reconsider your choice?",
  "Don't you want to not question this decision?",
  "Wouldn't it be wise to not have second thoughts about ${platform}?",
  "Isn't it smarter to not have doubts about this choice?",
  "Don't you think you shouldn't question whether ${platform} is right?",
  "Wouldn't you prefer to not wonder if this is correct?",
  "Shouldn't you not doubt this ${platform} decision?",
  "Don't you want to not reconsider visiting ${platform}?",
  "Isn't it better to not ask yourself if ${platform} is wrong?",
  "Wouldn't it be wiser to not consider changing your mind?",
  "Don't you think you shouldn't wonder if this isn't the right time?",
  "Shouldn't you not question your ${platform} choice?"
];

export const STEP_2_TRIPLE_NEGATIVES = [
  "Don't you think you shouldn't not reconsider this decision?",
  "Wouldn't you rather not avoid not changing your mind?",
  "Isn't it better to not refuse to not think twice about ${platform}?",
  "Shouldn't you not avoid not reconsidering your choice?",
  "Don't you want to not skip not questioning this decision?",
  "Wouldn't it be wise to not dismiss not having second thoughts?",
  "Isn't it smarter to not ignore not having doubts?",
  "Don't you think you shouldn't not question whether ${platform} isn't right?",
  "Wouldn't you prefer to not avoid not wondering if this isn't correct?",
  "Shouldn't you not refuse to not doubt this decision?",
  "Don't you want to not dismiss not reconsidering ${platform}?",
  "Isn't it better to not avoid not asking if ${platform} isn't wrong?",
  "Wouldn't it be wiser to not skip not considering whether you shouldn't visit?",
  "Don't you think you shouldn't not avoid not wondering about this?",
  "Shouldn't you not refuse to not question whether ${platform} isn't what you don't want?"
]

export const STEP_4_MESSAGES = [
  "Congratulations! You made it through! Ready to visit my ${platform} profile? 🎉",
  "Well done! Your patience is legendary! Let's head to ${platform}! 🏆",
  "Amazing! You persevered through all that! Time to check out my ${platform}! ⭐",
  "Bravo! You're officially unstoppable! Ready for ${platform}? 🎊",
  "Fantastic job! Hope you had some fun! Let's go to ${platform}! 🌟",
  "You did it! Thanks for playing along! ${platform} awaits! 🎈",
  "Incredible patience! You've earned this ${platform} visit! 💪",
  "Wonderful! Hope that was entertaining! Ready for ${platform}? 🎯",
  "Success! You conquered the modal maze! Time for ${platform}! 🗺️",
  "Outstanding! Thanks for your persistence! Let's visit ${platform}! 🚀",
  "Brilliant! You made it to the end! ${platform} is calling! ✨",
  "Excellent work! Hope you enjoyed the journey! On to ${platform}! 🎪",
  "You're a champion! Thanks for sticking with it! ${platform} time! 🏅",
  "Superb! Your determination paid off! Ready for ${platform}? 🎖️",
  "Perfect! Hope that brought a smile! Let's go to ${platform}! 😊",
  "Magnificent! You passed the test! ${platform} awaits your arrival! 🎓",
  "Awesome job! Thanks for being a good sport! ${platform} bound! 🎮",
  "Victory! You navigated the chaos beautifully! Time for ${platform}! 🏆",
  "Splendid! Hope you had as much fun as I did making this! ${platform} awaits! 🎨",
  "You made it! Thanks for your patience and humor! Let's visit ${platform}! 🎭",
  "Hooray! You're officially amazing! Ready to see my ${platform}? 🌈",
  "Well played! Your persistence is admirable! ${platform} here we come! 💫",
  "Congratulations! That was quite the adventure! On to ${platform}! 🗺️",
  "Spectacular! Thanks for playing along with my shenanigans! ${platform} time! 🎲",
  "You did it! Hope this made your day a bit more interesting! Let's go to ${platform}! 🎈",
  "Mission accomplished! You're a true explorer! ${platform} awaits! 🧭",
  "Wonderful! Thanks for being such a good sport! Ready for ${platform}? 🎪",
  "Amazing persistence! You've definitely earned this ${platform} visit! 💎",
  "Bravo! Hope you enjoyed this little game! Time for ${platform}! 🎯",
  "Success! Thanks for your patience and good humor! Let's visit ${platform}! 🎉"
];

export const ABC = [
  [
    'R29ubmEgZmluZCBteSBiYWJ5LCBnb25uYSBob2xkIGhlciB0aWdodA==',
    'R29ubmEgZ3JhYiBzb21lIGFmdGVybm9vbiBkZWxpZ2h0',
    'TXkgbW90dG8ncyBhbHdheXMgYmVlbiAiV2hlbiBpdCdzIHJpZ2h0LCBpdCdzIHJpZ2h0Ig==',
    'V2h5IHdhaXQgdW50aWwgdGhlIG1pZGRsZSBvZiBhIGNvbGQgZGFyayBuaWdodD8=',
    'V2hlbiBldmVyeXRoaW5nJ3MgYSBsaXR0bGUgY2xlYXJlciBpbiB0aGUgbGlnaHQgb2YgZGF5',
    'QW5kIHdlIGtub3cgdGhlIG5pZ2h0IGlzIGFsd2F5cyBnb25uYSBiZSB0aGVyZSBhbnl3YXk=',
    'Li4uIHRoYXQncyBhbGwgdGhlIHNpbmdpbmcgSSBjYW4gZG8sIHdpdGhvdXQgcG9zc2libHkgYmVpbmcgc3VlZCBieSBjb3B5cmlnaHQgbGF3cy4uLm1heWJlIEkndmUgc2FpZCB0b28gbXVjaCBhbHJlYWR5Lg=='
  ],
  [
    'V2hlbiB0aGUgbW9vbiBoaXRzIHlvdXIgZXll',
    'TGlrZSBhIGJpZyBwaXp6YSBwaWUsIHRoYXQncyBhbW9yZQ==',
    'V2hlbiB0aGUgd29ybGQgc2VlbXMgdG8gc2hpbmU=',
    'TGlrZSB5b3UndmUgaGFkIHRvbyBtdWNoIHdpbmUsIHRoYXQncyBhbW9yZQ==',
    'Li4uYW5kIHRoYXQncyBhcyBmYXIgYXMgSSBjYW4gZ28gYmVmb3JlIG15IGxhd3llciBzdGFydHMgY2xlYXJpbmcgdGhlaXIgdGhyb2F0Lg=='
  ],
  [
    'SXQncyBidXNpbmVzcywgaXQncyBidXNpbmVzcyB0aW1l',
    'KFlvdSBrbm93IHdoZW4gSSdtIGRvd24gdG8gbXkgc29ja3MgaXQncyB0aW1lIGZvciBidXNpbmVzcw==',
    'VGhhdCdzIHdoeSB0aGV5IGNhbGwgaXQgYnVzaW5lc3Mgc29ja3MsIG9vaCk=',
    'SXQncyBidXNpbmVzcywgaXQncyBidXNpbmVzcyB0aW1l',
    'KE9oLCBvaC1vaCwgb2gtb2gtb2gsIHllYWgteWVhaCwgeWVhaC15ZWFoKQ==',
    'Li4uaWYgSSBnbyBvbmUgbm90ZSBmdXJ0aGVyLCBJJ2xsIHByb2JhYmx5IG93ZSByb3lhbHRpZXMu'
  ]
]
