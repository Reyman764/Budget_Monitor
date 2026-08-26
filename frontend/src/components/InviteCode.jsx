import { useState } from 'react';
import Button from './ui/Button';
import { CheckIcon, CopyIcon, HouseholdIcon } from './icons';

/**
 * The code that lets a partner join the household. It used to be plain text you
 * had to select by hand; now it's one tap to copy, which is the only thing
 * anyone ever wants to do with it.
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
    <div
      className={`card flex flex-wrap items-center justify-between gap-4 px-5 py-4 ${className}`}
    >
      <div className="flex items-center gap-3.5">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-sage-soft text-sage">
          <HouseholdIcon className="h-[1.15rem] w-[1.15rem]" />
        </span>
        <div>
          <p className="eyebrow">Invite code</p>
          <p className="tnum font-display mt-0.5 text-[1.125rem] font-semibold tracking-[0.16em] text-ink">
            {code}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <p className="hidden max-w-[16rem] text-[0.8125rem] leading-snug text-ink-mute sm:block">
          Share it with the person you budget with — they'll land in this household.
        </p>
        <Button variant="secondary" size="sm" onClick={copy}>
          {copied ? <CheckIcon className="h-4 w-4 text-moss" /> : <CopyIcon className="h-4 w-4" />}
          {copied ? 'Copied' : 'Copy'}
        </Button>
      </div>
    </div>
  );
}
