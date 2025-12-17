---
name: react-guidelines
description: Coding guidelines and best practices for React projects.
---

## Optimization instructions

When wrting React applications, consider the following optimization strategies to enhance performance and user experience:

- **Rendering Optimization**: React.memo, useMemo, useCallback, virtualization, reconciliation
- **Bundle Analysis**: Webpack Bundle Analyzer, tree shaking, code splitting strategies
- **Memory Management**: Memory leaks, cleanup patterns, resource management
- **Network Performance**: Lazy loading, prefetching, caching strategies
- **Core Web Vitals**: LCP, FID, CLS optimization for React apps
- **Profiling Tools**: React DevTools Profiler, Chrome DevTools, Lighthouse
- **Advanced React Patterns**: Concurrent features, Suspense, error boundaries, context optimization

## Performance Optimization Strategies

### React.memo for Component Memoization

```
const ExpensiveComponent = React.memo(({ data, onUpdate }) => {
  const processedData = useMemo(() => {
    return data.map(item => ({
      ...item,
      computed: heavyComputation(item)
    }));
  }, [data]);

  return (
    <div>
      {processedData.map(item => (
        <Item key={item.id} item={item} onUpdate={onUpdate} />
      ))}
    </div>
  );
});
```

### Code Splitting with React.lazy

```
const Dashboard = lazy(() => import('./pages/Dashboard'));

const App = () => (
  <Router>
    <Suspense fallback={<LoadingSpinner />}>
      <Routes>
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </Suspense>
  </Router>
);
```

### Concurrent React Features

```
// React 18 Concurrent Features
import { startTransition, useDeferredValue, useTransition } from 'react';

function SearchResults({ query }: { query: string }) {
  const [isPending, startTransition] = useTransition();
  const [results, setResults] = useState([]);
  const deferredQuery = useDeferredValue(query);

  // Heavy search operation with transition
  const searchHandler = (newQuery: string) => {
    startTransition(() => {
      // This won't block the UI
      setResults(performExpensiveSearch(newQuery));
    });
  };

  return (
    <div>
      <SearchInput onChange={searchHandler} />
      {isPending && <SearchSpinner />}
      <ResultsList
        results={results}
        query={deferredQuery} // Uses deferred value
      />
    </div>
  );
}
```

### Virtualization for Large Lists

```
// React Window for performance
import { FixedSizeList as List } from 'react-window';

const VirtualizedList = ({ items }: { items: any[] }) => {
  const Row = ({ index, style }: { index: number; style: any }) => (
    <div style={style}>
      <ItemComponent item={items[index]} />
    </div>
  );

  return (
    <List
      height={400}
      itemCount={items.length}
      itemSize={50}
      width="100%"
    >
      {Row}
    </List>
  );
};

// Intersection Observer for infinite scrolling
const useInfiniteScroll = (callback: () => void) => {
  const observer = useRef<IntersectionObserver>();

  const lastElementRef = useCallback((node: HTMLDivElement) => {
    if (observer.current) observer.current.disconnect();
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting) callback();
    });
    if (node) observer.current.observe(node);
  }, [callback]);

  return lastElementRef;
};
```

### Bundle Analysis Configuration

```
// webpack.config.js
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

module.exports = {
  plugins: [
    new BundleAnalyzerPlugin({
      analyzerMode: 'static',
      openAnalyzer: false,
      reportFilename: 'bundle-report.html'
    })
  ],
  optimization: {
    splitChunks: {
      chunks: 'all',
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          priority: 10,
          reuseExistingChunk: true
        },
        common: {
          name: 'common',
          minChunks: 2,
          priority: 5,
          reuseExistingChunk: true
        }
      }
    }
  }
};
```

### Largest Contentful Paint (LCP) Optimization

```
// Image optimization for LCP
import Image from 'next/image';

const OptimizedHero = () => (
  <Image
    src="/hero-image.jpg"
    alt="Hero"
    width={1200}
    height={600}
    priority // Load immediately for LCP
    placeholder="blur"
    blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQ..."
  />
);

// Resource hints for LCP improvement
export function Head() {
  return (
    <>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link rel="preload" href="/critical.css" as="style" />
      <link rel="preload" href="/hero-image.jpg" as="image" />
    </>
  );
}
```

### First Input Delay (FID) Optimization

```
// Code splitting to reduce main thread blocking
const heavyLibrary = lazy(() => import('heavy-library'));

// Use scheduler for non-urgent updates
import { unstable_scheduleCallback, unstable_NormalPriority } from 'scheduler';

const deferNonCriticalWork = (callback: () => void) => {
  unstable_scheduleCallback(unstable_NormalPriority, callback);
};

// Debounce heavy operations
const useDebounce = (value: string, delay: number) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => clearTimeout(handler);
  }, [value, delay]);

  return debouncedValue;
};
```

### Cumulative Layout Shift (CLS) Prevention

```
/* Reserve space for dynamic content */
.skeleton-container {
  min-height: 200px; /* Prevent layout shift */
  display: flex;
  align-items: center;
  justify-content: center;
}

/* Aspect ratio containers */
.aspect-ratio-container {
  position: relative;
  width: 100%;
  height: 0;
  padding-bottom: 56.25%; /* 16:9 aspect ratio */
}

.aspect-ratio-content {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}
`

`typescript
// React component for CLS prevention
const StableComponent = ({ isLoading, data }: { isLoading: boolean; data?: any }) => {
  return (
    <div className="stable-container" style={{ minHeight: '200px' }}>
      {isLoading ? (
        <div className="skeleton" style={{ height: '200px' }} />
      ) : (
        <div className="content" style={{ height: 'auto' }}>
          {data && <DataVisualization data={data} />}
        </div>
      )}
    </div>
  );
};
```

### Real-time Performance Tracking

```
// Performance observer setup
const observePerformance = () => {
  // Core Web Vitals tracking
  const observer = new PerformanceObserver((list) => {
    for (const entry of list.getEntries()) {
      if (entry.name === 'largest-contentful-paint') {
        trackMetric('LCP', entry.startTime);
      }
      if (entry.name === 'first-input') {
        trackMetric('FID', entry.processingStart - entry.startTime);
      }
      if (entry.name === 'layout-shift') {
        trackMetric('CLS', entry.value);
      }
    }
  });

  observer.observe({ entryTypes: ['largest-contentful-paint', 'first-input', 'layout-shift'] });
};

// React performance monitoring
const usePerformanceMonitor = () => {
  useEffect(() => {
    const startTime = performance.now();

    return () => {
      const duration = performance.now() - startTime;
      trackMetric('component-mount-time', duration);
    };
  }, []);
};
```

### Memory Leak Detection

```
// Memory leak prevention patterns
const useCleanup = (effect: () => () => void, deps: any[]) => {
  useEffect(() => {
    const cleanup = effect();
    return () => {
      cleanup();
      // Clear any remaining references
      if (typeof cleanup === 'function') {
        cleanup();
      }
    };
  }, deps);
};

// Proper event listener cleanup
const useEventListener = (eventName: string, handler: (event: Event) => void) => {
  const savedHandler = useRef(handler);

  useEffect(() => {
    savedHandler.current = handler;
  }, [handler]);

  useEffect(() => {
    const eventListener = (event: Event) => savedHandler.current(event);
    window.addEventListener(eventName, eventListener);

    return () => {
      window.removeEventListener(eventName, eventListener);
    };
  }, [eventName]);
};
```

### Custom Performance Profiler

```
// React DevTools Profiler API
import { Profiler } from 'react';

const onRenderCallback = (id: string, phase: 'mount' | 'update', actualDuration: number) => {
  console.log('Component:', id, 'Phase:', phase, 'Duration:', actualDuration);

  // Send to analytics
  fetch('/api/performance', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      componentId: id,
      phase,
      duration: actualDuration,
      timestamp: Date.now()
    })
  });
};

export const ProfiledComponent = ({ children }: { children: React.ReactNode }) => (
  <Profiler id="ProfiledComponent" onRender={onRenderCallback}>
    {children}
  </Profiler>
);
```

### CUSTOM HOOKS USAGE - ABSOLUTE REQUIREMENT

**ALWAYS extract stateful logic into custom hooks** - NOT optional, REQUIRED

- **API calls MUST be in custom hooks** - NEVER put fetch/API logic in components
- **Form state MUST be in custom hooks** - NEVER manage form state directly in components
- **ALL useState/useEffect logic MUST be in custom hooks**
- Hooks prefixed with `use` and placed in `src/hooks/`
- **RULE VIOLATION**: If you see useState, useEffect, or fetch in a component, it MUST be extracted to a hook

### MOBILE-FIRST RESPONSIVE DESIGN - ABSOLUTE REQUIREMENT

**ALWAYS design mobile-first with 320px minimum screen width support**

- **Start with mobile**: Design for 320px width first, then scale up
- **Responsive breakpoints**: Use Tailwind's responsive prefixes (`sm:`, `md:`, `lg:`, `xl:`)
- **Touch-friendly**: Minimum 44px touch targets for interactive elements
- **Readable text**: Minimum 16px font size on mobile
- **Proper spacing**: Adequate padding/margins for small screens
- **Testing requirement**: Test on 320px width before larger screens
