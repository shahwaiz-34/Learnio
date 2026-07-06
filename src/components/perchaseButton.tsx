"use client";

import { useUser, SignInButton } from "@clerk/nextjs";
import { Id } from "../../convex/_generated/dataModel";
import { useAction, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Button } from "./ui/button";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

const PurchaseButton = ({ courseId }: { courseId: Id<"courses"> }) => {
  const { user, isLoaded: isUserLoaded, isSignedIn } = useUser();
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const userData = useQuery(
    api.users.getUserByClerkId,
    isUserLoaded && isSignedIn && user?.id ? { clerkId: user.id } : "skip",
  );
  const createCheckoutSession = useAction(api.stripe.createCheckoutSession);

  const userAccess = useQuery(
    api.users.getUserAccess,
    userData ? { userId: userData._id, courseId } : "skip",
  ) || { hasAccess: false };

  const handlePurchase = async () => {
    if (!isUserLoaded) {
      return alert("Please wait while we check your sign-in status.");
    }

    if (!isSignedIn || !user) {
      return alert("Please sign in to purchase the course.");
    }

    setIsLoading(true);
    try {
      const { checkoutUrl } = await createCheckoutSession({
        courseId,
        clerkId: user.id,
      });
      if (checkoutUrl) {
        window.location.href = checkoutUrl;
      } else {
        throw new Error("Failed to create checkout session");
      }
    } catch (error: any) {

      if(error.messsage.includes("Rate limit exceeded")) {
        
        toast.error("You are making purchases too quickly. Please wait a moment and try again.");
      } else {
        toast.error(
          error?.message ||
            "An error occurred while processing your purchase. Please try again.",
        );
      }
      console.error("Error creating checkout session:", error);
      const message =
        error?.message ||
        (typeof error === "string"
          ? error
          : "Something went wrong with the purchase.");
      setErrorMessage(message);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading || !isUserLoaded || (isSignedIn && userData === undefined)) {
    return (
      <Button variant={"outline"} disabled>
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        Processing...
      </Button>
    );
  }

  if (!isSignedIn || !user) {
    return (
      <SignInButton mode="modal">
        <Button variant={"default"}>Sign in to enroll</Button>
      </SignInButton>
    );
  }

  if (userAccess.hasAccess) {
    return (
      <Button variant={"secondary"} disabled>
        Already Enrolled
      </Button>
    );
  }

  return (
    <>
      <Button onClick={handlePurchase} variant={"default"}>
        Enroll Now
      </Button>
      {errorMessage ? (
        <p className="mt-2 text-sm text-red-600">{errorMessage}</p>
      ) : null}
    </>
  );
};

export default PurchaseButton;
