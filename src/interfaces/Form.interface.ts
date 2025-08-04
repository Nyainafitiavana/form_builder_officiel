export interface FormInterface {
  uuid: string;
  name: string;
  description?: string;
  elements: FormElement[];
  createdAt: string;
}

export interface FormCardProps {
  form: FormInterface;
  onUpdate: (updatedForm: FormInterface) => void;
  onDelete: (uuid: string) => void;
}

export type FormElementType =
  | 'input'
  | 'textarea'
  | 'checkbox'
  | 'radio'
  | "date"
  | "select"
  | "number";

export interface FormElement {
  uuid: string;
  type: FormElementType;
  name?: string;
  label: string;
  placeholder?: string;
  required?: boolean;
  multiple?: boolean;
  options?: { label: string; value: string }[];
  orientation?: "vertical" | "horizontal",
  order: number;
  min?: number;
  max?: number;
}
