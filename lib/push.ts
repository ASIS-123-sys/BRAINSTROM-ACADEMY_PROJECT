// It is recommended to remove this block and run: npm install -D @types/web-push
declare module "web-push" {
  const webpush: {
    setVapidDetails(
      subject: string,
      publicKey: string,
      privateKey: string,
    ): void;
    sendNotification(
      subscription: {
        endpoint: string;
        keys: { p256dh: string; auth: string };
      },
      payload: string,
    ): Promise<unknown>;
  };

  export default webpush;
}

import webpush from "web-push";
import { createAdminClient } from "@/lib/supabase";

webpush.setVapidDetails(
  process.env.VAPID_SUBJECT!,
  process.env.VAPID_PUBLIC_KEY!,
  process.env.VAPID_PRIVATE_KEY!,
);

type PushPayload = { title: string; body: string; url?: string };

function getWebPushStatusCode(err: unknown): number | undefined {
  if (typeof err === "object" && err !== null && "statusCode" in err) {
    const statusCode = (err as { statusCode?: unknown }).statusCode;
    return typeof statusCode === "number" ? statusCode : undefined;
  }

  return undefined;
}

// Sends a push notification to every subscribed student (used for notices)
export async function sendPushToAll(payload: PushPayload) {
  const supabase = createAdminClient();
  const { data: subs } = await supabase.from("push_subscriptions").select("*");

  if (!subs || subs.length === 0) return { sent: 0, failed: 0 };

  let sent = 0;
  let failed = 0;

  await Promise.all(
    subs.map(async (sub) => {
      try {
        await webpush.sendNotification(
          {
            endpoint: sub.endpoint,
            keys: { p256dh: sub.p256dh, auth: sub.auth },
          },
          JSON.stringify(payload),
        );
        sent++;
      } catch (err) {
        failed++;
        const statusCode = getWebPushStatusCode(err);
        if (statusCode === 410 || statusCode === 404) {
          await supabase
            .from("push_subscriptions")
            .delete()
            .eq("endpoint", sub.endpoint);
        }
      }
    }),
  );

  return { sent, failed };
}

// Sends a push notification to one specific student (used for fee updates)
export async function sendPushToStudent(
  studentId: string,
  payload: PushPayload,
) {
  const supabase = createAdminClient();
  const { data: subs } = await supabase
    .from("push_subscriptions")
    .select("*")
    .eq("student_id", studentId);

  if (!subs || subs.length === 0) return { sent: 0, failed: 0 };

  let sent = 0;
  let failed = 0;

  await Promise.all(
    subs.map(async (sub) => {
      try {
        await webpush.sendNotification(
          {
            endpoint: sub.endpoint,
            keys: { p256dh: sub.p256dh, auth: sub.auth },
          },
          JSON.stringify(payload),
        );
        sent++;
      } catch (err) {
        failed++;
        const statusCode = getWebPushStatusCode(err);
        if (statusCode === 410 || statusCode === 404) {
          await supabase
            .from("push_subscriptions")
            .delete()
            .eq("endpoint", sub.endpoint);
        }
      }
    }),
  );

  return { sent, failed };
}
