type ClassValue = string | undefined | null | false | 0;

export const cn = (...classes: ClassValue[]): string =>
  classes.filter(Boolean).join(" ");
