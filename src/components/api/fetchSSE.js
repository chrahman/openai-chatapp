import { createParser } from "eventsource-parser";
import { streamAsyncIterable } from "./stream-async-iterable";
import { toast } from "react-toastify";

export async function fetchSSE(resource, options) {
  const { onMessage, ...fetchOptions } = options;
  const resp = await fetch(resource, fetchOptions);
  if (!resp.ok) {
    const error = await resp.json().catch(() => ({}));
    toast.error(`API Error Code: ${resp.status} ${resp.statusText}`, {
      position: "bottom-center",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
    });
    throw new Error(
      !isEmpty(error)
        ? JSON.stringify(error)
        : `Status Code: ${resp.status} ${resp.statusText}`
    );
  }
  const parser = createParser((event) => {
    if (event.type === "event") {
      onMessage(event.data);
      // console.log("parser event", event.data)
    }
  });
  for await (const chunk of streamAsyncIterable(resp.body)) {
    const str = new TextDecoder().decode(chunk);
    parser.feed(str);
  }
}

function isEmpty(obj) {
  for (let key in obj) {
    if (obj.hasOwnProperty(key)) {
      return false;
    }
  }
  return true;
}
