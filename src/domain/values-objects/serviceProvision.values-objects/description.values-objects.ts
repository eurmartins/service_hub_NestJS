export class Description {
  private readonly value: string;

  constructor(value: string) {
    if (!Description.isValid(value)) {
      throw new Error('Description must have at least 10 characters');
    }
    this.value = value.trim();
  }

  static isValid(value: string): boolean {
    if (!value || typeof value !== 'string') {
      return false;
    }
    const trimmed = value.trim();
    return trimmed.length >= 10;
  }

  toString(): string {
    return this.value;
  }

  equals(other: Description): boolean {
    return this.value === other.value;
  }
}
