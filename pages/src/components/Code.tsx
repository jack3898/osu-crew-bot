import type { ReactElement, ReactNode } from "react";

type CodeProps = {
  children: ReactNode;
};

export function Code({ children }: CodeProps): ReactElement {
  return <code className="bg-zinc-700 p-1 rounded-md">{children}</code>;
}
