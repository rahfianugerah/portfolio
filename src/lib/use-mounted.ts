import { useSyncExternalStore } from "react";

const subscribe = () => () => {};

/**
 * False while the server renders and while the client hydrates, true from then on.
 *
 * Every widget here used to keep this flag in state and set it from an effect, which React 19's
 * lint rules flag as a cascading render. useSyncExternalStore gives the same two answers without
 * the second render pass.
 */
export function useMounted() {
  return useSyncExternalStore(subscribe, () => true, () => false);
}
