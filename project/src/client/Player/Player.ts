export default class Player {
  private id: string;
  private isPlaying: boolean;
  private playingSide: string;
  private currentGameId: string | null;

  constructor(id: string) {
    this.id = id;
    this.isPlaying = false;
    this.playingSide = "";
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

  getPlayingSide(): string {
    return this.playingSide;
  }

  setPlayingSide(value: string): void {
    this.playingSide = value;
  }

  getCurrentGameId(): string | null {
    return this.currentGameId;
  }

  setCurrentGameId(value: string | null): void {
    this.currentGameId = value;
  }
}
