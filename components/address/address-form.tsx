"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { AddressData } from "./address-card";
import { Loader2, Check, MapPin, ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";

interface AddressFormProps {
  mode: "create" | "edit";
  initialData?: Partial<AddressData>;
  onSubmit?: (data: AddressData) => void;
  onCancel?: () => void;
  className?: string;
}

// Form field component with floating label pattern
interface FormFieldProps {
  id: string;
  label: string;
  type?: string;
  required?: boolean;
  defaultValue?: string;
  placeholder?: string;
  autoComplete?: string;
}

function FormField({
  id,
  label,
  type = "text",
  required = false,
  defaultValue = "",
  placeholder,
  autoComplete,
}: FormFieldProps) {
  return (
    <div className="relative w-full group">
      <input
        id={id}
        name={id}
        type={type}
        required={required}
        defaultValue={defaultValue}
        placeholder={placeholder || " "}
        autoComplete={autoComplete}
        className={cn(
          "peer w-full border-0 border-b border-border bg-transparent py-3 px-0 text-[14px] md:text-[15px] rounded-none",
          "focus:border-[#d4af37] focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0 focus:outline-none",
          "placeholder-transparent transition-colors",
          "text-foreground"
        )}
      />
      <label
        htmlFor={id}
        className={cn(
          "absolute left-0 top-3 -translate-y-6 text-[10px] md:text-[11px] text-muted-foreground uppercase tracking-[0.15em] transition-all",
          "peer-placeholder-shown:translate-y-0 peer-placeholder-shown:text-[14px] md:peer-placeholder-shown:text-[15px] peer-placeholder-shown:normal-case peer-placeholder-shown:tracking-normal peer-placeholder-shown:text-muted-foreground/70",
          "peer-focus:-translate-y-6 peer-focus:text-[10px] md:peer-focus:text-[11px] peer-focus:text-[#d4af37] peer-focus:uppercase peer-focus:tracking-[0.15em]",
          required && "after:content-['*'] after:ml-1 after:text-destructive",
          "cursor-text font-sans font-semibold pointer-events-none"
        )}
      >
        {label}
      </label>
      {/* Bottom border highlight on focus */}
      <div className="absolute bottom-0 left-0 w-0 h-[1px] bg-[#d4af37] transition-all duration-300 peer-focus:w-full" />
    </div>
  );
}

export function AddressForm({
  mode,
  initialData,
  onSubmit,
  onCancel,
  className,
}: AddressFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDefault, setIsDefault] = useState(initialData?.isDefault || false);
  const [showSuccess, setShowSuccess] = useState(false);

  const isEditMode = mode === "edit";
  const pageTitle = isEditMode ? "Edit Address" : "Add New Address";
  const pageSubtitle = isEditMode
    ? "Update your delivery address information"
    : "Enter your delivery address for seamless order fulfillment";

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate form submission delay
    await new Promise((resolve) => setTimeout(resolve, 800));

    // Build address data from form - use e.target which is the form element
    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);
    const addressData: AddressData = {
      id: initialData?.id || "temp-id",
      firstName: formData.get("firstName") as string,
      lastName: formData.get("lastName") as string,
      company: (formData.get("company") as string) || undefined,
      addressLine1: formData.get("addressLine1") as string,
      addressLine2: (formData.get("addressLine2") as string) || undefined,
      city: formData.get("city") as string,
      state: (formData.get("state") as string) || "",
      postalCode: formData.get("postalCode") as string,
      country: formData.get("country") as string,
      phone: (formData.get("phone") as string) || "",
      isDefault,
    };

    // Call onSubmit callback if provided
    onSubmit?.(addressData);

    // Show success state
    setIsSubmitting(false);
    setShowSuccess(true);

    // Hide success after 2 seconds and navigate back
    setTimeout(() => {
      setShowSuccess(false);
      if (onCancel) {
        onCancel();
      } else {
        router.push("/address");
      }
    }, 2000);
  };

  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    } else {
      router.push("/address");
    }
  };

  return (
    <div className={cn("w-full max-w-3xl mx-auto", className)}>
      {/* Page Header */}
      <div className="mb-8 md:mb-12">
        {/* Back Link */}
        <button
          onClick={handleCancel}
          className="flex items-center gap-2 text-muted-foreground hover:text-[#d4af37] transition-colors mb-6 group"
        >
          <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
          <span className="font-sans text-xs uppercase tracking-wider font-semibold">
            Back to Addresses
          </span>
        </button>

        {/* Title Section */}
        <div className="flex items-start gap-4">
          <div className="shrink-0">
            <div className="w-12 h-12 border border-[#d4af37]/30 flex items-center justify-center bg-[#d4af37]/5">
              <MapPin className="w-5 h-5 text-[#d4af37]" />
            </div>
          </div>
          <div>
            <h1 className="font-heading text-2xl sm:text-3xl md:text-4xl text-foreground leading-tight mb-2">
              {pageTitle}
            </h1>
            <p className="text-muted-foreground text-sm md:text-base leading-relaxed max-w-lg">
              {pageSubtitle}
            </p>
          </div>
        </div>

        {/* Gold Divider */}
        <div className="w-16 h-px bg-[#d4af37] mt-6" />
      </div>

      {/* Form Card */}
      <Card className="border border-border bg-card p-6 sm:p-8 md:p-10">
        {showSuccess ? (
          /* Success State */
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="w-16 h-16 border border-[#d4af37] flex items-center justify-center mb-6">
              <Check className="w-8 h-8 text-[#d4af37]" />
            </div>
            <h2 className="font-heading text-xl md:text-2xl text-foreground mb-2">
              Address Saved
            </h2>
            <p className="text-muted-foreground text-sm">
              Your address has been {isEditMode ? "updated" : "added"} successfully.
            </p>
          </div>
        ) : (
          /* Form */
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Personal Information Section */}
            <div className="space-y-6">
              <div className="flex items-center gap-3 pb-2 border-b border-border/50">
                <div className="w-1.5 h-1.5 bg-[#d4af37]" />
                <h2 className="font-sans text-xs uppercase tracking-[0.15em] text-muted-foreground font-semibold">
                  Personal Information
                </h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-6">
                <FormField
                  id="firstName"
                  label="First Name"
                  required
                  defaultValue={initialData?.firstName}
                  autoComplete="given-name"
                />
                <FormField
                  id="lastName"
                  label="Last Name"
                  required
                  defaultValue={initialData?.lastName}
                  autoComplete="family-name"
                />
              </div>

              <FormField
                id="company"
                label="Company (Optional)"
                defaultValue={initialData?.company}
                autoComplete="organization"
              />
            </div>

            {/* Address Information Section */}
            <div className="space-y-6 pt-2">
              <div className="flex items-center gap-3 pb-2 border-b border-border/50">
                <div className="w-1.5 h-1.5 bg-[#d4af37]" />
                <h2 className="font-sans text-xs uppercase tracking-[0.15em] text-muted-foreground font-semibold">
                  Address Information
                </h2>
              </div>

              <FormField
                id="addressLine1"
                label="Address Line 1"
                required
                defaultValue={initialData?.addressLine1}
                autoComplete="address-line1"
              />

              <FormField
                id="addressLine2"
                label="Address Line 2 (Optional)"
                defaultValue={initialData?.addressLine2}
                autoComplete="address-line2"
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-6">
                <FormField
                  id="city"
                  label="City"
                  required
                  defaultValue={initialData?.city}
                  autoComplete="address-level2"
                />
                <FormField
                  id="state"
                  label="State / Province (Optional)"
                  defaultValue={initialData?.state}
                  autoComplete="address-level1"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-6">
                <FormField
                  id="postalCode"
                  label="Postal Code"
                  type="text"
                  required
                  defaultValue={initialData?.postalCode}
                  autoComplete="postal-code"
                />
                <FormField
                  id="country"
                  label="Country"
                  required
                  defaultValue={initialData?.country || "United States"}
                  autoComplete="country-name"
                />
              </div>
            </div>

            {/* Contact Section */}
            <div className="space-y-6 pt-2">
              <div className="flex items-center gap-3 pb-2 border-b border-border/50">
                <div className="w-1.5 h-1.5 bg-[#d4af37]" />
                <h2 className="font-sans text-xs uppercase tracking-[0.15em] text-muted-foreground font-semibold">
                  Contact Information
                </h2>
              </div>

              <FormField
                id="phone"
                label="Phone Number (Optional)"
                type="tel"
                defaultValue={initialData?.phone}
                autoComplete="tel"
              />
            </div>

            {/* Default Address Toggle */}
            <div className="flex items-start gap-3 pt-4 pb-2">
              <Checkbox
                id="isDefault"
                checked={isDefault}
                onCheckedChange={(checked) => setIsDefault(checked as boolean)}
                className="mt-0.5 border-border data-[state=checked]:bg-[#d4af37] data-[state=checked]:border-[#d4af37] data-[state=checked]:text-black"
              />
              <div className="space-y-1">
                <label
                  htmlFor="isDefault"
                  className="font-sans text-sm font-medium text-foreground cursor-pointer"
                >
                  Set as default shipping address
                </label>
                <p className="font-sans text-xs text-muted-foreground">
                  This address will be used as the default for all future orders
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-border">
              <Button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 sm:flex-none sm:min-w-[200px] bg-[#d4af37] text-black hover:bg-[#d4af37]/90 text-xs uppercase tracking-wider py-3 h-auto rounded-none transition-all duration-300 flex justify-center items-center gap-2 font-semibold"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Check className="w-4 h-4" />
                    Save Address
                  </>
                )}
              </Button>

              <Button
                type="button"
                variant="outline"
                onClick={handleCancel}
                disabled={isSubmitting}
                className="flex-1 sm:flex-none sm:min-w-[140px] text-xs uppercase tracking-wider py-3 h-auto rounded-none border-border hover:border-[#d4af37] hover:text-[#d4af37] transition-colors font-semibold"
              >
                Cancel
              </Button>
            </div>
          </form>
        )}
      </Card>
    </div>
  );
}
