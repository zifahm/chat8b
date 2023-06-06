import { useSubmit } from "@remix-run/react";
import { Box, Flex, IconButton, Sticky, TextArea } from "gestalt";
import { useCallback, useState } from "react";

export default function Chat() {
  const [value, setValue] = useState("");

  const submit = useSubmit();
  const clearValue = useCallback(() => {
    setValue("");
  }, []);

  const handleSubmit = useCallback(() => {
    if (value === "") return;
    const formData = new FormData();
    formData.append("message", value);
    submit(formData, { method: "POST", replace: true, action: "/" });
    clearValue();
  }, [clearValue, submit, value]);

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
  return (
    <Sticky bottom={0}>
      <Box
        display="flex"
        justifyContent="between"
        alignItems="center"
        color="dark"
        rounding={3}
        padding={1}
      >
        <Flex.Item flex="grow">
          <TextArea
            id="text"
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            placeholder="Is there something troubling you?"
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
  );
}
