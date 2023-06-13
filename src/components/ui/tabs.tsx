"use client"

import * as React from "react"
import * as TabsPrimitive from "@radix-ui/react-tabs"

import {cn} from "@/lib/utils"

const Tabs = TabsPrimitive.Root

const TabsList = React.forwardRef<
    React.ElementRef<typeof TabsPrimitive.List>,
    React.ComponentPropsWithoutRef<typeof TabsPrimitive.List>
>(({className, ...props}, ref) => (
    <TabsPrimitive.List
        ref={ref}
        className={cn(
            "flex items-center justify-center dark:bg-slate-800",
            className
        )}
        {...props}
    />
))
TabsList.displayName = TabsPrimitive.List.displayName

const TabsTrigger = React.forwardRef<
    React.ElementRef<typeof TabsPrimitive.Trigger>,
    React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger>
>(({className, ...props}, ref) => (
    <TabsPrimitive.Trigger
        className={cn(
            "bz-content flex-1 inline-flex items-center justify-center h-[50px] text-sm font-medium text-slate-500 transition-all " +
            "disabled:pointer-events-none " +
            "disabled:opacity-50 data-[state=active]:border-solid data-[state=active]:border-b-[2px] data-[state=active]:border-blue-500 data-[state=active]:text-blue-500 data-[state=active]:font-bold " +
            "dark:text-slate-200 " +
            "dark:data-[state=active]:bg-slate-900 dark:data-[state=active]:text-slate-100",
            className
        )}
        {...props}
        ref={ref}
    />
))
TabsTrigger.displayName = TabsPrimitive.Trigger.displayName

const TabsContent = React.forwardRef<
    React.ElementRef<typeof TabsPrimitive.Content>,
    React.ComponentPropsWithoutRef<typeof TabsPrimitive.Content>
>(({className, ...props}, ref) => (
    <TabsPrimitive.Content
        className={cn(
            className
        )}
        {...props}
        ref={ref}
    />
))
TabsContent.displayName = TabsPrimitive.Content.displayName

export {Tabs, TabsList, TabsTrigger, TabsContent}
