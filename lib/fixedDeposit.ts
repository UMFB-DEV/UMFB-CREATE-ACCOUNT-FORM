export const FIXED_DEPOSIT_TENORS = ['90 days', '180 days', '270 days', '360 days'] as const;

export type FixedDepositTenor = (typeof FIXED_DEPOSIT_TENORS)[number];

type RateTier = {
  minimumAmount: number;
  rates: Record<FixedDepositTenor, number>;
};

export const FIXED_DEPOSIT_RATE_TIERS: readonly RateTier[] = [
  { minimumAmount: 500_000, rates: { '90 days': 10, '180 days': 11, '270 days': 12.5, '360 days': 14 } },
  { minimumAmount: 2_000_001, rates: { '90 days': 11, '180 days': 12, '270 days': 13.5, '360 days': 15 } },
  { minimumAmount: 5_000_001, rates: { '90 days': 12, '180 days': 13, '270 days': 14.5, '360 days': 16 } },
  { minimumAmount: 10_000_001, rates: { '90 days': 13, '180 days': 14, '270 days': 15.5, '360 days': 17 } },
  { minimumAmount: 20_000_001, rates: { '90 days': 14, '180 days': 15, '270 days': 16.5, '360 days': 18 } },
  { minimumAmount: 50_000_001, rates: { '90 days': 15, '180 days': 16, '270 days': 17.5, '360 days': 19 } },
];

export function getFixedDepositRate(amount: number, tenor: string): number | null {
  if (!Number.isFinite(amount) || amount < 500_000 || !FIXED_DEPOSIT_TENORS.includes(tenor as FixedDepositTenor)) {
    return null;
  }

  const tier = [...FIXED_DEPOSIT_RATE_TIERS].reverse().find(({ minimumAmount }) => amount >= minimumAmount);
  return tier ? tier.rates[tenor as FixedDepositTenor] : null;
}

export function formatNaira(amount: number): string {
  return new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN', minimumFractionDigits: 2 }).format(amount);
}
