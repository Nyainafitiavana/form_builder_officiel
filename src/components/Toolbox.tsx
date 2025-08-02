"use client";
import {Button, Card} from "antd";
import { useFormContext } from "@/context/FormContext";
import Title from "antd/es/typography/Title";

export default function Toolbox() {
  const { addElement } = useFormContext();

  return (
    <Card variant="outlined" title={<Title level={5}>Ajouter un champ</Title>}>
      <Button block onClick={() => addElement("input")}>Input</Button>
      <Button block onClick={() => addElement("number")}>Number</Button>
      <Button block onClick={() => addElement("textarea")}>Textarea</Button>
      <Button block onClick={() => addElement("checkbox")}>Checkbox</Button>
      <Button block onClick={() => addElement("sex")}>Sexe (Masculin / Féminin)</Button>
      <Button block onClick={() => addElement("date")}>Date</Button>
    </Card>
  );
}
