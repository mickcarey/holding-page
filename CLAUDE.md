# Michael Carey - Holding Page

## Overview
Interactive "coming-soon" TypeScript/Vite-based website for Michael Carey, a software developer. Features playful UX with dodging buttons, confusing modals, and hidden easter eggs.

## Current Features

### Main Interactions
- **Desktop**: Buttons dodge the cursor for 10 seconds before becoming clickable
- **Mobile**: Buttons shuffle positions when tapped
- **Multi-step confirmation modals** with intentionally confusing/misleading button text
- **Analytics tracking** via Matomo for user interactions

### Easter Egg
- Console message appears after 1 second with shower-themed ASCII art

### UI Elements
- Animated gradient backgrounds and text
- Random "cooking" themed messages that update dynamically
- Social links to LinkedIn, GitHub, Facebook, Instagram
- Responsive design with mobile-specific behaviors

## Technical Structure
- `main.ts`: Main application class (`HoldingPage`) handling all logic
- `style.css`: Gradient animations, modal styling, responsive design
- `index.html`: Basic HTML shell with comprehensive meta tags and Matomo analytics
- `vite.config.ts`: Development server configuration (port 5180)

## Development Commands
- `npm run dev`: Start development server
- `npm run build`: Build for production (includes TypeScript compilation)
- `npm run preview`: Preview production build

## Future Implementation Plans

### Theme Guidelines
- **Light, colourful, and confusing interactions** - maintain the playful, disorienting UX that challenges user expectations while remaining visually appealing

### Mobile Gestures Manager
Implement a comprehensive gesture system for mobile devices:
- **Core Methods**:
  - `getRandomGesture()`: Returns a random gesture for users to discover
  - `applyGestureToInterface()`: Applies gesture effects to the interface
- **Gesture Properties**:
  - Optional hint text to guide users
  - Optional hint animations (e.g., three animated arrows showing swipe direction)
  - Gestures only active on main screen (disabled when modals are showing)
- **Integration**: Should work alongside existing button shuffling behavior

### Full Screen Social Carousel Modal
Create an immersive social media selection experience:
- **Full screen modal** overlay for social media selection
- **Carousel interface** to rotate through different social platforms
- **Single button per slide** that initiates the existing endless modal confirmation process
- **Seamless integration** with current modal system and analytics tracking
- Should maintain the confusing/playful theme while providing better mobile UX

## Code Organization Notes
- Main class uses private methods for organization
- Event listeners are properly managed (setup/removal)
- Analytics events tracked throughout user journey
- Base64 encoded content used for easter egg functionality
- Responsive design handles both desktop hover and mobile touch interactions