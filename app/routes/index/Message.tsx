import { useRouteLoaderData } from "@remix-run/react";
import { Box, Flex, Text } from "gestalt";
import { Fragment } from "react";
import type { RootData } from "../../root";
import { Bubble, BubbleUser } from "./message/Bubbles";

export default function Message() {
  const loaderData = useRouteLoaderData("root") as RootData;
  return (
    <Box marginTop={3}>
      <Flex gap={6} direction="column">
        <Flex gap={1} alignItems="center">
          <Text color="subtle" size="100">
            {loaderData.messageCount} chats
          </Text>
        </Flex>
        {loaderData?.messages?.map((message) => (
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
        ))}
        <Box />
      </Flex>
    </Box>
  );
}
