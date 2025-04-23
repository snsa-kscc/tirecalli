import { loadScript } from "@paypal/paypal-js";
import { increaseCartQuantity, decreaseCartQuantity, removeFromCart } from "../utils/utils";
import { useLocalStorage } from "../hooks/useLocalStorage";
import storeItems from "../data/inventory.json";
import { cartQuantityStore } from "../store/cartStore";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import { useState, useRef, useEffect } from "react";

type CartItem = {
  id: number;
  quantity: number;
};

export function ShoppingCart() {
  const [discount, setDiscount] = useState(false);
  const [appliedDiscountCode, setAppliedDiscountCode] = useState("");
  const [message, setMessage] = useState("");
  const [cartItems, setCartItems] = useLocalStorage<CartItem[]>("shopping-cart", []);
  const cartQuantity = cartItems.reduce((quantity, item) => item.quantity + quantity, 0);
  const [parent, enableAnimations] = useAutoAnimate<any>();
  cartQuantityStore.set(cartQuantity);
  const buttonContainerRef = useRef();
  const buttonRef = useRef(null);

  const createOrder = (data, actions) => {
    const requestBody = {
      purchasedItems: JSON.parse(localStorage.getItem("shopping-cart")),
      discount,
      appliedDiscountCode,
    };

    return fetch("/.netlify/functions/paypal", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    })
      .then((res) => {
        if (res.ok) return res.json();
        return res.json().then((json) => Promise.reject(json));
      })
      .then(({ id }) => {
        return id;
      })
      .catch((e) => {
        console.error(e.error);
      });
  };

  const onApprove = (data, actions) => {
    return actions.order.authorize().then(function () {
      localStorage.removeItem("shopping-cart");
      actions.redirect("https://tirecalli.com/success");
    });
  };

  const handleApplyDiscount = (event) => {
    event.preventDefault();
    const userInput = event.target.elements.code.value;
    if (userInput === "WELCOME10") {
      // if (userInput === "WELCOME10" || userInput === "TCJUICE30") {
      setAppliedDiscountCode(userInput);
      setDiscount(true);
      setMessage("");
    } else {
      setDiscount(false);
      setMessage("Your code is wrong!");
    }
  };

  useEffect(() => {
    const initPayPalButton = async () => {
      const paypal = await loadScript({
        "client-id": "AbJEWWb11uZPepCWJ-lcU4d3FS-AU96otqyvH5fNPAmamH8a5OLsMOOKgZJaAuXV5UIuq981mvcQdfVT",
        currency: "EUR",
        intent: "authorize",
      });

      buttonRef.current = paypal.Buttons({
        style: {
          layout: "vertical",
          color: "black",
          shape: "rect",
          label: "paypal",
        },
        createOrder,
        onApprove,
      });

      buttonRef.current.render(buttonContainerRef.current);
    };

    initPayPalButton();

    return () => {
      if (buttonRef.current) {
        buttonRef.current.close();
      }
    };
  }, [discount, appliedDiscountCode]);

  const subtotal = cartItems.reduce((total, cartItem) => {
    const item = storeItems.find((i) => i.id === cartItem.id);
    return total + (item?.price || 0) * cartItem.quantity;
  }, 0);

  const deliveryAndHandling = 10;

  const discountPercentage = discount ? (appliedDiscountCode === "T14M4S5KOFC" || appliedDiscountCode === "TCJUICE30" ? 0.3 : 0.1) : 0;
  const discountAmount = discountPercentage * subtotal;

  const total = subtotal + deliveryAndHandling - discountAmount;

  if (cartQuantity) {
    return (
      <div className="bag flex">
        <div className="bag__group bag__content">
          <h2>Bag</h2>
          <div ref={parent}>
            {cartItems.map((cartItem) => {
              const item = storeItems.find((i) => i.id === cartItem.id);
              return (
                <div key={cartItem.id} className="bag__item flex">
                  <img src={item.imgUrl} className="pic" alt="tirecalli-picture" />
                  <div className="bag__description">
                    <div>{item.name}</div>
                    <div className="bag__item-price">
                      Item price: {item.price}€ {cartItem.quantity > 1 && <span className="bag__item-quantity">x quantity {cartItem.quantity}</span>}
                    </div>
                    <div className="bag__item-price">Item total: {item.price * cartItem.quantity}€</div>
                    <div className="bag__buttons">
                      <button className="button button--size" onClick={() => increaseCartQuantity(cartItem.id, setCartItems)}>
                        <span>+</span>
                      </button>
                      <button className="button button--size" onClick={() => decreaseCartQuantity(cartItem.id, setCartItems)}>
                        <span>-</span>
                      </button>
                      <button className="button button--size" onClick={() => removeFromCart(cartItem.id, setCartItems)}>
                        <span className="trash"></span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        <div className="bag__group bag__summary">
          <h2>Summary</h2>
          <div>Subtotal: {subtotal.toFixed(2)}€</div>
          <div>Delivery and Handling: {deliveryAndHandling.toFixed(2)}€</div>
          {discount && <div>Discount: {discountAmount.toFixed(2)}€</div>}
          <div className="bag__total">Total: {total.toFixed(2)}€</div>
          <div>
            <form onSubmit={handleApplyDiscount} className="discount-form">
              <input type="text" id="code" placeholder="Discount code" className="discount-input" />
              <button type="submit">Apply</button>
            </form>
            {message && <p className="mt">{message}</p>}
          </div>
          <div className="paypal" ref={buttonContainerRef}></div>
        </div>
      </div>
    );
  }
  return (
    <div className="empty">
      <h2>Bag</h2>
      <p>There are no items in your bag.</p>
      <div className="paypal hidden" ref={buttonContainerRef}></div>
    </div>
  );
}
