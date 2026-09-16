import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from "react";

import { cn } from "@/lib/utils";

type ButtonVariant = "default" | "outline" | "light" | "outlineLight";
type ButtonSize = "default" | "small";

interface ButtonBaseProps {
  children: ReactNode;
  className?: string;
  size?: ButtonSize;
  variant?: ButtonVariant;
}

type ButtonProps = ButtonBaseProps &
  (
    | (ButtonHTMLAttributes<HTMLButtonElement> & { href?: never })
    | (AnchorHTMLAttributes<HTMLAnchorElement> & { href: string })
  );

const variantClasses: Record<ButtonVariant, string> = {
  default: "button-primary",
  outline: "button-secondary",
  light: "button-light",
  outlineLight: "button-outline-light",
};

// Provides the shared shadcn-style button primitive for actions and links.
export function Button({ children, className, size = "default", variant = "default", ...props }: ButtonProps) {
  const classes = cn("button", variantClasses[variant], size === "small" && "button-small", className);

  if ("href" in props) {
    const anchorProps = props as AnchorHTMLAttributes<HTMLAnchorElement> & { href: string };
    return <a className={classes} {...anchorProps}>{children}</a>;
  }

  const buttonProps = props as ButtonHTMLAttributes<HTMLButtonElement>;
  return <button className={classes} {...buttonProps}>{children}</button>;
}
