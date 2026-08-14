import { Injectable } from '@nestjs/common';

@Injectable()
export class ExcelNormalizerService {
  normalizeString(
    value: unknown,
  ): string | null {
    if (
      value === null ||
      value === undefined
    ) {
      return null;
    }

    const normalized = String(value)
      .trim()
      .replace(/\s+/g, ' ');

    if (
      normalized === '' ||
      normalized === '-'
    ) {
      return null;
    }

    return normalized;
  }

  normalizeEmail(
    value: unknown,
  ): string | null {
    const normalized =
      this.normalizeString(value);

    return normalized
      ? normalized.toLowerCase()
      : null;
  }

  normalizeContactNumber(
    value: unknown,
  ): string | null {
    const normalized =
      this.normalizeString(value);

    if (!normalized) {
      return null;
    }

    // Preserve the value as a string.
    // We do not convert contact numbers to numbers.
    return normalized.replace(
      /[\s\-()]/g,
      '',
    );
  }

  normalizePolicyNumber(
    value: unknown,
  ): string | null {
    const normalized =
      this.normalizeString(value);

    if (!normalized) {
      return null;
    }

    return normalized;
  }

  normalizeDecimal(
    value: unknown,
  ): string | null {
    const normalized =
      this.normalizeString(value);

    if (!normalized) {
      return null;
    }

    // Remove common formatting characters.
    const cleaned = normalized
      .replace(/,/g, '')
      .replace(/[₱$€£]/g, '')
      .trim();

    if (!cleaned) {
      return null;
    }

    return cleaned;
  }

  normalizeDate(
    value: unknown,
  ): Date | null {
    if (
      value === null ||
      value === undefined ||
      value === ''
    ) {
      return null;
    }

    if (value instanceof Date) {
      return value;
    }

    const normalized =
      this.normalizeString(value);

    if (!normalized) {
      return null;
    }

    const date = new Date(normalized);

    if (Number.isNaN(date.getTime())) {
      return null;
    }

    return date;
  }
}