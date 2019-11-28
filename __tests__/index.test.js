const { getClaimableAmountInCurrency } = require('../index');

describe("getClaimableAmountInCurrency", () => {
  describe("ATO_non_logbook", () => {
    test('should calculate correctly', () => {
      const result = getClaimableAmountInCurrency("ATO_non_logbook", 100);
      expect(result.amount).toEqual(68);
      expect(result.currency).toEqual('AUD');
    });

    test('should be capped at 5000km correctly', () => {
      const result = getClaimableAmountInCurrency("ATO_non_logbook", 10000);
      expect(result.amount).toBeCloseTo(3400.00, 2);
      expect(result.currency).toEqual('AUD');
    });
  });

  describe("IRS", () => {
    test('should calculate correctly', () => {
      const result = getClaimableAmountInCurrency("IRS", 100);
      expect(result.amount).toEqual(36.039518);
      expect(result.currency).toEqual('USD');
    });
  });

  describe('UK_HMRC', () => {
    test('should calculate correctly', () => {
      const result = getClaimableAmountInCurrency("UK_HMRC", 19312.128);
      expect(result.amount).toBeCloseTo(5000, 2);
      expect(result.currency).toEqual('GBP');
    });
  });

  describe("Canada_Revenue_Agency", () => {
    test("should calculate correctly", () => {
      const result = getClaimableAmountInCurrency("Canada_Revenue_Agency", 19312.128);
      expect(
        result.amount
      ).toBeCloseTo(10342.30656, 2);
      expect(result.currency).toEqual('CAD');
    });
  });

  describe("Germany", () => {
    test("should calculate correctly", () => {
      const result = getClaimableAmountInCurrency("Germany", 19312.128);
      expect(result.amount).toBeCloseTo(
        5793.6384,
        2
      );
      expect(result.currency).toEqual('EUR');
    });
  });

  describe("unsupported", () => {
    test('should return null', () => {
      const result = getClaimableAmountInCurrency('unsupported', 100);
      expect(result).toEqual(null);
    });
  });
});
