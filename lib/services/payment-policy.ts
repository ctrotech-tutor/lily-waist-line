export type SupportedPaymentMethod = "CASH_APP" | "PAYPAL";

export interface PaymentMethodConfiguration {
  paymentMethod: SupportedPaymentMethod;
  enabled: boolean;
  cashAppHandle?: string | null;
  paypalEmail?: string | null;
  paypalHandle?: string | null;
}

export interface PaymentDestination {
  recipient: string;
  url: string | null;
}

const UNITED_STATES_NAMES = new Set([
  "us",
  "u.s.",
  "usa",
  "u.s.a.",
  "united states",
  "united states of america",
  "america",
]);

function normalizeCountry(country: string): string {
  return country.trim().toLowerCase().replace(/\s+/g, " ");
}

export function isUnitedStatesCountry(country: string): boolean {
  return UNITED_STATES_NAMES.has(normalizeCountry(country));
}

export function isPaymentMethodAllowedForCountry(
  country: string,
  paymentMethod: SupportedPaymentMethod,
): boolean {
  return paymentMethod === "CASH_APP"
    ? isUnitedStatesCountry(country)
    : !isUnitedStatesCountry(country);
}

function isValidCashAppHandle(handle: string | null | undefined): handle is string {
  return Boolean(handle && /^\$[A-Za-z0-9_]{1,30}$/.test(handle.trim()));
}

function isValidPayPalHandle(handle: string | null | undefined): handle is string {
  return Boolean(handle && /^[A-Za-z0-9._-]{1,50}$/.test(handle.trim()));
}

function isValidEmail(email: string | null | undefined): email is string {
  if (!email) return false;
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

export function getPaymentDestination(
  paymentMethod: SupportedPaymentMethod,
  configuration: PaymentMethodConfiguration | null | undefined,
  amount: number,
): PaymentDestination | null {
  if (!configuration || !configuration.enabled || configuration.paymentMethod !== paymentMethod) {
    return null;
  }

  if (!Number.isFinite(amount) || amount < 0) return null;

  if (paymentMethod === "CASH_APP") {
    if (!isValidCashAppHandle(configuration.cashAppHandle)) return null;
    const recipient = configuration.cashAppHandle.trim();
    return {
      recipient,
      url: `https://cash.app/${encodeURIComponent(recipient.slice(1))}`,
    };
  }

  if (isValidPayPalHandle(configuration.paypalHandle)) {
    const recipient = configuration.paypalHandle.trim();
    return {
      recipient,
      url: `https://www.paypal.me/${encodeURIComponent(recipient)}/${amount.toFixed(2)}`,
    };
  }

  if (isValidEmail(configuration.paypalEmail)) {
    return { recipient: configuration.paypalEmail.trim(), url: null };
  }

  return null;
}

export function getAvailablePaymentMethods(
  country: string,
  configurations: readonly PaymentMethodConfiguration[],
): SupportedPaymentMethod[] {
  return configurations
    .filter((configuration) => isPaymentMethodAllowedForCountry(country, configuration.paymentMethod))
    .filter((configuration) => getPaymentDestination(configuration.paymentMethod, configuration, 0) !== null)
    .map((configuration) => configuration.paymentMethod);
}
