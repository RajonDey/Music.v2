import { redirect } from "next/navigation";

export default function VocalPage() {
  redirect("/skills?tab=vocal#voice");
}
