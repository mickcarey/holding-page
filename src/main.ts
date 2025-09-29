import './style.css'
import { shuffle } from './utils.ts';
import {
  ABC,
  COOKING_ACTIONS,
  DEV_OPS_ACTIONS,
  GREETINGS,
  HINT_MESSAGES,
  MOBILE_GESTURE_HINTS,
  STEP_1_DESKTOP_MESSAGES,
  STEP_1_MOBILE_MESSAGES,
  STEP_2_DOUBLE_NEGATIVES,
  STEP_2_TRIPLE_NEGATIVES,
  STEP_4_MESSAGES
} from "./constants.ts";
import type { CaptchaChallenge, Gesture } from "./types.ts";
import { GestureManager } from "./gesture-manager.ts";
import { CaptchaManager } from "./captcha-manager.ts";
import { StatsManager } from "./stats-manager.ts";

class HoldingPage {
  private isMobile: boolean
  private dodgeTimeout: number = 10000
  private isDodging: boolean = false
  private dodgingComplete: boolean = false
  private modalStep: number = 0
  private step2UsesTripleNegatives: boolean = false
  private gestureManager: GestureManager | null = null
  private captchaManager: CaptchaManager = new CaptchaManager()
  private currentCaptcha: CaptchaChallenge | null = null
  private statsManager: StatsManager = new StatsManager()
  private sessionStartTime: number = Date.now()
  private a = atob('c2luZ0Zvck1l')
  private b = atob('c2luZyBmb3IgeW91')
  private c = atob('bXVzaWNhbCBwZXJmb3JtYW5jZQ==')
  private d = atob('TXVzaWNhbCBQZXJmb3JtYW5jZQ==')
  private hasCompletedSocialInteraction: boolean = false
  private carouselModal: HTMLElement | null = null
  private currentSlideIndex: number = 0
  private carouselPlatforms = shuffle([
    { name: 'LinkedIn', platform: 'linkedin', icon: '💼', description: 'Professional networking and career updates' },
    { name: 'GitHub', platform: 'github', icon: '🐙', description: 'Open source projects and code repositories' },
    { name: 'Facebook', platform: 'facebook', icon: '📘', description: 'Personal updates and social connections' },
    { name: 'Instagram', platform: 'instagram', icon: '📸', description: 'Photos, stories, and visual content' }
  ]);

  constructor() {
    this.isMobile = window.innerWidth < 768 || /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)

    const existingStats = localStorage.getItem('holding-page-stats');
    const stats = JSON.parse(existingStats!);
    this.hasCompletedSocialInteraction = stats.socialNavigation.overall.attempts > 0;

    this.init()
    this.setupConsoleEasterEgg()

    if (this.isMobile) {
      this.setupGestureSystem()
    }

    if (this.hasCompletedSocialInteraction) {
      this.createStatsButton()
    }
  }

  private getRandomCookingMessage(): string {
    const greetings = GREETINGS;
    const cookingActions = COOKING_ACTIONS;
    const devOpsActions = DEV_OPS_ACTIONS;

    // 10% chance to use DevOps actions, 90% chance to use cooking actions
    const useDevOps = Math.random() < 0.25;
    const actions = useDevOps ? devOpsActions : cookingActions;
    const action = actions[Math.floor(Math.random() * actions.length)];
    const greeting = greetings[Math.floor(Math.random() * greetings.length)];

    return `${greeting} and I'm ${action}`;
  }

  private getPlayfulHintMessage(): string {
    const hintMessages = HINT_MESSAGES;
    return hintMessages[Math.floor(Math.random() * hintMessages.length)]
  }

  private getMobileGestureHintMessage(): string {
    const mobileHints = MOBILE_GESTURE_HINTS;
    return mobileHints[Math.floor(Math.random() * mobileHints.length)]
  }

  private init(): void {
    const randomMessage = this.getRandomCookingMessage()
    const hintMessage = this.isMobile ? this.getMobileGestureHintMessage() : this.getPlayfulHintMessage()
    const playfulHint = `<p class="social-hint">${hintMessage}<br><a href="https://about.michaelcarey.com.au" target="_blank" class="about-link">Learn more about me</a></p>`

    const socialButtonsHTML = this.isMobile ? '' : `
        <div class="social-links">
          <button id="linkedin-btn" class="social-btn" data-platform="linkedin">
            LinkedIn
          </button>
          <button id="github-btn" class="social-btn" data-platform="github">
            GitHub
          </button>
          <button id="facebook-btn" class="social-btn" data-platform="facebook">
            Facebook
          </button>
          <button id="instagram-btn" class="social-btn" data-platform="instagram">
            Instagram
          </button>
        </div>`

    document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
      <div class="holding-container">
        <h1 class="title">Coming Soon</h1>
        <p id="subtitle" class="subtitle">${randomMessage}</p>
        ${playfulHint}
        ${socialButtonsHTML}
        <div id="modal-overlay" class="modal-overlay hidden"></div>
        <div id="modal" class="modal hidden"></div>
      </div>
    `

    this.setInitialButtonPositioning()
    this.setupEventListeners()
  }

  private setInitialButtonPositioning(): void {
    const socialButtons = document.querySelectorAll<HTMLButtonElement>('.social-btn')!

    let left = 0;
    socialButtons.forEach((button, index) => {
      const rect = button.getBoundingClientRect();
      const top  = rect.top;

      let prevButtonWidth = 0;

      if (index === 0) {
        left = rect.left;
      } else {
        prevButtonWidth = socialButtons[index - 1].scrollWidth + 30;
      }

      left += prevButtonWidth

      button.style.position = 'fixed'
      button.style.left = `${left}px`
      button.style.top = `${top}px`
      button.style.transition = 'all 0.3s ease'
    });
  }

  private setupEventListeners(): void {
    // Skip event listeners for mobile since buttons don't exist
    if (this.isMobile) {
      return
    }

    const linkedinBtn = document.getElementById('linkedin-btn')!
    const githubBtn = document.getElementById('github-btn')!
    const facebookBtn = document.getElementById('facebook-btn')!
    const instagramBtn = document.getElementById('instagram-btn')!

    linkedinBtn.addEventListener('mouseenter', (e) => this.dodgeButton(e.target as HTMLElement))
    githubBtn.addEventListener('mouseenter', (e) => this.dodgeButton(e.target as HTMLElement))
    facebookBtn.addEventListener('mouseenter', (e) => this.dodgeButton(e.target as HTMLElement))
    instagramBtn.addEventListener('mouseenter', (e) => this.dodgeButton(e.target as HTMLElement))
    linkedinBtn.addEventListener('click', () => this.handleDesktopClick('linkedin'))
    githubBtn.addEventListener('click', () => this.handleDesktopClick('github'))
    facebookBtn.addEventListener('click', () => this.handleDesktopClick('facebook'))
    instagramBtn.addEventListener('click', () => this.handleDesktopClick('instagram'))
  }

  private removeEventListeners(): void {
    // Skip removing listeners for mobile since buttons don't exist
    if (this.isMobile) {
      return
    }

    const linkedinBtn = document.getElementById('linkedin-btn')!
    const githubBtn = document.getElementById('github-btn')!
    const facebookBtn = document.getElementById('facebook-btn')!
    const instagramBtn = document.getElementById('instagram-btn')!

    linkedinBtn.removeEventListener('mouseenter', (e) => this.dodgeButton(e.target as HTMLElement))
    githubBtn.removeEventListener('mouseenter', (e) => this.dodgeButton(e.target as HTMLElement))
    facebookBtn.removeEventListener('mouseenter', (e) => this.dodgeButton(e.target as HTMLElement))
    instagramBtn.removeEventListener('mouseenter', (e) => this.dodgeButton(e.target as HTMLElement))
    linkedinBtn.removeEventListener('click', () => this.handleDesktopClick('linkedin'))
    githubBtn.removeEventListener('click', () => this.handleDesktopClick('github'))
    facebookBtn.removeEventListener('click', () => this.handleDesktopClick('facebook'))
    instagramBtn.removeEventListener('click', () => this.handleDesktopClick('instagram'))
  }

  private dodgeButton(button: HTMLElement): void {
    if (this.dodgingComplete) {
      return
    }

    const platform = button.getAttribute('data-platform')

    if (!this.isDodging) {
      this.isDodging = true

      // Track start of dodging period
      this.trackEvent('Button Dodging', 'Started', platform)

      setTimeout(() => {
        this.isDodging = false
        this.dodgingComplete = true

        // Track end of dodging period and patience shown
        this.trackEvent('Button Dodging', 'Completed', platform)
        this.statsManager.trackDodgingPeriod(true) // User showed patience and waited
      }, this.dodgeTimeout)
    }

    // Track each dodge
    this.trackEvent('Button Dodging', 'Dodge', platform)
    this.statsManager.trackButtonDodge(platform || 'unknown')

    const maxX = window.innerWidth - button.offsetWidth - 40
    const maxY = window.innerHeight - button.offsetHeight - 40

    const newX = Math.random() * maxX
    const newY = Math.random() * maxY

    button.style.position = 'fixed'
    button.style.left = `${newX}px`
    button.style.top = `${newY}px`
    button.style.transition = 'all 0.3s ease'
  }

  private handleDesktopClick(platform: string): void {
    if (this.dodgingComplete) {
      // Track social button click on desktop
      this.trackEvent('Social Button', 'Click', `${platform} - Desktop`)

      // Track social navigation attempt with stats manager
      this.statsManager.trackSocialNavigationAttempt(platform)

      this.modalStep = 0
      this.showModal(platform)
      this.swapButtonContent()
      this.updateSubtitle();
    }
  }


  private updateSubtitle(): void {
    const subtitleEl = document.getElementById('subtitle')!
    subtitleEl.innerText = this.getRandomCookingMessage();
  }

  private showModal(platform: string): void {
    const overlay = document.getElementById('modal-overlay')!
    const modal = document.getElementById('modal')!

    overlay.classList.remove('hidden')
    modal.classList.remove('hidden')

    if (this.gestureManager) {
      this.gestureManager.setModalState(true)
    }

    // Track modal step
    const stepNames = ['Initial', 'Second Confirmation', 'Third Warning', 'Final Decision']
    this.trackEvent('Confirmation Modal', 'Step Shown', `${platform} - ${stepNames[this.modalStep]}`)

    // Track modal prompt shown with stats manager
    const isTripleNegative = this.modalStep === 1 && Math.random() < 0.5
    this.statsManager.trackModalPromptShown(this.modalStep, isTripleNegative)

    const messages = this.getModalMessages(platform)

    // For final step (modalStep 3), show single "Let's Go!" button
    if (this.modalStep === 3) {
      modal.innerHTML = `
        <div class="modal-content">
          <p>${messages[this.modalStep]}</p>
          <div class="modal-buttons">
            <button id="modal-final-btn" class="modal-btn primary lets-go-btn">Let's Go!</button>
          </div>
        </div>
      `

      // Attach event listener for final button
      document.getElementById('modal-final-btn')!.addEventListener('click', () => {
        this.trackEvent('Confirmation Modal', 'Final Success', `${platform} - Completed`)
        this.launchConfettiAndNavigate(platform)
      })
    } else {
      // Generate confusing button configuration for other steps
      const buttonConfig = this.generateConfusingButtons()

      modal.innerHTML = `
        <div class="modal-content">
          <p>${messages[this.modalStep]}</p>
          <div class="modal-buttons">
            ${buttonConfig.leftButton.html}
            ${buttonConfig.rightButton.html}
          </div>
        </div>
      `

      // Attach event listeners based on which button continues vs closes
      document.getElementById('modal-btn-1')!.addEventListener('click', () => {
        if (buttonConfig.leftButton.continuesFlow) {
          this.trackEvent('Confirmation Modal', 'Continue', `${platform} - Step ${this.modalStep + 1}`)
          this.statsManager.trackModalPromptResult(this.modalStep, true, false, true)
          this.handleModalYes(platform)
        } else {
          this.trackEvent('Confirmation Modal', 'Cancelled', `${platform} - Step ${this.modalStep + 1}`)
          this.statsManager.trackModalPromptResult(this.modalStep, false, false, false)
          this.statsManager.trackSocialNavigationCancel(platform)
          this.closeModal()
        }
      })

      document.getElementById('modal-btn-2')!.addEventListener('click', () => {
        if (buttonConfig.rightButton.continuesFlow) {
          this.trackEvent('Confirmation Modal', 'Continue', `${platform} - Step ${this.modalStep + 1}`)
          this.statsManager.trackModalPromptResult(this.modalStep, true, false, true)
          this.handleModalYes(platform)
        } else {
          this.trackEvent('Confirmation Modal', 'Cancelled', `${platform} - Step ${this.modalStep + 1}`)
          this.statsManager.trackModalPromptResult(this.modalStep, false, false, false)
          this.statsManager.trackSocialNavigationCancel(platform)
          this.closeModal()
        }
      })
    }
  }

  private getModalMessages(platform: string): string[] {
    const step1Messages = this.isMobile ? STEP_1_MOBILE_MESSAGES : STEP_1_DESKTOP_MESSAGES
    const step2DoubleNegatives = STEP_2_DOUBLE_NEGATIVES;
    const step2TripleNegatives = STEP_2_TRIPLE_NEGATIVES;

    // Randomly decide whether to use double or triple negative
    // Store this decision for step 2 only (modal step 1)
    if (this.modalStep === 0) {
      this.step2UsesTripleNegatives = Math.random() < 0.5
    }

    const step2Messages = this.step2UsesTripleNegatives ? step2TripleNegatives : step2DoubleNegatives
    const step4Messages = STEP_4_MESSAGES;

    const randomStep1 = step1Messages[Math.floor(Math.random() * step1Messages.length)].replace('${platform}', platform);
    const randomStep2 = step2Messages[Math.floor(Math.random() * step2Messages.length)].replace('${platform}', platform);
    const randomStep4 = step4Messages[Math.floor(Math.random() * step4Messages.length)].replace('${platform}', platform);

    // Keep 3rd position empty for Captcha Challenges
    return [randomStep1, randomStep2, '', randomStep4]
  }

  private handleModalYes(platform: string): void {
    if (this.modalStep === 0) {
      // After 1st prompt, go to 2nd prompt (double/triple negatives)
      this.modalStep++
      this.showModal(platform)
    } else if (this.modalStep === 1) {
      // After 2nd prompt, show CAPTCHA as 3rd prompt
      this.showCaptcha(platform)
    } else if (this.modalStep === 2) {
      // After CAPTCHA or 3rd prompt, go to final congratulations
      this.modalStep++
      this.showModal(platform)
    } else {
      // After final congratulations, navigate
      this.closeModal()
      this.navigateTo(platform)
    }
  }

  private showCaptcha(platform: string): void {
    this.currentCaptcha = this.captchaManager.generateChallenge()

    this.trackEvent('CAPTCHA', 'Shown', `${platform} - ${this.currentCaptcha.id}`)

    // Track captcha shown with stats manager
    this.statsManager.trackCaptchaShown(this.currentCaptcha.id, this.currentCaptcha.difficulty || 'simple')

    const modal = document.getElementById('modal')!

    const captchaHtml = this.captchaManager.renderChallenge(this.currentCaptcha)

    modal.innerHTML = `
      <div class="modal-content">
        <div class="captcha-header">
          <h3>Security Verification</h3>
          <p>Please complete this CAPTCHA to continue</p>
        </div>
        ${captchaHtml}
        <div class="captcha-footer">
          <button id="captcha-refresh" class="captcha-refresh-btn">🔄 New Challenge</button>
          <button id="captcha-cancel" class="captcha-cancel-btn">😫 Mister, get me out of here</button>
        </div>
      </div>
    `

    this.setupCaptchaEventListeners(platform)
  }

  private setupCaptchaEventListeners(platform: string): void {
    const captchaRefreshBtn = document.getElementById('captcha-refresh')
    const captchaSubmitBtn = document.getElementById('captcha-submit')
    const captchaCancelBtn = document.getElementById('captcha-cancel')
    const captchaInput = document.getElementById('captcha-answer') as HTMLInputElement

    if (captchaRefreshBtn) {
      captchaRefreshBtn.addEventListener('click', () => {
        this.trackEvent('CAPTCHA', 'Refresh', `${platform} - ${this.currentCaptcha?.id}`)
        if (this.currentCaptcha) {
          this.statsManager.trackCaptchaRefresh(this.currentCaptcha.id)
        }
        this.showCaptcha(platform)
      })
    }

    if (captchaCancelBtn) {
      captchaCancelBtn.addEventListener('click', () => {
        this.trackEvent('CAPTCHA', 'Cancel', `${platform} - ${this.currentCaptcha?.id}`)
        this.modalStep = 0;
        this.closeModal();
      })
    }

    if (captchaSubmitBtn && captchaInput) {
      const handleSubmit = () => {
        const userAnswer = captchaInput.value.trim().toLowerCase()
        this.validateCaptchaAnswer(userAnswer, platform)
      }

      captchaSubmitBtn.addEventListener('click', handleSubmit)
      captchaInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
          handleSubmit()
        }
      })
    }

    const captchaOptionBtns = document.querySelectorAll('.captcha-option-btn')
    captchaOptionBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        const target = e.target as HTMLButtonElement
        const optionId = target.getAttribute('data-option-id')
        if (optionId) {
          this.validateCaptchaAnswer(optionId, platform)
        }
      })
    })
  }

  private validateCaptchaAnswer(userAnswer: string | number, platform: string): void {
    if (!this.currentCaptcha) return

    const result = this.captchaManager.validateAnswer(userAnswer)

    if (result.success) {
      this.trackEvent('CAPTCHA', 'Success', `${platform} - ${this.currentCaptcha.id} - Attempts: ${result.attempts}`)
      this.statsManager.trackCaptchaAttempt(this.currentCaptcha.id, this.currentCaptcha.difficulty || 'simple', true, result.attempts)
      this.modalStep = 3 // Jump directly to final congratulations step

      setTimeout(() => {
        this.showModal(platform)
      }, 500)
    } else {
      this.trackEvent('CAPTCHA', 'Failed', `${platform} - ${this.currentCaptcha.id} - Attempt: ${result.attempts}`)
      this.statsManager.trackCaptchaAttempt(this.currentCaptcha.id, this.currentCaptcha.difficulty || 'simple', false, result.attempts)

      if (this.captchaManager.hasAttemptsRemaining()) {
        const modal = document.getElementById('modal')!
        const errorMsg = document.createElement('div')
        errorMsg.className = 'captcha-error'
        errorMsg.textContent = `Incorrect. ${3 - result.attempts} attempts remaining.`

        const existingError = modal.querySelector('.captcha-error')
        if (existingError) {
          existingError.remove()
        }

        const captchaContainer = modal.querySelector('.captcha-container')
        if (captchaContainer) {
          captchaContainer.insertBefore(errorMsg, captchaContainer.firstChild)
        }

        setTimeout(() => {
          errorMsg.remove()
        }, 3000)
      } else {
        this.trackEvent('CAPTCHA', 'Max Attempts Reached', `${platform} - ${this.currentCaptcha.id}`)

        const modal = document.getElementById('modal')!
        modal.innerHTML = `
          <div class="modal-content">
            <div class="captcha-failure">
              <h3>CAPTCHA Failed</h3>
              <p>Too many incorrect attempts. Don't worry, you can still continue!</p>
              <button id="captcha-continue" class="modal-btn primary">Continue Anyway</button>
            </div>
          </div>
        `

        document.getElementById('captcha-continue')!.addEventListener('click', () => {
          this.modalStep = 3 // Jump directly to final congratulations step
          this.showModal(platform)
        })
      }
    }
  }

  private generateConfusingButtons(): any {
    // Simple Yes/No button text
    const yesText = 'Yes'
    const noText = 'No'

    // Randomly determine styling (50/50 chance to swap primary/secondary)
    const swapStyling = Math.random() < 0.5

    // Randomly determine if we should swap the button positions entirely
    const swapPositions = Math.random() < 0.5

    // Determine which text goes where based on position swap
    const leftText = swapPositions ? noText : yesText // no : yes
    const rightText = swapPositions ? yesText : noText // yes : no

    // For step 2 (modalStep === 1), the continue button depends on whether we're using triple negatives
    let leftContinues: boolean
    let rightContinues: boolean

    if (this.modalStep === 1) {
      // Step 2: Triple negatives = No continues, Double negatives = Yes continues
      if (this.step2UsesTripleNegatives) {
        // Triple negatives: No continues
        leftContinues = swapPositions ? true : false // if swapped, left is no (true), otherwise yes (false)
        rightContinues = swapPositions ? false : true // if swapped, right is yes (false), otherwise no (true)
      } else {
        // Double negatives: Yes continues (normal behavior)
        leftContinues = swapPositions ? false : true // if swapped, left is no (false), otherwise yes (true)
        rightContinues = swapPositions ? true : false // if swapped, right is yes (true), otherwise no (false)
      }
    } else {
      // For all other steps, Yes always continues flow
      leftContinues = swapPositions ? false : true // if swapped, left is no (false), otherwise yes (true)
      rightContinues = swapPositions ? true : false // if swapped, right is yes (true), otherwise no (false)
    }

    // Determine styling classes (randomly swap primary/secondary)
    const leftClass = swapStyling ? 'primary' : 'secondary'
    const rightClass = swapStyling ? 'secondary' : 'primary'

    return {
      leftButton: {
        html: `<button id="modal-btn-1" class="modal-btn ${leftClass}">${leftText}</button>`,
        continuesFlow: leftContinues
      },
      rightButton: {
        html: `<button id="modal-btn-2" class="modal-btn ${rightClass}">${rightText}</button>`,
        continuesFlow: rightContinues
      }
    }
  }


  private closeModal(): void {
    // Track modal cancellation with stats manager
    this.statsManager.trackSocialNavigationCancel('modal')

    document.getElementById('modal-overlay')!.classList.add('hidden')
    document.getElementById('modal')!.classList.add('hidden')

    if (this.gestureManager) {
      this.gestureManager.setModalState(false)
    }

    this.modalStep = 0

    const existingStats = localStorage.getItem('holding-page-stats');
    const stats = JSON.parse(existingStats!);
    this.hasCompletedSocialInteraction = stats.socialNavigation.overall.attempts > 0;
    if (this.hasCompletedSocialInteraction) {
      this.createStatsButton()
    }
  }

  private launchConfettiAndNavigate(platform: string): void {
    // Launch confetti effect
    this.createConfettiEffect()

    // Close modal first
    this.closeModal()

    // Wait 1.5 seconds then navigate
    setTimeout(() => {
      this.navigateTo(platform)
    }, 1500)
  }

  private createConfettiEffect(): void {
    const confettiContainer = document.createElement('div')
    confettiContainer.className = 'confetti-container'
    confettiContainer.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      pointer-events: none;
      z-index: 9999;
    `
    document.body.appendChild(confettiContainer)

    // Create multiple confetti pieces
    for (let i = 0; i < 150; i++) {
      this.createConfettiPiece(confettiContainer, i)
    }

    // Remove confetti after animation
    setTimeout(() => {
      confettiContainer.remove()
    }, 4000)
  }

  private createConfettiPiece(container: HTMLElement, _index: number): void {
    const confetti = document.createElement('div')
    const colors = ['#ff6b9d', '#4ecdc4', '#45b7d1', '#96ceb4', '#fecca7', '#ff9a9e', '#a8e6cf', '#fad0c4', '#64ffda', '#ffd93d']
    const shapes = ['◆', '●', '▲', '■', '★', '♦', '♥', '♠', '♣']

    const color = colors[Math.floor(Math.random() * colors.length)]
    const shape = shapes[Math.floor(Math.random() * shapes.length)]
    const size = Math.random() * 15 + 10
    const startX = Math.random() * window.innerWidth
    const duration = Math.random() * 2000 + 2000
    const delay = Math.random() * 1000

    confetti.textContent = shape
    confetti.style.cssText = `
      position: absolute;
      left: ${startX}px;
      top: -20px;
      color: ${color};
      font-size: ${size}px;
      pointer-events: none;
      user-select: none;
      animation: confettiFall ${duration}ms linear ${delay}ms forwards;
    `

    container.appendChild(confetti)
  }

  private navigateTo(platform: string): void {
    const urls = {
      linkedin: 'https://www.linkedin.com/in/michael-carey-8b117944',
      github: 'https://github.com/mickcarey',
      facebook: 'https://www.facebook.com/careym86',
      instagram: 'https://www.instagram.com/mick_carey/'
    }

    // Track goal completion - user successfully navigated to social platform
    this.trackGoal('Social Navigation Success', platform)

    // Track social navigation success with stats manager
    const completionTime = Date.now() - this.sessionStartTime
    this.statsManager.trackSocialNavigationSuccess(platform, this.modalStep + 1, completionTime)

    this.dodgingComplete = false;
    window.open(urls[platform as keyof typeof urls], '_blank')
  }

  private setupConsoleEasterEgg(): void {
    setTimeout(() => {
      console.clear()
      console.log(`%c
╔═══════════════════════════╗
║  🚿 SHOWER SURPRISE! 🚿   ║
╚═══════════════════════════╝

   .-"\`\`"-.
  /        \\
 |  ( ^  ^) |  ♪ la la la ♪
 |    ∆     |
  \\  \\__/  /
   \`------'
     /||\\
    / || \\
     /  \\
    (    )
     \`--\`

    `, 'color: #64ffda; font-size: 14px; font-family: monospace; line-height: 1.2;')


      console.log(`%c"Oh! I didn't see you there!"`, 'color: #ff6b6b; font-size: 16px; font-weight: bold; font-style: italic;')
      console.log(`%c"Would you like me to ${this.b}?"`, 'color: #4ecdc4; font-size: 14px; font-weight: normal;')

      console.log(`%c💡 Type: %c${this.a}()%c to start the ${this.c}!`,
        'color: #ffd93d; font-size: 12px;',
        'color: #ff9ff3; font-size: 14px; font-weight: bold; background: #2a2a2a; padding: 2px 6px; border-radius: 3px;',
        'color: #ffd93d; font-size: 12px;')
    }, 1000)

    ;(window as any)[this.a] = () => {
      this.trackEvent('Console Easter Egg', `${this.a} Executed`, `${this.d}`)
      console.log(`%c🎵 Starting ${this.c}... 🎵`,
        'color: #ff6b9d; font-size: 18px; font-weight: bold; text-shadow: 1px 1px 2px rgba(0,0,0,0.5);')
      this.showLogs()
    }
  }

  private showLogs(): void {
    const abc = ABC;
    const abcIndex = Math.floor(Math.random() * abc.length);
    const xyz = abc[abcIndex].map(a => atob(a));

    xyz.forEach((line, index) => {
      setTimeout(() => console.log('🎶 ' + line), index * 1000)
    })
  }

  private trackEvent(category: string, action: string, name?: string|null|undefined): void {
    if (typeof window !== 'undefined' && (window as any)._paq) {
      const eventData = ['trackEvent', category, action]
      if (name) {
        eventData.push(name)
      }
      ;(window as any)._paq.push(eventData)
    }
  }

  private trackGoal(goalName: string, platform: string): void {
    if (typeof window !== 'undefined' && (window as any)._paq) {
      // Track as both an event and a goal completion
      this.trackEvent('Goal Completion', goalName, platform)

      // You can also track specific goal IDs if configured in Matomo
      // _paq.push(['trackGoal', goalId, customRevenue]);
    }
  }

  private setupGestureSystem(): void {
    this.gestureManager = new GestureManager((gestureId: string) => {
      this.onGestureCompleted(gestureId)
    })

    this.createExampleGestures()
    this.gestureManager.setRandomActiveGesture()
  }

  private createExampleGestures(): void {
    if (!this.gestureManager) return

    const swipeUpGesture: Gesture = {
      id: 'swipe-up',
      name: 'Swipe Up',
      description: 'Swipe up on the screen to reveal social links',
      hint: {
        type: 'animation',
        content: '<div class="swipe-hint-arrows">↑<br>↑<br>↑</div>',
        duration: 3000,
        className: 'swipe-up-hint'
      },
      isCompleted: () => true,
      onComplete: () => {
        this.trackEvent('Mobile Gesture', 'Completed', 'Swipe Up')
        this.showMobileSocialModal()
      }
    }

    const swipeDownGesture: Gesture = {
      id: 'swipe-down',
      name: 'Swipe Down',
      description: 'Swipe down to change the subtitle message',
      hint: {
        type: 'animation',
        content: '<div class="swipe-hint-arrows">↓<br>↓<br>↓</div>',
        duration: 3000,
        className: 'swipe-down-hint'
      },
      isCompleted: () => true,
      onComplete: () => {
        this.trackEvent('Mobile Gesture', 'Completed', 'Swipe Down')
        this.showMobileSocialModal();
      }
    }

    const longPressGesture: Gesture = {
      id: 'long-press',
      name: 'Long Press',
      description: 'Long press and hold the screen for 2 seconds',
      hint: {
        type: 'text',
        content: 'Hold your finger on the screen for 2 seconds',
        duration: 4000,
        className: 'long-press-hint'
      },
      setup: () => {
        const gestureCircle = document.createElement('div')
        gestureCircle.id = 'gesture-circle'
        gestureCircle.className = 'gesture-circle'
        document.body.appendChild(gestureCircle)
      },
      cleanup: () => {
        const gestureCircle = document.getElementById('gesture-circle')
        if (gestureCircle) {
          gestureCircle.remove()
        }
      },
      isCompleted: () => true,
      onComplete: () => {
        this.trackEvent('Mobile Gesture', 'Completed', 'Long Press')
        this.showMobileSocialModal()
      }
    }

    const multiTapGesture: Gesture = {
      id: 'multi-tap',
      name: 'Triple Tap',
      description: 'Tap the screen 3 times quickly',
      hint: {
        type: 'text',
        content: 'Tap the screen 3 times quickly',
        duration: 3000,
        className: 'multi-tap-hint'
      },
      isCompleted: () => true,
      onComplete: () => {
        this.trackEvent('Mobile Gesture', 'Completed', 'Triple Tap')
        this.showMobileSocialModal()
      }
    }

    this.gestureManager.addGesture(swipeUpGesture)
    this.gestureManager.addGesture(swipeDownGesture)
    this.gestureManager.addGesture(longPressGesture)
    this.gestureManager.addGesture(multiTapGesture)
  }

  private onGestureCompleted(gestureId: string): void {
    // Track gesture completion with stats manager
    this.statsManager.trackMobileGesture(gestureId)

    setTimeout(() => {
      if (this.gestureManager) {
        this.gestureManager.setRandomActiveGesture()
      }
    }, 3000)
  }

  private showMobileSocialModal(): void {
    this.trackEvent('Mobile Social Modal', 'Opened', 'Gesture Triggered')

    if (this.gestureManager) {
      this.gestureManager.setModalState(true)
    }

    this.showCarouselModal()
  }

  private swapButtonContent(): void {
    const buttons = [
      document.getElementById('linkedin-btn')!,
      document.getElementById('github-btn')!,
      document.getElementById('facebook-btn')!,
      document.getElementById('instagram-btn')!
    ]

    // Collect current platform assignments and their text content
    const platforms = ['linkedin', 'github', 'facebook', 'instagram']
    const platformNames = ['LinkedIn', 'GitHub', 'Facebook', 'Instagram']

    // Shuffle the platforms array while keeping button positions intact
    const shuffledPlatforms = [...platforms]
    for (let i = shuffledPlatforms.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[shuffledPlatforms[i], shuffledPlatforms[j]] = [shuffledPlatforms[j], shuffledPlatforms[i]]
    }

    // Apply the shuffled platforms to each button at its current position
    buttons.forEach((button, index) => {
      const newPlatform = shuffledPlatforms[index]
      const newPlatformName = platformNames[platforms.indexOf(newPlatform)]

      // Update the data attribute and text content without changing position/styling
      button.setAttribute('data-platform', newPlatform)
      button.id = `${newPlatform}-btn`
      button.textContent = newPlatformName
    })

    // Re-setup event listeners with the new platform assignments
    this.removeEventListeners();
    this.setupEventListeners()

    // Track button swap event
    this.statsManager.trackButtonSwap()
  }

  private createStatsButton(): void {
    // Check if button already exists to avoid duplicates
    if (document.getElementById('stats-button')) {
      return
    }

    const statsButton = document.createElement('button')
    statsButton.id = 'stats-button'
    statsButton.className = 'stats-button'
    statsButton.innerHTML = '📊'
    statsButton.title = 'View your interaction stats'

    statsButton.addEventListener('click', () => {
      this.showStatsModal()
    })

    document.body.appendChild(statsButton)
  }

  private showStatsModal(): void {
    const formattedStats = this.statsManager.getFormattedStats()

    const overlay = document.getElementById('modal-overlay')!
    const modal = document.getElementById('modal')!

    overlay.classList.remove('hidden')
    modal.classList.remove('hidden')

    if (this.gestureManager) {
      this.gestureManager.setModalState(true)
    }

    modal.innerHTML = `
      <div class="modal-content stats-modal-content">
        <div class="stats-header">
          <h2>📊 Your Interaction Stats</h2>
          <button id="stats-close-btn" class="stats-close-btn">×</button>
        </div>

        <div class="stats-tabs">
          <button class="stats-tab-btn active" data-tab="overview">Overview</button>
          <button class="stats-tab-btn" data-tab="social">Social Navigation</button>
          <button class="stats-tab-btn" data-tab="captcha">CAPTCHA Challenges</button>
          <button class="stats-tab-btn" data-tab="interactions">Interactions</button>
          <button class="stats-tab-btn" data-tab="quirky">Quirky Stats</button>
        </div>

        <div class="stats-content">
          <div id="stats-overview" class="stats-tab-content active">
            <div class="stats-section">
              <h3>⏱️ Time Spent</h3>
              <div class="stats-grid">
                <div class="stat-item">
                  <span class="stat-label">Current Session:</span>
                  <span class="stat-value">${formattedStats.session.duration}</span>
                </div>
                <div class="stat-item">
                  <span class="stat-label">Total Time:</span>
                  <span class="stat-value">${formattedStats.lifetime.totalTime}</span>
                </div>
                <div class="stat-item">
                  <span class="stat-label">Total Sessions:</span>
                  <span class="stat-value">${formattedStats.lifetime.sessions}</span>
                </div>
                <div class="stat-item">
                  <span class="stat-label">First Visit:</span>
                  <span class="stat-value">${formattedStats.lifetime.firstVisit}</span>
                </div>
              </div>
            </div>

            <div class="stats-section">
              <h3>🎯 Quick Overview</h3>
              <div class="stats-grid">
                <div class="stat-item">
                  <span class="stat-label">Social Attempts:</span>
                  <span class="stat-value">${formattedStats.social.overall.attempts}</span>
                </div>
                <div class="stat-item">
                  <span class="stat-label">Social Success Rate:</span>
                  <span class="stat-value">${formattedStats.social.overall.successRate}</span>
                </div>
                <div class="stat-item">
                  <span class="stat-label">CAPTCHAs Shown:</span>
                  <span class="stat-value">${formattedStats.captcha.overall.shown}</span>
                </div>
                <div class="stat-item">
                  <span class="stat-label">CAPTCHA Success Rate:</span>
                  <span class="stat-value">${formattedStats.captcha.overall.successRate}</span>
                </div>
              </div>
            </div>
          </div>

          <div id="stats-social" class="stats-tab-content">
            <div class="stats-section">
              <h3>🌐 Social Navigation Summary</h3>
              <div class="stats-grid">
                <div class="stat-item">
                  <span class="stat-label">Total Attempts:</span>
                  <span class="stat-value">${formattedStats.social.overall.attempts}</span>
                </div>
                <div class="stat-item">
                  <span class="stat-label">Successful:</span>
                  <span class="stat-value">${formattedStats.social.overall.successful}</span>
                </div>
                <div class="stat-item">
                  <span class="stat-label">Success Rate:</span>
                  <span class="stat-value">${formattedStats.social.overall.successRate}</span>
                </div>
                <div class="stat-item">
                  <span class="stat-label">This Session:</span>
                  <span class="stat-value">${formattedStats.social.session ? `${formattedStats.social.session.attempts} attempts` : '0 attempts'}</span>
                </div>
              </div>
            </div>

            <div class="stats-section">
              <h3>📱 Platform Breakdown</h3>
              <div class="platform-stats">
                ${formattedStats.social.byPlatform.map((platform: any) => `
                  <div class="platform-stat-item">
                    <h4>${platform.platform.charAt(0).toUpperCase() + platform.platform.slice(1)}</h4>
                    <div class="platform-details">
                      <span><span class="stat-label">Attempts:</span> <span class="stat-value">${platform.attempts}</span></span>
                      <span><span class="stat-label">Success:</span> <span class="stat-value">${platform.successful}</span></span>
                      <span><span class="stat-label">Success Rate:</span> <span class="stat-value">${platform.successRate}</span></span>
                      <span><span class="stat-label">Avg Time:</span> <span class="stat-value">${platform.averageTime}</span></span>
                      <span><span class="stat-label">Fastest:</span> <span class="stat-value">${platform.fastestTime}</span></span>
                    </div>
                  </div>
                `).join('')}
              </div>
            </div>
          </div>

          <div id="stats-captcha" class="stats-tab-content">
            <div class="stats-section">
              <h3>🔐 CAPTCHA Challenge Stats</h3>
              <div class="stats-grid">
                <div class="stat-item">
                  <span class="stat-label">Total Shown:</span>
                  <span class="stat-value">${formattedStats.captcha.overall.shown}</span>
                </div>
                <div class="stat-item">
                  <span class="stat-label">Success Rate:</span>
                  <span class="stat-value">${formattedStats.captcha.overall.successRate}</span>
                </div>
                <div class="stat-item">
                  <span class="stat-label">Average Attempts:</span>
                  <span class="stat-value">${formattedStats.captcha.overall.averageAttempts}</span>
                </div>
                <div class="stat-item">
                  <span class="stat-label">This Session:</span>
                  <span class="stat-value">${formattedStats.captcha.session.shown} shown (${formattedStats.captcha.session.successRate})</span>
                </div>
              </div>
            </div>
          </div>

          <div id="stats-interactions" class="stats-tab-content">
            <div class="stats-section">
              <h3>🖱️ Desktop Interactions</h3>
              <div class="stats-grid">
                <div class="stat-item">
                  <span class="stat-label">Button Dodges:</span>
                  <span class="stat-value">${formattedStats.interactions.desktop.totalDodges}</span>
                </div>
                <div class="stat-item">
                  <span class="stat-label">Dodging Periods:</span>
                  <span class="stat-value">${formattedStats.interactions.desktop.dodgingPeriods}</span>
                </div>
                <div class="stat-item">
                  <span class="stat-label">Avg Dodges/Period:</span>
                  <span class="stat-value">${formattedStats.interactions.desktop.averageDodges}</span>
                </div>
                <div class="stat-item">
                  <span class="stat-label">Patience Shown:</span>
                  <span class="stat-value">${formattedStats.interactions.desktop.patienceShown} times</span>
                </div>
              </div>
            </div>
          </div>

          <div id="stats-quirky" class="stats-tab-content">
            <div class="stats-section">
              <h3>🎪 Quirky & Fun Stats</h3>
              <div class="stats-grid">
                <div class="stat-item">
                  <span class="stat-label">Easter Eggs Found:</span>
                  <span class="stat-value">${formattedStats.quirky.easterEggs}</span>
                </div>
                <div class="stat-item">
                  <span class="stat-label">Confetti Celebrations:</span>
                  <span class="stat-value">${formattedStats.quirky.confetti}</span>
                </div>
                <div class="stat-item">
                  <span class="stat-label">Frustration Points:</span>
                  <span class="stat-value">${formattedStats.quirky.frustration}</span>
                </div>
                <div class="stat-item">
                  <span class="stat-label">Patience Score:</span>
                  <span class="stat-value">${formattedStats.quirky.patience}</span>
                </div>
                <div class="stat-item">
                  <span class="stat-label">Longest Session:</span>
                  <span class="stat-value">${formattedStats.quirky.longestSession}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="stats-footer">
          <button id="reset-stats-btn" class="reset-stats-btn">🗑️ Reset All Stats</button>
        </div>
      </div>
    `

    this.setupStatsModalEventListeners()
  }

  private showResetConfirmation(): void {
    const modal = document.getElementById('modal')!

    modal.innerHTML = `
      <div class="modal-content">
        <h3>🗑️ Reset All Stats?</h3>
        <p>This will permanently delete all your interaction statistics and cannot be undone.</p>
        <p>Are you sure you want to continue?</p>
        <div class="modal-buttons">
          <button id="confirm-reset-btn" class="modal-btn primary">Yes, Reset Everything</button>
          <button id="cancel-reset-btn" class="modal-btn secondary">Cancel</button>
        </div>
      </div>
    `

    // Handle confirmation
    document.getElementById('confirm-reset-btn')!.addEventListener('click', () => {
      this.statsManager.resetStats()
      this.trackEvent('Stats', 'Reset', 'User Confirmed')

      // Show success message
      modal.innerHTML = `
        <div class="modal-content">
          <h3>✅ Stats Reset Complete</h3>
          <p>All your interaction statistics have been cleared.</p>
          <p>The stats button will now disappear until you complete another social interaction.</p>
          <div class="modal-buttons">
            <button id="reset-complete-btn" class="modal-btn primary">OK</button>
          </div>
        </div>
      `

      document.getElementById('reset-complete-btn')!.addEventListener('click', () => {
        this.closeModal()

        // Remove stats button for fresh start
        const statsButton = document.getElementById('stats-button')
        if (statsButton) {
          statsButton.remove()
        }

        this.hasCompletedSocialInteraction = false
      })
    })

    // Handle cancellation
    document.getElementById('cancel-reset-btn')!.addEventListener('click', () => {
      this.showStatsModal() // Go back to stats modal
    })
  }

  private setupStatsModalEventListeners(): void {
    const closeBtn = document.getElementById('stats-close-btn')
    if (closeBtn) {
      closeBtn.addEventListener('click', () => {
        this.closeModal()
      })
    }

    const tabBtns = document.querySelectorAll('.stats-tab-btn')
    tabBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        const target = e.target as HTMLButtonElement
        const tabId = target.getAttribute('data-tab')

        // Remove active class from all tabs and content
        document.querySelectorAll('.stats-tab-btn').forEach(tab => tab.classList.remove('active'))
        document.querySelectorAll('.stats-tab-content').forEach(content => content.classList.remove('active'))

        // Add active class to clicked tab and corresponding content
        target.classList.add('active')
        const content = document.getElementById(`stats-${tabId}`)
        if (content) {
          content.classList.add('active')
        }
      })
    })

    // Reset stats button
    const resetBtn = document.getElementById('reset-stats-btn')
    if (resetBtn) {
      resetBtn.addEventListener('click', () => {
        this.showResetConfirmation()
      })
    }

    // Close modal when clicking overlay
    const overlay = document.getElementById('modal-overlay')
    if (overlay) {
      overlay.addEventListener('click', () => {
        this.closeModal()
      })
    }
  }

  private showCarouselModal(): void {
    this.currentSlideIndex = 0

    this.carouselModal = document.createElement('div')
    this.carouselModal.className = 'mobile-social-carousel'

    this.carouselModal.innerHTML = `
      <div class="carousel-header">
        <h2 class="carousel-title">Choose Your Platform</h2>
        <button class="carousel-close">×</button>
      </div>

      <div class="carousel-container">
        <div class="carousel-track" id="carousel-track">
          ${this.carouselPlatforms.map((platform, index) => `
            <div class="carousel-slide ${index === 0 ? 'active' : ''}" data-platform="${platform.platform}">
              <div class="platform-icon ${platform.platform}">${platform.icon}</div>
              <div class="platform-name">${platform.name}</div>
              <div class="platform-description">${platform.description}</div>
            </div>
          `).join('')}
        </div>

        <div class="carousel-navigation">
          ${this.carouselPlatforms.map((_, index) => `
            <div class="nav-dot ${index === 0 ? 'active' : ''}" data-slide="${index}"></div>
          `).join('')}
        </div>
      </div>

      <div class="carousel-footer">
        <button class="view-profile-btn" id="view-profile-btn">View Profile</button>
      </div>
    `

    document.body.appendChild(this.carouselModal)

    setTimeout(() => {
      this.carouselModal!.classList.add('active')
    }, 100)

    this.setupCarouselEventListeners()
  }

  private setupCarouselEventListeners(): void {
    if (!this.carouselModal) return

    const closeBtn = this.carouselModal.querySelector('.carousel-close')
    const viewProfileBtn = this.carouselModal.querySelector('#view-profile-btn')
    const navDots = this.carouselModal.querySelectorAll('.nav-dot')

    if (closeBtn) {
      closeBtn.addEventListener('click', () => {
        this.closeCarouselModal()
      })
    }

    if (viewProfileBtn) {
      viewProfileBtn.addEventListener('click', () => {
        const currentPlatform = this.carouselPlatforms[this.currentSlideIndex]
        this.trackEvent('Mobile Carousel', 'View Profile Clicked', currentPlatform.platform)
        this.statsManager.trackSocialNavigationAttempt(currentPlatform.platform)

        this.closeCarouselModal();

        setTimeout(() => {
          this.modalStep = 0
          this.showModal(currentPlatform.platform)
        }, 500)
      })
    }

    navDots.forEach((dot, index) => {
      dot.addEventListener('click', () => {
        this.goToSlide(index)
      })
    })

    let startX = 0
    let currentX = 0
    let isDragging = false

    const carouselTrack = this.carouselModal.querySelector('#carousel-track') as HTMLElement

    if (carouselTrack) {
      carouselTrack.addEventListener('touchstart', (e) => {
        startX = e.touches[0].clientX
        isDragging = true
      })

      carouselTrack.addEventListener('touchmove', (e) => {
        if (!isDragging) return
        currentX = e.touches[0].clientX
      })

      carouselTrack.addEventListener('touchend', () => {
        if (!isDragging) return
        isDragging = false

        const diffX = startX - currentX
        const threshold = 50

        if (Math.abs(diffX) > threshold) {
          if (diffX > 0 && this.currentSlideIndex < this.carouselPlatforms.length - 1) {
            this.goToSlide(this.currentSlideIndex + 1)
          } else if (diffX < 0 && this.currentSlideIndex > 0) {
            this.goToSlide(this.currentSlideIndex - 1)
          }
        }
      })
    }
  }

  private goToSlide(index: number): void {
    if (index < 0 || index >= this.carouselPlatforms.length) return

    this.currentSlideIndex = index
    this.updateCarouselDisplay()

    const platform = this.carouselPlatforms[index]
    this.trackEvent('Mobile Carousel', 'Slide Changed', `${platform.platform} - Slide ${index}`)
  }

  private updateCarouselDisplay(): void {
    if (!this.carouselModal) return

    const track = this.carouselModal.querySelector('#carousel-track') as HTMLElement
    const slides = this.carouselModal.querySelectorAll('.carousel-slide')
    const dots = this.carouselModal.querySelectorAll('.nav-dot')

    if (track) {
      console.log(track);
      const offset = -this.currentSlideIndex * window.innerWidth;
      track.style.transform = `translateX(${offset}px)`
    }

    slides.forEach((slide, index) => {
      slide.classList.toggle('active', index === this.currentSlideIndex)
    })

    dots.forEach((dot, index) => {
      dot.classList.toggle('active', index === this.currentSlideIndex)
    })
  }

  private closeCarouselModal(): void {
    if (!this.carouselModal) return

    this.trackEvent('Mobile Carousel', 'Closed', 'User Action')

    this.carouselModal.classList.remove('active')

    setTimeout(() => {
      if (this.carouselModal) {
        this.carouselModal.remove()
        this.carouselModal = null
        this.carouselPlatforms = shuffle(this.carouselPlatforms);
      }
    }, 500)

    if (this.gestureManager) {
      this.gestureManager.setModalState(false)
    }
  }
}

new HoldingPage()
