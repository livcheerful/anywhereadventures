"use client";
import { useSearchParams } from "next/navigation";
import { useEffect } from "react";
export default function SearchParamHandler({ paramsToFetch, cb }) {
  const searchParams = useSearchParams({});
  useEffect(() => {
    const kvp = {};
    paramsToFetch.forEach((key) => {
      kvp[key] = searchParams.get(key);
    });
    cb(kvp);
  }, [searchParams, paramsToFetch, cb]);
  return <></>;
}
