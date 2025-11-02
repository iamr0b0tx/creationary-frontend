import { Suspense } from "react";
import CheckoutComponent from "../CheckoutComponent";
import { getContentById } from "@/lib/data/exploreContent";
import { cookies } from "next/headers";
import { transformContent } from "@/lib/utils";

export default async function CheckoutPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const token = (await cookies()).get("token")?.value ?? "";
  const product = await getContentById(id, token);
  const content = product ? transformContent([product.content.post]) : null;

  if (!content)
    return (
      <div>
        <div className="flex min-h-screen flex-col items-center justify-center gap-4">
          <h1 className="text-2xl font-semibold">You must be at the wrong page</h1>
          <button
            onClick={() => window.history.back()}
            className="rounded-lg bg-blue-600 px-6 py-2 text-white transition-colors hover:bg-blue-700"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  return (
    <Suspense fallback={<CheckoutSkeleton />}>
      <CheckoutComponent product={content[0]} comments={product.content.comments} />
    </Suspense>
  );
}

const CheckoutSkeleton = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-3">
          {/* Main Content - Product Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Product Image */}
            <div className="animate-pulse bg-gray-200 rounded-lg h-96 w-full" />
            
            {/* Product Title */}
            <div className="animate-pulse bg-gray-200 rounded h-8 w-3/4" />
            
            {/* Product Description */}
            <div className="space-y-2">
              <div className="animate-pulse bg-gray-200 rounded h-4 w-full" />
              <div className="animate-pulse bg-gray-200 rounded h-4 w-5/6" />
              <div className="animate-pulse bg-gray-200 rounded h-4 w-4/6" />
            </div>

            {/* Comments Section */}
            <div className="space-y-4 mt-8">
              <div className="animate-pulse bg-gray-200 rounded h-6 w-32" />
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex gap-3">
                  <div className="animate-pulse bg-gray-200 rounded-full h-10 w-10" />
                  <div className="flex-1 space-y-2">
                    <div className="animate-pulse bg-gray-200 rounded h-4 w-24" />
                    <div className="animate-pulse bg-gray-200 rounded h-4 w-full" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Sidebar - Checkout Summary */}
          <div className="lg:col-span-1">
            <div className="sticky top-8 space-y-4 rounded-lg bg-white p-6 shadow">
              <div className="animate-pulse bg-gray-200 rounded h-6 w-32" />
              <div className="animate-pulse bg-gray-200 rounded h-4 w-full" />
              <div className="animate-pulse bg-gray-200 rounded h-10 w-full" />
              <div className="animate-pulse bg-gray-200 rounded h-12 w-full" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
