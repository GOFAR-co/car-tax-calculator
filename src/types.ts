export interface IRateTier {
  maxDistanceForThisTier: number;
  ratePerDistanceUnit: number;
}

export type TaxType = 'ATO_non_logbook' | 'IRS' | 'UK_HMRC' | 'Canada_Revenue_Agency' | 'Germany' | 'custom';

export interface ITaxCalculationParams {
  taxType: TaxType;
  kmTravelled: number;
  rateTiers?: IRateTier[];
  currency?: string;
  distanceUnit?: string;
}

export interface ITaxCalculationResult {
  claimableAmount: number;
  claimableDistance: number;
  currency: string;
  distanceUnit: string;
}
