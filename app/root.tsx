import { cssBundleHref } from "@remix-run/css-bundle";
import type {
  ActionArgs,
  LinksFunction,
  LoaderArgs,
  V2_MetaFunction,
} from "@remix-run/node";
import { json } from "@remix-run/node";
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "@remix-run/react";

import isbot from "isbot";
import stylesheet from "~/tailwind.css";
import type { Message } from "./models/message.server";
import { createMessage, getLatestMessages } from "./models/message.server";
import type { User } from "./models/user.server";
import { createUser, currentOnline, getUserCount } from "./models/user.server";
import {
  createUserSessionCookieHeader,
  getUser,
} from "./services/session.server";

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: stylesheet },
  ...(cssBundleHref ? [{ rel: "stylesheet", href: cssBundleHref }] : []),
];

const DEFAULT_MARKETING_IMAGE =
  "https://res.cloudinary.com/bespoke-cloudinary/image/upload/v1685976527/Group_8_jfkrbh.png";
const description = "A conversation with 8 Billion people";

export const meta: V2_MetaFunction = () => {
  return [
    { title: `Chat-8B | ${description}` },
    { description },
    { "og:url": "https://chat8b.fly.dev" },
    { "og:title": "Chat-8B" },
    { "og:site_name": "Chat-8B" },
    { "og:type": "website" },
    { "og:description": description },
    {
      "og:image": DEFAULT_MARKETING_IMAGE,
    },
    {
      "og:image:secure_url": DEFAULT_MARKETING_IMAGE,
    },
    {
      "og:image:width": 1600,
    },
    {
      "og:image:height": 900,
    },
    {
      "twitter:card": "summary",
    },
    {
      "twitter:title": "Chat-8B",
    },
    {
      "twitter:image": DEFAULT_MARKETING_IMAGE,
    },
    {
      "twitter:description": description,
    },
  ];
};

export interface RootData {
  user: User;
  messages: (Message & { user: User })[];
  userCount: number;
  onlineCount: number;
}

export const loader = async ({ request }: LoaderArgs) => {
  const bot = isbot(request.headers.get("user-agent"));
  if (bot) return json(null);

  const user = await getUser(request);
  let header = null;
  if (!user) {
    const user = await createUser();
    header = await createUserSessionCookieHeader({
      request,
      userId: user.id,
    });
  }
  const messages = await getLatestMessages();
  return json(
    {
      user,
      messages,
      userCount: await getUserCount(),
      onlineCount: await currentOnline(),
    },
    header
      ? {
          headers: {
            "Set-Cookie": header,
          },
        }
      : undefined
  );
};

export async function action({ request }: ActionArgs) {
  const formData = await request.formData();
  const message = formData.get("message") as string;
  const user = await getUser(request);
  if (user) {
    await createMessage(message, user.id);
  }

  return json(null);
}

export default function App() {
  return (
    <html lang="en" className="h-full">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body className="h-full">
        <Outlet />
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}
