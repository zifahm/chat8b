import type { Message, User } from "@prisma/client";
import { Avatar, Box, Flex, Text } from "gestalt";
import millify from "millify";

export const Bubble = ({
  user,
  message,
  view,
}: {
  user: User;
  message: Message;
  view: number;
}) => {
  return (
    <Box display="flex" justifyContent="start" alignItems="end">
      <Avatar name={user.name} size="sm" />
      <Flex direction="column" gap={1}>
        <Box display="flex" direction="column">
          <Text size="100" color="subtle">
            {user.name}
          </Text>
          <Box
            color="lightWash"
            borderStyle="none"
            rounding={4}
            padding={5}
            marginBottom={1}
            marginTop={1}
          >
            <Text overflow="breakWord" lineClamp={20}>
              {message.message}
            </Text>
          </Box>
          <Box marginStart={1}>
            <Flex justifyContent="end" gap={2} alignItems="center">
              <Text size="100" color="subtle">
                {new Date(message.createdAt).getHours()}:
                {new Date(message.createdAt).getMinutes()}
              </Text>
              {/* <Box>
                <Icon
                  icon="graph-bar"
                  color="subtle"
                  accessibilityLabel="view"
                  inline
                  size={10}
                />{" "}
                <Text size="100" color="subtle" inline>
                  {millify(view)}
                </Text>
              </Box> */}
            </Flex>
          </Box>
        </Box>
      </Flex>
    </Box>
  );
};

export const BubbleUser = ({
  message,
  view,
  user,
}: {
  user: User;
  message: Message;
  view: number;
}) => {
  return (
    <Box display="flex" justifyContent="end" alignItems="end">
      <Flex direction="column" gap={1}>
        <Box display="flex" direction="column">
          <Flex justifyContent="end">
            <Text size="100" color="subtle">
              {user.name}
            </Text>
          </Flex>
          <Box
            color="dark"
            borderStyle="sm"
            rounding={4}
            padding={5}
            marginBottom={1}
            marginTop={1}
          >
            <Text lineClamp={20} overflow="breakWord">
              {message.message}
            </Text>
          </Box>
          <Flex justifyContent="start" gap={2} alignItems="center">
            <Box>
              <Text size="100" color="subtle" inline>
                {millify(view)} views
              </Text>{" "}
              {/* <Icon
                icon="graph-bar"
                color="subtle"
                accessibilityLabel="view"
                inline
                size={10}
              /> */}
            </Box>
            <Text size="100" color="subtle">
              {new Date(message.createdAt).getHours()}:
              {new Date(message.createdAt).getMinutes()}
            </Text>
          </Flex>
        </Box>
      </Flex>
    </Box>
  );
};
