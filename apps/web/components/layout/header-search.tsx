"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";

import SearchInput from "@/components/ui/search-input";

export type HeaderSearchConfig = {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
};

type HeaderSearchContextValue = {
  config: HeaderSearchConfig | null;
  register: (config: HeaderSearchConfig | null) => void;
};

const HeaderSearchContext = createContext<HeaderSearchContextValue | null>(null);

export function HeaderSearchProvider({ children }: { children: ReactNode }) {
  const [config, setConfig] = useState<HeaderSearchConfig | null>(null);
  const register = useCallback((next: HeaderSearchConfig | null) => {
    setConfig(next);
  }, []);

  return (
    <HeaderSearchContext.Provider value={{ config, register }}>
      {children}
    </HeaderSearchContext.Provider>
  );
}

export function useHeaderSearchContext() {
  const context = useContext(HeaderSearchContext);

  if (!context) {
    throw new Error("Header search components must be used within HeaderSearchProvider");
  }

  return context;
}

export function useRegisterHeaderSearch(config: HeaderSearchConfig | null) {
  const { register } = useHeaderSearchContext();

  // keep the latest callback without making it an effect dependency
  const onChangeRef = useRef<HeaderSearchConfig["onChange"] | undefined>(undefined);
  onChangeRef.current = config?.onChange;

  const enabled = config !== null;
  const value = config?.value ?? "";
  const placeholder = config?.placeholder;

  useEffect(() => {
    if (!enabled) {
      register(null);
      return;
    }
    register({
      value,
      placeholder,
      onChange: (next: string) => onChangeRef.current?.(next),
    });
  }, [enabled, value, placeholder, register]);

  // clear the search when the page unmounts
  useEffect(() => () => register(null), [register]);
}

export function HeaderSearchSlot({ className = "" }: { className?: string }) {
  const { config } = useHeaderSearchContext();

  if (!config) return null;

  const placeholder = config.placeholder ?? "Search";

  return (
    <SearchInput
      aria-label={placeholder}
      placeholder={placeholder}
      value={config.value}
      onChange={(event) => config.onChange(event.target.value)}
      onClear={() => config.onChange("")}
      className="h-10 py-2"
      containerClassName={className}
    />
  );
}
