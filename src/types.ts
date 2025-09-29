export interface CaptchaChallenge {
  id: string
  type: 'button-selection' | 'math' | 'visual' | 'text-input' | 'impossible'
  question: string
  instruction: string
  options?: { id: string; text: string; correct?: boolean }[]
  correctAnswer?: string | number
  decoy?: boolean
  difficulty: 'simple' | 'elaborate'
}

export interface UserStats {
  version: string
  created: string
  lastUpdated: string
  session: {
    startTime: string
    totalDuration: number
    isActive: boolean
  }
  lifetime: {
    totalTimeSpent: number
    totalSessions: number
    firstVisit: string
  }
  captcha: {
    overall: CaptchaStats
    session: CaptchaStats
    byDifficulty: {
      simple: CaptchaStats
      elaborate: CaptchaStats
    }
    favoriteChallenge: string | null
    worstChallenge: string | null
  }
  modalPrompts: {
    overall: ModalPromptStats
    session: ModalPromptStats
    doubleNegatives: PromptTypeStats
    tripleNegatives: PromptTypeStats
  }
  socialNavigation: {
    overall: SocialNavigationStats
    session: SocialNavigationStats
    byPlatform: {
      linkedin: PlatformStats
      github: PlatformStats
      facebook: PlatformStats
      instagram: PlatformStats
    }
  }
  interactions: {
    desktop: DesktopInteractionStats
    mobile: MobileInteractionStats
  }
  quirkyStats: {
    easterEggsFound: number
    consoleSingsUsed: number
    buttonSwapsWitnessed: number
    confettiCelebrations: number
    gesturesCompleted: number
    totalFrustrationPoints: number
    patienceScore: number
    mostPersistentSession: number
  }
}

export interface CaptchaStats {
  shown: number
  attempts: number
  successful: number
  failed: number
  refreshes: number
  averageAttempts: number
  successRate: number
}

export interface ModalPromptStats {
  shown: number
  completed: number
  cancelled: number
  completionRate: number
}

export interface PromptTypeStats {
  shown: number
  correctlyNavigated: number
  successRate: number
}

export interface SocialNavigationStats {
  attempts: number
  successful: number
  cancelled: number
  successRate: number
  averageModalSteps: number
}

export interface PlatformStats {
  attempts: number
  successful: number
  cancelled: number
  modalsCancelled: number
  captchasFailed: number
  totalTimeToComplete: number
  averageTimeToComplete: number
  fastestCompletion: number
  successRate: number
}

export interface DesktopInteractionStats {
  buttonDodges: number
  dodgingPeriods: number
  averageDodgesPerPeriod: number
  patienceShown: number
}

export interface MobileInteractionStats {
  gesturesCompleted: number
  swipeUp: number
  swipeDown: number
  longPress: number
  multiTap: number
  easterEggsTriggered: number
  subtitleChanges: number
}

export interface GestureHint {
  type: 'text' | 'animation'
  content: string
  duration?: number
  className?: string
}

export interface Gesture {
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

export interface CaptchaChallenge {
  id: string
  type: 'button-selection' | 'math' | 'visual' | 'text-input' | 'impossible'
  question: string
  instruction: string
  options?: { id: string; text: string; correct?: boolean }[]
  correctAnswer?: string | number
  decoy?: boolean
  difficulty: 'simple' | 'elaborate'
}

export interface CaptchaResult {
  success: boolean
  attempts: number
}
