import { Player } from "./Player";

class UserList {
  private players: Record<string, Player> = {};
  private count: number = 0;

  private addUser(player: Player) {
    if (!this.players[player.getId()]) {
      this.players[player.getId()] = player;
      this.count++;
    }
   
  }
  public removeUser(id: string) {
    if (this.players[id]) {
      delete this.players[id];
      this.count--;
    }
  }
  public getUserById(id: string): Player | undefined {
    return this.players[id];
  }

  private getUserList() {
    return this.players;
  }
  public getUserIds(): string[] {
    return Object.keys(this.players);
  }

  private getUserCount() {
    return this.count;
  }
}



module.exports = UserList;
