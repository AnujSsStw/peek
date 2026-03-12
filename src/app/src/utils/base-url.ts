import Constants from "expo-constants";

/**
 * Extend this function when going to production by
 * setting the baseUrl to your production API URL.
 */
export const getBaseUrl = () => {
  const publicAuthBaseUrl = process.env.EXPO_PUBLIC_AUTH_BASE_URL?.trim();

  if (publicAuthBaseUrl) {
    return publicAuthBaseUrl.replace(/\/+$/, "");
  }

  /**
   * Gets the IP address of your host-machine. If it cannot automatically find it,
   * you'll have to manually set it. NOTE: Port 3000 should work for most but confirm
   * you don't have anything else running on it, or you'd have to change it.
   *
   * **NOTE**: This is only for development. In production, you'll want to set the
   * baseUrl to your production API URL.
   */
  const debuggerHost = Constants.expoConfig?.hostUri;
  const localhost = debuggerHost?.split(":")[0];

  if (!localhost) {
    // return "https://turbo.t3.gg";
    // return "http://192.168.29.157:3000";
    return "https://peek-snowy.vercel.app";
    throw new Error(
      "Failed to get localhost. Please point to your production server.",
    );
  }
  return `http://${localhost}:3000`;
};
