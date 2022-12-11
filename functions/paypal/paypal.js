const products = require("../data/inventory.json");
const paypal = require("@paypal/checkout-server-sdk");

const { PAYPAL_CLIENT_ID, PAYPAL_CLIENT_SECRET } = process.env;
const Environment = paypal.core.LiveEnvironment;
const paypalClient = new paypal.core.PayPalHttpClient(new Environment(PAYPAL_CLIENT_ID, PAYPAL_CLIENT_SECRET));

// const storeItems = new Map([
//   [1, { price: 100, name: "Learn React Today" }],
//   [2, { price: 200, name: "Learn CSS Today" }],
// ]);

const storeItems = new Map(products);
exports.handler = async function (event, context) {
  const request = new paypal.orders.OrdersCreateRequest();
  const parsedEvent = JSON.parse(event.body);
  const total = parsedEvent.reduce((sum, item) => {
    return sum + storeItems.get(item.id).price * item.quantity;
  }, 0);
  request.prefer("return=representation");
  request.requestBody({
    intent: "AUTHORIZE", // or capture
    purchase_units: [
      {
        amount: {
          currency_code: "EUR",
          value: total,
          breakdown: {
            item_total: {
              currency_code: "EUR",
              value: total,
            },
            // shipping: {
            //   currency_code: "EUR",
            //   value: "5.00",
            // },
          },
        },
        items: parsedEvent.map((item) => {
          const storeItem = storeItems.get(item.id);
          return {
            name: storeItem.name,
            unit_amount: {
              currency_code: "EUR",
              value: storeItem.price,
            },
            quantity: item.quantity,
          };
        }),
        shipping: {
          options: [
            {
              id: "SHIP_123",
              label: "Shipping and Handling",
              type: "SHIPPING",
              selected: true,
              amount: {
                value: "5.00",
                currency_code: "EUR",
              },
            },
            // {
            //   id: "SHIP_456",
            //   label: "Pickup in Zagreb, Cro",
            //   type: "PICKUP",
            //   selected: false,
            //   amount: {
            //     value: "0.00",
            //     currency_code: "EUR",
            //   },
            // },
          ],
        },
      },
    ],
  });

  try {
    const order = await paypalClient.execute(request);
    return {
      statusCode: 200,
      body: JSON.stringify({ id: order.result.id }),
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ msg: err }),
    };
  }
};
