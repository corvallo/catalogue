import type { ComponentType, ReactNode } from "react";
import { createElement, isValidElement, memo, useMemo } from "react";
import { Moon, Sun } from "lucide-react";
import { pluginHost } from "@catalogue-lab/shared/plugin";
import { useCatalogStore } from "@catalogue-lab/shared/store";
import { Button } from "@catalogue-lab/shared/ui";
import styles from "./toolbar.module.css";

export const Toolbar = memo(() => {
  const config = useCatalogStore((state) => state.toolbarConfig);
  const theme = useCatalogStore((state) => state.globals.theme);
  const items = pluginHost.getToolbarItems();

  const resolvedItems = useMemo(() => {
    if (!config.length) return items;
    const map = new Map(items.map((item) => [item.id, item]));
    return config
      .map((cfg) => {
        const base = map.get(cfg.id);
        if (!base) return null;
        return {
          ...base,
          label: cfg.label ?? base.label,
          order: cfg.order ?? base.order,
          icon: cfg.icon ?? base.icon,
          shortcut: cfg.shortcut ?? base.shortcut,
        };
      })
      .filter((item): item is NonNullable<typeof item> => Boolean(item))
      .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
  }, [config, items]);

  return (
    <div className={styles.toolbarItems}>
      {resolvedItems.map((item) => {
        const isThemeToggle = item.id === "theme.toggle";
        const themeIcon = theme === "dark" ? Sun : Moon;
        const iconValue = isThemeToggle ? themeIcon : item.icon;
        const isElement = isValidElement(iconValue);
        const isComponentType =
          typeof iconValue === "function" ||
          (typeof iconValue === "object" && iconValue !== null && "$$typeof" in iconValue);
        const iconNode = isElement
          ? iconValue
          : isComponentType
            ? createElement(iconValue as ComponentType<{ className?: string }>, {
                className: styles.toolbarIcon,
              })
            : (iconValue as ReactNode | null);
        return (
          <Button
            key={item.id}
            className={`${styles.toolbarButton} ${isThemeToggle ? styles.toolbarToggle : ""}`}
            onClick={item.onClick}
            title={item.shortcut ? `Shortcut: ${item.shortcut}` : item.label}
            aria-label={item.label}
            aria-pressed={isThemeToggle ? theme === "dark" : undefined}
            data-pressed={isThemeToggle ? theme === "dark" : undefined}
          >
            {iconNode}
            {isThemeToggle && <span className={styles.toolbarLabel}>{item.label}</span>}
          </Button>
        );
      })}
    </div>
  );
});
