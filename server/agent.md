You must follow this UI Editing Protocol for all layout/style changes:

Do NOT refactor or rewrite entire files.

Modify ONLY the files I show you.

For UI/layout changes, use Tailwind layout utilities only:

alignment: justify-end, ml-auto, mr-auto, justify-between, items-center, etc.

spacing: gap-4/gap-6, p-4, px-4, py-2

width: w-4/5, w-3/4, max-w-md, max-w-lg

Keep diffs MINIMAL:

change the smallest number of lines possible

do not reorder classes or move code unless absolutely required.

Never change component logic, props, or handlers.

If you need to change more than ~8 lines, STOP and describe the plan instead.

For every change, respond with: (1) short explanation (2) unified diff (3) full updated component file

If you are uncertain which element controls a visual change, say so and ask me which component or section to edit.