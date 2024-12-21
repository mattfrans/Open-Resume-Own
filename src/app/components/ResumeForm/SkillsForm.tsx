import { useAppDispatch, useAppSelector } from "lib/redux/hooks";
import { changeSkills, selectSkills } from "lib/redux/resumeSlice";
import { Form } from "components/ResumeForm/Form";
import { InputGroupWrapper, BulletListTextarea, Input } from "components/ResumeForm/Form/InputGroup";
import { FeaturedSkillInput } from "components/ResumeForm/Form/FeaturedSkillInput";
import {
  selectShowBulletPoints,
  selectThemeColor,
  selectFormToShow,
  changeShowForm,
} from "lib/redux/settingsSlice";
import { PlusIcon } from "@heroicons/react/24/outline";

export const SkillsForm = () => {
  const dispatch = useAppDispatch();
  const skills = useAppSelector(selectSkills);
  const { featuredSkills = [], categories = [] } = skills;
  const form = "skills";
  const showBulletPoints = useAppSelector(selectShowBulletPoints(form));
  const themeColor = useAppSelector(selectThemeColor) || "#38bdf8";
  const settings = useAppSelector(selectFormToShow);

  const handleFeaturedSkillsChange = (
    idx: number,
    skill: string,
    rating: number
  ) => {
    const newFeaturedSkills = [...featuredSkills];
    newFeaturedSkills[idx] = { skill, rating };
    dispatch(
      changeSkills({
        featuredSkills: newFeaturedSkills,
      })
    );
  };

  const handleAddCategory = () => {
    const newCategories = [...categories, { name: "", skills: [] }];
    dispatch(
      changeSkills({
        categories: newCategories,
      })
    );
  };

  const handleUpdateCategory = (idx: number, name: string) => {
    const newCategories = [...categories];
    newCategories[idx] = { ...newCategories[idx], name };
    dispatch(
      changeSkills({
        categories: newCategories,
      })
    );
  };

  const handleUpdateSkills = (idx: number, skillsText: string[]) => {
    const newCategories = [...categories];
    newCategories[idx] = {
      ...newCategories[idx],
      skills: skillsText,
    };
    dispatch(
      changeSkills({
        categories: newCategories,
      })
    );
  };

  const handleDeleteCategory = (idx: number) => {
    const newCategories = categories.filter((_, i) => i !== idx);
    dispatch(
      changeSkills({
        categories: newCategories,
      })
    );
  };

  return (
    <Form form={form}>
      <div className="col-span-full grid grid-cols-6 gap-3">
        <div className="col-span-full flex items-center justify-between">
          <h2 className="text-base font-medium">Skills</h2>
          <div className="flex items-center gap-2">
            <label htmlFor="featuredSkills" className="text-sm text-gray-600">
              Show Featured Skills
            </label>
            <input
              id="featuredSkills"
              type="checkbox"
              className="h-4 w-4 rounded border-gray-300"
              checked={settings.featuredSkills}
              onChange={(e) =>
                dispatch(
                  changeShowForm({
                    field: "featuredSkills",
                    value: e.target.checked,
                  })
                )
              }
            />
          </div>
        </div>

        {settings.featuredSkills && (
          <>
            <InputGroupWrapper
              label="Featured Skills (Optional)"
              className="col-span-full"
            >
              <p className="mt-2 text-sm font-normal text-gray-600">
                Featured skills is optional to highlight top skills, with more
                circles meaning higher proficiency.
              </p>
            </InputGroupWrapper>

            {featuredSkills.map(({ skill, rating }, idx) => (
              <FeaturedSkillInput
                key={idx}
                className="col-span-3"
                skill={skill}
                rating={rating}
                setSkillRating={(newSkill, newRating) => {
                  handleFeaturedSkillsChange(idx, newSkill, newRating);
                }}
                placeholder={`Featured Skill ${idx + 1}`}
                circleColor={themeColor}
              />
            ))}
          </>
        )}

        <div className="col-span-full mb-4 mt-6 border-t-2 border-dotted border-gray-200" />
        
        <div className="col-span-full">
          <button
            type="button"
            onClick={handleAddCategory}
            className="flex items-center gap-2 text-gray-500 hover:text-gray-600"
          >
            <PlusIcon className="h-5 w-5" />
            <span>Add Skill Category</span>
          </button>
        </div>

        {categories.map((category, idx) => (
          <div key={idx} className="col-span-full">
            <div className="flex items-center gap-3 mb-2">
              <Input
                name={`category-${idx}`}
                label=""
                value={category.name}
                onChange={(_, value) => handleUpdateCategory(idx, value)}
                placeholder="Category Name (e.g., Programming Languages)"
              />
              <button
                type="button"
                onClick={() => handleDeleteCategory(idx)}
                className="text-sm text-red-600 hover:text-red-700"
              >
                Delete
              </button>
            </div>
            <BulletListTextarea
              label=""
              name={`skills-${idx}`}
              value={category.skills}
              onChange={(_, value) => handleUpdateSkills(idx, value)}
              placeholder="Enter skills for this category (one per line)"
            />
          </div>
        ))}
      </div>
    </Form>
  );
};
