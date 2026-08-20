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

export function validateRegister(body: any): ValidationResult<{ name: string; phone: string; password?: string; email?: string }> {
  const errors: Record<string, string> = {};
  
  if (!body.name || typeof body.name !== "string" || body.name.trim().length < 2) {
    errors.name = "Ism kamida 2 ta belgidan iborat bo'lishi kerak";
  }

  if (!body.phone || !validatePhone(body.phone)) {
    errors.phone = "Yaroqli telefon raqamini kiriting (masalan: +998901234567)";
  }

  if (body.email && !validateEmail(body.email)) {
    errors.email = "Yaroqli elektron pochta manzilini kiriting";
  }

  if (body.password && (typeof body.password !== "string" || body.password.length < 6)) {
    errors.password = "Parol kamida 6 ta belgidan iborat bo'lishi kerak";
  }

  if (Object.keys(errors).length > 0) {
    return { success: false, errors };
  }

  return {
    success: true,
    data: {
      name: body.name.trim(),
      phone: body.phone.replace(/[\s-()]/g, ""),
      email: body.email?.trim().toLowerCase(),
      password: body.password,
    },
  };
}

export function validateLogin(body: any): ValidationResult<{ phone?: string; email?: string; password?: string }> {
  const errors: Record<string, string> = {};

  if (!body.phone && !body.email) {
    errors.identifier = "Telefon raqam yoki email kiritilishi shart";
  }

  if (body.phone && !validatePhone(body.phone)) {
    errors.phone = "Yaroqsiz telefon raqami";
  }

  if (body.email && !validateEmail(body.email)) {
    errors.email = "Yaroqsiz email";
  }

  if (Object.keys(errors).length > 0) {
    return { success: false, errors };
  }

  return {
    success: true,
    data: {
      phone: body.phone ? body.phone.replace(/[\s-()]/g, "") : undefined,
      email: body.email?.trim().toLowerCase(),
      password: body.password,
    },
  };
}

export function validateContact(body: any): ValidationResult<{ name: string; phone: string; message: string; email?: string; subject?: string }> {
  const errors: Record<string, string> = {};

  if (!body.name || typeof body.name !== "string" || body.name.trim().length < 2) {
    errors.name = "Ismingizni to'liq kiriting";
  }

  if (!body.phone || !validatePhone(body.phone)) {
    errors.phone = "To'g'ri telefon raqam kiriting";
  }

  if (!body.message || typeof body.message !== "string" || body.message.trim().length < 5) {
    errors.message = "Xabar matni kamida 5 ta belgidan iborat bo'lishi kerak";
  }

  if (body.email && !validateEmail(body.email)) {
    errors.email = "Noto'g'ri email formati";
  }

  if (Object.keys(errors).length > 0) {
    return { success: false, errors };
  }

  return {
    success: true,
    data: {
      name: body.name.trim(),
      phone: body.phone.replace(/[\s-()]/g, ""),
      message: body.message.trim(),
      email: body.email?.trim().toLowerCase(),
      subject: body.subject?.trim(),
    },
  };
}

export function validateOrder(body: any): ValidationResult<{
  items: Array<{ productId: string; quantity: number; volume?: string }>;
  customerName: string;
  customerPhone: string;
  address: string;
  notes?: string;
  paymentMethod: "click" | "payme" | "cash";
}> {
  const errors: Record<string, string> = {};

  if (!Array.isArray(body.items) || body.items.length === 0) {
    errors.items = "Savatcha bo'sh bo'lishi mumkin emas";
  }

  if (!body.customerName || typeof body.customerName !== "string" || body.customerName.trim().length < 2) {
    errors.customerName = "Buyurtmachi ismini kiriting";
  }

  if (!body.customerPhone || !validatePhone(body.customerPhone)) {
    errors.customerPhone = "Bog'lanish uchun telefon raqamini kiriting";
  }

  if (!body.address || typeof body.address !== "string" || body.address.trim().length < 5) {
    errors.address = "Yetkazib berish manzilini to'liq kiriting";
  }

  const validPayments = ["click", "payme", "cash"];
  if (!body.paymentMethod || !validPayments.includes(body.paymentMethod)) {
    errors.paymentMethod = "To'lov turini tanlang (click, payme, cash)";
  }

  if (Object.keys(errors).length > 0) {
    return { success: false, errors };
  }

  return {
    success: true,
    data: {
      items: body.items,
      customerName: body.customerName.trim(),
      customerPhone: body.customerPhone.replace(/[\s-()]/g, ""),
      address: body.address.trim(),
      notes: body.notes?.trim(),
      paymentMethod: body.paymentMethod,
    },
  };
}
