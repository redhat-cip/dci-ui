export function notEmpty<TValue>(
  value: TValue | null | undefined,
): value is TValue {
  return value !== null && value !== undefined;
}

export function isUUID(uuid: string) {
  return /^[0-9a-f]{8}-([0-9a-f]{4}-){3}[0-9a-f]{12}$/.test(uuid);
}
