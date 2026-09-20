"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useServerInsertedHTML } from "next/navigation";

export interface ThemeProviderProps {
  children: React.ReactNode;
  attribute?: string;
  defaultTheme?: string;
  enableSystem?: boolean;
  disableTransitionOnChange?: boolean;
  storageKey?: string;
  themes?: string[];
  forcedTheme?: string;
}

export interface UseThemeProps {
  theme?: string;
  setTheme: (theme: string) => void;
  resolvedTheme?: string;
  themes: string[];
  systemTheme?: "dark" | "light";
  forcedTheme?: string;
}

const ThemeContext = createContext<UseThemeProps>({
  theme: "dark",
  setTheme: () => {},
  resolvedTheme: "dark",
  themes: ["light", "dark"],
  systemTheme: "dark",
});

export const useTheme = () => useContext(ThemeContext);

const disableTransitions = () => {
  const css = document.createElement("style");
  css.appendChild(
    document.createTextNode(
      "*,*::before,*::after{-webkit-transition:none!important;-moz-transition:none!important;-o-transition:none!important;-ms-transition:none!important;transition:none!important}"
    )
  );
  document.head.appendChild(css);
  return () => {
    (() => window.getComputedStyle(document.body))();
    setTimeout(() => {
      document.head.removeChild(css);
    }, 1);
  };
};

const getSystemTheme = (): "dark" | "light" => {
  if (typeof window === "undefined") return "dark";
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
};

export function ThemeProvider({
  children,
  attribute = "class",
  defaultTheme = "dark",
  enableSystem = true,
  disableTransitionOnChange = false,
  storageKey = "theme",
  themes = ["light", "dark"],
  forcedTheme,
}: ThemeProviderProps) {
  const [theme, setThemeState] = useState<string>(forcedTheme || defaultTheme);
  const [systemTheme, setSystemTheme] = useState<"dark" | "light">("dark");
  const scriptInserted = useRef(false);

  // Server-side HTML insertion for anti-flicker blocking script.
  // Next.js App Router inserts this into the HTML <head> during SSR.
  // React 19 Client Component never renders a <script> in its JSX tree, preventing warnings.
  useServerInsertedHTML(() => {
    if (scriptInserted.current) return null;
    scriptInserted.current = true;

    const script = `(function(){try{var k='${storageKey}';var s=localStorage.getItem(k);var p=window.matchMedia('(prefers-color-scheme: dark)').matches;var t=s||'${defaultTheme}';var r=t==='system'?(p?'dark':'light'):t;var d=document.documentElement;${
      attribute === "class"
        ? "d.classList.remove('light','dark');d.classList.add(r);"
        : `d.setAttribute('${attribute}',r);`
    }d.style.colorScheme=r;}catch(e){}})();`;

    return (
      <script
        key="theme-bootstrap-script"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{ __html: script }}
      />
    );
  });

  const resolvedTheme = useMemo(() => {
    if (forcedTheme) return forcedTheme;
    if (theme === "system") return systemTheme;
    return theme;
  }, [forcedTheme, theme, systemTheme]);

  const applyTheme = useCallback(
    (targetTheme: string) => {
      if (typeof window === "undefined") return;

      const restore = disableTransitionOnChange ? disableTransitions() : null;
      const effectiveTheme = forcedTheme || targetTheme;
      const isDark =
        effectiveTheme === "dark" ||
        (effectiveTheme === "system" && window.matchMedia("(prefers-color-scheme: dark)").matches);
      const activeResolved = isDark ? "dark" : "light";
      const root = document.documentElement;

      if (attribute === "class") {
        root.classList.remove("light", "dark");
        root.classList.add(activeResolved);
      } else {
        root.setAttribute(attribute, activeResolved);
      }
      root.style.colorScheme = activeResolved;

      if (restore) restore();
    },
    [attribute, disableTransitionOnChange, forcedTheme]
  );

  const setTheme = useCallback(
    (newTheme: string) => {
      if (forcedTheme) return;
      setThemeState(newTheme);
      try {
        localStorage.setItem(storageKey, newTheme);
      } catch (e) {
        // LocalStorage might be disabled or full
      }
      applyTheme(newTheme);
    },
    [applyTheme, forcedTheme, storageKey]
  );

  // Initialize on client mount
  useEffect(() => {
    const currentSystem = getSystemTheme();
    setSystemTheme(currentSystem);

    try {
      const stored = localStorage.getItem(storageKey);
      if (stored) {
        setThemeState(stored);
        applyTheme(stored);
      } else {
        applyTheme(defaultTheme);
      }
    } catch (e) {
      applyTheme(defaultTheme);
    }

    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const handleSystemChange = (e: MediaQueryListEvent) => {
      const updatedSystem = e.matches ? "dark" : "light";
      setSystemTheme(updatedSystem);
      if (theme === "system") {
        applyTheme("system");
      }
    };

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === storageKey && e.newValue) {
        setThemeState(e.newValue);
        applyTheme(e.newValue);
      }
    };

    media.addEventListener("change", handleSystemChange);
    window.addEventListener("storage", handleStorageChange);

    return () => {
      media.removeEventListener("change", handleSystemChange);
      window.removeEventListener("storage", handleStorageChange);
    };
  }, [applyTheme, defaultTheme, storageKey, theme]);

  const contextValue = useMemo(
    () => ({
      theme,
      setTheme,
      resolvedTheme,
      themes: enableSystem ? [...themes, "system"] : themes,
      systemTheme,
      forcedTheme,
    }),
    [theme, setTheme, resolvedTheme, enableSystem, themes, systemTheme, forcedTheme]
  );

  return <ThemeContext.Provider value={contextValue}>{children}</ThemeContext.Provider>;
}

