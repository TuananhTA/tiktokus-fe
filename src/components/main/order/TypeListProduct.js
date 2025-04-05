export default function TypeListProduct({ orderDeatilsList }) {
  return (
    <ul>
      {orderDeatilsList?.map((item) => (
        <li key={item.id}>
          {item.product.productName} x {item.quantity}
        </li>
      ))}
    </ul>
  );
}
