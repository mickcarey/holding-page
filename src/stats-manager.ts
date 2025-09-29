import type {
  CaptchaStats, DesktopInteractionStats, MobileInteractionStats,
  ModalPromptStats,
  PlatformStats,
  PromptTypeStats,
  SocialNavigationStats,
  UserStats
} from "./types.ts";

export class StatsManager {
  private static readonly STORAGE_KEY = 'holding-page-stats'
  private static readonly CURRENT_VERSION = '1.0.0'
  private stats: UserStats
  private lastUpdateTime: number
  private updateInterval: number | null = null

  constructor() {
    this.lastUpdateTime = Date.now()
    this.stats = this.loadStats()
    this.startSession()
    this.setupPeriodicUpdates()
    this.setupVisibilityHandlers()
  }

  private loadStats(): UserStats {
    try {
      const stored = localStorage.getItem(StatsManager.STORAGE_KEY)
      if (stored) {
        const data = JSON.parse(stored)
        if (data.version === StatsManager.CURRENT_VERSION) {
          this.resetSessionStats(data)
          return data
        }
      }
    } catch (error) {
      console.warn('Failed to load stats from localStorage:', error)
    }

    return this.createDefaultStats()
  }

  private createDefaultStats(): UserStats {
    const now = new Date().toISOString()
    return {
      version: StatsManager.CURRENT_VERSION,
      created: now,
      lastUpdated: now,
      session: {
        startTime: now,
        totalDuration: 0,
        isActive: true
      },
      lifetime: {
        totalTimeSpent: 0,
        totalSessions: 0,
        firstVisit: now
      },
      captcha: {
        overall: this.createEmptyCaptchaStats(),
        session: this.createEmptyCaptchaStats(),
        byDifficulty: {
          simple: this.createEmptyCaptchaStats(),
          elaborate: this.createEmptyCaptchaStats()
        },
        favoriteChallenge: null,
        worstChallenge: null
      },
      modalPrompts: {
        overall: this.createEmptyModalPromptStats(),
        session: this.createEmptyModalPromptStats(),
        doubleNegatives: this.createEmptyPromptTypeStats(),
        tripleNegatives: this.createEmptyPromptTypeStats()
      },
      socialNavigation: {
        overall: this.createEmptySocialNavigationStats(),
        session: this.createEmptySocialNavigationStats(),
        byPlatform: {
          linkedin: this.createEmptyPlatformStats(),
          github: this.createEmptyPlatformStats(),
          facebook: this.createEmptyPlatformStats(),
          instagram: this.createEmptyPlatformStats()
        }
      },
      interactions: {
        desktop: this.createEmptyDesktopInteractionStats(),
        mobile: this.createEmptyMobileInteractionStats()
      },
      quirkyStats: {
        easterEggsFound: 0,
        consoleSingsUsed: 0,
        buttonSwapsWitnessed: 0,
        confettiCelebrations: 0,
        gesturesCompleted: 0,
        totalFrustrationPoints: 0,
        patienceScore: 100,
        mostPersistentSession: 0
      }
    }
  }

  private createEmptyCaptchaStats(): CaptchaStats {
    return {
      shown: 0,
      attempts: 0,
      successful: 0,
      failed: 0,
      refreshes: 0,
      averageAttempts: 0,
      successRate: 0
    }
  }

  private createEmptyModalPromptStats(): ModalPromptStats {
    return {
      shown: 0,
      completed: 0,
      cancelled: 0,
      completionRate: 0
    }
  }

  private createEmptyPromptTypeStats(): PromptTypeStats {
    return {
      shown: 0,
      correctlyNavigated: 0,
      successRate: 0
    }
  }

  private createEmptySocialNavigationStats(): SocialNavigationStats {
    return {
      attempts: 0,
      successful: 0,
      cancelled: 0,
      successRate: 0,
      averageModalSteps: 0
    }
  }

  private createEmptyPlatformStats(): PlatformStats {
    return {
      attempts: 0,
      successful: 0,
      cancelled: 0,
      modalsCancelled: 0,
      captchasFailed: 0,
      totalTimeToComplete: 0,
      averageTimeToComplete: 0,
      fastestCompletion: 0,
      successRate: 0
    }
  }

  private createEmptyDesktopInteractionStats(): DesktopInteractionStats {
    return {
      buttonDodges: 0,
      dodgingPeriods: 0,
      averageDodgesPerPeriod: 0,
      patienceShown: 0
    }
  }

  private createEmptyMobileInteractionStats(): MobileInteractionStats {
    return {
      gesturesCompleted: 0,
      swipeUp: 0,
      swipeDown: 0,
      longPress: 0,
      multiTap: 0,
      easterEggsTriggered: 0,
      subtitleChanges: 0
    }
  }

  private resetSessionStats(data: UserStats): void {
    data.session = {
      startTime: new Date().toISOString(),
      totalDuration: 0,
      isActive: true
    }
    data.captcha.session = this.createEmptyCaptchaStats()
    data.modalPrompts.session = this.createEmptyModalPromptStats()
    data.socialNavigation.session = this.createEmptySocialNavigationStats()
  }

  private startSession(): void {
    this.stats.lifetime.totalSessions++
    this.stats.session.startTime = new Date().toISOString()
    this.stats.session.isActive = true
    this.saveStats()
  }

  private setupPeriodicUpdates(): void {
    this.updateInterval = window.setInterval(() => {
      this.updateSessionDuration()
    }, 1000)
  }

  private setupVisibilityHandlers(): void {
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        this.stats.session.isActive = false
        this.updateSessionDuration()
      } else {
        this.stats.session.isActive = true
        this.lastUpdateTime = Date.now()
      }
    })

    window.addEventListener('beforeunload', () => {
      this.updateSessionDuration()
      this.saveStats()
    })
  }

  private updateSessionDuration(): void {
    if (!this.stats.session.isActive) return

    const now = Date.now()
    const elapsed = now - this.lastUpdateTime
    this.stats.session.totalDuration += elapsed
    this.stats.lifetime.totalTimeSpent += elapsed

    if (this.stats.session.totalDuration > this.stats.quirkyStats.mostPersistentSession) {
      this.stats.quirkyStats.mostPersistentSession = this.stats.session.totalDuration
    }

    this.lastUpdateTime = now
    this.stats.lastUpdated = new Date().toISOString()
  }

  public trackCaptchaShown(_challengeId: string, difficulty: 'simple' | 'elaborate'): void {
    this.stats.captcha.overall.shown++
    this.stats.captcha.session.shown++
    this.stats.captcha.byDifficulty[difficulty].shown++
    this.saveStats()
  }

  public trackCaptchaAttempt(_challengeId: string, difficulty: 'simple' | 'elaborate', success: boolean, attempts: number): void {
    this.stats.captcha.overall.attempts++
    this.stats.captcha.session.attempts++
    this.stats.captcha.byDifficulty[difficulty].attempts++

    if (success) {
      this.stats.captcha.overall.successful++
      this.stats.captcha.session.successful++
      this.stats.captcha.byDifficulty[difficulty].successful++
    } else {
      this.stats.captcha.overall.failed++
      this.stats.captcha.session.failed++
      this.stats.captcha.byDifficulty[difficulty].failed++
      this.stats.quirkyStats.totalFrustrationPoints += attempts
    }

    this.updateCaptchaAverages()
    this.saveStats()
  }

  public trackCaptchaRefresh(_challengeId: string): void {
    this.stats.captcha.overall.refreshes++
    this.stats.captcha.session.refreshes++
    this.stats.quirkyStats.totalFrustrationPoints += 2
    this.saveStats()
  }

  public trackModalPromptShown(step: number, isTripleNegative?: boolean): void {
    this.stats.modalPrompts.overall.shown++
    this.stats.modalPrompts.session.shown++

    if (step === 1) {
      if (isTripleNegative) {
        this.stats.modalPrompts.tripleNegatives.shown++
      } else {
        this.stats.modalPrompts.doubleNegatives.shown++
      }
    }

    this.saveStats()
  }

  public trackModalPromptResult(step: number, completed: boolean, isTripleNegative?: boolean, wasNavigatedCorrectly?: boolean): void {
    if (completed) {
      this.stats.modalPrompts.overall.completed++
      this.stats.modalPrompts.session.completed++
    } else {
      this.stats.modalPrompts.overall.cancelled++
      this.stats.modalPrompts.session.cancelled++
      this.stats.quirkyStats.totalFrustrationPoints += 5
    }

    if (step === 1 && wasNavigatedCorrectly !== undefined) {
      if (isTripleNegative) {
        if (wasNavigatedCorrectly) this.stats.modalPrompts.tripleNegatives.correctlyNavigated++
      } else {
        if (wasNavigatedCorrectly) this.stats.modalPrompts.doubleNegatives.correctlyNavigated++
      }
    }

    this.updateModalPromptAverages()
    this.saveStats()
  }

  public trackSocialNavigationAttempt(platform: string): void {
    this.stats.socialNavigation.overall.attempts++
    this.stats.socialNavigation.session.attempts++

    const platformStats = this.stats.socialNavigation.byPlatform[platform as keyof typeof this.stats.socialNavigation.byPlatform]
    if (platformStats) {
      platformStats.attempts++
    }

    this.saveStats()
  }

  public trackSocialNavigationSuccess(platform: string, _modalSteps: number, timeToComplete: number): void {
    this.stats.socialNavigation.overall.successful++
    this.stats.socialNavigation.session.successful++
    this.stats.quirkyStats.confettiCelebrations++

    const platformStats = this.stats.socialNavigation.byPlatform[platform as keyof typeof this.stats.socialNavigation.byPlatform]
    if (platformStats) {
      platformStats.successful++
      platformStats.totalTimeToComplete += timeToComplete

      if (platformStats.fastestCompletion === 0 || timeToComplete < platformStats.fastestCompletion) {
        platformStats.fastestCompletion = timeToComplete
      }
    }

    this.updateSocialNavigationAverages()
    this.saveStats()
  }

  public trackSocialNavigationCancel(platform: string): void {
    this.stats.socialNavigation.overall.cancelled++
    this.stats.socialNavigation.session.cancelled++

    const platformStats = this.stats.socialNavigation.byPlatform[platform as keyof typeof this.stats.socialNavigation.byPlatform]
    if (platformStats) {
      platformStats.cancelled++
      platformStats.modalsCancelled++
    }

    this.updateSocialNavigationAverages()
    this.saveStats()
  }

  public trackButtonDodge(_platform: string): void {
    this.stats.interactions.desktop.buttonDodges++
    this.saveStats()
  }

  public trackDodgingPeriod(patienceShown: boolean): void {
    this.stats.interactions.desktop.dodgingPeriods++

    if (patienceShown) {
      this.stats.interactions.desktop.patienceShown++
      this.stats.quirkyStats.patienceScore += 5
    } else {
      this.stats.quirkyStats.patienceScore = Math.max(0, this.stats.quirkyStats.patienceScore - 2)
    }

    this.updateDesktopInteractionAverages()
    this.saveStats()
  }

  public trackMobileGesture(gestureType: string): void {
    this.stats.interactions.mobile.gesturesCompleted++
    this.stats.quirkyStats.gesturesCompleted++

    switch (gestureType) {
      case 'swipe-up':
        this.stats.interactions.mobile.swipeUp++
        break
      case 'swipe-down':
        this.stats.interactions.mobile.swipeDown++
        this.stats.interactions.mobile.subtitleChanges++
        break
      case 'long-press':
        this.stats.interactions.mobile.longPress++
        this.stats.interactions.mobile.easterEggsTriggered++
        this.stats.quirkyStats.easterEggsFound++
        break
      case 'multi-tap':
        this.stats.interactions.mobile.multiTap++
        break
    }

    this.saveStats()
  }

  public trackEasterEgg(type: string): void {
    this.stats.quirkyStats.easterEggsFound++

    if (type === 'console-sing') {
      this.stats.quirkyStats.consoleSingsUsed++
    }

    this.saveStats()
  }

  public trackButtonSwap(): void {
    this.stats.quirkyStats.buttonSwapsWitnessed++
    this.saveStats()
  }

  private updateCaptchaAverages(): void {
    const updateCaptchaStats = (stats: CaptchaStats) => {
      stats.averageAttempts = stats.shown > 0 ? stats.attempts / stats.shown : 0
      stats.successRate = stats.attempts > 0 ? (stats.successful / stats.attempts) * 100 : 0
    }

    updateCaptchaStats(this.stats.captcha.overall)
    updateCaptchaStats(this.stats.captcha.session)
    updateCaptchaStats(this.stats.captcha.byDifficulty.simple)
    updateCaptchaStats(this.stats.captcha.byDifficulty.elaborate)
  }

  private updateModalPromptAverages(): void {
    const updateModalStats = (stats: ModalPromptStats) => {
      stats.completionRate = stats.shown > 0 ? (stats.completed / stats.shown) * 100 : 0
    }

    updateModalStats(this.stats.modalPrompts.overall)
    updateModalStats(this.stats.modalPrompts.session)

    const updatePromptTypeStats = (stats: PromptTypeStats) => {
      stats.successRate = stats.shown > 0 ? (stats.correctlyNavigated / stats.shown) * 100 : 0
    }

    updatePromptTypeStats(this.stats.modalPrompts.doubleNegatives)
    updatePromptTypeStats(this.stats.modalPrompts.tripleNegatives)
  }

  private updateSocialNavigationAverages(): void {
    const updateSocialStats = (stats: SocialNavigationStats) => {
      stats.successRate = stats.attempts > 0 ? (stats.successful / stats.attempts) * 100 : 0
    }

    updateSocialStats(this.stats.socialNavigation.overall)
    updateSocialStats(this.stats.socialNavigation.session)

    Object.values(this.stats.socialNavigation.byPlatform).forEach(platformStats => {
      platformStats.successRate = platformStats.attempts > 0 ? (platformStats.successful / platformStats.attempts) * 100 : 0
      platformStats.averageTimeToComplete = platformStats.successful > 0 ? platformStats.totalTimeToComplete / platformStats.successful : 0
    })
  }

  private updateDesktopInteractionAverages(): void {
    const desktop = this.stats.interactions.desktop
    desktop.averageDodgesPerPeriod = desktop.dodgingPeriods > 0 ? desktop.buttonDodges / desktop.dodgingPeriods : 0
  }

  public getStats(): UserStats {
    this.updateSessionDuration()
    return { ...this.stats }
  }

  public getFormattedStats(): any {
    const stats = this.getStats()

    return {
      session: {
        duration: this.formatDuration(stats.session.totalDuration),
        active: stats.session.isActive
      },
      lifetime: {
        totalTime: this.formatDuration(stats.lifetime.totalTimeSpent),
        sessions: stats.lifetime.totalSessions,
        firstVisit: new Date(stats.lifetime.firstVisit).toLocaleDateString()
      },
      captcha: {
        overall: {
          shown: stats.captcha.overall.shown,
          successRate: `${stats.captcha.overall.successRate.toFixed(1)}%`,
          averageAttempts: stats.captcha.overall.averageAttempts.toFixed(1)
        },
        session: {
          shown: stats.captcha.session.shown,
          successRate: `${stats.captcha.session.successRate.toFixed(1)}%`
        }
      },
      social: {
        overall: {
          attempts: stats.socialNavigation.overall.attempts,
          successful: stats.socialNavigation.overall.successful,
          successRate: `${stats.socialNavigation.overall.successRate.toFixed(1)}%`
        },
        byPlatform: Object.entries(stats.socialNavigation.byPlatform).map(([platform, data]) => ({
          platform,
          attempts: data.attempts,
          successful: data.successful,
          successRate: `${data.successRate.toFixed(1)}%`,
          averageTime: this.formatDuration(data.averageTimeToComplete),
          fastestTime: this.formatDuration(data.fastestCompletion)
        }))
      },
      interactions: {
        desktop: {
          totalDodges: stats.interactions.desktop.buttonDodges,
          dodgingPeriods: stats.interactions.desktop.dodgingPeriods,
          averageDodges: stats.interactions.desktop.averageDodgesPerPeriod.toFixed(1),
          patienceShown: stats.interactions.desktop.patienceShown
        },
        mobile: {
          totalGestures: stats.interactions.mobile.gesturesCompleted,
          swipeUp: stats.interactions.mobile.swipeUp,
          swipeDown: stats.interactions.mobile.swipeDown,
          longPress: stats.interactions.mobile.longPress,
          multiTap: stats.interactions.mobile.multiTap
        }
      },
      quirky: {
        easterEggs: stats.quirkyStats.easterEggsFound,
        confetti: stats.quirkyStats.confettiCelebrations,
        frustration: stats.quirkyStats.totalFrustrationPoints,
        patience: stats.quirkyStats.patienceScore,
        longestSession: this.formatDuration(stats.quirkyStats.mostPersistentSession)
      }
    }
  }

  private formatDuration(milliseconds: number): string {
    const seconds = Math.floor(milliseconds / 1000)
    const minutes = Math.floor(seconds / 60)
    const hours = Math.floor(minutes / 60)

    if (hours > 0) {
      return `${hours}h ${minutes % 60}m ${seconds % 60}s`
    } else if (minutes > 0) {
      return `${minutes}m ${seconds % 60}s`
    } else {
      return `${seconds}s`
    }
  }

  private saveStats(): void {
    try {
      localStorage.setItem(StatsManager.STORAGE_KEY, JSON.stringify(this.stats))
    } catch (error) {
      console.warn('Failed to save stats to localStorage:', error)
    }
  }

  public resetStats(): void {
    // Clear stats from localStorage
    localStorage.removeItem(StatsManager.STORAGE_KEY)

    // Create fresh stats
    this.stats = this.createDefaultStats()

    // Start a new session
    this.startSession()

    // Save the new stats
    this.saveStats()
  }

  public cleanup(): void {
    if (this.updateInterval) {
      clearInterval(this.updateInterval)
      this.updateInterval = null
    }
    this.updateSessionDuration()
    this.saveStats()
  }
}
