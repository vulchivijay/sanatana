/* Storage abstraction to choose between sessionStorage and localStorage per key.
 * Default policy: use `localStorage` for keys unless explicitly registered
 * as session-scoped via opts. This makes preferences persist across browser
 * restarts by default while still allowing callers to request session storage
 * when needed.
 */
export type StorageType = "local" | "session";

const LOCAL_KEYS = new Set<string>([
  // Keys that should persist across browser sessions
  "sanatana_dharma_language",
]);

export function addLocalKey(key: string) {
  try {
    LOCAL_KEYS.add(key);
  } catch (e) {
    // noop
  }
}

function getStorage(useLocal: boolean) {
  if (typeof window === "undefined") return null;
  try {
    return useLocal ? window.localStorage : window.sessionStorage;
  } catch (e) {
    return null;
  }
}

export function isLocalKey(key: string) {
  return LOCAL_KEYS.has(key);
}

export function getItem(key: string, opts?: { type?: StorageType }) {
  const useLocal = opts?.type ? opts.type === "local" : true;
  const s = getStorage(useLocal);
  if (!s) return null;
  try {
    return s.getItem(key);
  } catch (e) {
    return null;
  }
}

export function setItem(key: string, value: string, opts?: { type?: StorageType }) {
  const useLocal = opts?.type ? opts.type === "local" : true;
  const s = getStorage(useLocal);
  if (!s) return false;
  try {
    s.setItem(key, value);
    return true;
  } catch (e) {
    return false;
  }
}

export function removeItem(key: string, opts?: { type?: StorageType }) {
  const useLocal = opts?.type ? opts.type === "local" : true;
  const s = getStorage(useLocal);
  if (!s) return false;
  try {
    s.removeItem(key);
    return true;
  } catch (e) {
    return false;
  }
}

export default {
  getItem,
  setItem,
  removeItem,
  addLocalKey,
  isLocalKey,
};
