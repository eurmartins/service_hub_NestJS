export class Email {
  private readonly value: string;

  constructor(value: string) {
    if (!Email.isValid(value)) {
      throw new Error('Invalid email');
    }
    this.value = value;
  }

  static isValid(value: string): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  }

  toString(): string {
    return this.value;
  }
}
