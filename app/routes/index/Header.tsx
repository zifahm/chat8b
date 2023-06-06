import { useRouteLoaderData } from "@remix-run/react";
import {
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
  Toast,
  Tooltip,
} from "gestalt";
import millify from "millify";
import { useReducer, useRef, useState } from "react";
import type { RootData } from "../../root";
const PAGE_HEADER_ZINDEX = new FixedZIndex(10);

export const Header = () => {
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