## 2026-02-09 - Component Hoisting Performance
**Learning:** Defining sub-components inside a parent component's render function causes them to be re-created on every render, leading to full unmount/remount cycles for the entire sub-tree. This is especially costly when the sub-component contains large assets or complex DOM structures.
**Action:** Always hoist sub-components outside the parent or ensure they are properly memoized and stable across renders.

## 2026-02-10 - Intl Formatter Reuse
**Learning:** Calling `toLocaleString`, `toLocaleDateString`, or `toLocaleTimeString` repeatedly in render loops (especially with 10+ items or frequent updates) incurs significant overhead due to the repeated creation of `Intl` formatter objects.
**Action:** Define `Intl.NumberFormat` and `Intl.DateTimeFormat` instances as global constants and reuse them with the `.format()` method.
