/**
 * Device Detection and Experience Configuration
 *
 * @interface DeviceConfig - Core device interaction patterns
 * @property {boolean} isMobile - Mobile devices should show progressive modals with confirmations
 * @property {boolean} isDesktop - Desktop should have mouse-dodge buttons that move away from cursor
 * @property {number} dodgeTimeout - After 5-10 seconds buttons remain still on desktop
 * @property {string[]} confirmationFlow - Mobile uses double-negative wording confirmations
 * @property {string} easterEgg - Desktop console has ASCII shower man easter egg
 * @property {Function} singAlong - Console command that logs song lyrics
 * @property {string[]} socialLinks - Social Media links/buttons
 * @property {string} designPhilosophy - Modern minimalist styling approach
 */
export interface DeviceConfig {
  isMobile: boolean;
  isDesktop: boolean;
  dodgeTimeout: number;
  confirmationFlow: string[];
  easterEgg: string;
  socialLinks: string[];
  designPhilosophy: string;
}

/**
 * Navigation Link Configuration
 * @interface SocialLink - Social media link structure for holding page
 * @property {string} platform - Platform name (linkedin | github | facebook | instagram)
 * @property {string} url - External URL destination
 * @property {boolean} evasive - Desktop behavior: moves away from mouse cursor
 */
export interface SocialLink {
  platform: 'linkedin' | 'github' | 'facebook' | 'instagram';
  url: string;
  evasive: boolean;
}

/**
 * Mobile Modal Flow Configuration
 * @interface ModalFlow - Progressive confirmation system for mobile interactions
 * @property {string} initialPrompt - First modal with simple question
 * @property {string} secondConfirmation - Double-negative wording confirmation
 * @property {string} finalWarning - Last chance before navigation
 * @property {Function} onConfirm - Navigate to social platform
 */
export interface ModalFlow {
  initialPrompt: string;
  secondConfirmation: string;
  finalWarning: string;
  onConfirm: () => void;
}

/**
 * Console Easter Egg Configuration
 * @interface ConsoleEasterEgg - Desktop console feature with ASCII art
 * @property {string} trigger - Command name: singAlong()
 * @property {string} asciiArt - ASCII art of man caught in shower
 * @property {string} dialogue - What the man says before singing
 * @property {string[]} lyrics - Complete song lyrics to log
 */
export interface ConsoleEasterEgg {
  trigger: string;
  asciiArt: string;
  dialogue: string;
  lyrics: string[];
}