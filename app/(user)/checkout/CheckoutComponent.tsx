"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { currency } from "@/lib/utils/currency";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import {
  Play,
  ArrowLeft,
  Shield,
  Star,
  CheckCircle,
  Gift,
  ArrowUp,
  Loader2,
} from "lucide-react";
import { posthog } from "posthog-js";
import { toast } from "sonner";
import Modal from "@/components/modal";
import { TComment, TContentItem, TPriceCardProps } from "@/lib/types/types";
import { addComment } from "../../action/post";

export type ReferenceObj = {
  message: string;
  reference: string;
  status: "success" | "failure";
  trans: string;
  transaction: string;
  trxref: string;
};

export default function CheckoutComponent({
  product,
  comments,
}: {
  product: TContentItem | null;
  comments: TComment | null;
}) {
  const router = useRouter();

  const [success, setSuccess] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    firstName: "",
    lastName: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [currentlySelectedPlan, setCurrentlySelectedPlan] = useState<string>("Lifetime");
  const [commentText, setCommentText] = useState("");

  const [pending, startTransition] = useTransition();

  const addCommentAction = () => {
    startTransition(async () => {
      await addComment(product?._id ?? "", commentText);
      setCommentText("");
      router.refresh();
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
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
      <div className="flex min-h-screen items-center justify-center">
        <div className="border-primary h-8 w-8 animate-spin rounded-full border-b-2"></div>
      </div>
    );
  }

  const savings = product.originalPrice
    ? currency.subtract(product.originalPrice, product.price)
    : 0;

  return (
    <div className="from-background via-background to-muted/20 min-h-screen bg-gradient-to-br">
      {/* Header */}
      <header className="bg-background/80 sticky top-0 z-50 border-b backdrop-blur-sm">
        <div className="container mx-auto flex items-center justify-between px-4 py-4">
          <Link href="/" className="flex items-center space-x-2">
            <div className="bg-primary flex h-8 w-8 items-center justify-center rounded-lg">
              <Play className="text-primary-foreground h-4 w-4" />
            </div>
            <span className="text-xl font-bold">Creationary</span>
          </Link>

          <div className="flex items-center space-x-2">
            <Shield className="h-4 w-4 text-green-600" />
            <span className="text-muted-foreground text-sm">Secure Checkout</span>
          </div>
        </div>
      </header>

      <div className="container mx-auto max-w-6xl px-4 py-8">
        {/* Back button */}
        <Button variant="ghost" className="mb-6" onClick={() => router.back()}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          {/* Order Summary */}
          <div className="order-2 lg:order-1">
            <Card>
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="mb-6 flex gap-4">
                  <img
                    // src={product.thumbnail}
                    src="/default_image.png"
                    alt={product.title}
                    className="h-20 w-20 rounded-lg object-cover"
                  />
                  <div className="flex-1">
                    <h3 className="line-clamp-2 font-semibold">{product.title}</h3>
                    <div className="mt-1 flex items-center gap-2">
                      <Avatar className="h-4 w-4">
                        <AvatarImage src={product.creator.avatar} />
                        <AvatarFallback className="text-xs">
                          {product.creator.name
                            .split(" ")
                            .map((n: string) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-muted-foreground text-sm">{product.creator.name}</span>
                      {product.creator.verified && (
                        <CheckCircle className="h-3 w-3 text-blue-500" />
                      )}
                    </div>
                    <div className="mt-1 flex items-center gap-1">
                      <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                      <span className="text-xs">{product.rating}</span>
                      <span className="text-muted-foreground text-xs">({product.reviews})</span>
                    </div>
                  </div>
                </div>

                <div className="mb-6 space-y-3">
                  <h4 className="font-medium">What&apos;s included:</h4>
                  {product.features.map((feature: string, index: number) => (
                    <div key={index} className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span className="text-sm">{feature}</span>
                    </div>
                  ))}
                </div>

                <div className="space-y-2 border-t pt-4">
                  <div className="flex justify-between">
                    <span>Course price:</span>
                    <span
                      className={product.originalPrice ? "text-muted-foreground line-through" : ""}
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
                      <div className="flex justify-between border-t pt-2 text-lg font-semibold">
                        <span>Total:</span>
                        <span>₦{product.price}</span>
                      </div>
                    </>
                  )}
                  {!savings && (
                    <div className="flex justify-between border-t pt-2 text-lg font-semibold">
                      <span>Total:</span>
                      <span>₦{product.price}</span>
                    </div>
                  )}
                </div>

                {savings > 0 && (
                  <div className="mt-4 rounded-lg border border-green-200 bg-green-50 p-3">
                    <div className="flex items-center gap-2">
                      <Gift className="h-4 w-4 text-green-600" />
                      <span className="text-sm font-medium text-green-800">
                        You&apos;re saving ₦{savings}!
                      </span>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
            <div className="mt-5 rounded-xl border p-4">
              <header className="mb-4 border-b py-2 text-xl font-medium">Comments</header>
              {comments && comments.list.length > 0 ? (
                comments.list.map((comment, index) => (
                  <Comment
                    key={index}
                    authorName={"Anonymous User"}
                    authorUrl={"/placeholder.png"}
                    text={comment.content}
                  />
                ))
              ) : (
                <p className="text-muted-foreground text-sm">No comments yet.</p>
              )}
              {/* <Comment authorName="Eniola Abayoi" authorUrl="/random.png" /> */}

              {/* Comment field */}
              <section className="mt-5 grid grid-cols-[35px_1fr] gap-x-3">
                <Avatar className="col-start-1 col-end-1 h-[35px] w-full">
                  <AvatarImage src={product.creator.avatar} />
                  <AvatarFallback className="text-xs">
                    {product.creator.name
                      .split(" ")
                      .map((n: string) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <textarea
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    className="border-muted-foreground/50 w-full rounded-md border p-2"
                    placeholder="Write a comment..."
                  ></textarea>
                  <Button
                    disabled={pending}
                    onClick={addCommentAction}
                    className="mt-2 ml-[93%] h-9 w-9 rounded-full"
                  >
                    {pending ? (
                      <Loader2 className="animate-spin" />
                    ) : (
                      <ArrowUp className="h-full" />
                    )}
                  </Button>
                </div>
              </section>
            </div>
          </div>

          {/* Payment Form */}
          <div className="order-1 lg:order-2">
            <div className="sticky top-24">
              <Card>
                <CardHeader>
                  <CardTitle>Payment Details</CardTitle>
                  <CardDescription>Complete your purchase to get instant access</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Contact Information */}
                  <div>
                    <h3 className="mb-3 font-medium">Contact Information</h3>
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
                          <p className="mt-1 text-sm text-red-500">{errors.email}</p>
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
                            <p className="mt-1 text-sm text-red-500">{errors.firstName}</p>
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
                            <p className="mt-1 text-sm text-red-500">{errors.lastName}</p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Payment Method */}

                  {/* Security Notice */}
                  <div className="bg-muted/50 flex items-center gap-2 rounded-lg p-3">
                    <Shield className="h-4 w-4 text-green-600" />
                    <span className="text-muted-foreground text-sm">
                      Your payment information is encrypted and secure
                    </span>
                  </div>

                  {/* Pricing Options */}
                  <div>
                    <h3 className="mb-3 font-medium">Select Plan</h3>
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
                        <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                        Processing...
                      </>
                    ) : (
                      <>Complete Purchase - ₦{product.price}</>
                    )}
                  </Button>

                  <p className="text-muted-foreground text-center text-xs">
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
      <Modal isOpen={success} hasCloseBtn={false} onClose={() => {}}>
        <PaymentSuccess />
      </Modal>
    </div>
  );
}

const Comment = ({
  authorUrl,
  authorName,
  text,
}: {
  authorUrl: string;
  authorName: string;
  text: string;
}) => (
  <article className="grid grid-cols-[35px_1fr] gap-x-4">
    <Avatar className="col-start-1 col-end-1 h-[35px] w-full">
      <AvatarImage src={authorUrl} />
      <AvatarFallback className="text-xs">
        {authorName
          .split(" ")
          .map((n: string) => n[0])
          .join("")}
      </AvatarFallback>
    </Avatar>
    <div className="col-start-2 col-end-6 flex items-center text-sm font-medium">
      <strong>Jenny Wen</strong>
      <span className="pl-2 text-gray-400">6 hours ago</span>
    </div>
    <div className="col-start-2 col-end-6">{text}</div>
  </article>
);
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
      className={`hover:bg-muted/50 flex cursor-pointer items-center justify-between rounded-lg border p-4 ${
        currentlySelectedPlan === duration ? "border-primary/50" : ""
      } transition-colors`}
    >
      <div className="flex items-center gap-3">
        <input
          type="radio"
          name="pricingPlan"
          value="monthly"
          className="h-4 w-4"
          checked={currentlySelectedPlan === duration}
          onClick={() => setCurrentlySelectedPlan(duration)}
        />
        <div>
          <div className="flex items-center gap-2 font-medium">
            {duration} Access{" "}
            {isRecommended && (
              <span className="bg-primary text-primary-foreground rounded-full px-2 py-0.5 text-xs">
                Best Value
              </span>
            )}
          </div>
          <div className="text-muted-foreground text-sm">
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

const PaymentSuccess = () => {
  return (
    <div className="flex flex-col items-center justify-center p-8">
      <svg width="200" height="200" viewBox="0 0 200 200" className="mb-4">
        {/* Credit card morphing */}
        <g className="animate-card-morph">
          {/* Card shape */}
          <rect
            x="40"
            y="80"
            width="120"
            height="75"
            rx="8"
            fill="none"
            stroke="#8b5cf6"
            strokeWidth="3"
            className="card-rect"
          />
          <rect
            x="40"
            y="95"
            width="120"
            height="15"
            fill="#8b5cf6"
            opacity="0.3"
            className="card-stripe"
          />
          <circle cx="140" cy="135" r="8" fill="#8b5cf6" opacity="0.5" className="card-chip" />
        </g>

        {/* Success checkmark that replaces card */}
        <g>
          {" "}
          {/*className="animate-payment-check"*/}
          <circle
            cx="100"
            cy="100"
            r="50"
            fill="none"
            stroke="#10b981"
            strokeWidth="3"
            className="payment-circle"
          />
          <path
            d="M70 100 L90 120 L130 80"
            fill="none"
            stroke="#10b981"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="payment-path"
          />
        </g>
      </svg>
      <p className="text-lg font-semibold text-gray-700">Payment Successful!</p>
    </div>
  );
};
