# Skeleton Loader System

A lightweight, production-ready skeleton loader system for React + Tailwind CSS applications.

## Features

- 🚀 **High Performance**: GPU-optimized animations using only `transform` and `opacity`
- ♿ **Accessible**: Full ARIA support with `aria-busy`, `role="status"`, and keyboard navigation
- 🎨 **Customizable**: Flexible components for any content type
- 📱 **Responsive**: Works seamlessly across all device sizes
- 🔄 **Async Ready**: Built-in support for async data loading
- 🎯 **Intersection Observer**: Only animates visible skeletons
- ♿ **Reduced Motion**: Respects `prefers-reduced-motion` settings

## Quick Start

### 1. Setup Provider

Wrap your app with the `SkeletonProvider`:

```jsx
import { SkeletonProvider } from './components/skeleton';

function App() {
  return (
    <SkeletonProvider>
      {/* Your app content */}
    </SkeletonProvider>
  );
}
```

### 2. Basic Usage

```jsx
import { SkeletonText, SkeletonCard, SkeletonImage } from './components/skeleton';

function MyComponent() {
  const [isLoading, setIsLoading] = useState(true);

  if (isLoading) {
    return (
      <div>
        <SkeletonText lines={3} />
        <SkeletonImage height="200px" />
        <SkeletonCard />
      </div>
    );
  }

  return <div>Your actual content</div>;
}
```

## Components

### Base Components

#### `SkeletonBase`
The foundation component with shimmer animation.

```jsx
<SkeletonBase 
  width="200px" 
  height="50px" 
  borderRadius="8px" 
/>
```

#### `SkeletonText`
For text content with multiple lines.

```jsx
<SkeletonText lines={3} lineHeight="1.5rem" />
```

#### `SkeletonImage`
For rectangular images.

```jsx
<SkeletonImage width="100%" height="200px" />
```

#### `SkeletonAvatar`
For circular profile images.

```jsx
<SkeletonAvatar size="3rem" />
```

#### `SkeletonButton`
For button placeholders.

```jsx
<SkeletonButton width="120px" height="2.5rem" />
```

### Complex Components

#### `SkeletonCard`
Complete card skeleton with image, text, and buttons.

```jsx
<SkeletonCard 
  showImage={true}
  showText={true}
  showButton={true}
/>
```

#### `SkeletonProjectCard`
Specialized for project cards.

```jsx
<SkeletonProjectCard />
```

#### `SkeletonHero`
For hero sections.

```jsx
<SkeletonHero />
```

#### `SkeletonArticle`
For article/blog content.

```jsx
<SkeletonArticle />
```

#### `SkeletonList`
For list items.

```jsx
<SkeletonList items={5} />
```

## Hooks

### `useSkeletonController`

Programmatically control skeleton visibility:

```jsx
import { useSkeletonController } from './components/skeleton';

function MyComponent() {
  const { showSkeleton, hideSkeleton, isSkeletonVisible } = useSkeletonController();

  const loadData = async () => {
    showSkeleton('data-loading');
    
    try {
      const data = await fetchData();
      setData(data);
    } finally {
      hideSkeleton('data-loading');
    }
  };

  return (
    <div>
      {isSkeletonVisible('data-loading') ? (
        <SkeletonText lines={3} />
      ) : (
        <div>{data}</div>
      )}
    </div>
  );
}
```

### `useSkeletonAsync`

Handle async operations with automatic skeleton state:

```jsx
import { useSkeletonAsync } from './components/skeleton';

function ProjectList() {
  const { data, isLoading, error } = useSkeletonAsync(
    () => fetchProjects(),
    [] // dependencies
  );

  if (isLoading) {
    return <SkeletonList items={6} />;
  }

  if (error) {
    return <div>Error loading projects</div>;
  }

  return (
    <div>
      {data.map(project => (
        <ProjectCard key={project.id} project={project} />
      ))}
    </div>
  );
}
```

## Boundaries

### `SkeletonBoundary`

Wrap async components with automatic fallback:

```jsx
import { SkeletonBoundary } from './components/skeleton';

function App() {
  return (
    <SkeletonBoundary fallback={<SkeletonHero />}>
      <LazyHeroComponent />
    </SkeletonBoundary>
  );
}
```

### `withSkeleton`

Higher-order component for automatic skeleton wrapping:

```jsx
import { withSkeleton, SkeletonCard } from './components/skeleton';

const ProjectCardWithSkeleton = withSkeleton(
  ProjectCard,
  SkeletonProjectCard,
  'project-card'
);
```

## Advanced Features

### Image with LQIP Support

```jsx
import { SkeletonImageWithLQIP } from './components/skeleton';

<SkeletonImageWithLQIP 
  src="/high-res-image.jpg"
  lqip="/low-res-blur.jpg"
  alt="Description"
/>
```

### Custom Styling

All components accept standard props and className:

```jsx
<SkeletonCard 
  className="bg-blue-100 border-blue-200"
  style={{ minHeight: '400px' }}
/>
```

## Performance Tips

1. **Use Intersection Observer**: Skeletons only animate when visible
2. **Respect Reduced Motion**: Animations are disabled for users who prefer reduced motion
3. **GPU Optimization**: All animations use `transform` and `opacity` only
4. **Lazy Loading**: Use `SkeletonImageWithLQIP` for images

## Accessibility

- All skeletons include proper ARIA attributes
- Screen readers announce loading state
- Keyboard navigation is preserved
- Reduced motion preferences are respected

## Examples

See `examples/SkeletonExamples.jsx` for complete usage examples including:
- Hero sections
- Project lists
- Articles
- Lists
- Controlled skeletons

## Testing

The skeleton system is designed to be easily testable:

```jsx
import { render, screen } from '@testing-library/react';
import { SkeletonText } from './components/skeleton';

test('renders skeleton text', () => {
  render(<SkeletonText lines={3} />);
  expect(screen.getByRole('status')).toBeInTheDocument();
  expect(screen.getByLabelText('Loading content')).toBeInTheDocument();
});
```




