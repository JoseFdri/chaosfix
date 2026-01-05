import { forwardRef } from "react";
import * as TabsPrimitive from "@radix-ui/react-tabs";
import { cn } from "../../libs/cn.lib";

export interface TabsProps extends TabsPrimitive.TabsProps {
  className?: string;
}

export const Tabs = forwardRef<React.ElementRef<typeof TabsPrimitive.Root>, TabsProps>(
  ({ className, ...props }, ref) => {
    return <TabsPrimitive.Root ref={ref} className={cn("flex flex-col", className)} {...props} />;
  }
);

Tabs.displayName = "Tabs";

export interface TabsListProps extends TabsPrimitive.TabsListProps {
  className?: string;
}

export const TabsList = forwardRef<React.ElementRef<typeof TabsPrimitive.List>, TabsListProps>(
  ({ className, ...props }, ref) => {
    return (
      <TabsPrimitive.List
        ref={ref}
        className={cn("inline-flex h-9 items-center border-b border-border-default", className)}
        {...props}
      />
    );
  }
);

TabsList.displayName = "TabsList";

export interface TabsTriggerProps extends TabsPrimitive.TabsTriggerProps {
  className?: string;
}

export const TabsTrigger = forwardRef<
  React.ElementRef<typeof TabsPrimitive.Trigger>,
  TabsTriggerProps
>(({ className, ...props }, ref) => {
  return (
    <TabsPrimitive.Trigger
      ref={ref}
      className={cn(
        "inline-flex items-center justify-center whitespace-nowrap px-4 py-2 mb-[-1px]",
        "border-b-2 border-transparent",
        "text-sm font-medium text-text-secondary transition-all duration-150",
        "hover:text-text-primary",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring-focus",
        "disabled:pointer-events-none disabled:opacity-50",
        "data-[state=active]:border-accent-primary data-[state=active]:text-text-primary",
        className
      )}
      {...props}
    />
  );
});

TabsTrigger.displayName = "TabsTrigger";

export interface TabsContentProps extends TabsPrimitive.TabsContentProps {
  className?: string;
}

export const TabsContent = forwardRef<
  React.ElementRef<typeof TabsPrimitive.Content>,
  TabsContentProps
>(({ className, ...props }, ref) => {
  return (
    <TabsPrimitive.Content
      ref={ref}
      className={cn(
        "mt-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring-focus",
        className
      )}
      {...props}
    />
  );
});

TabsContent.displayName = "TabsContent";
