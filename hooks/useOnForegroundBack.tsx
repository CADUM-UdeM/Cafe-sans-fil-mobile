import React, { useEffect, useState } from "react";
import { AppState, AppStateStatus } from "react-native";

/**
 * Hook to run a function when the app comes back to the foreground.
 *
 * Foreground refers to the app being open and visible to the user.
 *
 * @param runOnForegroundBack Function to run when the app comes back to the foreground.
 */
export default function useOnForegroundBack(runOnForegroundBack: () => void) {
  // State to store the current app state, default is the current state.
  const [appState, setAppState] = useState<AppStateStatus>(
    AppState.currentState
  );

  // State to store whether the app has come back to the foreground.
  const [isBackToForeground, setIsBackToForeground] = useState(true);

  useEffect(() => {
    // FIXME: Remove this log after testing.
    console.log("SECOND USE EFFECT");

    // Function to handle the app state change event.
    const handleAppStateChange = (nextAppState: AppStateStatus) => {
      // If the app was in the background or inactive and is now active.
      if (appState.match(/inactive|background/) && nextAppState === "active") {
        // FIXME: Remove this log after testing.
        console.info("App has come back to the foreground!");

        // Run the function passed as a parameter.
        runOnForegroundBack();

        setIsBackToForeground(true);
      } else {
        setIsBackToForeground(false);
      }

      setAppState(nextAppState);
    };

    // When the app state changes, call the function to handle the change.
    const subscription = AppState.addEventListener(
      "change",
      handleAppStateChange
    );

    // Remove the event listener when the component is unmounted.
    return () => {
      subscription.remove();
    };

  }, [appState]);
}
