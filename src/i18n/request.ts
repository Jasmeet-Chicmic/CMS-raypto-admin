import { getRequestConfig } from "next-intl/server";
import { cookies } from "next/headers";

export default getRequestConfig(async () => {
  const cookieLocale = (await cookies()).get("locale")?.value;

  const locale = cookieLocale || "en";
  return {
    locale,
    messages: (await import(`../messages/${locale}.json`)).default,
  };
});
