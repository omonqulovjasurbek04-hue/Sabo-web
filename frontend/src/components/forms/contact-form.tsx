"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import { CheckIcon } from "@/components/ui/icons";
import { apiClient } from "@/lib/api-client";
import type { Dictionary } from "@/lib/i18n/dictionary";
import { cn } from "@/lib/utils";

interface ContactFormProps {
  dict: Dictionary;
}

type FormValues = {
  name: string;
  phone: string;
  email: string;
  message: string;
};

type FormErrors = Partial<Record<keyof FormValues, string>>;

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_PATTERN = /^\+?[0-9\s\-()]{7,17}$/;

export function ContactForm({ dict }: ContactFormProps) {
  const [values, setValues] = useState<FormValues>({
    name: "",
    phone: "",
    email: "",
    message: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const setField = (field: keyof FormValues, value: string) => {
    setValues((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: undefined }));
  };

  const validate = (): FormErrors => {
    const next: FormErrors = {};
    if (!values.name.trim()) next.name = dict.contact.validation.required;
    if (!values.phone.trim()) {
      next.phone = dict.contact.validation.required;
    } else if (!PHONE_PATTERN.test(values.phone.trim())) {
      next.phone = dict.contact.validation.phone;
    }
    if (!values.email.trim()) {
      next.email = dict.contact.validation.required;
    } else if (!EMAIL_PATTERN.test(values.email.trim())) {
      next.email = dict.contact.validation.email;
    }
    if (!values.message.trim()) next.message = dict.contact.validation.required;
    return next;
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const next = validate();
    setErrors(next);
    if (Object.keys(next).length > 0) return;

    setLoading(true);
    setSubmitError(null);

    const res = await apiClient.sendContactMessage({
      name: values.name.trim(),
      phone: values.phone.trim(),
      email: values.email.trim(),
      message: values.message.trim(),
      subject: "Mijoz qayta aloqa xabari",
    });

    setLoading(false);

    if (res.success || res.data) {
      setSubmitted(true);
    } else {
      setSubmitError(res.error?.message || "Xabar yuborishda xatolik yuz berdi");
    }
  };

  if (submitted) {
    return (
      <div className="flex flex-col items-start gap-4 p-8 sm:p-10 rounded-2xl border border-border bg-surface shadow-xs">
        <span
          className="inline-flex items-center justify-center size-14 rounded-2xl bg-accent-soft text-accent"
          aria-hidden="true"
        >
          <CheckIcon width={28} height={28} />
        </span>
        <h3 className="font-sans font-bold text-xl text-foreground">{dict.contact.success}</h3>
        <p className="text-muted text-base leading-relaxed">{dict.contact.successHint}</p>
      </div>
    );
  }

  const inputClass = (field: keyof FormValues) =>
    cn(
      "w-full px-4 py-3 rounded-xl border bg-surface text-foreground text-sm sm:text-base outline-none transition-all placeholder:text-muted",
      errors[field]
        ? "border-primary ring-2 ring-primary-soft"
        : "border-border-strong focus:border-secondary focus:ring-2 focus:ring-secondary-soft"
    );

  return (
    <form
      className="flex flex-col gap-5 p-6 sm:p-8 rounded-2xl border border-border bg-surface shadow-xs"
      onSubmit={handleSubmit}
      noValidate
    >
      <div className="flex flex-col gap-2">
        <label className="text-sm font-semibold text-foreground" htmlFor="contact-name">
          {dict.contact.name}
        </label>
        <input
          id="contact-name"
          type="text"
          className={inputClass("name")}
          value={values.name}
          onChange={(event) => setField("name", event.target.value)}
          placeholder={dict.contact.namePlaceholder}
          aria-invalid={errors.name ? "true" : undefined}
        />
        {errors.name ? (
          <span className="text-xs text-primary font-medium" role="alert">
            {errors.name}
          </span>
        ) : null}
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-sm font-semibold text-foreground" htmlFor="contact-phone">
          {dict.contact.phone}
        </label>
        <input
          id="contact-phone"
          type="tel"
          className={inputClass("phone")}
          value={values.phone}
          onChange={(event) => setField("phone", event.target.value)}
          placeholder={dict.contact.phonePlaceholder}
          aria-invalid={errors.phone ? "true" : undefined}
        />
        {errors.phone ? (
          <span className="text-xs text-primary font-medium" role="alert">
            {errors.phone}
          </span>
        ) : null}
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-sm font-semibold text-foreground" htmlFor="contact-email">
          {dict.contact.email}
        </label>
        <input
          id="contact-email"
          type="email"
          className={inputClass("email")}
          value={values.email}
          onChange={(event) => setField("email", event.target.value)}
          placeholder={dict.contact.emailPlaceholder}
          aria-invalid={errors.email ? "true" : undefined}
        />
        {errors.email ? (
          <span className="text-xs text-primary font-medium" role="alert">
            {errors.email}
          </span>
        ) : null}
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-sm font-semibold text-foreground" htmlFor="contact-message">
          {dict.contact.message}
        </label>
        <textarea
          id="contact-message"
          className={inputClass("message")}
          value={values.message}
          onChange={(event) => setField("message", event.target.value)}
          placeholder={dict.contact.messagePlaceholder}
          rows={5}
          aria-invalid={errors.message ? "true" : undefined}
        />
        {errors.message ? (
          <span className="text-xs text-primary font-medium" role="alert">
            {errors.message}
          </span>
        ) : null}
      </div>

      {submitError ? (
        <div className="p-3.5 rounded-xl bg-primary/10 border border-primary/20 text-primary text-xs font-semibold">
          {submitError}
        </div>
      ) : null}

      <Button type="submit" size="lg" className="w-full font-bold" disabled={loading}>
        {loading ? "Yuborilmoqda..." : dict.contact.submit}
      </Button>

      <p className="text-xs text-muted leading-relaxed">{dict.contact.formNote}</p>
    </form>
  );
}