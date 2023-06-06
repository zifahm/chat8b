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
import gestaltStyle from "gestalt/dist/gestalt.css";

import { ColorSchemeProvider } from "gestalt";
import isbot from "isbot";
import { promiseHash } from "remix-utils";
import type { Message } from "./models/message.server";
import {
  createMessage,
  getLatestMessages,
  getMessageCount,
} from "./models/message.server";
import type { User } from "./models/user.server";
import {
  createUser,
  currentOnline,
  getChatViewCount,
  getUserCount,
} from "./models/user.server";
import {
  createUserSessionCookieHeader,
  getUser,
} from "./services/session.server";

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: gestaltStyle },
];

const DEFAULT_MARKETING_IMAGE =
  "https://res.cloudinary.com/bespoke-cloudinary/image/upload/f_auto/v1686076084/Group_8_1_xvs0ko.jpg";
const description = "A single chat room for all 8 billion humans.";

export const meta: V2_MetaFunction = () => {
  return [
    { title: `Chat-8B | ${description}` },
    { description },
    { property: "og:url", content: "https://chat8b.online" },
    { property: "og:title", content: "Chat-8B" },
    { property: "og:site_name", content: "Chat-8B" },
    { property: "og:type", content: "website" },
    { property: "og:description", content: description },
    {
      property: "og:image",
      content: DEFAULT_MARKETING_IMAGE,
    },
    {
      property: "og:image:secure_url",
      content: DEFAULT_MARKETING_IMAGE,
    },
    {
      property: "og:image:width",
      content: "1600",
    },
    {
      property: "og:image:height",
      content: "900",
    },
    {
      property: "twitter:card",
      content: "summary_large_image",
    },
    {
      property: "twitter:title",
      content: "Chat-8B",
    },
    {
      property: "twitter:image",
      content: DEFAULT_MARKETING_IMAGE,
    },
    {
      property: "twitter:description",
      content: description,
    },
  ];
};

export interface RootData {
  user?: User | null | undefined;
  messages?: (Message & { user: User })[] | null | undefined;
  userCount?: number | null | undefined;
  onlineCount?: number | null | undefined;
  messageCount?: number | null | undefined;
  chatViewCount?: number | null | undefined;
}

export const loader = async ({ request }: LoaderArgs) => {
  const bot = isbot(request.headers.get("user-agent"));
  if (bot) return json<RootData>({});

  const user = await getUser(request);
  let setcookie = null;
  if (!user) {
    const user = await createUser();
    setcookie = await createUserSessionCookieHeader({
      request,
      userId: user.id,
    });
  }

  return json<RootData>(
    {
      user,
      ...(await promiseHash({
        messages: getLatestMessages(),
        userCount: getUserCount(),
        onlineCount: currentOnline(),
        messageCount: getMessageCount(),
        chatViewCount: getChatViewCount(),
      })),
    },
    setcookie
      ? {
          headers: {
            "Set-Cookie": setcookie,
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
      <body className="h-full" style={{ backgroundColor: "black" }}>
        <ColorSchemeProvider colorScheme="dark">
          <Outlet />
        </ColorSchemeProvider>
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}
