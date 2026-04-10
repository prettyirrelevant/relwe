"use client";

import { useState } from "react";

interface AccordionItem {
  question: string;
  answer: string;
}

interface AccordionProps {
  items: AccordionItem[];
}

export function Accordion({ items }: AccordionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div className="flex flex-col">
      {items.map((item, index) => (
        <div className="border-b border-border" key={index}>
          <button
            onClick={() =>
              setOpenIndex(openIndex === index ? null : index)
            }
            className="w-full flex items-center justify-between py-6 text-left cursor-pointer"
            type="button"
          >
            <span className="font-heading text-[18px] text-text">
              {item.question}
            </span>
            <span className="text-primary text-[24px] ml-4">
              {openIndex === index ? "-" : "+"}
            </span>
          </button>
          {openIndex === index && (
            <div className="pb-6 text-muted leading-relaxed">
              {item.answer}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
