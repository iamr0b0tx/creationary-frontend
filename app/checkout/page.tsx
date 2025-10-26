"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { currency } from "@/lib/utils/currency";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Play, ArrowLeft, Shield, Star, CheckCircle, Gift } from "lucide-react";
import { getProductById, TContentItem } from "@/lib/data/exploreContent";
import { posthog } from "posthog-js";
import { toast } from "sonner";

export type ReferenceObj = {
  message: string;
  reference: string;
  status: "success" | "failure";
  trans: string;
  transaction: string;
  trxref: string;
};

function CheckoutComponent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const productId = searchParams.get("product");

  const [product, setProduct] = useState<TContentItem | null>(null);
  const [success, setSuccess] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    firstName: "",
    lastName: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [currentlySelectedPlan, setCurrentlySelectedPlan] =
    useState<string>("Lifetime");

  useEffect(() => {
    if (productId || !isProcessing) {
      if (!productId) setProduct(null);
      else {
        const productData = getProductById(productId);
        setProduct(productData);
      }
    } else {
      router.push("/explore");
    }
  }, [productId, router, isProcessing]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    setFormData((prev) => ({ ...prev, [name]: value }));

    // Clear errors when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.email) newErrors.email = "Email is required";
    if (!formData.firstName) newErrors.firstName = "First name is required";
    if (!formData.lastName) newErrors.lastName = "Last name is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // PAYSTACKKKKKKKKKKKKKKKKKKKKK

  const onSuccess = (reference: ReferenceObj) => {
    fetch(`/api/verify/${reference.reference}`)
      .then((res) => res.json())
      .then((verifyData) => {
        if (verifyData.data.status === "success") {
          posthog.capture("successfulPayment", {
            verifyData,
            email: formData.email,
            firstName: formData.firstName,
            lastName: formData.lastName,
            amount: product?.price,
          });
          setSuccess(true);
        } else {
          posthog.capture("failedPayment", {
            verifyData,
            email: formData.email,
            firstName: formData.firstName,
            lastName: formData.lastName,
            amount: product?.price,
          });
        }
      });
  };

  const onClose = () => {
    posthog.capture("cancelledPayment", {
      email: formData.email,
      firstName: formData.firstName,
      lastName: formData.lastName,
      amount: product?.price,
    });
    toast("Payment Cancelled", {
      description: "Something went wrong during the payment process.",
      action: {
        label: "Undo",
        onClick: () => console.log("Undo"),
      },
    });
    setIsProcessing(false);
  };

  const handlePaystackPayment = async () => {
    // Validate form first
    if (!validateForm()) return;

    // Dynamically import Paystack only on client-side when needed (I faced this window is not defined issue (SSR issue))
    setIsProcessing(true);
    const Paystack = (await import("@paystack/inline-js")).default;

    const popup = new Paystack();
    popup.checkout({
      key: process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY as string,
      email: formData.email,
      amount: (product?.price ?? 0) * 100, // Paystack expects amount in kobo (minor units)
      reference: new Date().getTime().toString(),
      firstName: formData.firstName,
      lastName: formData.lastName,
      currency: "NGN",
      onSuccess,
      onCancel: onClose,
    });
    // setIsProcessing(false);
  };

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  const savings = product.originalPrice
    ? currency.subtract(product.originalPrice, product.price)
    : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      {/* Header */}
      <header className="border-b bg-background/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <Play className="w-4 h-4 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold">Creationary</span>
          </Link>

          <div className="flex items-center space-x-2">
            <Shield className="w-4 h-4 text-green-600" />
            <span className="text-sm text-muted-foreground">
              Secure Checkout
            </span>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Back button */}
        <Button variant="ghost" className="mb-6" onClick={() => router.back()}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Order Summary */}
          <div className="order-2 lg:order-1">
            <Card>
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex gap-4 mb-6">
                  <img
                    // src={product.thumbnail}
                    src="/default_image.png"
                    alt={product.title}
                    className="w-20 h-20 object-cover rounded-lg"
                  />
                  <div className="flex-1">
                    <h3 className="font-semibold line-clamp-2">
                      {product.title}
                    </h3>
                    <div className="flex items-center gap-2 mt-1">
                      <Avatar className="w-4 h-4">
                        <AvatarImage src={product.creator.avatar} />
                        <AvatarFallback className="text-xs">
                          {product.creator.name
                            .split(" ")
                            .map((n: string) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-sm text-muted-foreground">
                        {product.creator.name}
                      </span>
                      {product.creator.verified && (
                        <CheckCircle className="w-3 h-3 text-blue-500" />
                      )}
                    </div>
                    <div className="flex items-center gap-1 mt-1">
                      <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                      <span className="text-xs">{product.rating}</span>
                      <span className="text-xs text-muted-foreground">
                        ({product.reviews})
                      </span>
                    </div>
                  </div>
                </div>

                <div className="space-y-3 mb-6">
                  <h4 className="font-medium">What&apos;s included:</h4>
                  {product.features.map((feature: string, index: number) => (
                    <div key={index} className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span className="text-sm">{feature}</span>
                    </div>
                  ))}
                </div>

                <div className="border-t pt-4 space-y-2">
                  <div className="flex justify-between">
                    <span>Course price:</span>
                    <span
                      className={
                        product.originalPrice
                          ? "line-through text-muted-foreground"
                          : ""
                      }
                    >
                      ₦{product.originalPrice || product.price}
                    </span>
                  </div>
                  {savings > 0 && (
                    <>
                      <div className="flex justify-between text-green-600">
                        <span>Discount:</span>
                        <span>-₦{savings}</span>
                      </div>
                      <div className="flex justify-between font-semibold text-lg border-t pt-2">
                        <span>Total:</span>
                        <span>₦{product.price}</span>
                      </div>
                    </>
                  )}
                  {!savings && (
                    <div className="flex justify-between font-semibold text-lg border-t pt-2">
                      <span>Total:</span>
                      <span>₦{product.price}</span>
                    </div>
                  )}
                </div>

                {savings > 0 && (
                  <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                    <div className="flex items-center gap-2">
                      <Gift className="w-4 h-4 text-green-600" />
                      <span className="text-sm font-medium text-green-800">
                        You&apos;re saving ₦{savings}!
                      </span>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Payment Form */}
          <div className="order-1 lg:order-2">
            <div>
              <Card>
                <CardHeader>
                  <CardTitle>Payment Details</CardTitle>
                  <CardDescription>
                    Complete your purchase to get instant access
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Contact Information */}
                  <div>
                    <h3 className="font-medium mb-3">Contact Information</h3>
                    <div className="space-y-4">
                      <div>
                        <Input
                          name="email"
                          type="email"
                          placeholder="Email address"
                          value={formData.email}
                          onChange={handleInputChange}
                          className={errors.email ? "border-red-500" : ""}
                        />
                        {errors.email && (
                          <p className="text-sm text-red-500 mt-1">
                            {errors.email}
                          </p>
                        )}
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Input
                            name="firstName"
                            placeholder="First name"
                            value={formData.firstName}
                            onChange={handleInputChange}
                            className={errors.firstName ? "border-red-500" : ""}
                          />
                          {errors.firstName && (
                            <p className="text-sm text-red-500 mt-1">
                              {errors.firstName}
                            </p>
                          )}
                        </div>
                        <div>
                          <Input
                            name="lastName"
                            placeholder="Last name"
                            value={formData.lastName}
                            onChange={handleInputChange}
                            className={errors.lastName ? "border-red-500" : ""}
                          />
                          {errors.lastName && (
                            <p className="text-sm text-red-500 mt-1">
                              {errors.lastName}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Payment Method */}

                  {/* Security Notice */}
                  <div className="flex items-center gap-2 p-3 bg-muted/50 rounded-lg">
                    <Shield className="w-4 h-4 text-green-600" />
                    <span className="text-sm text-muted-foreground">
                      Your payment information is encrypted and secure
                    </span>
                  </div>

                  {/* Pricing Options */}
                  <div>
                    <h3 className="font-medium mb-3">Select Plan</h3>
                    <div className="space-y-3">
                      {[
                        {
                          price: product.price,
                          duration: "Monthly",
                          remark: "Billed monthly, cancel anytime",
                        },
                        {
                          price: Math.round(product.price * 12 * 0.8),
                          duration: "Yearly",
                          remark: "Save 20% with annual billing",
                        },
                        {
                          price: Math.round(product.price * 24),
                          duration: "Lifetime",
                          remark: "One-time payment, access forever",
                        },
                      ].map((plan, index) => (
                        <PriceCard
                          key={index}
                          price={plan.price}
                          duration={plan.duration}
                          remark={plan.remark}
                          currentlySelectedPlan={currentlySelectedPlan}
                          setCurrentlySelectedPlan={setCurrentlySelectedPlan}
                          isRecommended={plan.duration === "Lifetime"}
                        />
                      ))}
                      {/* <label className="flex items-center justify-between p-4 border rounded-lg cursor-pointer hover:bg-muted/50 transition-colors">
                        <div className="flex items-center gap-3">
                          <input
                            type="radio"
                            name="pricingPlan"
                            value="yearly"
                            className="w-4 h-4"
                          />
                          <div>
                            <div className="font-medium">Yearly Access</div>
                            <div className="text-sm text-muted-foreground">
                              Save 20% with annual billing
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-semibold">
                            ₦{Math.round(product.price * 12 * 0.8)}/yr
                          </div>
                          <div className="text-xs text-green-600">Save 20%</div>
                        </div>
                      </label>

                      <label className="flex items-center justify-between p-4 border rounded-lg cursor-pointer hover:bg-muted/50 transition-colors border-primary/50 bg-primary/5">
                        <div className="flex items-center gap-3">
                          <input
                            type="radio"
                            name="pricingPlan"
                            value="lifetime"
                            className="w-4 h-4"
                          />
                          <div>
                            <div className="font-medium flex items-center gap-2">
                              Lifetime Access
                              <span className="text-xs bg-primary text-primary-foreground px-2 py-0.5 rounded-full">
                                Best Value
                              </span>
                            </div>
                            <div className="text-sm text-muted-foreground">
                              One-time payment, access forever
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-semibold">
                            ₦{Math.round(product.price * 24)}
                          </div>
                          <div className="text-xs text-green-600">
                            Best deal
                          </div>
                        </div>
                      </label> */}
                    </div>
                  </div>

                  {/* Submit Button */}
                  <Button
                    // type="submit"
                    size="lg"
                    className="w-full"
                    onClick={handlePaystackPayment}
                    disabled={isProcessing}
                  >
                    {isProcessing ? (
                      <>
                        <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
                        Processing...
                      </>
                    ) : (
                      <>Complete Purchase - ₦{product.price}</>
                    )}
                  </Button>

                  <p className="text-xs text-center text-muted-foreground">
                    By completing your purchase, you agree to our{" "}
                    <Link href="/terms" className="underline">
                      Terms of Service
                    </Link>{" "}
                    and{" "}
                    <Link href="/privacy" className="underline">
                      Privacy Policy
                    </Link>
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <CheckoutComponent />
    </Suspense>
  );
}

type TPriceCardProps = {
  price: number;
  duration: string;
  isRecommended?: boolean;
  remark?: string;
  currentlySelectedPlan: string;
  setCurrentlySelectedPlan: (plan: string) => void;
};

const PriceCard = ({
  price,
  duration,
  isRecommended,
  remark,
  currentlySelectedPlan,
  setCurrentlySelectedPlan,
}: TPriceCardProps) => {
  return (
    <label
      className={`flex items-center justify-between p-4 border rounded-lg cursor-pointer hover:bg-muted/50 ${
        currentlySelectedPlan === duration ? "border-primary/50" : ""
      } transition-colors`}
    >
      <div className="flex items-center gap-3">
        <input
          type="radio"
          name="pricingPlan"
          value="monthly"
          className="w-4 h-4"
          checked={currentlySelectedPlan === duration}
          onClick={() => setCurrentlySelectedPlan(duration)}
        />
        <div>
          <div className="font-medium flex items-center gap-2">
            {duration} Access{" "}
            {isRecommended && (
              <span className="text-xs bg-primary text-primary-foreground px-2 py-0.5 rounded-full">
                Best Value
              </span>
            )}
          </div>
          <div className="text-sm text-muted-foreground">
            {/* Billed monthly, cancel anytime */}
            {remark}
          </div>
        </div>
      </div>
      <div className="text-right">
        <div className="font-semibold">₦{price}/mo</div>
      </div>
    </label>
  );
};

//monthly access
