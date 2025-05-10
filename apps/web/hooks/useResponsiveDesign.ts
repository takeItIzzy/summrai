import { isNil, isObject } from 'lodash-es';
import React from 'react';

type MediaQueryListener = (matches: boolean) => void;

export type Orientation = 'portrait' | 'landscape';

export const breakPointsAndQueriesMap = {
  sm: '(min-width: 640px)',
  md: '(min-width: 768px)',
  lg: '(min-width: 1024px)',
  xl: '(min-width: 1280px)',
  '2xl': '(min-width: 1536px)',
};

export const orientationQueriesMap = {
  portrait: '(orientation: portrait)',
  landscape: '(orientation: landscape)',
};

class MediaQueryStore {
  private mediaQueries: Map<string, MediaQueryList> = new Map();
  private listeners: Map<string, Set<MediaQueryListener>> = new Map();
  private initialized = false;

  init() {
    if (this.initialized) return;
    this.initialized = true;

    // 初始化断点媒体查询
    Object.entries(breakPointsAndQueriesMap).forEach(([key, query]) => {
      this.initMediaQuery(key, query);
    });

    // 初始化横纵向媒体查询
    Object.entries(orientationQueriesMap).forEach(([key, query]) => {
      this.initMediaQuery(key, query);
    });
  }

  private initMediaQuery(key: string, query: string) {
    const mediaQuery = window.matchMedia(query);
    this.mediaQueries.set(key, mediaQuery);
    this.listeners.set(key, new Set());

    mediaQuery.addEventListener('change', event => {
      this.notifyListeners(key, event.matches);
    });
  }

  subscribe(key: string, listener: MediaQueryListener): () => void {
    const listeners = this.listeners.get(key);
    const mediaQuery = this.mediaQueries.get(key);

    if (listeners && mediaQuery) {
      listeners.add(listener);
      listener(mediaQuery.matches);
    }

    return () => {
      listeners?.delete(listener);
    };
  }

  private notifyListeners(key: string, matches: boolean) {
    this.listeners.get(key)?.forEach(listener => listener(matches));
  }

  matches(key: string): boolean {
    return this.mediaQueries.get(key)?.matches ?? false;
  }
}

const mediaQueryStore = new MediaQueryStore();

type BreakpointKey = keyof typeof breakPointsAndQueriesMap;
type OrientationKey = keyof typeof orientationQueriesMap;

interface OrientationValue<T> {
  portrait?: T;
  landscape?: T;
}

type ResponsiveValue<T> = T | OrientationValue<T>;

interface Breakpoints<T> {
  sm?: ResponsiveValue<T>;
  md?: ResponsiveValue<T>;
  lg?: ResponsiveValue<T>;
  xl?: ResponsiveValue<T>;
  '2xl'?: ResponsiveValue<T>;
}

export const useMediaQuery = (breakPoint?: BreakpointKey, orientation?: OrientationKey) => {
  const [matches, setMatches] = React.useState(false);
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
    mediaQueryStore.init();

    if (!breakPoint && !orientation) return;

    const cleanupFns: Array<() => void> = [];

    if (breakPoint) {
      cleanupFns.push(
        mediaQueryStore.subscribe(breakPoint, matches => {
          if (orientation) {
            setMatches(matches && mediaQueryStore.matches(orientation));
          } else {
            setMatches(matches);
          }
        })
      );
    }

    if (orientation) {
      cleanupFns.push(
        mediaQueryStore.subscribe(orientation, matches => {
          if (breakPoint) {
            setMatches(matches && mediaQueryStore.matches(breakPoint));
          } else {
            setMatches(matches);
          }
        })
      );
    }

    return () => cleanupFns.forEach(fn => fn());
  }, [breakPoint, orientation]);

  if (!mounted) return false;

  return matches;
};

const isOrientationValue = <T>(value: any): value is OrientationValue<T> => {
  return isObject(value) && ('portrait' in value || 'landscape' in value);
};

const findFirstValidDesign = <T>(
  designs: (ResponsiveValue<T> | undefined)[],
  orientation?: OrientationKey
): T | undefined => {
  for (const design of designs) {
    // eslint-disable-next-line no-continue
    if (isNil(design)) continue;

    if (isOrientationValue(design)) {
      if (orientation && design[orientation]) {
        return design[orientation];
      }
      // 如果没有指定方向，或者指定方向的值不存在，尝试使用另一个方向的值
      return design.portrait || design.landscape;
    }

    return design as T;
  }
};

const useResponsiveDesign = <T>(
  defaultDesign: ResponsiveValue<T>,
  breakpoints: Breakpoints<T>
): T => {
  const { sm, md, lg, xl, '2xl': _2xl } = breakpoints;

  // eslint-disable-next-line no-undefined
  const isPortrait = useMediaQuery(undefined, 'portrait');
  const orientation: OrientationKey = isPortrait ? 'portrait' : 'landscape';

  const isSm = useMediaQuery('sm');
  const isMd = useMediaQuery('md');
  const isLg = useMediaQuery('lg');
  const isXl = useMediaQuery('xl');
  const is2xl = useMediaQuery('2xl');

  const allDesigns = [_2xl, xl, lg, md, sm, defaultDesign];

  if (is2xl) return findFirstValidDesign(allDesigns.slice(0), orientation) as T;
  if (isXl) return findFirstValidDesign(allDesigns.slice(1), orientation) as T;
  if (isLg) return findFirstValidDesign(allDesigns.slice(2), orientation) as T;
  if (isMd) return findFirstValidDesign(allDesigns.slice(3), orientation) as T;
  if (isSm) return findFirstValidDesign(allDesigns.slice(4), orientation) as T;

  return findFirstValidDesign([defaultDesign], orientation) as T;
};

export default useResponsiveDesign;
