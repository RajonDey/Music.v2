import { Button, TextInput } from "@music/ui";
import { addDriftPocket } from "@/app/(private)/songs/drift-actions";

export function AddCategoryForm() {
  return (
    <form action={addDriftPocket} className="flex flex-col gap-2 sm:flex-row sm:items-center">
      <label htmlFor="category-name" className="sr-only">
        Name a category
      </label>
      <TextInput
        id="category-name"
        name="name"
        required
        placeholder="Name a category — hangouts, covers, Rabindra…"
        className="sm:max-w-md"
      />
      <Button type="submit" variant="ghost" size="sm" className="shrink-0 self-start">
        Add the category
      </Button>
    </form>
  );
}
