import { FieldLabel, SelectInput } from "@music/ui";
import type { DriftList } from "@music/types";

export function CategorySelect({
  categories,
  defaultId,
  id,
  hint = "optional",
}: {
  categories: DriftList[];
  defaultId?: string | null;
  id: string;
  hint?: string;
}) {
  if (categories.length === 0) return null;

  return (
    <div>
      <FieldLabel htmlFor={id} hint={hint}>
        Category
      </FieldLabel>
      <SelectInput id={id} name="category_id" defaultValue={defaultId ?? ""}>
        <option value="">None yet</option>
        {categories.map((category) => (
          <option key={category.id} value={category.id}>
            {category.name}
          </option>
        ))}
      </SelectInput>
    </div>
  );
}
