"use client";

import Image from "next/image";
import { useSearchParams } from "next/navigation";

import { FormEmail } from "@/components/auth/form-email";
import { FormOTP } from "@/components/auth/form-otp";
import { FormUserInfo } from "@/components/auth/form-user-info";

export default function AuthContent() {
  const searchParams = useSearchParams();
  const step = searchParams.get("step");

  return (
    <div className="p-4 lg:p-10">
      <div className="m-auto container shadow-md w-full lg:grid lg:min-h-[calc(100vh - 200px)] lg:grid-cols-2">
        <div className="flex items-center justify-center py-12 px-6">
          {!step ? (
            <FormEmail />
          ) : step == "2" ? (
            <FormOTP />
          ) : step == "3" ? (
            <FormUserInfo />
          ) : (
            <></>
          )}
        </div>
        <div className="hidden bg-muted sm:block">
          <Image
            alt="Image"
            className="h-full w-full object-cover dark:brightness-[0.5]"
            height="1080"
            src="/images/photos/img (1).jpg"
            width="1920"
          />
        </div>
      </div>
    </div>
  );
}
