# Bolt's Journal - Critical Learnings

## 2025-05-14 - [Memoization Effectiveness]
**Learning:** `React.memo` is only effective if all props passed to the component are stable. Passing newly created function references (event handlers) on every render nullifies the performance benefit of memoization.
**Action:** Always wrap event handlers in `useCallback` when they are passed as props to memoized components.

## 2025-05-14 - [Intl Formatter Overhead]
**Learning:** Creating new `Intl.NumberFormat` or `Intl.DateTimeFormat` instances inside a render loop or a frequently called utility function is expensive and can cause noticeable lag in data-heavy UIs.
**Action:** Hoist `Intl` formatters to global constants to reuse a single instance across the application lifecycle.

## 2025-05-14 - [Image Dimension Optimization]
**Learning:** External image services (like Unsplash) often allow resizing via URL parameters. Requesting images significantly larger than their display size wastes bandwidth and increases memory usage/decoding time.
**Action:** Analyze the actual display size of images and adjust URL width parameters (e.g., `w=600`) to match requirements.
