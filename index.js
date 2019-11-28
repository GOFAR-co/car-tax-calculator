const KM_TO_MILES_CONVERSION_RATE = 0.621371;

const getClaimableAmountWithTieredRates = (distanceTravelled, rateTiers) => {
  return rateTiers.reduce(
    (totalData, rateTier) => {
      const remainingUncalculatedDistance =
        distanceTravelled - totalData.claimableDistance;
      const distanceToUseInThisTier = Math.min(
        rateTier.maxDistanceForThisTier,
        remainingUncalculatedDistance
      );
      const amountForThisTier =
        distanceToUseInThisTier * rateTier.ratePerDistanceUnit;

      return {
        claimableDistance: totalData.claimableDistance + distanceToUseInThisTier,
        claimableAmount: totalData.claimableAmount + amountForThisTier
      };
    },
    {
      claimableDistance: 0,
      claimableAmount: 0
    }
  );
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

  const { claimableAmount, claimableDistance } = getClaimableAmountWithTieredRates(kmTravelled, RATE_TIERS);
  return {
    claimableAmount,
    claimableDistance,
    currency: "AUD",
    distanceUnit: "km"
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
  const { claimableAmount, claimableDistance } = getClaimableAmountWithTieredRates(milesTravelled, RATE_TIERS);
  return {
    claimableAmount,
    claimableDistance,
    currency: "USD",
    distanceUnit: "miles"
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

  const { claimableAmount, claimableDistance } = getClaimableAmountWithTieredRates(milesTravelled, RATE_TIERS);
  return {
    claimableAmount,
    claimableDistance,
    currency: "GBP",
    distanceUnit: "miles"
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

  const { claimableAmount, claimableDistance } = getClaimableAmountWithTieredRates(kmTravelled, RATE_TIERS);
  return {
    claimableAmount,
    claimableDistance,
    currency: "CAD",
    distanceUnit: "km"
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

  const { claimableAmount, claimableDistance } = getClaimableAmountWithTieredRates(kmTravelled, RATE_TIERS);
  return {
    claimableAmount,
    claimableDistance,
    currency: "EUR",
    distanceUnit: 'km'
  };
};

const getClaimableAmountCustom = (kmTravelled, rateTiers, currency, distanceUnit) => {
  const {
    claimableAmount,
    claimableDistance
  } = getClaimableAmountWithTieredRates(kmTravelled, rateTiers);

  return {
    claimableAmount,
    claimableDistance,
    currency,
    distanceUnit
  };
};

const getTaxClaimableMileage = ({ taxType, kmTravelled, rateTiers, currency, distanceUnit }) => {
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
    case "custom":
      return getClaimableAmountCustom(kmTravelled, rateTiers, currency, distanceUnit);
    default:
      return null;
  }
}

module.exports = {
  getTaxClaimableMileage
};



