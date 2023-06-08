import { useRevalidator, useRouteLoaderData } from "@remix-run/react";
import { Box, Flex, Text } from "gestalt";
import { Fragment, useEffect, useMemo } from "react";
import { useEventSource } from "remix-utils";
import type { RootData } from "../../root";
import { Bubble, BubbleUser } from "./message/Bubbles";

export default function Message() {
  const loaderData = useRouteLoaderData("root") as RootData;
  const revalidator = useRevalidator();

  let lastMessageId = useEventSource("/message", {
    event: "new-message",
  });

  useEffect(() => revalidator.revalidate(), [lastMessageId]);

  const chat = useMemo(
    () =>
      loaderData?.messages?.map((message) => (
        <Fragment key={message.id}>
          {message.userId === loaderData.user?.id ? (
            <BubbleUser
              message={message}
              user={message.user}
              view={loaderData.chatViewCount ?? 0}
            />
          ) : (
            <Bubble
              message={message}
              user={message.user}
              view={loaderData.chatViewCount ?? 0}
            />
          )}
        </Fragment>
      )),
    [loaderData.chatViewCount, loaderData?.messages, loaderData.user?.id]
  );

  return (
    <Box marginTop={3}>
      <Flex wrap gap={6} direction="column">
        <Flex gap={1} alignItems="center">
          <Text color="subtle" size="100">
            {loaderData.messageCount} chats
          </Text>
        </Flex>
        {chat}
        <Box />
      </Flex>
    </Box>
  );
}
