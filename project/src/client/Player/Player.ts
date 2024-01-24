export default class Player {
  private id: string;
  private isPlaying: boolean;
  private playingSide: number;
  private currentGameId: 0 | 1 | null;

  constructor(id: string) {
    this.id = id;
    this.isPlaying = false;
    this.playingSide = -1;
    this.currentGameId = null;
  }

  getIsPlaying(): boolean {
    return this.isPlaying;
  }
  getId() {
    return this.id;
  }

  setIsPlaying(value: boolean): void {
    this.isPlaying = value;
  }

  getPlayingSide(): number {
    return this.playingSide;
  }

  setPlayingSide(value: number): void {
    this.playingSide = value;
  }

  getCurrentGameId(): 0 | 1 | null {
    return this.currentGameId;
  }

  setCurrentGameId(value: 0 | 1 | null): void {
    this.currentGameId = value;
  }
}
