"use client"; // Error components must be Client Components

import Button from "@/components/button";
import Image from "next/image";
import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error("Page render error" + error);
  }, [error]);

  return (
    <div className="text-center mb-20">
      <div className="flex flex-col items-center max-w-sm mx-auto text-center md:mt-20 mt-10">
        <Image

          className="w-[400px] h-[200px]"
          width={400}
          height={200}
          style={{ width: '400px', height: '200px' }}
          alt="404 - something went wrong "
          src="/assets/images/error/error.png"
          property="true"
        />
      </div>
      <h2 className="text-center py-10 font-gotham text-3xl">
        Something went wrong!
      </h2>
      <Button
        className="mb-5 px-2 py-1 font-gotham text-sm"
        onClick={
          // Attempt to recover by trying to re-render the segment
          () => reset()
        }
      >
        Try again
      </Button>
    </div>
  );
}
