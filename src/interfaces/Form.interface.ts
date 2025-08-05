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
  | 'head'
  | 'divider'
  | 'input'
  | 'textarea'
  | 'checkbox'
  | 'radio'
  | "date"
  | "select"
  | "time"
  | "phone"
  | "file"
  | "image"
  | "email"
  | "number";

export interface FormElement {
  uuid: string;
  title?: string;
  description?: string;
  align?: "left" | "center" | "right";
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
