"use client";

import { useEffect, useRef, useState } from "react";

type Props = {
  family: string;
  weight?: number;
  text: string;
  className?: string;
};

export function LazySpecimen({ family, weight = 400, text, className }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(false);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    if (typeof IntersectionObserver === "undefined") {
      setActive(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          setActive(true);
          observer.disconnect();
        }
      },
      { rootMargin: "250px 0px" }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!active) return;
    let cancelled = false;

    document.fonts
      ?.load(`${weight} 1em '${family}'`)
      .then(() => {
        if (!cancelled) setLoaded(true);
      })
      .catch(() => {
        if (!cancelled) setLoaded(true);
      });

    return () => {
      cancelled = true;
    };
  }, [active, family, weight]);

  return (
    <div
      ref={ref}
      className={className}
      style={{
        fontFamily: active ? `'${family}', serif` : undefined,
        fontWeight: weight,
        opacity: loaded ? 1 : 0,
        transition: "opacity 250ms ease",
      }}
    >
      {text}
    </div>
  );
}
