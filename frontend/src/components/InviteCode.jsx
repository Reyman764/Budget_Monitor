import { useState } from 'react';
import Button from './ui/Button';
import { SectionCard } from './ui/Card';
import { CheckIcon, CopyIcon, HouseholdIcon } from './icons';

/**
 * A fully separate, clearly-labelled section — not a stray card next to
 * whatever else is on the page. It gets the same title-row treatment as
 * every other named section, so on a phone it reads as "this is the invite
 * area" at a glance instead of blending into the content around it.
 *
 * Layout is mobile-first: the code and the copy action stack on narrow
 * screens (nothing is fixed-width, nothing can push off the edge) and sit
 * side by side once there's room.
 */
export default function InviteCode({ code, className = '' }) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard is blocked outside secure contexts — the code is on screen,
      // so there's nothing to recover from.
    }
  };

  return (
    <SectionCard
      title="Invite a partner"
      description="Share this code — whoever enters it lands in this household."
      icon={<HouseholdIcon className="h-[1.15rem] w-[1.15rem]" />}
      className={className}
    >
      <div className="flex flex-col gap-4 rounded-field bg-sunken px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="tnum font-display text-[1.375rem] font-semibold tracking-[0.2em] text-ink sm:text-[1.5rem]">
          {code}
        </p>
        <Button variant="secondary" onClick={copy} className="w-full sm:w-auto">
          {copied ? <CheckIcon className="h-4 w-4 text-moss" /> : <CopyIcon className="h-4 w-4" />}
          {copied ? 'Copied' : 'Copy code'}
        </Button>
      </div>
    </SectionCard>
  );
}
