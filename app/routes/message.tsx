import type { Message } from "@prisma/client";
import type { LoaderArgs } from "@remix-run/node";
import { eventStream } from "remix-utils";
import { emitter } from "../services/emitter.server";

export async function loader({ request }: LoaderArgs) {
  return eventStream(request.signal, function setup(send) {
    function handle(message: Message) {
      send({ event: "new-message", data: message.id });
    }
    emitter.on("message", handle);
    return function clear() {
      emitter.off("message", handle);
    };
  });
}
