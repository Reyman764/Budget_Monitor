import Meter from './ui/Meter';

/**
 * Spend (or goal progress) against a target. Thin wrapper over <Meter> so the
 * existing call sites keep working while the colour thresholds live in one
 * place: over 100% clay, over 80% honey, otherwise sage.
 */
export default function BudgetProgressBar({ percentageUsed = 0, size = 'sm', label }) {
  return <Meter percent={percentageUsed} size={size} label={label} />;
}
