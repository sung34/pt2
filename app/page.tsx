import { redirect } from "next/navigation";

export default function Page() {
  redirect("/students");
  return null;
}
