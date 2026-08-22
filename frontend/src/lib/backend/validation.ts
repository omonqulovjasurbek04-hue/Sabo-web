export interface ValidationResult<T> {
  success: boolean;
  data?: T;
  errors?: Record<string, string>;
}

export function validatePhone(phone: string): boolean {
  return /^\+?[0-9]{9,15}$/.test(phone.replace(/[\s-()]/g, ""));
}

export function validateEmail(email: string): boolean {
  return /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email);
}

export function validateRegister(body: Record<string, unknown>): ValidationResult<{ name: string; phone: string; password?: string; email?: string }> {
  const errors: Record<string, string> = {};
  
  const name = typeof body.name === "string" ? body.name : "";
  const phone = typeof body.phone === "string" ? body.phone : "";
  const email = typeof body.email === "string" ? body.email : undefined;
  const password = typeof body.password === "string" ? body.password : undefined;

  if (!name || name.trim().length < 2) {
    errors.name = "Ism kamida 2 ta belgidan iborat bo'lishi kerak";
  }

  if (!phone || !validatePhone(phone)) {
    errors.phone = "Yaroqli telefon raqamini kiriting (masalan: +998901234567)";
  }

  if (email && !validateEmail(email)) {
    errors.email = "Yaroqli elektron pochta manzilini kiriting";
  }

  if (password && password.length < 6) {
    errors.password = "Parol kamida 6 ta belgidan iborat bo'lishi kerak";
  }

  if (Object.keys(errors).length > 0) {
    return { success: false, errors };
  }

  return {
    success: true,
    data: {
      name: name.trim(),
      phone: phone.replace(/[\s-()]/g, ""),
      email: email?.trim().toLowerCase(),
      password,
    },
  };
}

export function validateLogin(body: Record<string, unknown>): ValidationResult<{ phone?: string; email?: string; password?: string }> {
  const errors: Record<string, string> = {};

  const phone = typeof body.phone === "string" ? body.phone : undefined;
  const email = typeof body.email === "string" ? body.email : undefined;
  const password = typeof body.password === "string" ? body.password : undefined;

  if (!phone && !email) {
    errors.identifier = "Telefon raqam yoki email kiritilishi shart";
  }

  if (phone && !validatePhone(phone)) {
    errors.phone = "Yaroqsiz telefon raqami";
  }

  if (email && !validateEmail(email)) {
    errors.email = "Yaroqsiz email";
  }

  if (Object.keys(errors).length > 0) {
    return { success: false, errors };
  }

  return {
    success: true,
    data: {
      phone: phone ? phone.replace(/[\s-()]/g, "") : undefined,
      email: email?.trim().toLowerCase(),
      password,
    },
  };
}

export function validateContact(body: Record<string, unknown>): ValidationResult<{ name: string; phone: string; message: string; email?: string; subject?: string }> {
  const errors: Record<string, string> = {};

  const name = typeof body.name === "string" ? body.name : "";
  const phone = typeof body.phone === "string" ? body.phone : "";
  const message = typeof body.message === "string" ? body.message : "";
  const email = typeof body.email === "string" ? body.email : undefined;
  const subject = typeof body.subject === "string" ? body.subject : undefined;

  if (!name || name.trim().length < 2) {
    errors.name = "Ismingizni to'liq kiriting";
  }

  if (!phone || !validatePhone(phone)) {
    errors.phone = "To'g'ri telefon raqam kiriting";
  }

  if (!message || message.trim().length < 5) {
    errors.message = "Xabar matni kamida 5 ta belgidan iborat bo'lishi kerak";
  }

  if (email && !validateEmail(email)) {
    errors.email = "Noto'g'ri email formati";
  }

  if (Object.keys(errors).length > 0) {
    return { success: false, errors };
  }

  return {
    success: true,
    data: {
      name: name.trim(),
      phone: phone.replace(/[\s-()]/g, ""),
      message: message.trim(),
      email: email?.trim().toLowerCase(),
      subject: subject?.trim(),
    },
  };
}

export function validateOrder(body: Record<string, unknown>): ValidationResult<{
  items: Array<{ productId: string; quantity: number; volume?: string }>;
  customerName: string;
  customerPhone: string;
  address: string;
  notes?: string;
  paymentMethod: "click" | "payme" | "cash";
}> {
  const errors: Record<string, string> = {};

  const items = Array.isArray(body.items) ? (body.items as Array<{ productId: string; quantity: number; volume?: string }>) : [];
  const customerName = typeof body.customerName === "string" ? body.customerName : "";
  const customerPhone = typeof body.customerPhone === "string" ? body.customerPhone : "";
  const address = typeof body.address === "string" ? body.address : "";
  const notes = typeof body.notes === "string" ? body.notes : undefined;
  const paymentMethod = typeof body.paymentMethod === "string" ? body.paymentMethod : "";

  if (items.length === 0) {
    errors.items = "Savatcha bo'sh bo'lishi mumkin emas";
  }

  if (!customerName || customerName.trim().length < 2) {
    errors.customerName = "Buyurtmachi ismini kiriting";
  }

  if (!customerPhone || !validatePhone(customerPhone)) {
    errors.customerPhone = "Bog'lanish uchun telefon raqamini kiriting";
  }

  if (!address || address.trim().length < 5) {
    errors.address = "Yetkazib berish manzilini to'liq kiriting";
  }

  const validPayments = ["click", "payme", "cash"];
  if (!paymentMethod || !validPayments.includes(paymentMethod)) {
    errors.paymentMethod = "To'lov turini tanlang (click, payme, cash)";
  }

  if (Object.keys(errors).length > 0) {
    return { success: false, errors };
  }

  return {
    success: true,
    data: {
      items,
      customerName: customerName.trim(),
      customerPhone: customerPhone.replace(/[\s-()]/g, ""),
      address: address.trim(),
      notes: notes?.trim(),
      paymentMethod: paymentMethod as "click" | "payme" | "cash",
    },
  };
}
