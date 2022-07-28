import { createContext, Dispatch, Reducer, useReducer } from "react";

interface Action {
  type: string;
  payload: PaymentData | null;
}

type City = {
  name: string;
  type: string;
};

export type Address = {
  province: string;
  city: City;
  subdistrict: string;
  detail: string;
  postal_code: string;
};

type COD = {
  shipping: string;
  shipping_service: string;
  address: Address;
};

export type PaymentData = {
  customer_name: string;
  customer_whatsapp: string;
  information: COD;
};

interface PaymentContextInterface {
  payment: PaymentData | null;
  paymentDispatch: Dispatch<Action>;
}

type PaymentProviderProps = {
  children?: JSX.Element;
};

const reducer: Reducer<PaymentData | null, Action> = (state, action) => {
  const { type, payload } = action;
  switch (type) {
    case "UPDATE":
      return payload as PaymentData;
    default:
      return null;
  }
};

export const PaymentContext = createContext<PaymentContextInterface | null>(
  null
);

export const PaymentProvider = ({ children }: PaymentProviderProps) => {
  const [state, dispatch] = useReducer(reducer, null);

  return (
    <PaymentContext.Provider
      value={{ payment: state, paymentDispatch: dispatch }}
    >
      {children}
    </PaymentContext.Provider>
  );
};
