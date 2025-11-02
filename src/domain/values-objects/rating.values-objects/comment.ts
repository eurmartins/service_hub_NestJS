export class Comment {
  private readonly value: string;

  private constructor(value: string) {
    this.value = value.trim();
  }

  static create(value: string): Comment {
    if (!Comment.isValid(value)) {
      throw new Error(
        'Comment must be a non-empty string with maximum 1000 characters',
      );
    }
    return new Comment(value);
  }

  static isValid(value: string): boolean {
    if (!value || typeof value !== 'string') {
      return false;
    }
    const trimmed = value.trim();
    return trimmed.length > 0 && trimmed.length <= 1000;
  }

  toString(): string {
    return this.value;
  }

  equals(other: Comment): boolean {
    return this.value === other.value;
  }

  length(): number {
    return this.value.length;
  }
}
