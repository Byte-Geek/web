import type { ReactNode } from "react";

type SectionHeadingProps = {
  id: string;
  kicker?: string | null;
  title?: string | null;
  text?: string | null;
  children?: ReactNode;
};

export function SectionHeading({ id, kicker, title, text, children }: SectionHeadingProps) {
  return (
    <div className="mb-8 flex flex-wrap items-end justify-between gap-x-10 gap-y-3">
      <div>
        {kicker && <p className="kicker">{kicker}</p>}
        <h2 id={id} className="heading-1 reveal">
          {title}
        </h2>
      </div>
      {text && <p className="reveal max-w-[44ch] self-start text-[13.5px] text-muted md:mr-[18%]">{text}</p>}
      {children}
    </div>
  );
}
