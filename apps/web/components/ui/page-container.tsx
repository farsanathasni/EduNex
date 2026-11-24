import type { HTMLAttributes, ReactNode } from "react";

type PageContainerProps = HTMLAttributes<HTMLDivElement> & {
  children: ReactNode;
};

export default function PageContainer({
  className = "",
  children,
  ...props
}: PageContainerProps) {
  return (
    <div {...props} className={`page-container min-w-0 ${className}`}>
      {children}
    </div>
  );
}
