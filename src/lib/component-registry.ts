import type { ReactNode } from "react"

export interface ComponentConfig {
  name: string;
  importPath: string;
  variants?: Record<string, string[]>;
  defaultChildren?: string;
  preview?: (variant: string, size?: string) => React.ReactNode;
}

function getButtonVariants(): string[] {
  return ['default', 'outline', 'secondary', 'ghost', 'destructive', 'link'];
}

function getButtonSizes(): string[] {
  return ['default', 'xs', 'sm', 'lg', 'icon'];
}

export const componentRegistry: ComponentConfig[] = [
  {
    name: 'Button',
    importPath: '@/components/ui/button',
    variants: {
      variant: getButtonVariants(),
      size: getButtonSizes(),
    },
    defaultChildren: 'Button',
  },
  {
    name: 'Input',
    importPath: '@/components/ui/input',
    variants: {},
    defaultChildren: undefined,
  },
  {
    name: 'Card',
    importPath: '@/components/ui/card',
    variants: {},
    defaultChildren: 'Card Content',
  },
  {
    name: 'Alert',
    importPath: '@/components/ui/alert',
    variants: {
      variant: ['default', 'destructive'],
    },
    defaultChildren: 'This is an alert message',
  },
  {
    name: 'Badge',
    importPath: '@/components/ui/badge',
    variants: {
      variant: ['default', 'secondary', 'outline', 'destructive'],
    },
    defaultChildren: 'Badge',
  },
  {
    name: 'Checkbox',
    importPath: '@/components/ui/checkbox',
    variants: {},
    defaultChildren: 'Remember me',
  },
  {
    name: 'Select',
    importPath: '@/components/ui/select',
    variants: {},
    defaultChildren: 'Select option',
  },
  {
    name: 'Dialog',
    importPath: '@/components/ui/dialog',
    variants: {},
    defaultChildren: 'Open Dialog',
  },
  {
    name: 'Table',
    importPath: '@/components/ui/table',
    variants: {},
    defaultChildren: 'Table Content',
  },
  {
    name: 'Tabs',
    importPath: '@/components/ui/tabs',
    variants: {},
    defaultChildren: 'Tab Content',
  },
];
