import * as React from "react";
import * as SliderPrimitive from "@radix-ui/react-slider";

import { cn } from "@/lib/utils";

const Slider = React.forwardRef<
  React.ElementRef<typeof SliderPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root>
>(({ className, ...props }, ref) => (
  <SliderPrimitive.Root
    ref={ref}
    className={cn(
      "relative flex w-full touch-none select-none items-center data-[orientation=horizontal]:h-12 data-[orientation=horizontal]:px-2 data-[orientation=vertical]:h-full data-[orientation=vertical]:w-12 data-[orientation=vertical]:py-2",
      className,
    )}
    {...props}
  >
    <SliderPrimitive.Track className="relative h-3 w-full grow overflow-hidden rounded-full bg-primary/15 ring-1 ring-inset ring-primary/30 transition-colors data-[orientation=vertical]:h-full data-[orientation=vertical]:w-3">
      <SliderPrimitive.Range className="absolute h-full bg-primary data-[orientation=vertical]:w-full" />
    </SliderPrimitive.Track>
    <SliderPrimitive.Thumb className="flex h-7 w-7 items-center justify-center rounded-full border-2 border-primary bg-background shadow-lg transition-transform hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background active:scale-110 disabled:pointer-events-none disabled:opacity-50">
      <span className="sr-only">Adjust value</span>
    </SliderPrimitive.Thumb>
  </SliderPrimitive.Root>
));
Slider.displayName = SliderPrimitive.Root.displayName;

export { Slider };
