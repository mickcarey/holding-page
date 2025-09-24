import './style.css'

class HoldingPage {
  private isMobile: boolean
  private dodgeTimeout: number = 10000
  private isDodging: boolean = false
  private dodgingComplete: boolean = false
  private modalStep: number = 0

  constructor() {
    this.isMobile = window.innerWidth < 768 || /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
    this.init()
    this.setupConsoleEasterEgg()
  }

  private getRandomCookingMessage(): string {
    const cookingMessages = [
      "Michael is cooking something up 👨‍🍳",
      "Michael is brewing something special ☕",
      "Michael is whipping up something amazing 🥄",
      "Michael is simmering new ideas 🍲",
      "Michael is baking fresh concepts 🍞",
      "Michael is mixing something incredible 🥣",
      "Michael is stirring up innovation 🥄",
      "Michael is seasoning new projects 🧂",
      "Michael is grilling up greatness 🔥",
      "Michael is roasting new features ☕",
      "Michael is fermenting brilliant ideas 🍺",
      "Michael is marinating future plans 🥩",
      "Michael is kneading fresh solutions 🥖",
      "Michael is preparing something delicious 🍽️",
      "Michael is crafting digital recipes 📝",
      "Michael is slow-cooking perfection 🍯",
      "Michael is blending creative flavors 🥤",
      "Michael is steaming ahead with plans ♨️",
      "Michael is heating up new projects 🔥",
      "Michael is dicing up fresh ideas 🔪",
      "Michael is whisking together innovation 🥄",
      "Michael is caramelizing concepts 🍮",
      "Michael is flambéing creativity 🔥",
      "Michael is sous-vide developing ideas 🍖",
      "Michael is pressure-cooking solutions ⏲️",
      "Michael is barbecuing brilliant plans 🍖",
      "Michael is sautéing fresh approaches 🍳",
      "Michael is garnishing new features 🌿",
      "Michael is plating up something special 🍽️",
      "Michael is julienning innovative concepts 🔪",
      "Michael is reducing complexity to perfection 🍷",
      "Michael is tempering digital experiences 🌡️",
      "Michael is poaching creative solutions 🥚",
      "Michael is braising bold new ideas 🍲",
      "Michael is blanching fresh possibilities 🥬"
    ]

    return cookingMessages[Math.floor(Math.random() * cookingMessages.length)]
  }

  private init(): void {
    const randomMessage = this.getRandomCookingMessage()

    document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
      <div class="holding-container">
        <h1 class="title">Coming Soon</h1>
        <p class="subtitle">${randomMessage}</p>
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
        </div>
        <div id="modal-overlay" class="modal-overlay hidden"></div>
        <div id="modal" class="modal hidden"></div>
      </div>
    `

    this.setupEventListeners()
  }

  private setupEventListeners(): void {
    const linkedinBtn = document.getElementById('linkedin-btn')!
    const githubBtn = document.getElementById('github-btn')!
    const facebookBtn = document.getElementById('facebook-btn')!
    const instagramBtn = document.getElementById('instagram-btn')!

    if (this.isMobile) {
      linkedinBtn.addEventListener('click', () => this.startMobileFlow('linkedin'))
      githubBtn.addEventListener('click', () => this.startMobileFlow('github'))
      facebookBtn.addEventListener('click', () => this.startMobileFlow('facebook'))
      instagramBtn.addEventListener('click', () => this.startMobileFlow('instagram'))
    } else {
      linkedinBtn.addEventListener('mouseenter', (e) => this.dodgeButton(e.target as HTMLElement))
      githubBtn.addEventListener('mouseenter', (e) => this.dodgeButton(e.target as HTMLElement))
      facebookBtn.addEventListener('mouseenter', (e) => this.dodgeButton(e.target as HTMLElement))
      instagramBtn.addEventListener('mouseenter', (e) => this.dodgeButton(e.target as HTMLElement))
      linkedinBtn.addEventListener('click', () => this.handleDesktopClick('linkedin'))
      githubBtn.addEventListener('click', () => this.handleDesktopClick('github'))
      facebookBtn.addEventListener('click', () => this.handleDesktopClick('facebook'))
      instagramBtn.addEventListener('click', () => this.handleDesktopClick('instagram'))
    }
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
        button.style.position = 'static'
        button.style.transition = 'none'

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
    }
  }

  private startMobileFlow(platform: string): void {
    // Track social button tap on mobile
    this.trackEvent('Social Button', 'Tap', `${platform} - Mobile`)
    this.modalStep = 0
    this.showModal(platform)
  }

  private showModal(platform: string): void {
    const overlay = document.getElementById('modal-overlay')!
    const modal = document.getElementById('modal')!

    overlay.classList.remove('hidden')
    modal.classList.remove('hidden')

    // Track modal step
    const stepNames = ['Initial', 'Second Confirmation', 'Third Warning', 'Final Decision']
    this.trackEvent('Confirmation Modal', 'Step Shown', `${platform} - ${stepNames[this.modalStep]}`)

    const messages = this.getModalMessages(platform)

    // Generate confusing button configuration
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

  private getModalMessages(platform: string): string[] {
    const step1Messages = [
      `Do you want to visit my ${platform} profile?`,
      `Ready to check out my ${platform}?`,
      `Interested in my ${platform} page?`,
      `Want to see my ${platform} profile?`,
      `Curious about my ${platform}?`,
      `Shall we head to ${platform}?`,
      `Time to visit ${platform}?`,
      `Ready to explore my ${platform}?`,
      `Want to connect on ${platform}?`,
      `Interested in my ${platform} content?`,
      `Feel like checking out ${platform}?`,
      `Ready to jump to ${platform}?`,
      `Want to see what I'm up to on ${platform}?`,
      `Shall I take you to ${platform}?`,
      `Ready for some ${platform} action?`,
      `Want to dive into my ${platform}?`,
      `Interested in my ${platform} updates?`,
      `Ready to visit my ${platform} space?`,
      `Want to see my ${platform} posts?`,
      `Curious about my ${platform} activity?`,
      `Shall we go to ${platform} together?`,
      `Ready to check my ${platform} out?`,
      `Want to explore my ${platform} world?`,
      `Time to see my ${platform} profile?`,
      `Ready to discover my ${platform}?`,
      `Want to peek at my ${platform}?`,
      `Interested in my ${platform} journey?`,
      `Ready to visit ${platform} with me?`,
      `Want to see my ${platform} story?`,
      `Shall we venture to ${platform}?`
    ]

    const step2Messages = [
      `Don't you think you shouldn't not reconsider this decision?`,
      `Wouldn't you rather not avoid changing your mind?`,
      `Isn't it better to not refuse to think twice about ${platform}?`,
      `Shouldn't you not avoid reconsidering your choice?`,
      `Don't you want to not skip questioning this decision?`,
      `Wouldn't it be wise to not dismiss second thoughts about ${platform}?`,
      `Isn't it smarter to not ignore doubts about this choice?`,
      `Don't you think you shouldn't not question whether ${platform} is right?`,
      `Wouldn't you prefer to not avoid wondering if this is correct?`,
      `Shouldn't you not refuse to doubt this ${platform} decision?`,
      `Don't you want to not dismiss the possibility that you shouldn't choose ${platform}?`,
      `Isn't it better to not avoid asking yourself if ${platform} isn't the wrong choice?`,
      `Wouldn't it be wiser to not skip considering whether you shouldn't not visit ${platform}?`,
      `Don't you think you shouldn't not avoid wondering if this isn't the right time for ${platform}?`,
      `Shouldn't you not refuse to question whether ${platform} isn't exactly what you don't want?`,
      `Wouldn't you rather not dismiss the idea that you shouldn't not reconsider ${platform}?`,
      `Isn't it smarter to not ignore the possibility that ${platform} isn't not the wrong decision?`,
      `Don't you want to not avoid questioning whether you shouldn't not think twice about ${platform}?`,
      `Wouldn't it be better to not skip wondering if ${platform} isn't not exactly what you don't need right now?`,
      `Shouldn't you not refuse to consider that you might not want to not avoid rethinking ${platform}?`,
      `Don't you think you shouldn't not dismiss the possibility that ${platform} isn't not the choice you don't want to not make?`,
      `Wouldn't you prefer to not avoid questioning whether you shouldn't not refuse to reconsider this ${platform} decision that you don't want to not think about?`,
      `Isn't it wiser to not ignore the chance that you might not want to not skip wondering if ${platform} isn't not the right choice you don't want to not avoid making?`,
      `Don't you want to not refuse to question whether you shouldn't not avoid considering that ${platform} might not be what you don't want to not choose right now?`,
      `Shouldn't you not dismiss the idea that you might not want to not avoid reconsidering whether ${platform} isn't not exactly the decision you don't want to not make at this moment?`
    ]

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
      `Last chance! You absolutely definitely want to leave?`,
      `Final warning! You're completely certain about abandoning this page?`,
      `Ultimate decision time! You're 100% sure about going to ${platform}?`,
      `This is it! You're absolutely positive about leaving?`,
      `Final call! You're totally committed to visiting ${platform}?`,
      `Last opportunity! You're completely decided on leaving this site?`,
      `Ultimate choice! You're absolutely determined to go?`,
      `Final moment! You're entirely sure about navigating away?`,
      `This is the end! You're completely resolved to leave?`,
      `Last stand! You're absolutely certain about going to ${platform}?`,
      `Final crossroads! You're totally sure about abandoning this page?`,
      `Ultimate test! You're completely convinced about leaving?`,
      `This is your last shot! You're absolutely decided?`,
      `Final frontier! You're entirely committed to ${platform}?`,
      `Ultimate verdict! You're completely determined to go?`,
      `Last hurrah! You're absolutely resolved to leave this site?`,
      `Final chapter! You're totally convinced about navigating away?`,
      `Ultimate conclusion! You're completely sure about going?`,
      `This is the finale! You're absolutely certain about ${platform}?`,
      `Last dance! You're entirely decided on leaving?`,
      `Final curtain! You're completely committed to going away?`,
      `Ultimate ending! You're absolutely determined to visit ${platform}?`,
      `This is closure! You're totally resolved to leave this page?`,
      `Final goodbye! You're completely convinced about navigating to ${platform}?`,
      `Last farewell! You're absolutely sure about abandoning this site?`,
      `Ultimate departure! You're entirely certain about going?`,
      `Final exit! You're completely decided on leaving for ${platform}?`,
      `This is the end of the road! You're absolutely committed?`,
      `Last call for staying! You're totally determined to go to ${platform}?`,
      `Final chance to reconsider! You're completely resolved to leave this amazing page?`
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

      this.closeModal()
      this.navigateTo(platform)
    }
  }

  private generateConfusingButtons(): any {
    // Arrays of confusing button text pairs [affirmative, negative]
    const buttonTextPairs = [
      ['Yes', 'No'],
      ['Confirm', 'Deny'],
      ['Proceed', 'Cancel'],
      ['Accept', 'Decline'],
      ['Continue', 'Stop'],
      ['Absolutely', 'Never'],
      ['Of course', 'Obviously not'],
      ['Certainly', 'Probably not'],
      ['Agree', 'Disagree'],
      ['Approve', 'Reject'],
      ['Okay', 'Nope'],
      ['Sure', 'No way'],
      ['Yep', 'Nah'],
      ['Affirmative', 'Negative'],
      ['Roger that', 'I refuse'],
      ['Let\'s go', 'Hold on'],
      ['Why not', 'Because no'],
      ['Fine', 'Not fine'],
      ['I suppose', 'I doubt it'],
      ['Seems right', 'Seems wrong'],
      ['Makes sense', 'No sense'],
      ['Good idea', 'Bad idea'],
      ['Let\'s do it', 'Let\'s not'],
      ['I\'m in', 'I\'m out'],
      ['Count me in', 'Count me out'],
      ['Why not?', 'Because!']
    ]

    // Randomly select button text pair
    const textPair = buttonTextPairs[Math.floor(Math.random() * buttonTextPairs.length)]

    // Randomly determine styling (50/50 chance to swap primary/secondary)
    const swapStyling = Math.random() < 0.5

    // Randomly determine if we should swap the button positions entirely
    const swapPositions = Math.random() < 0.5

    // Determine which text goes where based on position swap
    const leftText = swapPositions ? textPair[1] : textPair[0] // negative : affirmative
    const rightText = swapPositions ? textPair[0] : textPair[1] // affirmative : negative

    // Affirmative text always continues flow, regardless of position
    const leftContinues = swapPositions ? false : true // if swapped, left is negative (false), otherwise affirmative (true)
    const rightContinues = swapPositions ? true : false // if swapped, right is affirmative (true), otherwise negative (false)

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

  private shuffleSocialButtons(): void {
    const socialLinks = document.querySelector('.social-links')!
    const buttons = ['linkedin', 'github', 'facebook', 'instagram']

    // Shuffle the array
    for (let i = buttons.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[buttons[i], buttons[j]] = [buttons[j], buttons[i]]
    }

    // Rebuild the social links HTML with shuffled order
    const buttonHTML = buttons.map(platform => {
      const capitalizedPlatform = platform.charAt(0).toUpperCase() + platform.slice(1)
      return `<button id="${platform}-btn" class="social-btn" data-platform="${platform}">
            ${capitalizedPlatform}
          </button>`
    }).join('\n          ')

    socialLinks.innerHTML = buttonHTML

    // Re-setup event listeners for the shuffled buttons
    this.setupEventListeners()
  }

  private closeModal(): void {
    document.getElementById('modal-overlay')!.classList.add('hidden')
    document.getElementById('modal')!.classList.add('hidden')
    this.modalStep = 0

    // Subtly shuffle the social buttons after closing modal
    setTimeout(() => {
      this.shuffleSocialButtons()
    }, 300) // Small delay so user doesn't notice the immediate change during modal close animation
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
      console.log(`%c"Would you like me to sing for you?"`, 'color: #4ecdc4; font-size: 14px; font-weight: normal;')

      console.log(`%c💡 Type: %csingAlong()%c to start the musical performance!`,
        'color: #ffd93d; font-size: 12px;',
        'color: #ff9ff3; font-size: 14px; font-weight: bold; background: #2a2a2a; padding: 2px 6px; border-radius: 3px;',
        'color: #ffd93d; font-size: 12px;')
    }, 1000)

    ;(window as any).singAlong = () => {
      // Track console easter egg execution
      this.trackEvent('Console Easter Egg', 'singAlong Executed', 'Musical Performance')
      console.log(`%c🎵 Starting musical performance... 🎵`,
        'color: #ff6b9d; font-size: 18px; font-weight: bold; text-shadow: 1px 1px 2px rgba(0,0,0,0.5);')
      this.logLyrics()
    }
  }

  private logLyrics(): void {
    const lyrics = [
      '... that\'s all the singing I can do, without possibly being sued by copyright laws...'
    ]

    lyrics.forEach((line, index) => {
      setTimeout(() => console.log(line), index * 1000)
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
}

new HoldingPage()
