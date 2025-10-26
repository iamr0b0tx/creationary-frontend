import React from "react";
import { Card, CardHeader } from "@/components/ui/card";
import { Play } from "lucide-react";

const Loading = () => {
  return (
    <div>
      <div className="container mx-auto px-4 py-8">
        {/* Header Skeleton */}
        <div className="mb-8">
          <div className="mb-4 h-8 w-48 animate-pulse rounded bg-gray-200"></div>
          <div className="h-4 w-96 animate-pulse rounded bg-gray-200"></div>
        </div>

        {/* Search/Filter Bar Skeleton */}
        <div className="mb-6 flex gap-4">
          <div className="h-10 flex-1 animate-pulse rounded bg-gray-200"></div>
          <div className="h-10 w-32 animate-pulse rounded bg-gray-200"></div>
        </div>

        {/* Grid of Content Cards Skeleton */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, index) => (
            <div key={index} className="space-y-3 rounded-lg border p-4">
              {/* Image placeholder */}
              <div className="h-48 animate-pulse rounded bg-gray-200"></div>
              {/* Title */}
              <div className="h-6 w-3/4 animate-pulse rounded bg-gray-200"></div>
              {/* Description */}
              <div className="space-y-2">
                <div className="h-4 animate-pulse rounded bg-gray-200"></div>
                <div className="h-4 w-5/6 animate-pulse rounded bg-gray-200"></div>
              </div>
              {/* Footer */}
              <div className="flex gap-2 pt-2">
                <div className="h-8 w-20 animate-pulse rounded bg-gray-200"></div>
                <div className="h-8 w-20 animate-pulse rounded bg-gray-200"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Loading;
