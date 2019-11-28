const KM_TO_MILES_CONVERSION_RATE = 0.621371;

const getClaimableAmountWithTieredRates = (distanceTravelled, rateTiers) => {
  const { totalAmount } = rateTiers.reduce(
    (totalData, rateTier) => {
      const remainingUncalculatedDistance =
        distanceTravelled - totalData.distanceUsed;
      const distanceToUseInThisTier = Math.min(
        rateTier.maxDistanceForThisTier,
        remainingUncalculatedDistance
      );
      const amountForThisTier =
        distanceToUseInThisTier * rateTier.ratePerDistanceUnit;

      return {
        distanceUsed: totalData.distanceUsed + distanceToUseInThisTier,
        totalAmount: totalData.totalAmount + amountForThisTier
      };
    },
    {
      distanceUsed: 0,
      totalAmount: 0
    }
  );

  return totalAmount;
};

const getClaimableAmountATONonLogbook = (kmTravelled) => {
  // NB if you don't provide a logbook, the ATO limits you to claiming 5000km per year
  // See https://www.ato.gov.au/individuals/income-and-deductions/deductions-you-can-claim/vehicle-and-travel-expenses/car-expenses/

  const RATE_TIERS = [
    {
      maxDistanceForThisTier: 5000,
      ratePerDistanceUnit: 0.68
    }
  ];

  const amount = getClaimableAmountWithTieredRates(kmTravelled, RATE_TIERS);
  return {
    amount,
    currency: 'AUD'
  };
}

const getClaimableAmountIRS = (kmTravelled) => {
  // Source: https://www.irs.gov/tax-professionals/standard-mileage-rates

  const RATE_TIERS = [
    {
      maxDistanceForThisTier: Infinity,
      ratePerDistanceUnit: 0.58
    }
  ];

  const milesTravelled = kmTravelled * KM_TO_MILES_CONVERSION_RATE;
  const amount = getClaimableAmountWithTieredRates(milesTravelled, RATE_TIERS);
  return {
    amount,
    currency: "USD"
  };
}

const getClaimableAmountUKHMRC = (kmTravelled) => {
  const milesTravelled = kmTravelled * KM_TO_MILES_CONVERSION_RATE;
  // https://www.gov.uk/expenses-and-benefits-business-travel-mileage/rules-for-tax
  const RATE_TIERS = [
    {
      maxDistanceForThisTier: 10000,
      ratePerDistanceUnit: 0.45
    },
    {
      maxDistanceForThisTier: Infinity,
      ratePerDistanceUnit: 0.25
    }
  ];

  const amount = getClaimableAmountWithTieredRates(milesTravelled, RATE_TIERS);
  return {
    amount,
    currency: "GBP"
  };
}

const getClaimableAmountCanadaRevenueAgency = (kmTravelled) => {
  // https://www.canada.ca/en/revenue-agency/services/tax/businesses/topics/payroll/benefits-allowances/automobile/automobile-motor-vehicle-allowances/automobile-allowance-rates.html

  const RATE_TIERS = [
    {
      maxDistanceForThisTier: 5000,
      ratePerDistanceUnit: 0.58
    },
    {
      maxDistanceForThisTier: Infinity,
      ratePerDistanceUnit: 0.52
    }
  ];

  const amount = getClaimableAmountWithTieredRates(kmTravelled, RATE_TIERS);
  return {
    amount,
    currency: "CAD"
  };
}

const getClaimableAmountGermany = kmTravelled => {
  // https://www.eurodev.com/wp-content/uploads/2019/05/hea-5c-20surgic_38993149.pdf

  const RATE_TIERS = [
    {
      maxDistanceForThisTier: Infinity,
      ratePerDistanceUnit: 0.3
    }
  ];

  const amount = getClaimableAmountWithTieredRates(kmTravelled, RATE_TIERS);
  return {
    amount,
    currency: "EUR"
  };
};

const getClaimableAmountInCurrency = (taxType, kmTravelled) => {
  switch (taxType) {
    case "ATO_non_logbook":
      return getClaimableAmountATONonLogbook(kmTravelled);
    case "IRS":
      return getClaimableAmountIRS(kmTravelled)
    case "UK_HMRC":
      return getClaimableAmountUKHMRC(kmTravelled);
    case "Canada_Revenue_Agency":
      return getClaimableAmountCanadaRevenueAgency(kmTravelled);
    case "Germany":
      return getClaimableAmountGermany(kmTravelled);
    default:
      return null;
  }
}

module.exports = {
  getClaimableAmountInCurrency
};



