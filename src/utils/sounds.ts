//@ts-nocheck
class SoundManager {
  private static instance: SoundManager;
  private sounds: { [key: string]: HTMLAudioElement } = {};
  private muted: boolean = false;

  private constructor() {
    this.sounds = {
      packOpen: new Audio('/sounds/pack-open.mp3'),
      cardFlip: new Audio('/sounds/card-flip.mp3'),
      legendary: new Audio('/sounds/legendary.mp3'),
      epic: new Audio('/sounds/epic.mp3'),
      rare: new Audio('/sounds/rare.mp3'),
      common: new Audio('/sounds/common.mp3'),
      hover: new Audio('/sounds/hover.mp3'),
      click: new Audio('/sounds/click.mp3'),
    };

    // Preload all sounds
    Object.values(this.sounds).forEach(sound => {
      sound.load();
    });
  }

  static getInstance(): SoundManager {
    if (!SoundManager.instance) {
      SoundManager.instance = new SoundManager();
    }
    return SoundManager.instance;
  }

  play(soundName: string) {
    if (this.muted) return;
    const sound = this.sounds[soundName];
    if (sound) {
      sound.currentTime = 0;
      sound.play();
    }
  }

  setMuted(muted: boolean) {
    this.muted = muted;
  }
}

export const soundManager = SoundManager.getInstance(); 