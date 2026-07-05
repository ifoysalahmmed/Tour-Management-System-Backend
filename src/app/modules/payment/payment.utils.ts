const mapGatewayData = (gatewayData: Record<string, string>) => {
  return {
    status: gatewayData.status ?? null,
    tran_date: gatewayData.tran_date ?? null,
    tran_id: gatewayData.tran_id ?? null,
    val_id: gatewayData.val_id ?? null,
    amount: gatewayData.amount ?? null,
    store_amount: gatewayData.store_amount ?? null,
    store_id: gatewayData.store_id ?? null,
    card_type: gatewayData.card_type ?? null,
    card_no: gatewayData.card_no ?? null,
    currency: gatewayData.currency ?? null,
    bank_tran_id: gatewayData.bank_tran_id ?? null,
    card_issuer: gatewayData.card_issuer ?? null,
    card_brand: gatewayData.card_brand ?? null,
    card_issuer_country: gatewayData.card_issuer_country ?? null,
    card_issuer_country_code: gatewayData.card_issuer_country_code ?? null,
    currency_type: gatewayData.currency_type ?? null,
    currency_amount: gatewayData.currency_amount ?? null,
    currency_rate: gatewayData.currency_rate ?? null,
    base_fair: gatewayData.base_fair ?? null,
    value_a: gatewayData.value_a ?? null,
    value_b: gatewayData.value_b ?? null,
    value_c: gatewayData.value_c ?? null,
    value_d: gatewayData.value_d ?? null,
    verify_sign: gatewayData.verify_sign ?? null,
    verify_key: gatewayData.verify_key ?? null,
    risk_level: gatewayData.risk_level ?? null,
    risk_title: gatewayData.risk_title ?? null,
  };
};

export const PaymentUtils = {
  mapGatewayData,
};
