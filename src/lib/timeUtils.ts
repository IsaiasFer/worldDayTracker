export interface CountryTimeInfo {
  name: string;
  flag: string;
  timezone: string;
  localTime: string;
  timeUntilMidnight: number; // in milliseconds
}

export const getMidnightLongitude = (date: Date): number => {
  const utcHours = date.getUTCHours();
  const utcMinutes = date.getUTCMinutes();
  const utcSeconds = date.getUTCSeconds();

  const totalHours = utcHours + utcMinutes / 60 + utcSeconds / 3600;

  // At 00:00 UTC, midnight is at 0 degrees.
  // Earth rotates West to East, so midnight moves East to West.
  let longitude = -(totalHours * 15);

  // Normalize to -180 to 180
  while (longitude <= -180) longitude += 360;
  while (longitude > 180) longitude -= 360;

  return longitude;
};

export const getCountriesChangingDay = (): CountryTimeInfo[] => {
  // Hardcoded selection of representative countries for the stats panel
  const countries = [
    { name: "Japan", flag: "🇯🇵", timezone: "Asia/Tokyo" },
    { name: "Australia", flag: "🇦🇺", timezone: "Australia/Sydney" },
    { name: "Germany", flag: "🇩🇪", timezone: "Europe/Berlin" },
    { name: "United Kingdom", flag: "🇬🇧", timezone: "UTC" },
    { name: "Brazil", flag: "🇧🇷", timezone: "America/Sao_Paulo" },
    { name: "United States", flag: "🇺🇸", timezone: "America/New_York" },
    { name: "China", flag: "🇨🇳", timezone: "Asia/Shanghai" },
    { name: "India", flag: "🇮🇳", timezone: "Asia/Kolkata" },
    { name: "South Africa", flag: "🇿🇦", timezone: "Africa/Johannesburg" },
    { name: "Mexico", flag: "🇲🇽", timezone: "America/Mexico_City" },
  ];

  const now = new Date();

  return countries.map(c => {
    const formatter = new Intl.DateTimeFormat('en-US', {
      timeZone: c.timezone,
      hour: 'numeric',
      minute: 'numeric',
      second: 'numeric',
      hour12: false,
    });

    const parts = formatter.formatToParts(now);
    const hour = parseInt(parts.find(p => p.type === 'hour')?.value || '0');
    const min = parseInt(parts.find(p => p.type === 'minute')?.value || '0');
    const sec = parseInt(parts.find(p => p.type === 'second')?.value || '0');

    const secondsSinceMidnight = (hour * 3600) + (min * 60) + sec;
    const totalSecondsInDay = 24 * 3600;
    const timeUntilMidnight = (totalSecondsInDay - secondsSinceMidnight) * 1000;

    return {
      ...c,
      localTime: `${hour.toString().padStart(2, '0')}:${min.toString().padStart(2, '0')}`,
      timeUntilMidnight
    };
  }).sort((a, b) => a.timeUntilMidnight - b.timeUntilMidnight);
};
