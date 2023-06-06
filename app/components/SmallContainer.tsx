import { Box, Flex } from "gestalt";
import React from "react";

export default function SmallContainer({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Flex alignItems="stretch" justifyContent="center">
      <Box maxWidth={480} width="100%">
        {children}
      </Box>
    </Flex>
  );
}
