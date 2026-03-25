export function WordmarkLogo() {
  return (
    <div className="flex flex-col items-start leading-none gap-[3px]">
      <span className="font-heading text-[15px] font-light tracking-[-0.04em] text-ink">
        CAR
      </span>
      <div className="flex items-center gap-1.5">
        <div className="h-px w-7 bg-brand-600" />
        <div className="h-[3px] w-[3px] rounded-full bg-brand-600" />
      </div>
      <span className="font-heading text-[15px] font-extrabold tracking-[-0.04em] text-brand-600">
        FOLIO
      </span>
    </div>
  );
}
