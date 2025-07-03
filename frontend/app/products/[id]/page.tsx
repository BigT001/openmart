"use client";

import React from "react";
import ViewProduct from "@/components/vendors-dashboard/products/view-product";
import { useParams } from "next/navigation";

const ProductPage: React.FC = () => {
  // Get the product id from the route params
  const params = useParams();
  const productId = typeof params?.id === "string" ? params.id : Array.isArray(params?.id) ? params.id[0] : "";

  if (!productId) {
    return <div className="text-center py-12 text-red-500">Product not found.</div>;
  }

  return <ViewProduct productId={productId} />;
};

export default ProductPage;
