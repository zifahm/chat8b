import { useRouteLoaderData } from "@remix-run/react";
import SmallContainer from "../../components/SmallContainer";
import type { RootData } from "../../root";
import Chat from "./Chat";
import { Header } from "./Header";
import Message from "./Message";

export default function () {
  const loaderData = useRouteLoaderData("root") as RootData;
  if (
    !loaderData.messages ||
    loaderData.messages == undefined ||
    loaderData.messages.length === 0
  )
    return null;

  return (
    <SmallContainer>
      <Header />
      <Message />
      <Chat />
    </SmallContainer>
  );
}
