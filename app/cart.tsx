import { createContext, Dispatch, Reducer, useReducer } from "react";

type QtyPayload = {
  i: number;
  qty: number;
};

type RemovePayload = {
  i: number;
};

interface Action {
  type: string;
  payload?: CartItem | QtyPayload | RemovePayload;
}

export type CartItem = {
  id: number;
  qty: number;
  message?: string;
};

interface CartContextInterface {
  carts: CartItem[];
  cartsDispatch: Dispatch<Action>;
}

type CartProviderProps = {
  children?: JSX.Element;
};

const reducer: Reducer<CartItem[], Action> = (state, action) => {
  const { type, payload } = action;
  switch (type) {
    case "ADD":
      var temp = [...state];
      temp.push(payload as CartItem);
      return temp;
    case "CHANGE":
      var temp = [...state];
      temp[(payload as QtyPayload).i].qty = (payload as QtyPayload).qty;
      return temp;
    case "REMOVE":
      var temp = [...state];
      temp.splice((payload as RemovePayload).i, 1);
      return temp;
    case "CLEAR":
      return [];
    default:
      return state;
  }
};

export const CartContext = createContext<CartContextInterface | null>(null);

export const CartProvider = ({ children }: CartProviderProps) => {
  const [state, dispatch] = useReducer(reducer, []);

  return (
    <CartContext.Provider value={{ carts: state, cartsDispatch: dispatch }}>
      {children}
    </CartContext.Provider>
  );
};
