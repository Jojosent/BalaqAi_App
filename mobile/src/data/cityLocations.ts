import locations from './cityLocations.json';

export const cityLocations = locations;
const normalized = (value: string) => value.trim().toLocaleLowerCase().replace(/[\s-]+/g, '');
export function getCityLocation(value: string) {
  const key = normalized(value);
  return cityLocations.find(location => [location.city, ...location.aliases].some(name => normalized(name) === key));
}
