"use client";
import { useUserStore } from "@/context/useUser";
import { fetchUserProfile } from "@/lib/utils";
import { PayPalButtons, PayPalScriptProvider } from "@paypal/react-paypal-js";
import React, { useState } from "react";
import { toast } from "sonner";

const creditOptions = [
  { price: "1.00", credits: 3 },
  { price: "5.00", credits: 20 },
  { price: "10.00", credits: 50 },
];

function BuyCredits() {

  const { user, setUser } = useUserStore((state) => state);
  const [loading, setLoading] = useState(false);
  const initialOptions = {
    clientId:
      "AWBmEVN9uhHpgYlPoAeYksMTCrLavPvj7pi1YhVUU22Zq1Bm9g799v3ZaS--dAKb3eB8TP9JXiOL21py", // Replace with your actual client ID
    currency: "USD",
    intent: "capture"
  };

  return (
    <PayPalScriptProvider options={initialOptions}>
      <div className="flex gap-6 justify-center items-start p-6 flex-wrap">
        {creditOptions.map((option, index) => (
          <div
            key={index}
            className="bg-white shadow-lg rounded-xl p-6 w-64 border border-gray-200 text-center"
          >
            <h2 className="text-xl font-semibold mb-2">${option.price}</h2>
            <p className="text-gray-700 mb-4">{option.credits} Credits</p>

            <PayPalButtons
              style={{ layout: "horizontal" }}
              forceReRender={[option.price]}
              createOrder={(data, actions) => {
                return actions.order.create({
                  purchase_units: [
                    {
                      amount: {
                        value: option.price,
                        currency_code: "USD"
                      },
                    },
                  ],
                });
              }}
              onApprove={(data, actions) => {
                return actions.order.capture().then(async (details) => {
                  toast.success(
                    `Payment of $${option.price} successful! You've purchased ${option.credits} credits.`
                  );

                  try {
                    const res = await fetch("/api/add-credits", {
                      method: "POST",
                      headers: {
                        "Content-Type": "application/json",
                      },
                      body: JSON.stringify({
                        creditsToAdd: option.credits,
                      }),
                    });

                    const responseData = await res.json();


                    if (res.ok) {
                      console.log(
                        "Credits updated successfully:",
                        responseData
                      );

                      toast.success(responseData?.message)
                      await fetchUserProfile(setUser, setLoading)
                      // Optional: Trigger a UI update or refetch user data here
                    } else {
                      console.error(
                        "Failed to update credits:",
                        responseData.message
                      );
                      toast.success(
                        "Payment succeeded but credit update failed. Please contact support."
                      );
                    }
                  } catch (error) {
                    console.error("Error calling add-credits API:", error);
                    toast.error("Something went wrong while updating your credits.");
                  }
                });
              }}
            />
          </div>
        ))}
      </div>
    </PayPalScriptProvider>
  );
}

export default BuyCredits;
// Replace "test" with your real PayPal client ID
