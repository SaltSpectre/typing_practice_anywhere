import React, { Fragment } from "react";
import { getDefaultPreference } from "./chromeSynced";
import { createChromeSyncedReactContext } from "./chromeSyncedReactContext";

export const GeneralOptionContextProvider = createChromeSyncedReactContext(
	getDefaultPreference("useCpm", "animated", "normalizeSpecialChars", "normalizeAccents", "skipSpecialChars", "useLowercaseOnly", "fontFamily", "fontSize", "fontWeight")
);
export const generalOptionContextType = GeneralOptionContextProvider.contextType;