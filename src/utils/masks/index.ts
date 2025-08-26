export function removeNonNumber(input: string) {
  if (!input) {
    return input;
  }
  const regex = /[^0-9]/g;
  return input.replace(regex, '');
}
