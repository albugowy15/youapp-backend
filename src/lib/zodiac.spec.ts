import { getHoroscopeSign, getZodiacSign } from './zodiac';

describe('zodiac.ts', () => {
  describe('getHoroscopeSign', () => {
    it('should return the correct horoscope sign for each zodiac date range', () => {
      expect(getHoroscopeSign(20, 1)).toBe('Aquarius');
      expect(getHoroscopeSign(18, 2)).toBe('Aquarius');
      expect(getHoroscopeSign(19, 2)).toBe('Pisces');
      expect(getHoroscopeSign(20, 3)).toBe('Pisces');
      expect(getHoroscopeSign(21, 3)).toBe('Aries');
      expect(getHoroscopeSign(19, 4)).toBe('Aries');
      expect(getHoroscopeSign(20, 4)).toBe('Taurus');
      expect(getHoroscopeSign(20, 5)).toBe('Taurus');
      expect(getHoroscopeSign(21, 5)).toBe('Gemini');
      expect(getHoroscopeSign(20, 6)).toBe('Gemini');
      expect(getHoroscopeSign(21, 6)).toBe('Cancer');
      expect(getHoroscopeSign(22, 7)).toBe('Cancer');
      expect(getHoroscopeSign(23, 7)).toBe('Leo');
      expect(getHoroscopeSign(22, 8)).toBe('Leo');
      expect(getHoroscopeSign(23, 8)).toBe('Virgo');
      expect(getHoroscopeSign(22, 9)).toBe('Virgo');
      expect(getHoroscopeSign(23, 9)).toBe('Libra');
      expect(getHoroscopeSign(22, 10)).toBe('Libra');
      expect(getHoroscopeSign(23, 10)).toBe('Scorpio');
      expect(getHoroscopeSign(21, 11)).toBe('Scorpio');
      expect(getHoroscopeSign(22, 11)).toBe('Sagittarius');
      expect(getHoroscopeSign(21, 12)).toBe('Sagittarius');
      expect(getHoroscopeSign(22, 12)).toBe('Capricorn');
      expect(getHoroscopeSign(19, 1)).toBe('Capricorn');
    });

    it('should return undefined for invalid date input', () => {
      expect(getHoroscopeSign(32, 1)).toBeUndefined();
      expect(getHoroscopeSign(0, 1)).toBeUndefined();
      expect(getHoroscopeSign(15, 13)).toBeUndefined();
      expect(getHoroscopeSign(15, 0)).toBeUndefined();
    });
  });

  describe('getZodiacSign', () => {
    it('should return the correct zodiac sign based on the year', () => {
      expect(getZodiacSign(2000)).toBe('Dragon');
      expect(getZodiacSign(1996)).toBe('Rat');
      expect(getZodiacSign(1987)).toBe('Rabbit');
      expect(getZodiacSign(1975)).toBe('Rabbit');
      expect(getZodiacSign(2014)).toBe('Horse');
      expect(getZodiacSign(2021)).toBe('Ox');
    });

    it('should handle years before the reference year', () => {
      expect(getZodiacSign(1900)).toBe('Rat');
      expect(getZodiacSign(1896)).toBe('Monkey');
    });
  });
});
