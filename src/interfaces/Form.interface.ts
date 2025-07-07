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

export type FormElementType = 'input' | 'textarea' | 'checkbox' | 'radio' | 'sex' | "date" | "number";

export interface FormElement {
  uuid: string;
  type: FormElementType;
  name?: string;
  label: string;
  placeholder?: string;
  required?: boolean;
  options?: string[];
  order: number;
  min?: number;
  max?: number;
}
