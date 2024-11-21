import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { runUserChecks } from "./userMiddleware";
import { checkDailyLogin } from "./dailyLoginCheck";

export async function withAuth(callback: (userId: string) => Promise<any>) {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect('/auth/signin');
  }

  // Run checks in parallel
  Promise.all([
    runUserChecks(session.user.id),
    checkDailyLogin(session.user.id)
  ]).catch(console.error);

  return callback(session.user.id);
} 