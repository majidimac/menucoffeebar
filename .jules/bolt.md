## 2026-02-09 - Component Hoisting Performance
**Learning:** Defining sub-components inside a parent component's render function causes them to be re-created on every render, leading to full unmount/remount cycles for the entire sub-tree. This is especially costly when the sub-component contains large assets or complex DOM structures.
**Action:** Always hoist sub-components outside the parent or ensure they are properly memoized and stable across renders.

## 2026-02-14 - RTL Sidebar Alignment and Global Formatters
**Learning:** In RTL layouts, standard LTR patterns like `justify-end` for sidebars can lead to incorrect positioning (e.g., sidebar appearing on the left instead of the right). Additionally, repeated creation of `Intl.NumberFormat` instances in render loops or utility functions introduces measurable overhead.
**Action:** Use `justify-start` to align elements to the right in RTL. Re-use `Intl` formatter instances as global constants.
