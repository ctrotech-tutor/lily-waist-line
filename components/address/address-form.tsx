"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useForm, type Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { ROUTES } from "@/lib/constants/routes";
import { Label } from "@/components/ui/label";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { AddressData } from "./address-card";
import { Loader2, Check, MapPin, ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";
import { createAddress, updateAddress } from "@/server/actions/address";
import { createAddressSchema, type UpdateAddressInput } from "@/lib/validators/address";
import { z } from "zod";

interface AddressFormProps {
  mode: "create" | "edit";
  initialData?: Partial<AddressData>;
  onSubmit?: (data: AddressData) => void;
  onCancel?: () => void;
  className?: string;
  redirectTo?: string;
}

const addressFormSchema = createAddressSchema.extend({
  id: z.string().optional(),
});

type AddressFormValues = z.infer<typeof addressFormSchema>;

export function AddressForm({
  mode,
  initialData,
  onSubmit,
  onCancel,
  className,
  redirectTo,
}: AddressFormProps) {
  const router = useRouter();
  const isEditMode = mode === "edit";
  const pageTitle = isEditMode ? "Edit Address" : "Add New Address";
  const pageSubtitle = isEditMode
    ? "Update your delivery address information"
    : "Enter your delivery address for seamless order fulfillment";

  const form = useForm<AddressFormValues>({
    resolver: zodResolver(addressFormSchema) as Resolver<AddressFormValues>,
    defaultValues: {
      id: initialData?.id || "",
      firstName: initialData?.firstName || "",
      lastName: initialData?.lastName || "",
      company: initialData?.company || "",
      addressLine1: initialData?.addressLine1 || "",
      addressLine2: initialData?.addressLine2 || "",
      city: initialData?.city || "",
      state: initialData?.state || "",
      postalCode: initialData?.postalCode || "",
      country: initialData?.country || "United States",
      phone: initialData?.phone || "",
      isDefault: initialData?.isDefault || false,
    },
  });

  const {
    handleSubmit,
    watch,
    setValue,
    formState: { isSubmitting },
  } = form;

  const isDefault = watch("isDefault"); // eslint-disable-line react-hooks/incompatible-library

  const onSubmitForm = async (values: AddressFormValues) => {
    try {
      let result;
      if (isEditMode) {
        if (!values.id) {
          toast.error("Address ID is missing");
          return;
        }
        result = await updateAddress(values as UpdateAddressInput);
      } else {
        const { id, ...createData } = values;
        void id;
        result = await createAddress(createData);
      }

      if (result.success) {
        onSubmit?.(values as AddressData);
        toast.success(isEditMode ? "Address updated" : "Address added");
        if (redirectTo) {
          router.push(redirectTo);
        } else if (onCancel) {
          onCancel();
        } else {
          router.push(ROUTES.ADDRESS);
        }
      } else {
        toast.error(result.error || "Failed to save address");
      }
    } catch (err) {
      console.error("Form submission error:", err);
      toast.error("An unexpected error occurred. Please try again.");
    }
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
        <button
          onClick={handleCancel}
          className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors mb-6 group"
        >
          <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
          <span className="font-sans text-xs uppercase tracking-wider font-semibold">
            Back to Addresses
          </span>
        </button>

        <div className="flex items-start gap-4">
          <div className="shrink-0">
            <div className="w-12 h-12 border border-primary/30 flex items-center justify-center bg-primary/5">
              <MapPin className="w-5 h-5 text-primary" />
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

        <div className="w-16 h-px bg-primary mt-6" />
      </div>

      {/* Form Card */}
      <Card className="border border-border bg-card p-6 sm:p-8 md:p-10">
        <Form {...form}>
          <form onSubmit={handleSubmit(onSubmitForm)} className="space-y-8">
            {/* Personal Information Section */}
            <div className="space-y-6">
              <div className="flex items-center gap-3 pb-2 border-b border-border/50">
                <div className="w-1.5 h-1.5 bg-primary" />
                <h2 className="font-sans text-xs uppercase tracking-[0.15em] text-muted-foreground font-semibold">
                  Personal Information
                </h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-6">
                <FormField
                  name="firstName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-sans text-xs uppercase tracking-wider text-muted-foreground">
                        First Name
                      </FormLabel>
                      <FormControl>
                        <Input placeholder="John" autoComplete="given-name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField

                  name="lastName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-sans text-xs uppercase tracking-wider text-muted-foreground">
                        Last Name
                      </FormLabel>
                      <FormControl>
                        <Input placeholder="Doe" autoComplete="family-name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                name="company"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-sans text-xs uppercase tracking-wider text-muted-foreground">
                      Company (Optional)
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="Company name" autoComplete="organization" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Address Information Section */}
            <div className="space-y-6 pt-2">
              <div className="flex items-center gap-3 pb-2 border-b border-border/50">
                <div className="w-1.5 h-1.5 bg-primary" />
                <h2 className="font-sans text-xs uppercase tracking-[0.15em] text-muted-foreground font-semibold">
                  Address Information
                </h2>
              </div>

              <FormField
                name="addressLine1"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-sans text-xs uppercase tracking-wider text-muted-foreground">
                      Address Line 1
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="123 Main Street" autoComplete="address-line1" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                name="addressLine2"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-sans text-xs uppercase tracking-wider text-muted-foreground">
                      Address Line 2 (Optional)
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="Apt, Suite, etc." autoComplete="address-line2" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-6">
                <FormField

                  name="city"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-sans text-xs uppercase tracking-wider text-muted-foreground">
                        City
                      </FormLabel>
                      <FormControl>
                        <Input placeholder="New York" autoComplete="address-level2" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField

                  name="state"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-sans text-xs uppercase tracking-wider text-muted-foreground">
                        State / Province
                      </FormLabel>
                      <FormControl>
                        <Input placeholder="NY" autoComplete="address-level1" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-6">
                <FormField

                  name="postalCode"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-sans text-xs uppercase tracking-wider text-muted-foreground">
                        Postal Code
                      </FormLabel>
                      <FormControl>
                        <Input placeholder="10001" autoComplete="postal-code" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField

                  name="country"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-sans text-xs uppercase tracking-wider text-muted-foreground">
                        Country
                      </FormLabel>
                      <FormControl>
                        <Input placeholder="United States" autoComplete="country-name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Contact Section */}
            <div className="space-y-6 pt-2">
              <div className="flex items-center gap-3 pb-2 border-b border-border/50">
                <div className="w-1.5 h-1.5 bg-primary" />
                <h2 className="font-sans text-xs uppercase tracking-[0.15em] text-muted-foreground font-semibold">
                  Contact Information
                </h2>
              </div>

              <FormField
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-sans text-xs uppercase tracking-wider text-muted-foreground">
                      Phone Number (Optional)
                    </FormLabel>
                    <FormControl>
                      <Input type="tel" placeholder="+1 (555) 123-4567" autoComplete="tel" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Default Address Toggle */}
            <div className="flex items-start gap-3 pt-4 pb-2">
              <Checkbox
                id="isDefault"
                checked={isDefault}
                onCheckedChange={(checked) => setValue("isDefault", checked as boolean)}
                className="mt-0.5 border-border data-[state=checked]:bg-primary data-[state=checked]:border-primary data-[state=checked]:text-primary-foreground"
              />
              <div className="space-y-1">
                <Label
                  htmlFor="isDefault"
                  className="font-sans text-sm font-medium text-foreground cursor-pointer"
                >
                  Set as default shipping address
                </Label>
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
                className="flex-1 sm:flex-none sm:min-w-50 bg-primary text-primary-foreground hover:bg-primary/90 text-xs uppercase tracking-wider py-3 h-auto transition-all duration-300 flex justify-center items-center gap-2 font-semibold"
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
                className="flex-1 sm:flex-none sm:min-w-50 text-xs uppercase tracking-wider py-3 h-auto border-border hover:border-primary hover:text-primary transition-colors font-semibold"
              >
                Cancel
              </Button>
            </div>
          </form>
        </Form>
      </Card>
    </div>
  );
}