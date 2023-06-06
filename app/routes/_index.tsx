import type { Message, User } from "@prisma/client";
import {
  useRevalidator,
  useRouteLoaderData,
  useSubmit,
} from "@remix-run/react";
import {
  Avatar,
  Box,
  CompositeZIndex,
  Dropdown,
  FixedZIndex,
  Flex,
  Icon,
  IconButton,
  Layer,
  Sticky,
  Text,
  TextArea,
  Toast,
  Tooltip,
} from "gestalt";
import millify from "millify";
import { useCallback, useEffect, useReducer, useRef, useState } from "react";
import { useEventSource } from "remix-utils";
import SmallContainer from "../components/SmallContainer";
import type { RootData } from "../root";

export default function () {
  const [value, setValue] = useState("");

  const submit = useSubmit();
  const loaderData = useRouteLoaderData("root") as RootData;
  const revalidator = useRevalidator();

  let lastMessageId = useEventSource("/message", {
    event: "new-message",
  });

  useEffect(() => revalidator.revalidate(), [lastMessageId]);

  const handleSubmit = useCallback(() => {
    if (value === "") return;
    const formData = new FormData();
    formData.append("message", value);
    submit(formData, { method: "POST", replace: true, action: "/" });
    clearValue();
  }, [submit, value]);
  const clearValue = () => {
    setValue("");
  };

  const handleChange = useCallback(
    ({ value }: { value: string }) => setValue(value),
    []
  );

  const handleKeyDown = useCallback(
    ({ event }: { event: React.KeyboardEvent<HTMLTextAreaElement> }) => {
      if (event.key === "Enter" && !event.shiftKey) {
        event.preventDefault();
        handleSubmit();
      }
    },
    [handleSubmit]
  );

  if (
    !loaderData.messages ||
    loaderData.messages == undefined ||
    loaderData.messages.length === 0
  )
    return null;

  return (
    <SmallContainer>
      <Header />
      <Box marginTop={3}>
        <Flex gap={6} direction="column">
          <Flex gap={1} alignItems="center">
            <Text color="subtle" size="100">
              {loaderData.messageCount} chats
            </Text>
          </Flex>
          {loaderData?.messages?.map((message) => (
            <>
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
            </>
          ))}
          <Box />
        </Flex>
      </Box>

      <Sticky bottom={0}>
        <Box
          display="flex"
          justifyContent="between"
          alignItems="center"
          color="light"
          padding={1}
        >
          <Flex.Item flex="grow">
            <TextArea
              id="text"
              onChange={handleChange}
              onKeyDown={handleKeyDown}
              placeholder="Ask Chat-GPT questions or advice to humans"
              rows={2}
              value={value}
            />
          </Flex.Item>
          <Box marginStart={1}>
            <IconButton
              icon="send"
              size="lg"
              accessibilityLabel="send"
              onClick={handleSubmit}
            />
          </Box>
        </Box>
      </Sticky>
    </SmallContainer>
  );
}
const PAGE_HEADER_ZINDEX = new FixedZIndex(10);
const Header = () => {
  const loaderData = useRouteLoaderData("root") as RootData;
  const [showToast, setShowToast] = useState(false);
  const [open, toggleOpen] = useReducer((s) => !s, false);
  const anchorRef = useRef(null);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(
      "Hey, I'm inviting you to Chat-8B. You can ask Chat-GPT questions or advice to humans. I'm sharing this to so we chat with all 8 billion of us https://chat8b.fly.dev"
    );
    setShowToast(true);
    setTimeout(() => {
      setShowToast(false);
    }, 1000); // Hide the toast after 3 seconds
  };

  return (
    <Sticky top={0}>
      {showToast && <BottomToast />}
      <Box
        display="flex"
        justifyContent="between"
        alignItems="center"
        borderStyle="shadow"
        color="light"
        padding={2}
        rounding={5}
      >
        <IconButton
          accessibilityLabel="users"
          icon="person-add"
          size="md"
          onClick={copyToClipboard}
        />
        <Box>
          <Box display="flex" alignItems="center">
            <Text weight="bold" size="500">
              Chat-8B
            </Text>
            <Box marginStart={1}>
              <Tooltip
                zIndex={PAGE_HEADER_ZINDEX}
                text="Ask Chat-GPT questions or adivice to humans. Share to reach all 8 billion of us."
              >
                <Icon icon="info-circle" accessibilityLabel="info" />
              </Tooltip>
            </Box>
          </Box>
          <Flex justifyContent="center" gap={1}>
            <Box
              color="successBase"
              padding={1}
              rounding="circle"
              display="inlineBlock"
            />
            <Text inline size="100">
              {millify(loaderData?.onlineCount ?? 0)} online
            </Text>{" "}
            <Text size="100" inline>
              {millify(loaderData?.userCount ?? 0)} users
            </Text>
          </Flex>
        </Box>
        <IconButton
          accessibilityLabel="more"
          icon="ellipsis"
          size="md"
          ref={anchorRef}
          onClick={toggleOpen}
          selected={open}
        />
      </Box>
      {open && (
        <Dropdown
          anchor={anchorRef.current}
          id="more-dropdown"
          onDismiss={toggleOpen}
          zIndex={new CompositeZIndex([PAGE_HEADER_ZINDEX])}
        >
          <Dropdown.Link
            option={{
              value: "Follow Dev on Twitter",
              label: "Folow Dev on Twitter",
            }}
            isExternal
            href="https://twitter.com/zifahm1"
          />

          <Dropdown.Link
            option={{
              value: "See Chat-8B Codebase",
              label: "Chat-8B Codebase",
            }}
            isExternal
            href="https://github.com/zifahm/chat8b"
          />
        </Dropdown>
      )}
    </Sticky>
  );
};

const Bubble = ({
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
            <Text>{message.message}</Text>
          </Box>
          <Box marginStart={1}>
            <Flex justifyContent="end" gap={2} alignItems="center">
              <Text size="100" color="subtle">
                {new Date(message.createdAt).getHours()}:
                {new Date(message.createdAt).getMinutes()}
              </Text>
              <Box>
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
              </Box>
            </Flex>
          </Box>
        </Box>
      </Flex>
    </Box>
  );
};

const BubbleUser = ({
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
            color="light"
            borderStyle="sm"
            rounding={4}
            padding={5}
            marginBottom={1}
            marginTop={1}
          >
            <Text>{message.message}</Text>
          </Box>
          <Flex justifyContent="start" gap={2} alignItems="center">
            <Box>
              <Text size="100" color="subtle" inline>
                {millify(view)}
              </Text>{" "}
              <Icon
                icon="graph-bar"
                color="subtle"
                accessibilityLabel="view"
                inline
                size={10}
              />
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

const BottomToast = () => {
  return (
    <Layer zIndex={{ index: () => 9999999 }}>
      <Box
        dangerouslySetInlineStyle={{
          __style: {
            bottom: 50,
            left: "50%",
            transform: "translateX(-50%)",
          },
        }}
        width="100%"
        paddingX={1}
        position="fixed"
        display="flex"
        justifyContent="center"
      >
        <Toast
          //@ts-ignore
          type="success"
          text={<Text inline>Copied invitaion to clipboard</Text>}
        />
      </Box>
    </Layer>
  );
};
