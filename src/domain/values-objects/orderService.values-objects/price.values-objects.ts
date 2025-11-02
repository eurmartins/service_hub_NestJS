export class Price {
  private readonly value: number;

  private constructor(value: number) {
    this.value = Number(value.toFixed(2));
  }

  static create(value: number): Price {
    if (!Price.isValid(value)) {
      throw new Error('Price must be a positive number');
    }
    return new Price(value);
  }

  static parseStringToDouble(value: any): Price {
    let numericValue: number;

    if (typeof value === 'string') {
      numericValue = parseFloat(value);
    } else if (typeof value === 'number') {
      numericValue = value;
    } else {
      console.warn(
        `Invalid price type for value: ${value} (type: ${typeof value})`,
      );
      numericValue = 0;
    }

    if (isNaN(numericValue)) {
      console.warn(`Price value is NaN after conversion: ${value}`);
      numericValue = 0;
    }

    return new Price(numericValue);
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

  equals(other: Price): boolean {
    return this.value === other.value;
  }
}
