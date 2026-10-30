export function hospitalMapUrl(address: string) {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address + ', Kazakhstan')}`;
}
