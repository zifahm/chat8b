import {
  useRevalidator,
  useRouteLoaderData,
  useSubmit,
} from "@remix-run/react";
import { useCallback, useEffect, useState } from "react";
import { useEventSource } from "remix-utils";
import type { RootData } from "../root";

export default function () {
  const [value, setValue] = useState("");
  const [showToast, setShowToast] = useState(false);

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

  const copyToClipboard = () => {
    navigator.clipboard.writeText("https://chat8b.fly.dev");
    setShowToast(true);
    setTimeout(() => {
      setShowToast(false);
    }, 1000); // Hide the toast after 3 seconds
  };

  const clearValue = () => {
    setValue("");
  };

  const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setValue(event.target.value);
  };

  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (event.key === "Enter" && !event.shiftKey) {
        event.preventDefault();
        handleSubmit();
      }
    },
    [handleSubmit]
  );

  if (
    !loaderData.user ||
    !loaderData.messages ||
    !loaderData.onlineCount == null ||
    loaderData.userCount == undefined ||
    loaderData.userCount == null ||
    loaderData.userCount == undefined
  )
    return null;

  return (
    <div className="mx-auto flex h-screen max-w-md flex-col bg-gray-100">
      {/* Top bar */}
      {showToast && (
        <div className="fixed left-0 top-0 flex h-12 w-full items-center justify-center bg-gray-800 text-white">
          <p>Link copied to clipboard!</p>
        </div>
      )}
      <div className="flex items-center justify-between bg-gray-800 p-4 text-white">
        <div>
          <p className="text-lg font-bold">
            {loaderData.userCount} of 8 billion users
          </p>
          <p className="text-sm">
            {loaderData.onlineCount} online
            <span className="ml-2 inline-block h-2 w-2 rounded-full bg-green-500"></span>
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={copyToClipboard}
            className="rounded bg-blue-500 px-2 py-1 text-white hover:bg-blue-600"
          >
            Share
          </button>
          <a href="https://github.com/zifahm/chat8b">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-gray-500"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M12 0C5.373 0 0 5.373 0 12c0 5.303 3.438 9.8 8.207 11.385.6.113.793-.26.793-.578l-.007-2.003c-3.338.725-4.033-1.276-4.033-1.276-.546-1.386-1.334-1.756-1.334-1.756-1.089-.745.084-.73.084-.73 1.206.085 1.841 1.236 1.841 1.236 1.07 1.835 2.807 1.305 3.49.997.108-.765.418-1.285.76-1.581-2.665-.301-5.466-1.331-5.466-5.93 0-1.31.468-2.38 1.236-3.22-.125-.302-.535-1.524.117-3.176 0 0 1.008-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.288-1.23 3.288-1.23.656 1.652.246 2.874.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.626-5.475 5.92.432.37.816 1.102.816 2.22l-.006 3.288c0 .32.192.694.8.576C20.565 21.795 24 17.3 24 12c0-6.627-5.373-12-12-12z"
                clipRule="evenodd"
              />
            </svg>
          </a>
        </div>
      </div>
      <div className="flex-grow overflow-auto p-4">
        {/* Chat bubbles */}
        <div className="max-h-100 mt-auto flex flex-col space-y-2 overflow-y-auto">
          {/* Chat bubble */}
          {loaderData.messages?.map((message) => (
            <div
              key={message.id}
              className={`my-2 flex flex-col items-${
                message.userId === loaderData.user?.id ? "end" : "start"
              }`}
            >
              <span className="mb-1 text-xs text-gray-400">
                {/* {message.userId !== loaderData.user.id && <>You- </>} */}
                {message.user.name} {new Date(message.createdAt).getHours()}:{" "}
                {new Date(message.createdAt).getMinutes()}{" "}
              </span>
              <div
                className={`rounded-br-lg rounded-tl-lg bg-${
                  message.userId === loaderData.user?.id ? "blue" : "green"
                }-500 px-4 py-2 text-white`}
              >
                {message.message}
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* Textarea and send button */}
      <div className="flex p-4">
        <textarea
          name="message"
          className="mr-2 flex-grow rounded-lg border p-2"
          placeholder="Type a message..."
          value={value}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
        ></textarea>
        <button
          className="rounded-lg bg-blue-500 px-4 py-2 text-white"
          type="button"
          onClick={handleSubmit}
        >
          Send
        </button>
      </div>
    </div>
  );
}
