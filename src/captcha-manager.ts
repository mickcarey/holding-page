import type { CaptchaChallenge, CaptchaResult } from "./types.ts";
import { CAPTCHA_CHALLENGES } from "./constants.ts";

export class CaptchaManager {
  private currentChallenge: CaptchaChallenge | null = null
  private attempts: number = 0
  private maxAttempts: number = 3

  constructor() {
  }

  public generateChallenge(): CaptchaChallenge {
    const challenges = CAPTCHA_CHALLENGES;
    const randomChallenge = challenges[Math.floor(Math.random() * challenges.length)]
    this.currentChallenge = randomChallenge
    this.attempts = 0
    return randomChallenge
  }

  public validateAnswer(userAnswer: string | number): CaptchaResult {
    this.attempts++

    if (!this.currentChallenge) {
      return {success: false, attempts: this.attempts}
    }

    let isCorrect = false

    if (this.currentChallenge.type === 'impossible') {
      isCorrect = false
    } else if (this.currentChallenge.type === 'button-selection') {
      const selectedOption = this.currentChallenge.options?.find(opt => opt.id === userAnswer)
      isCorrect = selectedOption?.correct === true
    } else {
      isCorrect = userAnswer == this.currentChallenge.correctAnswer
    }

    return {success: isCorrect, attempts: this.attempts}
  }

  public hasAttemptsRemaining(): boolean {
    return this.attempts < this.maxAttempts
  }

  public renderChallenge(challenge: CaptchaChallenge): string {
    switch (challenge.type) {
      case 'button-selection':
        return this.renderButtonSelection(challenge)
      case 'math':
        return this.renderMathChallenge(challenge)
      case 'visual':
        return this.renderVisualChallenge(challenge)
      case 'text-input':
        return this.renderTextInput(challenge)
      case 'impossible':
        return this.renderImpossibleChallenge(challenge)
      default:
        return '<p>Unknown challenge type</p>'
    }
  }

  private renderButtonSelection(challenge: CaptchaChallenge): string {
    const optionsHtml = challenge.options?.map(option =>
      `<button class="captcha-option-btn" data-option-id="${option.id}">${option.text}</button>`
    ).join('') || ''

    return `
      <div class="captcha-container">
        <p class="captcha-question">${challenge.question}</p>
        <p class="captcha-instruction">${challenge.instruction}</p>
        <div class="captcha-options">
          ${optionsHtml}
        </div>
      </div>
    `
  }

  private renderMathChallenge(challenge: CaptchaChallenge): string {
    return `
      <div class="captcha-container">
        <p class="captcha-question">${challenge.question}</p>
        <p class="captcha-instruction">${challenge.instruction}</p>
        <div class="captcha-input-group">
          <input type="text" id="captcha-answer" class="captcha-input" placeholder="Your answer">
          <button id="captcha-submit" class="captcha-submit-btn">Submit</button>
        </div>
      </div>
    `
  }

  private renderVisualChallenge(challenge: CaptchaChallenge): string {
    return `
      <div class="captcha-container">
        <p class="captcha-question">${challenge.question}</p>
        <p class="captcha-instruction">${challenge.instruction}</p>
        <div class="captcha-input-group">
          <input type="text" id="captcha-answer" class="captcha-input" placeholder="Your answer">
          <button id="captcha-submit" class="captcha-submit-btn">Submit</button>
        </div>
      </div>
    `
  }

  private renderTextInput(challenge: CaptchaChallenge): string {
    return `
      <div class="captcha-container">
        <p class="captcha-question">${challenge.question}</p>
        <p class="captcha-instruction">${challenge.instruction}</p>
        <div class="captcha-input-group">
          <input type="text" id="captcha-answer" class="captcha-input" placeholder="Type your answer">
          <button id="captcha-submit" class="captcha-submit-btn">Submit</button>
        </div>
      </div>
    `
  }

  private renderImpossibleChallenge(challenge: CaptchaChallenge): string {
    const optionsHtml = challenge.options?.map(option =>
      `<button class="captcha-option-btn" data-option-id="${option.id}">${option.text}</button>`
    ).join('') || ''

    return `
      <div class="captcha-container">
        <p class="captcha-question">${challenge.question}</p>
        <p class="captcha-instruction">${challenge.instruction}</p>
        <div class="captcha-options">
          ${optionsHtml}
        </div>
      </div>
    `
  }
}
