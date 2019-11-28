# Car Tax Calculations

Little util to calculate claimable cost of car mileage for different jurisdictions.

# Example Usage

```
npm install car-tax-calculations
```

```
const { getTaxClaimableMileage } = require('car-tax-calculations');
const { claimableAmount, claimableDistance, currency, distanceUnit } = getTaxClaimableMileage({ taxType: 'ATO_non_logbook', kmTravelled: 100 });

/* Output:

    {
      claimableAmount: 68,
      claimableDistance: 100,
      currency: 'AUD',
      distanceUnit: 'km'
    }
*/
```

# Parameters

## taxType

| taxType  | Description |
| ------------- | ------------- |
| ATO_non_logbook  | Australian Taxation Office non logbook calculation method (capped at 5000km) |
| IRS  | US Internal Revenue Service |
| Canada_Revenue_Agency  | Canada Revenue Agency |
| Germany  | Mileage claim for Germany |
| UK_HMRC  | UK Her Majesty's Revenue Service |

## kmTravelled

We always use km as the base unit. Sorry fans of miles - we're Australian and that's how we roll.
