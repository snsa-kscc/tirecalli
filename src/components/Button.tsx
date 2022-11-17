import { useLocalStorage } from "../hooks/useLocalStorage";
import { cartQuantityStore } from "./cartStore";

type ButtonProps = {
  id: number;
  size?: string;
};

type CartItem = {
  id: number;
  quantity: number;
};

export function Button({ id, size }: ButtonProps) {
  const [cartItems, setCartItems] = useLocalStorage<CartItem[]>("shopping-cart", []);
  const cartQuantity = cartItems.reduce((quantity, item) => item.quantity + quantity, 1);

  function increaseCartQuantity(id: number) {
    setCartItems((currItems) => {
      if (currItems.find((item) => item.id === id) == null) {
        return [...currItems, { id, quantity: 1 }];
      } else {
        return currItems.map((item) => {
          if (item.id === id) {
            return { ...item, quantity: item.quantity + 1 };
          } else {
            return item;
          }
        });
      }
    });
    cartQuantityStore.set(cartQuantity);
  }

  return (
    <button data-item={id} className="button button--cta" onClick={() => increaseCartQuantity(id)}>
      <span>Add to basket</span>
    </button>
  );
}
