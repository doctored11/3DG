export class Game {
  private socket: any;
  private key: string;

  constructor(socket: any, key: string) {
    this.socket = socket;
    this.key = key;
    this.setupEventHandlers();
  }

  private setupEventHandlers() {
    this.socket.emit("new player")
    
    // this.socket.on("players update", (data: any) => {
    //   console.log(data);
    //   const result = data;
    //   this.onNewEvent(result, "new");
    // });
    
  }
  private listen(key: string): Promise<any> {
    return new Promise((resolve) => {
      this.socket.on(key, function (data: any) {
        console.log(`получено по ключу ${key}:` + data);
        resolve(data);
      });
    });
  }

  private onNewEvent(result: string, eventKey?: any) {
    console.log(`событие на ${eventKey || "?"} :`, result);
  }
}
