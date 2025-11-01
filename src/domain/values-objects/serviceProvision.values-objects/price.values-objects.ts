export class Price {
  private readonly value: number;

  constructor(value: number) {
    if (!Price.isValid(value)) {
      throw new Error('Price must be a positive number');
    }
    this.value = Number(value.toFixed(2));
  }

  static isValid(value: number): boolean {
    if (typeof value !== 'number' || isNaN(value)) {
      return false;
    }
    return value >= 0;
  }

  toNumber(): number {
    return this.value;
  }

  toString(): string {
    return this.value.toFixed(2);
  }

  equals(other: Price): boolean {
    return this.value === other.value;
  }
}
