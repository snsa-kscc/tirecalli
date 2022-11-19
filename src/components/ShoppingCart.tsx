import styles from "./CartItem.module.css";
import { increaseCartQuantity, decreaseCartQuantity, removeFromCart } from "../utils/utils";
import { useLocalStorage } from "../hooks/useLocalStorage";
import storeItems from "../data/inventory.json";
import { cartQuantityStore } from "../store/cartStore";

type CartItem = {
  id: number;
  quantity: number;
};

export function ShoppingCart() {
  const [cartItems, setCartItems] = useLocalStorage<CartItem[]>("shopping-cart", []);
  const cartQuantity = cartItems.reduce((quantity, item) => item.quantity + quantity, 0);
  cartQuantityStore.set(cartQuantity);

  return (
    <>
      {cartItems.map((cartItem) => {
        const item = storeItems.find((i) => i.id === cartItem.id);
        return (
          <div key={cartItem.id}>
            <div>
              {item.id} {item.name}
            </div>
            <div>
              {item.price} {cartItem.quantity > 1 && <span>x {cartItem.quantity}</span>}
            </div>
            <div>{item.price * cartItem.quantity}</div>
            <button className={styles.btn} onClick={() => increaseCartQuantity(cartItem.id, setCartItems)}>
              plus
            </button>
            <button className={styles.btn} onClick={() => decreaseCartQuantity(cartItem.id, setCartItems)}>
              minus
            </button>
            <button className={styles.btn} onClick={() => removeFromCart(cartItem.id, setCartItems)}>
              remove
            </button>
          </div>
        );
      })}
      <div>
        Total{" "}
        {cartItems.reduce((total, cartItem) => {
          const item = storeItems.find((i) => i.id === cartItem.id);
          return total + (item?.price || 0) * cartItem.quantity;
        }, 0)}
      </div>
    </>
  );
}