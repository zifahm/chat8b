import { Box, Flex } from "gestalt";
import React, { useEffect, useRef } from "react";

export default function SmallContainer({
  children,
}: {
  children: React.ReactNode;
}) {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "smooth", block: "end" });
    }
  });

  return (
    <Flex alignItems="stretch" justifyContent="center">
      <Box ref={scrollRef} maxWidth={480} width="100%">
        {children}
      </Box>
    </Flex>
  );
}
