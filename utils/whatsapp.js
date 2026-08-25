export function generateWhatsAppLink(cartItems, total, phoneNumber) {
  let message = "Olá! Gostaria de fazer o seguinte pedido:\n\n";

  cartItems.forEach((item) => {
    const price = `R$ ${Number(item.salePrice || 0).toFixed(2).replace('.', ',')}`;
    message += `${item.quantity}x ${item.name} - ${price}\n`;
  });

  const formattedTotal = `R$ ${Number(total).toFixed(2).replace('.', ',')}`;

  message += `\n*Total: ${formattedTotal}*`;

  const encodedMessage = encodeURIComponent(message);
  
  // Limpar formatação do número se houver
  const cleanNumber = phoneNumber.replace(/\D/g, "");

  return `https://wa.me/${cleanNumber}?text=${encodedMessage}`;
}
