import { Form } from "components/ResumeForm/Form";
import {
  Input,
  InputGroupWrapper,
} from "components/ResumeForm/Form/InputGroup";
import { useAppDispatch, useAppSelector } from "lib/redux/hooks";
import {
  selectReferences,
  changeReferences,
  initialReference,
} from "lib/redux/resumeSlice";
import { PlusSmallIcon, XMarkIcon } from "@heroicons/react/24/outline";
import type { Reference } from "lib/redux/types";

export const ReferencesForm = () => {
  const { references } = useAppSelector(selectReferences);
  const dispatch = useAppDispatch();

  const handleAddReference = () => {
    const updatedReferences = [...references, { ...initialReference }];
    dispatch(changeReferences({ field: "references", value: updatedReferences }));
  };

  const handleUpdateReference = (idx: number, field: keyof Reference, value: string) => {
    const updatedReferences = [...references];
    updatedReferences[idx] = {
      ...updatedReferences[idx],
      [field]: value,
    };
    dispatch(changeReferences({ field: "references", value: updatedReferences }));
  };

  const handleDeleteReference = (idx: number) => {
    const updatedReferences = references.filter((_, i) => i !== idx);
    dispatch(changeReferences({ field: "references", value: updatedReferences }));
  };

  return (
    <Form form="references">
      <div className="col-span-full space-y-6">
        <InputGroupWrapper
          label="References"
          className="col-span-full"
        >
          <p className="mt-2 text-sm font-normal text-gray-600">
            Add professional references who can vouch for your skills and experience.
          </p>
        </InputGroupWrapper>

        {references.map((reference, idx) => (
          <div key={idx} className="col-span-full space-y-4 rounded-lg border border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium">Reference {idx + 1}</h3>
              <button
                type="button"
                onClick={() => handleDeleteReference(idx)}
                className="p-1 hover:bg-gray-100 rounded"
              >
                <XMarkIcon className="h-5 w-5 text-gray-400" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Name"
                name={`reference-${idx}-name`}
                value={reference.name}
                onChange={(_, value) => handleUpdateReference(idx, "name", value)}
                placeholder="John Smith"
              />
              <Input
                label="Title"
                name={`reference-${idx}-title`}
                value={reference.title}
                onChange={(_, value) => handleUpdateReference(idx, "title", value)}
                placeholder="Senior Software Engineer"
              />
              <Input
                label="Company"
                name={`reference-${idx}-company`}
                value={reference.company}
                onChange={(_, value) => handleUpdateReference(idx, "company", value)}
                placeholder="ABC Company"
              />
              <Input
                label="Email"
                name={`reference-${idx}-email`}
                value={reference.email}
                onChange={(_, value) => handleUpdateReference(idx, "email", value)}
                placeholder="john@example.com"
              />
              <Input
                label="Phone"
                name={`reference-${idx}-phone`}
                value={reference.phone}
                onChange={(_, value) => handleUpdateReference(idx, "phone", value)}
                placeholder="123-456-7890"
              />
            </div>
          </div>
        ))}

        <button
          type="button"
          onClick={handleAddReference}
          className="flex items-center rounded-md bg-white py-2 px-3 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
        >
          <PlusSmallIcon className="h-5 w-5 text-gray-400 mr-1" />
          Add Reference
        </button>
      </div>
    </Form>
  );
};
