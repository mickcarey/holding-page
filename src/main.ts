import './style.css'

class HoldingPage {
  private isMobile: boolean
  private dodgeTimeout: number = 10000
  private isDodging: boolean = false
  private dodgingComplete: boolean = false
  private modalStep: number = 0
  private a = atob('c2luZ0Zvck1l')
  private b = atob('c2luZyBmb3IgeW91')
  private c = atob('bXVzaWNhbCBwZXJmb3JtYW5jZQ==')
  private d = atob('TXVzaWNhbCBQZXJmb3JtYW5jZQ==')

  constructor() {
    this.isMobile = window.innerWidth < 768 || /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
    this.init()
    this.setupConsoleEasterEgg()
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

  private init(): void {
    const randomMessage = this.getRandomCookingMessage()

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

    // Yes always continues flow, regardless of position
    const leftContinues = swapPositions ? false : true // if swapped, left is no (false), otherwise yes (true)
    const rightContinues = swapPositions ? true : false // if swapped, right is yes (true), otherwise no (false)

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
    this.modalStep = 0
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
