export class ChargedAmount {
  private readonly value: number;

  private constructor(value: number) {
    this.value = Number(value.toFixed(2));
  }

  static create(value: number): ChargedAmount {
    if (!ChargedAmount.isValid(value)) {
      throw new Error('ChargedAmount must be a positive number');
    }
    return new ChargedAmount(value);
  }

  static fromDatabase(value: any): ChargedAmount {
    let numericValue: number;

    if (typeof value === 'string') {
      numericValue = parseFloat(value);
    } else if (typeof value === 'number') {
      numericValue = value;
    } else {
      console.warn(
        `Invalid chargedAmount type for value: ${value} (type: ${typeof value})`,
      );
      numericValue = 0;
    }

    if (isNaN(numericValue)) {
      console.warn(`ChargedAmount value is NaN after conversion: ${value}`);
      numericValue = 0;
    }

    return new ChargedAmount(numericValue);
  }

  static isValid(value: number): boolean {
    if (typeof value !== 'number' || isNaN(value)) {
      return false;
    }
    return value > 0;
  }

  toNumber(): number {
    return this.value;
  }

  toString(): string {
    return this.value.toFixed(2);
  }

  equals(other: ChargedAmount): boolean {
    return this.value === other.value;
  }
}
