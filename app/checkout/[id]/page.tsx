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
    <Suspense fallback={<div>Loading...</div>}>
      <CheckoutComponent product={content[0]} comments={product.content.comments} />
    </Suspense>
  );
}
