import { TaxType } from '../src/types';
import { getTaxClaimableMileage } from '../src/index';

describe('getTaxClaimableMileage', () => {
  const TEST_CASES = [
    {
      taxType: 'ATO_non_logbook',
      kmTravelled: 100,
      description: 'small trip under 5000km should claim all mileage',
      expectedResult: {
        claimableAmount: 68,
        claimableDistance: 100,
        currency: 'AUD',
        distanceUnit: 'km'
      }
    },
    {
      taxType: 'ATO_non_logbook',
      kmTravelled: 10000,
      description: 'big trip over 5000km should be capped at 5000km',
      expectedResult: {
        claimableAmount: 3400,
        claimableDistance: 5000,
        currency: 'AUD',
        distanceUnit: 'km'
      }
    },
    {
      taxType: 'IRS',
      kmTravelled: 100,
      description: 'small trip should calculate correctly',
      expectedResult: {
        claimableAmount: 36.039518,
        claimableDistance: 62.137,
        currency: 'USD',
        distanceUnit: 'miles'
      }
    },
    {
      taxType: 'UK_HMRC',
      kmTravelled: 19312.128,
      description: 'trip should calculate correctly',
      expectedResult: {
        claimableAmount: 5000,
        claimableDistance: 12000,
        currency: 'GBP',
        distanceUnit: 'miles'
      }
    },
    {
      taxType: 'Canada_Revenue_Agency',
      kmTravelled: 19312.128,
      description: 'trip should calculate correctly',
      expectedResult: {
        claimableAmount: 10342.30656,
        claimableDistance: 19312.128,
        currency: 'CAD',
        distanceUnit: 'km'
      }
    },
    {
      taxType: 'Germany',
      kmTravelled: 19312.128,
      description: 'trip should calculate correctly',
      expectedResult: {
        claimableAmount: 5793.6384,
        claimableDistance: 19312.128,
        currency: 'EUR',
        distanceUnit: 'km'
      }
    }
  ];

  TEST_CASES.forEach((testCase) => {
    test(`Given that the tax type is ${testCase.taxType} and the distance is ${testCase.kmTravelled}, ${testCase.description}`, () => {
      const result = getTaxClaimableMileage({
        taxType: testCase.taxType as TaxType,
        kmTravelled: testCase.kmTravelled
      });
      expect(result.claimableAmount).toBeCloseTo(testCase.expectedResult.claimableAmount, 2);
      expect(result.claimableDistance).toBeCloseTo(testCase.expectedResult.claimableDistance, 2);
      expect(result.currency).toEqual(testCase.expectedResult.currency);
      expect(result.distanceUnit).toEqual(testCase.expectedResult.distanceUnit);
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
