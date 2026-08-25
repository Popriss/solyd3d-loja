export function generateWhatsAppLink(cartItems, total, phoneNumber, customerName, customerMessage) {
  let message = `Olá! Meu nome é *${customerName}* e gostaria de fazer o seguinte pedido:\n\n`;

  cartItems.forEach((item) => {
    const price = `R$ ${Number(item.salePrice || 0).toFixed(2).replace('.', ',')}`;
    const colorText = item.selectedColor && item.selectedColor !== "default" ? ` [Cor: ${item.selectedColor}]` : "";
    message += `${item.quantity}x ${item.name}${colorText} - ${price}\n`;
  });

  const formattedTotal = `R$ ${Number(total).toFixed(2).replace('.', ',')}`;

  message += `\n*Total: ${formattedTotal}*`;

  if (customerMessage && customerMessage.trim()) {
    message += `\n\n*Observação:*\n${customerMessage.trim()}`;
  }

  const encodedMessage = encodeURIComponent(message);
  
  // Limpar formatação do número se houver
  const cleanNumber = phoneNumber.replace(/\D/g, "");

  return `https://wa.me/${cleanNumber}?text=${encodedMessage}`;
}
