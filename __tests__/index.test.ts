import { getTaxClaimableMileage } from '../src/index';

describe('getTaxClaimableMileage', () => {
  describe('ATO_non_logbook', () => {
    test('should calculate correctly for a trip under 5000km', () => {
      const result = getTaxClaimableMileage({
        taxType: 'ATO_non_logbook',
        kmTravelled: 100
      });
      expect(result.claimableAmount).toEqual(68);
      expect(result.claimableDistance).toEqual(100);
      expect(result.currency).toEqual('AUD');
      expect(result.distanceUnit).toEqual('km');
    });

    test('should be capped at 5000km correctly', () => {
      const result = getTaxClaimableMileage({
        taxType: 'ATO_non_logbook',
        kmTravelled: 10000
      });
      expect(result.claimableAmount).toBeCloseTo(3400.0, 2);
      expect(result.claimableDistance).toEqual(5000);
      expect(result.currency).toEqual('AUD');
      expect(result.distanceUnit).toEqual('km');
    });
  });

  describe('IRS', () => {
    test('should calculate correctly', () => {
      const result = getTaxClaimableMileage({
        taxType: 'IRS',
        kmTravelled: 100
      });
      expect(result.claimableAmount).toEqual(36.039518);
      expect(result.claimableDistance).toBeCloseTo(62.137, 2);
      expect(result.currency).toEqual('USD');
      expect(result.distanceUnit).toEqual('miles');
    });
  });

  describe('UK_HMRC', () => {
    test('should calculate correctly', () => {
      const result = getTaxClaimableMileage({
        taxType: 'UK_HMRC',
        kmTravelled: 19312.128
      });
      expect(result.claimableAmount).toBeCloseTo(5000, 2);
      expect(result.claimableDistance).toBeCloseTo(12000, 2);
      expect(result.currency).toEqual('GBP');
      expect(result.distanceUnit).toEqual('miles');
    });
  });

  describe('Canada_Revenue_Agency', () => {
    test('should calculate correctly', () => {
      const result = getTaxClaimableMileage({
        taxType: 'Canada_Revenue_Agency',
        kmTravelled: 19312.128
      });
      expect(result.claimableAmount).toBeCloseTo(10342.30656, 2);
      expect(result.claimableDistance).toBeCloseTo(19312.128, 2);
      expect(result.currency).toEqual('CAD');
      expect(result.distanceUnit).toEqual('km');
    });
  });

  describe('Germany', () => {
    test('should calculate correctly', () => {
      const result = getTaxClaimableMileage({
        taxType: 'Germany',
        kmTravelled: 19312.128
      });
      expect(result.claimableDistance).toBeCloseTo(19312.128, 2);
      expect(result.claimableAmount).toBeCloseTo(5793.6384, 2);
      expect(result.currency).toEqual('EUR');
      expect(result.distanceUnit).toEqual('km');
    });
  });

  describe('custom', () => {
    test('should work with lambos purchased with BTC', () => {
      const rateTiers = [
        {
          maxDistanceForThisTier: 8000,
          ratePerDistanceUnit: 0.42
        },
        {
          maxDistanceForThisTier: Infinity,
          ratePerDistanceUnit: 0.52
        }
      ];

      const { claimableAmount, claimableDistance, currency, distanceUnit } = getTaxClaimableMileage({
        taxType: 'custom',
        kmTravelled: 15122,
        currency: 'BTC',
        distanceUnit: 'earth to moon hops',
        rateTiers
      });
      expect(claimableAmount).toEqual(7063.4400000000005);
      expect(claimableDistance).toEqual(15122);
      expect(currency).toEqual('BTC');
      expect(distanceUnit).toEqual('earth to moon hops');
    });
  });

  describe('unsupported', () => {
    test('should return null', () => {
      const taxType = 'unsupported' as any;
      const result = getTaxClaimableMileage({
        taxType,
        kmTravelled: 100
      });
      expect(result).toEqual(null);
    });
  });
});
