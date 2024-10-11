"use client";

import { useEffect, FC } from "react";

const PaypalButton: FC = () => {
  useEffect(() => {
    const script: HTMLScriptElement = document.createElement("script");

    script.src =
      "https://www.paypal.com/sdk/js?client-id=ARCxehtDVS93CqOo4NvZnsdQBylRsaJ_mXpO2UoVflVfpZbuC4sv9F-F2FJSgNxM47Rmoih99lE98Cvg&vault=true&intent=subscription";
    script.setAttribute("data-sdk-integration-source", "button-factory");
    script.addEventListener("load", () => {
      if ((window as any).paypal) {
        (window as any).paypal
          .Buttons({
            style: {
              shape: "pill",
              color: "black",
              layout: "horizontal",
              label: "paypal",
            },
            createSubscription: function (data: any, actions: any) {
              return actions.subscription.create({
                plan_id: "P-5BB11760L3518994TM3ZLRMQ",
                quantity: 1,
              });
            },
            onApprove: function (data: any, actions: any) {
              alert(data.subscriptionID);
            },
          })
          .render("#paypal-button-container-P-5BB11760L3518994TM3ZLRMQ");
      }
    });
    document.body.appendChild(script);
  }, []);

  return <div id="paypal-button-container-P-5BB11760L3518994TM3ZLRMQ" />;
};

export default PaypalButton;
