"use client";

import { useCallback, useState, useRef } from "react";
import { Upload, X, FileImage, CheckCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export interface PaymentProofDropzoneProps {
  className?: string;
  paymentMethod?: "cashapp" | "paypal";
}

const ALLOWED_TYPES = ["image/png", "image/jpeg", "image/jpg", "image/webp"];
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

export function PaymentProofDropzone({
  className,
  paymentMethod = "cashapp",
}: PaymentProofDropzoneProps) {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [transactionRef, setTransactionRef] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback((selectedFile: File) => {
    setError(null);

    if (!ALLOWED_TYPES.includes(selectedFile.type)) {
      setError("Please upload an image file (PNG, JPG, JPEG, or WebP)");
      return;
    }

    if (selectedFile.size > MAX_FILE_SIZE) {
      setError("File size must be less than 10MB");
      return;
    }

    setFile(selectedFile);
    const objectUrl = URL.createObjectURL(selectedFile);
    setPreview(objectUrl);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);

      const droppedFile = e.dataTransfer.files[0];
      if (droppedFile) {
        handleFile(droppedFile);
      }
    },
    [handleFile]
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleClick = useCallback(() => {
    inputRef.current?.click();
  }, []);

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const selectedFile = e.target.files?.[0];
      if (selectedFile) {
        handleFile(selectedFile);
      }
    },
    [handleFile]
  );

  const handleRemove = useCallback(() => {
    if (preview) {
      URL.revokeObjectURL(preview);
    }
    setFile(null);
    setPreview(null);
    setError(null);
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  }, [preview]);

  const handleSubmit = useCallback(async () => {
    if (!file) return;

    setIsSubmitting(true);

    // Simulate upload delay (UI only - no actual upload)
    await new Promise((resolve) => setTimeout(resolve, 2000));

    setIsSubmitting(false);
    setIsSuccess(true);
  }, [file]);

  const paymentMethodLabel = paymentMethod === "cashapp" ? "Cash App" : "PayPal";

  if (isSuccess) {
    return (
      <div className={cn("text-center py-8", className)}>
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 flex items-center justify-center border-2 border-[#d4af37]/30 bg-[#d4af37]/10">
            <CheckCircle className="w-8 h-8 text-[#d4af37]" />
          </div>
        </div>
        <h3 className="font-heading text-xl md:text-2xl font-semibold text-foreground mb-3">
          Payment Proof Submitted
        </h3>
        <p className="font-sans text-sm md:text-base text-muted-foreground max-w-sm mx-auto leading-relaxed mb-8">
          Payment proof submitted successfully. Our team will verify your payment shortly.
        </p>
        <Button
          variant="outline"
          className="border-[#d4af37]/50 text-foreground hover:bg-[#d4af37]/10 hover:border-[#d4af37] rounded-none"
          onClick={() => window.location.href = "/orders"}
        >
          Back To Orders
        </Button>
      </div>
    );
  }

  return (
    <div className={cn("space-y-8", className)}>
      {/* Upload Dropzone */}
      <div className="space-y-4">
        {!file ? (
          <div
            onClick={handleClick}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            className={cn(
              "relative cursor-pointer border-2 border-dashed transition-all duration-300",
              "p-8 md:p-12 text-center",
              isDragging
                ? "border-[#d4af37] bg-[#d4af37]/10"
                : "border-border hover:border-[#d4af37]/50 hover:bg-muted/50"
            )}
          >
            <input
              ref={inputRef}
              type="file"
              accept=".png,.jpg,.jpeg,.webp"
              onChange={handleInputChange}
              className="hidden"
            />

            <div className="flex flex-col items-center gap-4">
              <div className="w-12 h-12 flex items-center justify-center border border-[#d4af37]/30 bg-[#d4af37]/10">
                <Upload className="w-6 h-6 text-[#d4af37]" />
              </div>

              <div className="space-y-2">
                <p className="font-sans text-sm md:text-base text-foreground font-medium">
                  Drop your payment screenshot here
                </p>
                <p className="font-sans text-xs md:text-sm text-muted-foreground">
                  or click to browse (PNG, JPG, WebP)
                </p>
              </div>
            </div>
          </div>
        ) : (
          <Card className="border-border bg-card rounded-none overflow-hidden">
            <CardContent className="p-4 md:p-6">
              <div className="flex flex-col md:flex-row gap-4 items-start">
                {/* Preview Image */}
                <div className="relative w-full md:w-32 h-32 shrink-0 border border-border overflow-hidden">
                  {preview && (
                    <img
                      src={preview}
                      alt="Payment proof preview"
                      className="w-full h-full object-cover"
                    />
                  )}
                </div>

                {/* File Info */}
                <div className="flex-1 min-w-0 space-y-2">
                  <div className="flex items-center gap-2">
                    <FileImage className="w-4 h-4 text-[#d4af37]" />
                    <p className="font-sans text-sm text-foreground font-medium truncate">
                      {file.name}
                    </p>
                  </div>
                  <p className="font-sans text-xs text-muted-foreground">
                    {(file.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>

                {/* Remove Button */}
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleRemove}
                  className="shrink-0 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-none"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Error Message */}
        {error && (
          <p className="font-sans text-sm text-destructive text-center">{error}</p>
        )}
      </div>

      {/* Additional Payment Details */}
      {file && (
        <div className="space-y-6">
          {/* Payment Method Display */}
          <div className="space-y-2">
            <Label className="font-sans text-xs uppercase tracking-wider text-muted-foreground">
              Payment Method Used
            </Label>
            <div className="flex items-center gap-3 p-3 border border-border bg-muted/30">
              <Badge
                variant="outline"
                className="rounded-none border-[#d4af37]/50 text-[#d4af37] bg-[#d4af37]/10"
              >
                {paymentMethodLabel}
              </Badge>
              <span className="font-sans text-sm text-muted-foreground">
                Selected at checkout
              </span>
            </div>
          </div>

          {/* Transaction Reference Input */}
          <div className="space-y-2">
            <Label
              htmlFor="transaction-ref"
              className="font-sans text-xs uppercase tracking-wider text-muted-foreground"
            >
              Transaction Reference (Optional)
            </Label>
            <Input
              id="transaction-ref"
              type="text"
              placeholder={`${paymentMethodLabel} transaction ID or reference number`}
              value={transactionRef}
              onChange={(e) => setTransactionRef(e.target.value)}
              className="rounded-none border-0 border-b border-border bg-transparent focus:border-[#d4af37] focus-visible:ring-0 focus-visible:ring-offset-0 placeholder:text-muted-foreground/50"
            />
            <p className="font-sans text-xs text-muted-foreground">
              Adding a reference helps us verify your payment faster
            </p>
          </div>

          {/* Trust Messaging */}
          <div className="p-4 border border-[#d4af37]/20 bg-[#d4af37]/5">
            <p className="font-sans text-sm text-foreground leading-relaxed">
              Your order will be verified manually before shipping begins. Our team typically reviews payment proofs within 24 hours.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <Button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="flex-1 bg-[#d4af37] text-black hover:bg-[#ffd700] rounded-none font-sans font-semibold uppercase tracking-wider disabled:opacity-50"
            >
              {isSubmitting ? (
                <span className="flex items-center gap-2">
                  <svg
                    className="animate-spin h-4 w-4"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Submitting...
                </span>
              ) : (
                "Submit Proof"
              )}
            </Button>

            <Button
              variant="outline"
              onClick={() => window.location.href = "/orders"}
              className="flex-1 border-[#d4af37]/50 text-foreground hover:bg-[#d4af37]/10 hover:border-[#d4af37] rounded-none"
            >
              Back To Orders
            </Button>
          </div>
        </div>
      )}

      {/* Back to Orders - shown when no file */}
      {!file && (
        <div className="text-center pt-4">
          <Button
            variant="outline"
            onClick={() => window.location.href = "/orders"}
            className="border-[#d4af37]/50 text-foreground hover:bg-[#d4af37]/10 hover:border-[#d4af37] rounded-none"
          >
            Back To Orders
          </Button>
        </div>
      )}
    </div>
  );
}
