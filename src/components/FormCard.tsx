import {FormCardProps} from "@/interfaces/Form.interface";
import {useState} from "react";
import {Button, Card, Input, message, Modal, Tooltip} from "antd";
import {DeleteOutlined, EditOutlined, ToolOutlined} from "@ant-design/icons";
import Link from "next/link";

export function FormCard({ form, onUpdate, onDelete }: FormCardProps) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState(form.name);
  const [desc, setDesc] = useState(form.description || "");

  const handleSave = async () => {
    if (!name.trim()) {
      message.error("Le titre est requis !");
      return;
    }
    onUpdate({ ...form, name: name.trim(), description: desc.trim() });
    setOpen(false);
  };

  return (
    <Card
      title={
        <div className="flex justify-between items-center">
          <span>{form.name}</span>
          <div className="flex gap-2">
            <Tooltip title="Modifier">
              <Button
                icon={<EditOutlined />}
                size="small"
                onClick={() => setOpen(true)}
              />
            </Tooltip>
            <Tooltip title="Supprimer">
              <Button
                icon={<DeleteOutlined />}
                size="small"
                danger
                onClick={() => onDelete(form.uuid)}
              />
            </Tooltip>
          </div>
        </div>
      }
      className="w-full min-h-50"
    >
      <p>{form.description || "Aucune description !"}</p>

      <div className="flex gap-2 mt-4">
        <Button className="w-full">
          <Link href={`/forms/${form.uuid}`}>Remplir</Link>
        </Button>
        <Button className="w-full" icon={<ToolOutlined />}>
          <Link href={`/builder/${form.uuid}`}>Personnaliser</Link>
        </Button>
      </div>

      <Modal
        title="Modifier le formulaire"
        open={open}
        onOk={handleSave}
        onCancel={() => setOpen(false)}
        okText="Enregistrer"
        cancelText="Annuler"
      >
        <div className="space-y-4">
          <div className="mb-4">
            <Input
              placeholder="Nom du formulaire"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="mb-4">
            <Input.TextArea
              rows={3}
              placeholder="Description (facultative)"
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
            />
          </div>
        </div>
      </Modal>
    </Card>
  );
}