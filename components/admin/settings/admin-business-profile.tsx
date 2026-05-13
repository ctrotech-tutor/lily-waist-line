"use client";

import { useState } from "react";
import { Building, Mail, Phone, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function AdminBusinessProfile() {
  const [storeName, setStoreName] = useState("Lily Waist Line");
  const [brandEmail, setBrandEmail] = useState("contact@lilywaistline.com");
  const [supportContact, setSupportContact] = useState("+1 (555) 123-4567");

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Building className="h-5 w-5" />
          Business Profile
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid gap-2">
          <Label htmlFor="store-name">Store Name</Label>
          <Input
            id="store-name"
            value={storeName}
            onChange={(e) => setStoreName(e.target.value)}
            placeholder="Enter store name"
          />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="brand-email">Brand Email</Label>
          <Input
            id="brand-email"
            type="email"
            value={brandEmail}
            onChange={(e) => setBrandEmail(e.target.value)}
            placeholder="Enter brand email"
          />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="support-contact">Support Contact</Label>
          <Input
            id="support-contact"
            value={supportContact}
            onChange={(e) => setSupportContact(e.target.value)}
            placeholder="Enter support phone number"
          />
        </div>

        <div className="grid gap-2">
          <Label>Business Logo</Label>
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-none border border-border">
              <Building className="h-8 w-8 text-muted-foreground" />
            </div>
            <div className="flex-1">
              <Button variant="outline" className="w-full">
                <Upload className="mr-2 h-4 w-4" />
                Upload Logo
              </Button>
              <p className="mt-1 text-xs text-muted-foreground">
                Recommended: Square image, at least 200x200px
              </p>
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <Button>Save Changes</Button>
        </div>
      </CardContent>
    </Card>
  );
}
