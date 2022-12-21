type Message = { text: string; error: boolean };

export class Log {
  public readonly messages: Message[] = [];

  public info(message: string): void {
    this.messages.push({ text: message, error: false });
  }

  public error(message: string): void {
    this.messages.push({ text: message, error: true });
  }

  public clear(): void {
    this.messages.length = 0;
  }
}
