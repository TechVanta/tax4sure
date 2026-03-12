import { TAX_YEARS } from "@/lib/utils";
import YearPageClient from "./YearPageClient";

export function generateStaticParams() {
  return TAX_YEARS.map((year) => ({ year: String(year) }));
}

export default function YearPage({ params }: { params: { year: string } }) {
  return <YearPageClient params={params} />;
}
