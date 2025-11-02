export class Title {
  private readonly value: string;

  constructor(value: string) {
    if (!Title.isValid(value)) {
      throw new Error('Title must have between 3 and 100 characters');
    }
    this.value = value.trim();
  }

  static isValid(value: string): boolean {
    if (!value || typeof value !== 'string') {
      return false;
    }
    const trimmed = value.trim();
    return trimmed.length >= 3 && trimmed.length <= 100;
  }

  toString(): string {
    return this.value;
  }

  equals(other: Title): boolean {
    return this.value === other.value;
  }
}
