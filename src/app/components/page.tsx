"use client"

import { useState, useMemo, type ReactNode } from "react"
import dynamic from "next/dynamic"
import { componentRegistry, type ComponentConfig } from "@/lib/component-registry"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

const Alert = dynamic(() => import("@/components/ui/alert").then(mod => {
  const AlertComponent = ({ children, ...props }: React.ComponentPropsWithoutRef<typeof mod.Alert>) => (
    <mod.Alert {...props}>{children}</mod.Alert>
  )
  AlertComponent.displayName = "Alert"
  return AlertComponent
}))

function ComponentPreview({ config }: { config: ComponentConfig }) {
  const [selectedVariants, setSelectedVariants] = useState<Record<string, string>>({})

  const handleVariantChange = (variantKey: string, value: string) => {
    setSelectedVariants(prev => ({ ...prev, [variantKey]: value }))
  }

  const renderComponent = (): ReactNode => {
    const { name, variants = {}, defaultChildren } = config
    
    switch (name) {
      case "Button":
        return (
          <div className="flex flex-wrap gap-2">
            {(variants.size || []).map(size => (
              <div key={size} className="flex flex-col gap-2 items-center">
                <span className="text-xs text-muted-foreground mb-1">{size}</span>
                {(variants.variant || []).map(variant => (
                  <Button
                    key={variant}
                    variant={variant as React.ComponentProps<typeof Button>["variant"]}
                    size={size as React.ComponentProps<typeof Button>["size"]}
                    onClick={() => {}}
                  >
                    {defaultChildren}
                  </Button>
                ))}
              </div>
            ))}
          </div>
        )
      
      case "Input":
        return (
          <div className="space-y-4 w-full max-w-sm">
            <Input placeholder="Default input" />
            <Input placeholder="With value" defaultValue="User input" />
            <Input placeholder="Disabled" disabled />
            <Input placeholder="Error state" aria-invalid />
          </div>
        )
      
      case "Card":
        return (
          <Card className="w-full max-w-sm">
            <CardHeader>
              <CardTitle>Card Title</CardTitle>
              <CardDescription>Card description goes here</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm">Card content with some text.</p>
            </CardContent>
          </Card>
        )
      
      case "Alert":
        return (
          <div className="space-y-4 w-full max-w-md">
            <Alert>
              <p>This is a default alert message.</p>
            </Alert>
            <Alert variant="destructive">
              <p>This is a destructive alert message.</p>
            </Alert>
          </div>
        )
      
      case "Badge":
        return (
          <div className="flex flex-wrap gap-2">
            {(variants.variant || []).map(variant => (
              <Badge key={variant} variant={variant as React.ComponentProps<typeof Badge>["variant"]}>
                {defaultChildren}
              </Badge>
            ))}
          </div>
        )
      
      case "Checkbox":
        return (
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Checkbox id="terms" defaultChecked />
              <label htmlFor="terms" className="text-sm">Checked</label>
            </div>
            <div className="flex items-center gap-2">
              <Checkbox id="terms2" />
              <label htmlFor="terms2" className="text-sm">Unchecked</label>
            </div>
            <div className="flex items-center gap-2">
              <Checkbox id="terms3" disabled />
              <label htmlFor="terms3" className="text-sm text-muted-foreground">Disabled</label>
            </div>
          </div>
        )
      
      case "Select":
        return (
          <Select>
            <SelectTrigger>
              <SelectValue placeholder="Select an option" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="option1">Option 1</SelectItem>
              <SelectItem value="option2">Option 2</SelectItem>
              <SelectItem value="option3">Option 3</SelectItem>
            </SelectContent>
          </Select>
        )
      
      case "Dialog":
        return (
          <Dialog>
            <DialogTrigger className="cursor-pointer text-sm text-muted-foreground hover:text-foreground">
              Open Dialog
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Dialog Title</DialogTitle>
                <DialogDescription>
                  This is a dialog description.
                </DialogDescription>
              </DialogHeader>
              <p>Dialog content goes here.</p>
              <DialogFooter>
                <Button variant="outline">Cancel</Button>
                <Button>Confirm</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )
      
      case "Table":
        return (
          <Table>
            <TableCaption>A list of your recent invoices.</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">Invoice</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Amount</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell className="font-medium">INV001</TableCell>
                <TableCell>Paid</TableCell>
                <TableCell>$250.00</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">INV002</TableCell>
                <TableCell>Pending</TableCell>
                <TableCell>$120.00</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        )
      
      case "Tabs":
        return (
          <Tabs defaultValue="account" className="w-[400px]">
            <TabsList>
              <TabsTrigger value="account">Account</TabsTrigger>
              <TabsTrigger value="password">Password</TabsTrigger>
            </TabsList>
            <TabsContent value="account">
              <Card>
                <CardHeader>
                  <CardTitle>Account</CardTitle>
                  <CardDescription>Manage your account settings.</CardDescription>
                </CardHeader>
                <CardContent>
                  <p>Account tab content.</p>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="password">
              <Card>
                <CardHeader>
                  <CardTitle>Password</CardTitle>
                  <CardDescription>Change your password here.</CardDescription>
                </CardHeader>
                <CardContent>
                  <p>Password tab content.</p>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        )
      
      default:
        return <p className="text-muted-foreground">No preview available</p>
    }
  }

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-4">{config.name}</h3>
      <div className="min-h-[200px] flex items-center justify-center border rounded-lg p-4 bg-background">
        {renderComponent()}
      </div>
      
      {Object.keys(config.variants || {}).length > 0 && (
        <div className="mt-4 flex flex-wrap gap-4">
          {Object.entries(config.variants || {}).map(([key, values]) => (
            <div key={key} className="flex flex-col gap-2">
              <span className="text-xs font-medium text-muted-foreground uppercase">{key}</span>
              <div className="flex flex-wrap gap-1">
                {values.map(value => (
                  <Button
                    key={value}
                    variant={selectedVariants[key] === value ? "default" : "outline"}
                    size="sm"
                    onClick={() => handleVariantChange(key, value)}
                  >
                    {value}
                  </Button>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </Card>
  )
}

export default function ComponentsTestPage() {
  const [search, setSearch] = useState("")
  
  const filteredComponents = useMemo(() => {
    if (!search) return componentRegistry
    return componentRegistry.filter(c => 
      c.name.toLowerCase().includes(search.toLowerCase())
    )
  }, [search])

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Component Testing</h1>
          <p className="text-muted-foreground mb-4">
            Preview and test all UI components from the design system
          </p>
          <Input
            placeholder="Search components..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="max-w-sm"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredComponents.map(config => (
            <ComponentPreview key={config.name} config={config} />
          ))}
        </div>

        {filteredComponents.length === 0 && (
          <p className="text-center text-muted-foreground py-8">
            No components found matching &quot;{search}&quot;
          </p>
        )}
      </div>
    </div>
  )
}