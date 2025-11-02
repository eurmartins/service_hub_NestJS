export class Score {
  private readonly value: number;

  private constructor(value: number) {
    this.value = value;
  }

  static create(value: number): Score {
    if (!Score.isValid(value)) {
      throw new Error('Score must be an integer between 1 and 5');
    }
    return new Score(value);
  }

  static isValid(value: number): boolean {
    if (typeof value !== 'number' || isNaN(value)) {
      return false;
    }
    return Number.isInteger(value) && value >= 1 && value <= 5;
  }

  toNumber(): number {
    return this.value;
  }

  toString(): string {
    return this.value.toString();
  }

  equals(other: Score): boolean {
    return this.value === other.value;
  }

  toStars(): string {
    return '⭐'.repeat(this.value);
  }
}
