export default class Player {
  private id: string;
  private isPlaying: boolean;
  private playingSide: 0 | 1 | null;
  private nickname: string;
  private currentGameId: string|null;

  constructor(id: string) {
    this.id = id;
    this.isPlaying = false;
    this.playingSide = null;
    this.currentGameId = null;
    this.nickname = "Игрок"
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

  getPlayingSide(): 0 | 1 | null {
    return this.playingSide;
  }

  setPlayingSide(value: 0 | 1 | null): void {
    this.playingSide = value;
  }

  getCurrentGameId(): string|null {
    return this.currentGameId;
  }

  setCurrentGameId(value:string): void {
    this.currentGameId = value;
  }
  public setNickname(nick: string): void {
    this.nickname = nick;
  }
  public getNickname(): string {
    return this.nickname;
  }
}
