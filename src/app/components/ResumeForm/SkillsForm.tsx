import { Form } from "components/ResumeForm/Form";
import {
  BulletListTextarea,
  InputGroupWrapper,
  Input,
} from "components/ResumeForm/Form/InputGroup";
import { FeaturedSkillInput } from "components/ResumeForm/Form/FeaturedSkillInput";
import { useAppDispatch, useAppSelector } from "lib/redux/hooks";
import { selectSkills, changeSkills } from "lib/redux/resumeSlice";
import {
  selectShowBulletPoints,
  selectThemeColor,
} from "lib/redux/settingsSlice";
import { useState } from "react";
import { PlusSmallIcon, XMarkIcon } from "@heroicons/react/24/outline";
import type { SkillCategory } from "lib/redux/types";

export const SkillsForm = () => {
  const skills = useAppSelector(selectSkills);
  const dispatch = useAppDispatch();
  const { featuredSkills, categories } = skills;
  const form = "skills";
  const showBulletPoints = useAppSelector(selectShowBulletPoints(form));
  const themeColor = useAppSelector(selectThemeColor) || "#38bdf8";
  const [newCategory, setNewCategory] = useState("");

  const handleFeaturedSkillsChange = (
    idx: number,
    skill: string,
    rating: number
  ) => {
    dispatch(changeSkills({ field: "featuredSkills", idx, skill, rating }));
  };

  const handleAddCategory = () => {
    if (!newCategory) return;
    const updatedCategories = [...categories, { name: newCategory, skills: [] }];
    dispatch(changeSkills({ field: "categories", value: updatedCategories }));
    setNewCategory("");
  };

  const handleUpdateCategory = (idx: number, name: string) => {
    const updatedCategories = [...categories];
    updatedCategories[idx] = { ...updatedCategories[idx], name };
    dispatch(changeSkills({ field: "categories", value: updatedCategories }));
  };

  const handleUpdateSkills = (categoryIdx: number, skills: string[]) => {
    const updatedCategories = [...categories];
    updatedCategories[categoryIdx] = {
      ...updatedCategories[categoryIdx],
      skills: skills.filter(s => s.trim()),
    };
    dispatch(changeSkills({ field: "categories", value: updatedCategories }));
  };

  const handleDeleteCategory = (idx: number) => {
    const updatedCategories = categories.filter((_, i) => i !== idx);
    dispatch(changeSkills({ field: "categories", value: updatedCategories }));
  };

  return (
    <Form form={form}>
      <div className="col-span-full grid grid-cols-6 gap-3">
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

        <div className="col-span-full mb-4 mt-6 border-t-2 border-dotted border-gray-200" />
        
        <InputGroupWrapper
          label="Skill Categories"
          className="col-span-full"
        >
          <p className="mt-2 text-sm font-normal text-gray-600">
            Organize your skills into categories for better presentation.
          </p>
        </InputGroupWrapper>

        <div className="col-span-full flex items-center gap-2">
          <Input
            name="newCategory"
            placeholder="Add new category (e.g., Programming Languages)"
            value={newCategory}
            onChange={(_, value) => setNewCategory(value)}
            className="flex-grow"
          />
          <button
            type="button"
            onClick={handleAddCategory}
            className="flex items-center rounded-md bg-white py-2 px-3 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
          >
            <PlusSmallIcon className="h-5 w-5 text-gray-400" />
            Add Category
          </button>
        </div>

        {categories.map((category, idx) => (
          <div key={idx} className="col-span-full">
            <div className="flex items-center gap-2 mb-2">
              <Input
                name={`category-${idx}`}
                value={category.name}
                onChange={(_, value) => handleUpdateCategory(idx, value)}
                className="flex-grow font-semibold"
              />
              <button
                type="button"
                onClick={() => handleDeleteCategory(idx)}
                className="p-1 hover:bg-gray-100 rounded"
              >
                <XMarkIcon className="h-5 w-5 text-gray-400" />
              </button>
            </div>
            <BulletListTextarea
              label=""
              name={`skills-${idx}`}
              placeholder="Enter skills for this category (one per line)"
              value={category.skills}
              onChange={(_, value) => handleUpdateSkills(idx, value)}
              showBulletPoints={true}
            />
          </div>
        ))}
      </div>
    </Form>
  );
};
