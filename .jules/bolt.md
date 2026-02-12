## 2026-02-09 - Component Hoisting Performance
**Learning:** Defining sub-components inside a parent component's render function causes them to be re-created on every render, leading to full unmount/remount cycles for the entire sub-tree. This is especially costly when the sub-component contains large assets or complex DOM structures.
**Action:** Always hoist sub-components outside the parent or ensure they are properly memoized and stable across renders.

## 2026-02-11 - RTL Alignment and Performance Formatters
**Learning:** In RTL (Right-to-Left) layouts using Tailwind CSS, `justify-start` aligns content to the right (the start of the line). Misunderstanding this often leads to reversed sidebars. Additionally, repeated creation of `Intl` formatter objects (e.g., `Intl.NumberFormat`) in render loops is a significant performance hit.
**Action:** Use `justify-start` for right-alignment in RTL. Hoist `Intl` formatters to global constants to reuse them across the application life-cycle.
