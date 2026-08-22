import { redirect } from "next/navigation";
import { isLocale } from "@/lib/i18n/locales";

interface LoginPageProps {
  params: Promise<{ locale: string }>;
}

export default async function LoginPage({ params }: LoginPageProps) {
  const { locale = "uz" } = await params;
  const validLocale = isLocale(locale) ? locale : "uz";
  redirect(`/${validLocale}/admin`);
}
