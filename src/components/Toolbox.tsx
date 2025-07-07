"use client";
import { Button } from "antd";
import { useFormContext } from "@/context/FormContext";

export default function Toolbox() {
  const { addElement } = useFormContext();

  return (
    <div className="space-y-2 p-4 bg-white shadow rounded">
      <h2 className="font-bold">Ajouter un champ</h2>
      <Button block onClick={() => addElement("input")}>Input</Button>
      <Button block onClick={() => addElement("number")}>Number</Button>
      <Button block onClick={() => addElement("textarea")}>Textarea</Button>
      <Button block onClick={() => addElement("checkbox")}>Checkbox</Button>
      <Button block onClick={() => addElement("sex")}>Sexe (Masculin / Féminin)</Button>
      <Button block onClick={() => addElement("date")}>Date</Button>
    </div>
  );
}
