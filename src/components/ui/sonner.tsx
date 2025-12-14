import React from "react";
import { Toaster as Sonner } from "sonner"

type ToasterProps = React.ComponentProps<typeof Sonner>

const Toaster = ({ ...props }: ToasterProps) => {
  return (
    <Sonner
      theme="dark"
      className="toaster group"
      toastOptions={{
        classNames: {
          toast:
            "group toast group-[.toaster]:bg-neutral group-[.toaster]:text-foreground group-[.toaster]:border-neutral-light group-[.toaster]:shadow-lg",
          description: "group-[.toast]:text-foreground/80",
          actionButton:
            "group-[.toast]:bg-primary group-[.toast]:text-background",
          cancelButton:
            "group-[.toast]:bg-neutral-light group-[.toast]:text-foreground/80",
        },
      }}
      {...props}
    />
  )
}

export { Toaster }
