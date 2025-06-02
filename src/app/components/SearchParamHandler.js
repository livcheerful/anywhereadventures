"use client";
import { useSearchParams } from "next/navigation";
import { useEffect } from "react";
export default function SearchParamHandler({ paramsToFetch, cb }) {
  const searchParams = useSearchParams({});

  let res = {};
  paramsToFetch.forEach((p, i) => {
    const val = searchParams.get(p);
    res[p] = val;
  });

  cb(res);
  useEffect(() => {}, []);
  return <></>;
}
