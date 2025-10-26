export class HashPassword {
  private readonly value: string;

  constructor(value: string) {
    if (!value || value.length < 8) {
      throw new Error('Invalid hashPassword');
    }
    this.value = value;
  }

  toString(): string {
    return this.value;
  }
}
