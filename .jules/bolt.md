## 2026-02-09 - Component Hoisting Performance
**Learning:** Defining sub-components inside a parent component's render function causes them to be re-created on every render, leading to full unmount/remount cycles for the entire sub-tree. This is especially costly when the sub-component contains large assets or complex DOM structures.
**Action:** Always hoist sub-components outside the parent or ensure they are properly memoized and stable across renders.

## 2025-05-22 - Global Formatters and RTL Border Fix
**Learning:** Reusing Intl.NumberFormat instances as global constants avoids the performance overhead of repeatedly creating formatter objects in render loops. Additionally, in RTL layouts, a right-side sidebar should have a left border (border-l) to correctly separate it from the main content.
**Action:** Hoisted number formatters and fixed the Cart Sidebar border direction.
