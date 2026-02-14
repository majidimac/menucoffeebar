## 2026-02-09 - Component Hoisting Performance
**Learning:** Defining sub-components inside a parent component's render function causes them to be re-created on every render, leading to full unmount/remount cycles for the entire sub-tree. This is especially costly when the sub-component contains large assets or complex DOM structures.
**Action:** Always hoist sub-components outside the parent or ensure they are properly memoized and stable across renders.

## 2026-02-09 - Intl Formatter and State Initialization
**Learning:** `Intl.NumberFormat` and `Intl.DateTimeFormat` are expensive to instantiate. Creating them inside a render loop or frequently called utility function causes significant CPU overhead. Additionally, reading from `localStorage` directly in `useState`'s initial value (instead of using a function) causes the read to happen on every render, even though only the first result is used.
**Action:** Hoist `Intl` formatters to the module level and use lazy state initialization (functional updates) for expensive initial state values like `localStorage` reads.
