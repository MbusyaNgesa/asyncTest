// let statuses = [];
// let xhr = new XMLHttpRequest();

// xhr.open("GET", "http://localhost:3000/api/orderStatuses");
// xhr.onload = () => {
//   statuses = JSON.parse(xhr.responseText);

//   let xhr2 = new XMLHttpRequest();
//   xhr2.open("GET", "http://localhost:3000/api/orders");
//   xhr2.onload = () => {
//     const orders = JSON.parse(xhr2.responseText);
//     const fullOrders = orders.map((o) => {
//       o.orderStatus = statuses.find(
//         (s) => s.id === o.orderStatusId
//       ).description;
//       return o;
//     });

//     showOrderList("#order-list", fullOrders);
//   };
//   xhr2.send();
// };
// xhr.send();

//Promises
// axios
//   .get("http://localhost:3000/api/orders")
//   .then(({ data }) => {
//     showOrderList("#order-list", data);
//   })
//   .catch((err) => showError("#order-list", err));

//Chaining promises
// let statuses = [];
// axios
//   .get("http://localhost:3000/api/orderStatuses")
//   .then(({ data }) => {
//     statuses = data;
//     return axios.get("http://localhost:3000/api/orders");
//   })
//   .then(({ data }) => {
//     let orders = data.map((o) => {
//       return {
//         ...o,
//         orderStatus: statuses.find((d) => d.id === o.orderStatusId).description,
//       };
//     });
//     showOrderList("#order-list", orders);
//   })
//   .catch((err) => showError("#order-list", err))
//   .finally(() => {
//     setTimeout(hideWaiting, 1500);
//   });

//Queuing promises
let statusReq = axios.get("http://localhost:3000/api/orderStatuses");
let addressReq = axios.get("http://localhost:3000/api/addresses");

let statuses = [];
let addresses = [];

Promise.all([statusReq, addressReq])
  .then(([statusReq, addressReq]) => {
    statuses = statusReq.data;
    addresses = addressReq.data;

    return axios.get("http://localhost:3000/api/orders");
  })
  .then(({ data }) => {
    let orders = data.map((d) => {
      const addr = addresses.find((a) => a.id === d.shippingAddress);

      return {
        ...d,
        orderStatus: statuses.find((s) => s.id === d.orderStatusId).description,
        shippingAddressText: `${addr.street} ${addr.city}, ${addr.state} ${addr.zipCode}`,
      };
    });
    showOrderList("#order-list", orders);
  })
  .catch((err) => showError("#order-list", err))
  .finally(() => {
    setTimeout(hideWaiting, 1500);
  });
