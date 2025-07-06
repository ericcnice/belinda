// Gerador de áudio sintético para criar sons musicais
export class AudioGenerator {
  private audioContext: AudioContext | null = null

  constructor() {
    if (typeof window !== "undefined") {
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
    }
  }

  private async ensureAudioContext() {
    if (!this.audioContext) return null

    if (this.audioContext.state === "suspended") {
      await this.audioContext.resume()
    }
    return this.audioContext
  }

  // Criar tom simples
  async playTone(frequency: number, duration: number, type: OscillatorType = "sine") {
    const ctx = await this.ensureAudioContext()
    if (!ctx) return

    const oscillator = ctx.createOscillator()
    const gainNode = ctx.createGain()

    oscillator.connect(gainNode)
    gainNode.connect(ctx.destination)

    oscillator.frequency.setValueAtTime(frequency, ctx.currentTime)
    oscillator.type = type

    gainNode.gain.setValueAtTime(0.3, ctx.currentTime)
    gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + duration)

    oscillator.start(ctx.currentTime)
    oscillator.stop(ctx.currentTime + duration)
  }

  // Música relaxante (sequência de tons suaves)
  async playRelaxingMusic() {
    const notes = [261.63, 293.66, 329.63, 349.23, 392.0] // C, D, E, F, G
    for (let i = 0; i < notes.length; i++) {
      setTimeout(() => {
        this.playTone(notes[i], 0.8, "sine")
      }, i * 400)
    }
  }

  // Sons da natureza (tons que imitam pássaros e água)
  async playNatureSounds() {
    // Som de pássaro
    for (let i = 0; i < 3; i++) {
      setTimeout(() => {
        this.playTone(800 + Math.random() * 400, 0.2, "square")
      }, i * 300)
    }

    // Som de água (ruído branco filtrado)
    setTimeout(() => {
      this.playWhiteNoise(2000)
    }, 1000)
  }

  // Música alegre (sequência rápida e animada)
  async playHappyMusic() {
    const melody = [523.25, 587.33, 659.25, 698.46, 783.99, 880.0] // C5, D5, E5, F5, G5, A5
    for (let i = 0; i < melody.length; i++) {
      setTimeout(() => {
        this.playTone(melody[i], 0.3, "triangle")
      }, i * 200)
    }
  }

  // Ninar (tons baixos e suaves)
  async playLullaby() {
    const lullaby = [220.0, 246.94, 261.63, 293.66] // A3, B3, C4, D4
    for (let i = 0; i < lullaby.length; i++) {
      setTimeout(() => {
        this.playTone(lullaby[i], 1.2, "sine")
      }, i * 800)
    }
  }

  // Sons de instrumentos (piano simulado)
  async playInstruments() {
    const chord = [261.63, 329.63, 392.0] // Acorde C maior
    chord.forEach((freq, index) => {
      setTimeout(() => {
        this.playTone(freq, 1.5, "triangle")
      }, index * 100)
    })
  }

  // Sons de animais
  async playAnimalSounds() {
    // Gato (miau simulado)
    await this.playTone(400, 0.1, "sawtooth")
    setTimeout(() => this.playTone(300, 0.2, "sawtooth"), 150)

    // Cachorro (au au simulado)
    setTimeout(() => {
      this.playTone(200, 0.15, "square")
      setTimeout(() => this.playTone(180, 0.15, "square"), 200)
    }, 500)
  }

  // Ruído branco para sons da natureza
  private async playWhiteNoise(duration: number) {
    const ctx = await this.ensureAudioContext()
    if (!ctx) return

    const bufferSize = ctx.sampleRate * (duration / 1000)
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate)
    const data = buffer.getChannelData(0)

    // Gerar ruído branco
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * 0.1
    }

    const source = ctx.createBufferSource()
    const filter = ctx.createBiquadFilter()
    const gainNode = ctx.createGain()

    source.buffer = buffer
    filter.type = "lowpass"
    filter.frequency.setValueAtTime(800, ctx.currentTime)
    gainNode.gain.setValueAtTime(0.1, ctx.currentTime)

    source.connect(filter)
    filter.connect(gainNode)
    gainNode.connect(ctx.destination)

    source.start()
    source.stop(ctx.currentTime + duration / 1000)
  }
}
