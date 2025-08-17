import SignatureCanvas from "react-signature-canvas";

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
  | 'groupedName'
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
  | "fieldset"
  | "switch"
  | "number"
  | "signature"
  | "submit";

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
  multiple?: boolean; // pour les selects
  children?: FormElement[];
  checkedChildren?: string;// pour les switchs
  unCheckedChildren?: string;// pour les switchs
  options?: { label: string; value: string }[]; // pour les selects et check box
  orientation?: "vertical" | "horizontal";
  order: number;
  min?: number;// pour les champs number
  max?: number;// pour les champs number
  buttonText?: string;
  buttonWidth?: "Normal" | "Full";
  // seulement pour les signatures
  ref?: SignatureCanvas | null;
}
