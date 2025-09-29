import type { Gesture } from "./types.ts";

export class GestureManager {
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
    document.addEventListener('touchcancel', this.handleTouchCancel.bind(this), { passive: false })
    document.addEventListener('contextmenu', this.handleContextMenu.bind(this), { passive: false })
  }

  private handleTouchStart(e: TouchEvent): void {
    if (this.isModalOpen || !this.activeGesture) return

    const touch = e.touches[0]
    this.touchStartX = touch.clientX
    this.touchStartY = touch.clientY
    this.touchStartTime = Date.now()

    if (this.activeGesture.id === 'long-press') {
      e.preventDefault()
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

  private handleTouchCancel(_e: TouchEvent): void {
    if (this.longPressTimeout) {
      clearTimeout(this.longPressTimeout)
      this.longPressTimeout = null
    }
    if (this.multiTapTimeout) {
      clearTimeout(this.multiTapTimeout)
      this.multiTapTimeout = null
      this.tapCount = 0
    }
  }

  private handleContextMenu(e: Event): void {
    if (this.activeGesture?.id === 'long-press' && !this.isModalOpen) {
      e.preventDefault()
    }
  }

  private startLongPress(): void {
    this.longPressTimeout = window.setTimeout(() => {
      if (this.activeGesture?.id === 'long-press') {
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

    if (this.longPressTimeout) {
      clearTimeout(this.longPressTimeout)
      this.longPressTimeout = null
    }

    if (this.multiTapTimeout) {
      clearTimeout(this.multiTapTimeout)
      this.multiTapTimeout = null
    }

    document.removeEventListener('touchstart', this.handleTouchStart.bind(this))
    document.removeEventListener('touchmove', this.handleTouchMove.bind(this))
    document.removeEventListener('touchend', this.handleTouchEnd.bind(this))
    document.removeEventListener('touchcancel', this.handleTouchCancel.bind(this))
    document.removeEventListener('contextmenu', this.handleContextMenu.bind(this))
  }
}
