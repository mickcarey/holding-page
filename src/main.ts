import './style.css'

interface GestureHint {
  type: 'text' | 'animation'
  content: string
  duration?: number
  className?: string
}

interface Gesture {
  id: string
  name: string
  description: string
  hint?: GestureHint
  requiredElement?: string
  isCompleted: () => boolean
  onComplete: () => void
  cleanup?: () => void
  setup?: () => void
}

class GestureManager {
  private gestures: Gesture[] = []
  private activeGesture: Gesture | null = null
  private isModalOpen: boolean = false
  private hintElement: HTMLElement | null = null
  private touchStartX: number = 0
  private touchStartY: number = 0
  private touchStartTime: number = 0
  private longPressTimeout: number | null = null
  private multiTapTimeout: number | null = null
  private tapCount: number = 0
  private onGestureComplete: (gestureId: string) => void

  constructor(onGestureComplete: (gestureId: string) => void) {
    this.onGestureComplete = onGestureComplete
    this.setupGlobalEventListeners()
  }

  private setupGlobalEventListeners(): void {
    document.addEventListener('touchstart', this.handleTouchStart.bind(this), { passive: false })
    document.addEventListener('touchmove', this.handleTouchMove.bind(this), { passive: false })
    document.addEventListener('touchend', this.handleTouchEnd.bind(this), { passive: false })
  }

  private handleTouchStart(e: TouchEvent): void {
    if (this.isModalOpen || !this.activeGesture) return

    const touch = e.touches[0]
    this.touchStartX = touch.clientX
    this.touchStartY = touch.clientY
    this.touchStartTime = Date.now()

    if (this.activeGesture.id === 'long-press') {
      this.startLongPress()
    }

    if (this.activeGesture.id === 'multi-tap') {
      this.handleMultiTap()
    }
  }

  private handleTouchMove(e: TouchEvent): void {
    if (this.isModalOpen || !this.activeGesture) return

    const touch = e.touches[0]
    const deltaX = touch.clientX - this.touchStartX
    const deltaY = touch.clientY - this.touchStartY
    const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY)

    if (distance > 10 && this.longPressTimeout) {
      clearTimeout(this.longPressTimeout)
      this.longPressTimeout = null
    }
  }

  private handleTouchEnd(e: TouchEvent): void {
    if (this.isModalOpen || !this.activeGesture) return

    const touch = e.changedTouches[0]
    const deltaX = touch.clientX - this.touchStartX
    const deltaY = touch.clientY - this.touchStartY
    const deltaTime = Date.now() - this.touchStartTime
    const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY)

    if (this.longPressTimeout) {
      clearTimeout(this.longPressTimeout)
      this.longPressTimeout = null
    }

    if (this.activeGesture.id.startsWith('swipe') && distance > 50 && deltaTime < 300) {
      this.handleSwipe(deltaX, deltaY)
    }

    if (this.activeGesture.id === 'pinch') {
      this.handlePinch(e)
    }
  }

  private startLongPress(): void {
    this.longPressTimeout = window.setTimeout(() => {
      if (this.activeGesture?.id === 'long-press' && this.activeGesture.isCompleted()) {
        this.completeGesture()
      }
    }, 2000)
  }

  private handleMultiTap(): void {
    this.tapCount++

    if (this.multiTapTimeout) {
      clearTimeout(this.multiTapTimeout)
    }

    this.multiTapTimeout = window.setTimeout(() => {
      if (this.activeGesture?.id === 'multi-tap' && this.tapCount >= 3) {
        this.completeGesture()
      }
      this.tapCount = 0
    }, 500)
  }

  private handleSwipe(deltaX: number, deltaY: number): void {
    const absX = Math.abs(deltaX)
    const absY = Math.abs(deltaY)

    if (absX > absY) {
      if (deltaX > 0 && this.activeGesture?.id === 'swipe-right') {
        this.completeGesture()
      } else if (deltaX < 0 && this.activeGesture?.id === 'swipe-left') {
        this.completeGesture()
      }
    } else {
      if (deltaY > 0 && this.activeGesture?.id === 'swipe-down') {
        this.completeGesture()
      } else if (deltaY < 0 && this.activeGesture?.id === 'swipe-up') {
        this.completeGesture()
      }
    }
  }

  private handlePinch(e: TouchEvent): void {
    if (e.touches.length === 2) {
      if (this.activeGesture?.id === 'pinch' && this.activeGesture.isCompleted()) {
        this.completeGesture()
      }
    }
  }

  public addGesture(gesture: Gesture): void {
    this.gestures.push(gesture)
  }

  public removeGesture(id: string): void {
    const index = this.gestures.findIndex(g => g.id === id)
    if (index !== -1) {
      this.gestures.splice(index, 1)
    }
  }

  public setActiveGesture(gestureId: string): void {
    const gesture = this.gestures.find(g => g.id === gestureId)
    if (!gesture) return

    if (this.activeGesture?.cleanup) {
      this.activeGesture.cleanup()
    }

    this.activeGesture = gesture

    if (gesture.setup) {
      gesture.setup()
    }

    this.showHint()
  }

  public setRandomActiveGesture(): void {
    if (this.gestures.length === 0) return

    const randomIndex = Math.floor(Math.random() * this.gestures.length)
    const randomGesture = this.gestures[randomIndex]
    this.setActiveGesture(randomGesture.id)
  }

  public setModalState(isOpen: boolean): void {
    this.isModalOpen = isOpen
    if (isOpen) {
      this.hideHint()
    } else {
      this.showHint()
    }
  }

  public getActiveGesture(): Gesture | null {
    return this.activeGesture
  }

  private completeGesture(): void {
    if (!this.activeGesture) return

    this.hideHint()
    this.activeGesture.onComplete()
    this.onGestureComplete(this.activeGesture.id)
  }

  private showHint(): void {
    if (!this.activeGesture?.hint || this.isModalOpen) return

    this.hideHint()

    this.hintElement = document.createElement('div')
    this.hintElement.className = `gesture-hint ${this.activeGesture.hint.className || ''}`

    if (this.activeGesture.hint.type === 'text') {
      this.hintElement.textContent = this.activeGesture.hint.content
    } else if (this.activeGesture.hint.type === 'animation') {
      this.hintElement.innerHTML = this.activeGesture.hint.content
    }

    document.body.appendChild(this.hintElement)

    if (this.activeGesture.hint.duration) {
      setTimeout(() => {
        this.hideHint()
      }, this.activeGesture.hint.duration)
    }
  }

  private hideHint(): void {
    if (this.hintElement) {
      this.hintElement.remove()
      this.hintElement = null
    }
  }

  public cleanup(): void {
    if (this.activeGesture?.cleanup) {
      this.activeGesture.cleanup()
    }

    this.hideHint()

    document.removeEventListener('touchstart', this.handleTouchStart.bind(this))
    document.removeEventListener('touchmove', this.handleTouchMove.bind(this))
    document.removeEventListener('touchend', this.handleTouchEnd.bind(this))
  }
}

class HoldingPage {
  private isMobile: boolean
  private dodgeTimeout: number = 10000
  private isDodging: boolean = false
  private dodgingComplete: boolean = false
  private modalStep: number = 0
  private step2UsesTripleNegatives: boolean = false
  private gestureManager: GestureManager | null = null
  private a = atob('c2luZ0Zvck1l')
  private b = atob('c2luZyBmb3IgeW91')
  private c = atob('bXVzaWNhbCBwZXJmb3JtYW5jZQ==')
  private d = atob('TXVzaWNhbCBQZXJmb3JtYW5jZQ==')

  constructor() {
    this.isMobile = window.innerWidth < 768 || /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
    this.init()
    this.setupConsoleEasterEgg()

    if (this.isMobile) {
      this.setupGestureSystem()
    }
  }

  private getRandomCookingMessage(): string {
    const greetings = [
      "Hi, I'm Michael",
      "Hi, I'm Mike",
      "Hi, I'm Mick",
      "Hi, I'm MC"
    ]

    const cookingActions = [
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
    ]

    const devOpsActions = [
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
    ]

    // 10% chance to use DevOps actions, 90% chance to use cooking actions
    const useDevOps = Math.random() < 0.1
    const actions = useDevOps ? devOpsActions : cookingActions
    const action = actions[Math.floor(Math.random() * actions.length)]
    const greeting = greetings[Math.floor(Math.random() * greetings.length)]

    return `${greeting} and I'm ${action}`
  }

  private getPlayfulHintMessage(): string {
    const hintMessages = [
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
    ]

    return hintMessages[Math.floor(Math.random() * hintMessages.length)]
  }

  private init(): void {
    const randomMessage = this.getRandomCookingMessage()
    const playfulHint = !this.isMobile ? `<p class="social-hint">${this.getPlayfulHintMessage()}<br><a href="https://about.michaelcarey.com.au" target="_blank" class="about-link">Learn more about me</a></p>` : ''

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

        // Track end of dodging period
        this.trackEvent('Button Dodging', 'Completed', platform)
      }, this.dodgeTimeout)
    }

    // Track each dodge
    this.trackEvent('Button Dodging', 'Dodge', platform)

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
          this.handleModalYes(platform)
        } else {
          this.trackEvent('Confirmation Modal', 'Cancelled', `${platform} - Step ${this.modalStep + 1}`)
          this.closeModal()
        }
      })

      document.getElementById('modal-btn-2')!.addEventListener('click', () => {
        if (buttonConfig.rightButton.continuesFlow) {
          this.trackEvent('Confirmation Modal', 'Continue', `${platform} - Step ${this.modalStep + 1}`)
          this.handleModalYes(platform)
        } else {
          this.trackEvent('Confirmation Modal', 'Cancelled', `${platform} - Step ${this.modalStep + 1}`)
          this.closeModal()
        }
      })
    }
  }

  private getModalMessages(platform: string): string[] {
    const step1DesktopMessages = [
      `Just checking you were meant to click on the ${platform} button?`,
      `Did you mean to click ${platform}?`,
      `You clicked on ${platform} - was that intentional?`,
      `Was clicking ${platform} what you intended?`,
      `Just confirming - you meant to click ${platform}?`,
      `You clicked ${platform} - is that correct?`,
      `Did you intend to click on ${platform}?`,
      `Just making sure - you clicked ${platform}?`,
      `You clicked ${platform} - was that on purpose?`,
      `Was ${platform} the button you meant to click?`,
      `Confirming: you intended to click ${platform}?`,
      `Just checking - clicking ${platform} was deliberate?`,
      `You clicked ${platform} - intentional choice?`,
      `Was clicking ${platform} what you wanted?`,
      `Did you purposely click on ${platform}?`,
      `Just verifying - you meant to click ${platform}?`,
      `${platform} was clicked - is that right?`,
      `You clicked ${platform} - was that the plan?`,
      `Was clicking on ${platform} deliberate?`,
      `Just double-checking - you clicked ${platform} on purpose?`,
      `You clicked the ${platform} button - meant to do that?`,
      `Confirming your ${platform} click - correct?`,
      `Was clicking ${platform} what you wanted to do?`,
      `Just making sure - you clicked ${platform} intentionally?`,
      `${platform} button clicked - was that intentional?`,
      `Did you mean to click the ${platform} button?`,
      `You clicked ${platform} - deliberate choice?`,
      `Was clicking ${platform} your intended action?`,
      `Just confirming you meant to click ${platform}?`,
      `Quick check - you clicked ${platform} on purpose?`
    ]

    const step1MobileMessages = [
      `Just checking you were meant to tap on the ${platform} button?`,
      `Did you mean to tap ${platform}?`,
      `You tapped on ${platform} - was that intentional?`,
      `Was tapping ${platform} what you intended?`,
      `Just confirming - you meant to tap ${platform}?`,
      `You tapped ${platform} - is that correct?`,
      `Did you intend to tap on ${platform}?`,
      `Just making sure - you tapped ${platform}?`,
      `You tapped ${platform} - was that on purpose?`,
      `Was ${platform} the button you meant to tap?`,
      `Confirming: you intended to tap ${platform}?`,
      `Just checking - tapping ${platform} was deliberate?`,
      `You tapped ${platform} - intentional choice?`,
      `Was tapping ${platform} what you wanted?`,
      `Did you purposely tap on ${platform}?`,
      `Just verifying - you meant to tap ${platform}?`,
      `${platform} was tapped - is that right?`,
      `You tapped ${platform} - was that the plan?`,
      `Was tapping on ${platform} deliberate?`,
      `Just double-checking - you tapped ${platform} on purpose?`,
      `You tapped the ${platform} button - meant to do that?`,
      `Confirming your ${platform} tap - correct?`,
      `Was tapping ${platform} what you wanted to do?`,
      `Just making sure - you tapped ${platform} intentionally?`,
      `${platform} button tapped - was that intentional?`,
      `Did you mean to tap the ${platform} button?`,
      `You tapped ${platform} - deliberate choice?`,
      `Was tapping ${platform} your intended action?`,
      `Just confirming you meant to tap ${platform}?`,
      `Quick check - you tapped ${platform} on purpose?`
    ]

    // Choose the appropriate messages based on device type
    const step1Messages = this.isMobile ? step1MobileMessages : step1DesktopMessages

    // Double negatives - Yes continues
    const step2DoubleNegatives = [
      `Don't you think you shouldn't reconsider this decision?`,
      `Wouldn't you rather not change your mind?`,
      `Isn't it better to not think twice about ${platform}?`,
      `Shouldn't you not reconsider your choice?`,
      `Don't you want to not question this decision?`,
      `Wouldn't it be wise to not have second thoughts about ${platform}?`,
      `Isn't it smarter to not have doubts about this choice?`,
      `Don't you think you shouldn't question whether ${platform} is right?`,
      `Wouldn't you prefer to not wonder if this is correct?`,
      `Shouldn't you not doubt this ${platform} decision?`,
      `Don't you want to not reconsider visiting ${platform}?`,
      `Isn't it better to not ask yourself if ${platform} is wrong?`,
      `Wouldn't it be wiser to not consider changing your mind?`,
      `Don't you think you shouldn't wonder if this isn't the right time?`,
      `Shouldn't you not question your ${platform} choice?`
    ]

    // Triple negatives - No continues
    const step2TripleNegatives = [
      `Don't you think you shouldn't not reconsider this decision?`,
      `Wouldn't you rather not avoid not changing your mind?`,
      `Isn't it better to not refuse to not think twice about ${platform}?`,
      `Shouldn't you not avoid not reconsidering your choice?`,
      `Don't you want to not skip not questioning this decision?`,
      `Wouldn't it be wise to not dismiss not having second thoughts?`,
      `Isn't it smarter to not ignore not having doubts?`,
      `Don't you think you shouldn't not question whether ${platform} isn't right?`,
      `Wouldn't you prefer to not avoid not wondering if this isn't correct?`,
      `Shouldn't you not refuse to not doubt this decision?`,
      `Don't you want to not dismiss not reconsidering ${platform}?`,
      `Isn't it better to not avoid not asking if ${platform} isn't wrong?`,
      `Wouldn't it be wiser to not skip not considering whether you shouldn't visit?`,
      `Don't you think you shouldn't not avoid not wondering about this?`,
      `Shouldn't you not refuse to not question whether ${platform} isn't what you don't want?`
    ]

    // Randomly decide whether to use double or triple negatives
    // Store this decision for step 2 only (modal step 1)
    if (this.modalStep === 0) {
      this.step2UsesTripleNegatives = Math.random() < 0.5
    }
    const step2Messages = this.step2UsesTripleNegatives ? step2TripleNegatives : step2DoubleNegatives

    const step3Messages = [
      `Really? You won't reconsider staying on this amazing page?`,
      `Seriously? You don't want to not leave this incredible site?`,
      `For real? You won't not stay on this fantastic page?`,
      `Honestly? You don't want to not remain here?`,
      `Truly? You won't not reconsider leaving this awesome site?`,
      `Actually? You don't prefer not going to ${platform}?`,
      `Really though? You won't not stay here instead?`,
      `Genuinely? You don't want to not avoid leaving?`,
      `Seriously though? You won't not reconsider staying?`,
      `For sure? You don't want to not remain on this page?`,
      `Honestly though? You won't not prefer staying here?`,
      `Truly now? You don't want to not avoid ${platform}?`,
      `Actually though? You won't not reconsider this decision?`,
      `Really now? You don't prefer not leaving this site?`,
      `Genuinely though? You won't not stay here longer?`,
      `Seriously now? You don't want to not remain here?`,
      `For real though? You won't not avoid going to ${platform}?`,
      `Honestly now? You don't prefer not navigating away?`,
      `Truly though? You won't not reconsider staying put?`,
      `Actually now? You don't want to not avoid leaving?`,
      `Really truly? You won't not prefer remaining here?`,
      `Genuinely now? You don't want to not stay longer?`,
      `Seriously for real? You won't not avoid ${platform}?`,
      `Honestly truly? You don't prefer not staying here?`,
      `For sure though? You won't not reconsider this choice?`,
      `Actually for real? You don't want to not remain put?`,
      `Truly seriously? You won't not avoid navigating away?`,
      `Genuinely for sure? You don't prefer not staying?`,
      `Really honestly? You won't not reconsider remaining?`,
      `Seriously truly? You don't want to not avoid leaving this page?`
    ]

    const step4Messages = [
      `Congratulations! You made it through! Ready to visit my ${platform} profile? 🎉`,
      `Well done! Your patience is legendary! Let's head to ${platform}! 🏆`,
      `Amazing! You persevered through all that! Time to check out my ${platform}! ⭐`,
      `Bravo! You're officially unstoppable! Ready for ${platform}? 🎊`,
      `Fantastic job! Hope you had some fun! Let's go to ${platform}! 🌟`,
      `You did it! Thanks for playing along! ${platform} awaits! 🎈`,
      `Incredible patience! You've earned this ${platform} visit! 💪`,
      `Wonderful! Hope that was entertaining! Ready for ${platform}? 🎯`,
      `Success! You conquered the modal maze! Time for ${platform}! 🗺️`,
      `Outstanding! Thanks for your persistence! Let's visit ${platform}! 🚀`,
      `Brilliant! You made it to the end! ${platform} is calling! ✨`,
      `Excellent work! Hope you enjoyed the journey! On to ${platform}! 🎪`,
      `You're a champion! Thanks for sticking with it! ${platform} time! 🏅`,
      `Superb! Your determination paid off! Ready for ${platform}? 🎖️`,
      `Perfect! Hope that brought a smile! Let's go to ${platform}! 😊`,
      `Magnificent! You passed the test! ${platform} awaits your arrival! 🎓`,
      `Awesome job! Thanks for being a good sport! ${platform} bound! 🎮`,
      `Victory! You navigated the chaos beautifully! Time for ${platform}! 🏆`,
      `Splendid! Hope you had as much fun as I did making this! ${platform} awaits! 🎨`,
      `You made it! Thanks for your patience and humor! Let's visit ${platform}! 🎭`,
      `Hooray! You're officially amazing! Ready to see my ${platform}? 🌈`,
      `Well played! Your persistence is admirable! ${platform} here we come! 💫`,
      `Congratulations! That was quite the adventure! On to ${platform}! 🗺️`,
      `Spectacular! Thanks for playing along with my shenanigans! ${platform} time! 🎲`,
      `You did it! Hope this made your day a bit more interesting! Let's go to ${platform}! 🎈`,
      `Mission accomplished! You're a true explorer! ${platform} awaits! 🧭`,
      `Wonderful! Thanks for being such a good sport! Ready for ${platform}? 🎪`,
      `Amazing persistence! You've definitely earned this ${platform} visit! 💎`,
      `Bravo! Hope you enjoyed this little game! Time for ${platform}! 🎯`,
      `Success! Thanks for your patience and good humor! Let's visit ${platform}! 🎉`
    ]

    const randomStep1 = step1Messages[Math.floor(Math.random() * step1Messages.length)]
    const randomStep2 = step2Messages[Math.floor(Math.random() * step2Messages.length)]
    const randomStep3 = step3Messages[Math.floor(Math.random() * step3Messages.length)]
    const randomStep4 = step4Messages[Math.floor(Math.random() * step4Messages.length)]

    return [randomStep1, randomStep2, randomStep3, randomStep4]
  }

  private handleModalYes(platform: string): void {
    if (this.modalStep < 3) {
      this.modalStep++
      this.showModal(platform)
    } else {
      // This shouldn't be called for step 4 anymore
      this.closeModal()
      this.navigateTo(platform)
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
    document.getElementById('modal-overlay')!.classList.add('hidden')
    document.getElementById('modal')!.classList.add('hidden')

    if (this.gestureManager) {
      this.gestureManager.setModalState(false)
    }

    this.modalStep = 0
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
    const abc = [
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
        this.updateSubtitle()
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
        this.triggerEasterEgg()
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

  private onGestureCompleted(_gestureId: string): void {
    setTimeout(() => {
      if (this.gestureManager) {
        this.gestureManager.setRandomActiveGesture()
      }
    }, 3000)
  }

  private showMobileSocialModal(): void {
    this.trackEvent('Mobile Social Modal', 'Opened', 'Gesture Triggered')

    const socialPlatforms = [
      { name: 'LinkedIn', url: 'https://www.linkedin.com/in/michael-carey-8b117944', platform: 'linkedin' },
      { name: 'GitHub', url: 'https://github.com/mickcarey', platform: 'github' },
      { name: 'Facebook', url: 'https://www.facebook.com/careym86', platform: 'facebook' },
      { name: 'Instagram', url: 'https://www.instagram.com/mick_carey/', platform: 'instagram' }
    ]

    const randomPlatform = socialPlatforms[Math.floor(Math.random() * socialPlatforms.length)]

    if (this.gestureManager) {
      this.gestureManager.setModalState(true)
    }

    this.modalStep = 0
    this.showModal(randomPlatform.platform)
  }

  private triggerEasterEgg(): void {
    this.trackEvent('Mobile Gesture Easter Egg', 'Triggered', 'Long Press')

    const easterEggElement = document.createElement('div')
    easterEggElement.className = 'mobile-easter-egg'
    easterEggElement.innerHTML = '🎉✨ You found a secret! ✨🎉'
    document.body.appendChild(easterEggElement)

    setTimeout(() => {
      easterEggElement.remove()
    }, 3000)
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
  }
}

new HoldingPage()
