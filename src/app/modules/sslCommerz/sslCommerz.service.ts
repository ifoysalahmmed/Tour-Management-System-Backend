import axios from "axios";
import status from "http-status";

import { envVars } from "../../config/env.js";
import { AppError } from "../../errors/app.error.js";
import type { ISSLCommerzPayload } from "./sslCommerz.interface.js";

const initiatePayment = async (payload: ISSLCommerzPayload) => {
  const data = {
    store_id: envVars.SSL.STORE_ID,
    store_passwd: envVars.SSL.STORE_PASSWORD,
    total_amount: payload.amount,
    currency: payload.currency,
    tran_id: payload.transactionId,
    success_url: `${envVars.SSL.SUCCEEDED_BACKEND_URL}?transactionId=${payload.transactionId}`,
    fail_url: `${envVars.SSL.FAILED_BACKEND_URL}?transactionId=${payload.transactionId}`,
    cancel_url: `${envVars.SSL.CANCELLED_BACKEND_URL}?transactionId=${payload.transactionId}`,
    shipping_method: "N/A",
    product_name: "Tour Booking",
    product_category: "Tour Service",
    product_profile: "general",
    cus_name: payload.name,
    cus_email: payload.email,
    cus_add1: payload.address,
    cus_add2: "N/A",
    cus_city: "N/A",
    cus_state: "N/A",
    cus_postcode: "N/A",
    cus_country: "N/A",
    cus_phone: payload.phone,
    cus_fax: "N/A",
    ship_name: "N/A",
    ship_add1: "N/A",
    ship_add2: "N/A",
    ship_city: "N/A",
    ship_state: "N/A",
    ship_postcode: "N/A",
    ship_country: "N/A",
  };

  try {
    const response = await axios({
      method: "POST",
      url: envVars.SSL.PAYMENT_URL,
      data: data,
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });

    return response.data;
  } catch (error) {
    throw new AppError(
      status.BAD_REQUEST,
      error instanceof Error ? error.message : "Payment initialization failed",
    );
  }
};

export const SSLCommerzServices = {
  initiatePayment,
};
