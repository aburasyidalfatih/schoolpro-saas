"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CreditCard, Check } from "lucide-react"

const plans = [
  {
    name: "Gratis",
    price: "Rp 0",
    current: true,
    features: ["1 Pengguna", "100 Data", "Notifikasi In-App"],
  },
  {
    name: "Pro",
    price: "Rp 199.000/bln",
    features: ["10 Pengguna", "Data Tak Terbatas", "Semua Notifikasi", "Export Excel"],
  },
  {
    name: "Enterprise",
    price: "Rp 499.000/bln",
    features: ["Pengguna Tak Terbatas", "Custom Domain", "API Access", "Dukungan Dedicated"],
  },
]

export default function BillingPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Langganan</h1>
        <p className="text-muted-foreground">Kelola paket langganan Anda</p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {plans.map((plan) => (
          <Card key={plan.name} className={plan.current ? "border-primary" : ""}>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                {plan.name}
                {plan.current && (
                  <span className="text-xs bg-primary/10 text-primary rounded-full px-2 py-1">
                    Aktif
                  </span>
                )}
              </CardTitle>
              <CardDescription className="text-2xl font-bold text-foreground">
                {plan.price}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 mb-6">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-center gap-2 text-sm">
                    <Check className="h-4 w-4 text-primary" />
                    {f}
                  </li>
                ))}
              </ul>
              <Button className="w-full" variant={plan.current ? "outline" : "default"} disabled={plan.current}>
                {plan.current ? "Paket Saat Ini" : "Upgrade"}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
