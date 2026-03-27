import React from "react";

interface SpanProps {
    text: string,
    font?: 'sm' | 'md' | 'lg' | 'xl',
}

function Span({text, font = 'md'}: SpanProps) {
  const fontSizes = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg',
    xl: 'text-xl',
  };

  return (
    <div className="relative text-center mb-4">
      <span className={`relative z-10 bg-background px-4 text-foreground font-medium ${fontSizes[font]}`}>
        {text}
      </span>
    </div>
  );
}

export default Span;
