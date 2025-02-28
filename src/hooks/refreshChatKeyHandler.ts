import { useEffect } from "react";

export const useRefreshChatKeyHandler = (
  functionToCall: () => void,
  key: string,
) => {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Detect operating system using user agent
      const userAgent = navigator.userAgent.toLowerCase();
      const isMac = userAgent.includes("mac");
      const isWindows = userAgent.includes("win");
      const isLinux = userAgent.includes("linux");

      // Detailed key combination checks
      const isMacPress = isMac && event.metaKey && event.key === key;
      const isWindowsPress = isWindows && event.ctrlKey && event.key === key;
      const isLinuxPress = isLinux && event.ctrlKey && event.key === key;

      if (isMacPress || isWindowsPress || isLinuxPress) {
        event.preventDefault();
        event.stopPropagation();
        functionToCall();
      }
    };

    // Add event listener
    window.addEventListener("keydown", handleKeyDown);

    // Cleanup event listener on component unmount
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [functionToCall, key]);
};
