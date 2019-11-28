const { getClaimableAmountInCurrency } = require('../index');

describe("getClaimableAmountInCurrency", () => {
  describe("ATO_non_logbook", () => {
    test('should calculate correctly', () => {
      const result = getClaimableAmountInCurrency("ATO_non_logbook", 100);
      expect(result.claimableAmount).toEqual(68);
      expect(result.claimableDistance).toEqual(100);
      expect(result.currency).toEqual('AUD');
      expect(result.distanceUnit).toEqual('km');
    });

    test('should be capped at 5000km correctly', () => {
      const result = getClaimableAmountInCurrency("ATO_non_logbook", 10000);
      expect(result.claimableAmount).toBeCloseTo(3400.00, 2);
      expect(result.claimableDistance).toEqual(5000);
      expect(result.currency).toEqual('AUD');
      expect(result.distanceUnit).toEqual('km');
    });
  });

  describe("IRS", () => {
    test('should calculate correctly', () => {
      const result = getClaimableAmountInCurrency("IRS", 100);
      expect(result.claimableAmount).toEqual(36.039518);
      expect(result.claimableDistance).toBeCloseTo(62.137, 2);
      expect(result.currency).toEqual('USD');
      expect(result.distanceUnit).toEqual('miles');
    });
  });

  describe('UK_HMRC', () => {
    test('should calculate correctly', () => {
      const result = getClaimableAmountInCurrency("UK_HMRC", 19312.128);
      expect(result.claimableAmount).toBeCloseTo(5000, 2);
      expect(result.claimableDistance).toBeCloseTo(12000, 2);
      expect(result.currency).toEqual('GBP');
      expect(result.distanceUnit).toEqual('miles');
    });
  });

  describe("Canada_Revenue_Agency", () => {
    test("should calculate correctly", () => {
      const result = getClaimableAmountInCurrency("Canada_Revenue_Agency", 19312.128);
      expect(
        result.claimableAmount
      ).toBeCloseTo(10342.30656, 2);
      expect(result.claimableDistance).toBeCloseTo(19312.128, 2);
      expect(result.currency).toEqual('CAD');
      expect(result.distanceUnit).toEqual('km');
    });
  });

  describe("Germany", () => {
    test("should calculate correctly", () => {
      const result = getClaimableAmountInCurrency("Germany", 19312.128);
      expect(result.claimableDistance).toBeCloseTo(19312.128, 2);
      expect(result.claimableAmount).toBeCloseTo(
        5793.6384,
        2
      );
      expect(result.currency).toEqual('EUR');
      expect(result.distanceUnit).toEqual('km');
    });
  });

  describe("unsupported", () => {
    test('should return null', () => {
      const result = getClaimableAmountInCurrency('unsupported', 100);
      expect(result).toEqual(null);
    });
  });
});
