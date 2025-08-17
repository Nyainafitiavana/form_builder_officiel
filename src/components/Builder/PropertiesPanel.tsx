import {Input, Checkbox, Card, Button, Switch, Select, InputNumber} from "antd";
import {useFormContext} from "@/context/FormContext";
import React, {useEffect, useState} from "react";
import Title from "antd/es/typography/Title";
import {DeleteOutlined} from "@ant-design/icons";
import {FormElement, FormElementType} from "@/interfaces/Form.interface";

function generateNameFromLabel(label: string): string {
  return label
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9 ]/gi, "")
    .trim()
    .replace(/\s+/g, "_");
}

export default function PropertiesPanel() {
  const {elements, selectedUuid, updateElement} = useFormContext();
  const selected = elements.find((el) => el.uuid === selectedUuid);

  const [label, setLabel] = useState("");

  useEffect(() => {
    if (selected) setLabel(selected.label || "");
  }, [selected, selectedUuid]);

  const handleLabelChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newLabel = e.target.value;
    setLabel(newLabel);
    updateElement(selected!.uuid, {
      label: newLabel,
      name: generateNameFromLabel(newLabel),
    });
  };

  const handleOptionChange = (index: number, key: "label" | "value", value: string) => {
    const updatedOptions = [...(selected?.options || [])];
    updatedOptions[index] = {
      ...updatedOptions[index],
      [key]: value,
    };
    updateElement(selected!.uuid, {options: updatedOptions});
  };

  const handleAddOption = () => {
    const newOption = {label: "Option", value: "option"};
    updateElement(selected!.uuid, {
      options: [...(selected?.options || []), newOption],
    });
  };

  const handleRemoveOption = (index: number) => {
    const updated = [...(selected?.options || [])].filter((_, i) => i !== index);
    updateElement(selected!.uuid, {options: updated});
  };

  //Met à jour le label d’un champ enfant dans le fieldset
  function updateChildLabel(index: number, newLabel: string) {
    if (!selected || selected.type !== "fieldset") return;

    const updatedChildren = [...(selected.children || [])];
    updatedChildren[index] = {
      ...updatedChildren[index],
      label: newLabel,
    };

    updateElement(selected.uuid, {children: updatedChildren});
  }

  //Met à jour le label d’un champ enfant dans le fieldset
  function updateChildPlaceholder(index: number, newPlaceholder: string) {
    if (!selected || selected.type !== "fieldset") return;

    const updatedChildren = [...(selected.children || [])];
    updatedChildren[index] = {
      ...updatedChildren[index],
      placeholder: newPlaceholder,
    };

    updateElement(selected.uuid, {children: updatedChildren});
  }

  //Met à jour le type (input, date, etc.) d’un champ enfant
  function updateChildType(index: number, newType: FormElementType) {
    if (!selected || selected.type !== "fieldset") return;

    const updatedChildren = [...(selected.children || [])];
    updatedChildren[index] = {
      ...updatedChildren[index],
      type: newType,
    };

    updateElement(selected.uuid, {children: updatedChildren});
  }


  //Met à jour si un champ est requis ou non
  function updateChildRequired(index: number, required: boolean) {
    if (!selected || selected.type !== "fieldset") return;

    const updatedChildren = [...(selected.children || [])];
    updatedChildren[index] = {
      ...updatedChildren[index],
      required: required,
    };

    updateElement(selected.uuid, {children: updatedChildren});
  }


  //Ajoute un champ enfant dans le fieldset
  function addChild() {
    if (!selected || selected.type !== "fieldset") return;

    const newChild: FormElement = {
      uuid: crypto.randomUUID(),
      type: "input",
      label: "Nouveau champ",
      required: false,
      placeholder: "",
      order: (selected.children?.length || 0),
    };

    const updatedChildren = [...(selected.children || []), newChild];
    updateElement(selected.uuid, {children: updatedChildren});
  }


  //Supprime un champ enfant
  function removeChild(index: number) {
    if (!selected || selected.type !== "fieldset") return;

    const updatedChildren = [...(selected.children || [])];
    updatedChildren.splice(index, 1);

    updateElement(selected.uuid, {children: updatedChildren});
  }

  function updateChildMin(index: number, min: number) {
    if (!selected || selected.type !== 'fieldset') return;

    const updatedChildren = [...(selected.children || [])];
    updatedChildren[index] = {
      ...updatedChildren[index],
      min,
    };

    updateElement(selected.uuid, {children: updatedChildren});
  }

  function updateChildMax(index: number, max: number) {
    if (!selected || selected.type !== 'fieldset') return;

    const updatedChildren = [...(selected.children || [])];
    updatedChildren[index] = {
      ...updatedChildren[index],
      max,
    };

    updateElement(selected.uuid, {children: updatedChildren});
  }


  if (!selected) return <Card className="text-gray-500 min-h-[800px]">Aucun élément sélectionné</Card>;

  return (
    <Card
      variant="outlined"
      title={<Title level={5}>Propriétés</Title>}
      className="space-y-2 rounded shadow p-4 overflow-y-auto min-h-[300px] md:min-h-[400px] lg:min-h-[800px] max-h-[80vh]"
    >
      <div>
        {
          selected.type !== "head" &&
          selected.type !== "divider" &&
          selected.type !== "submit" && (
          <>
            <Input className="mt-4" addonBefore="Label" value={label} onChange={handleLabelChange}/>
            <Input className="mt-4" addonBefore="Name" value={selected.name} disabled/>
          </>
        )}
        
        {selected.type === "submit" && (
          <>
            <Input
              value={selected.buttonText}
              onChange={(e) =>
                updateElement(selected.uuid, {buttonText: e.target.value})
              }
              placeholder="Texte du bouton"
            />

            <div className="mt-4">
              <h3 className="font-semibold">Taille</h3>
              <Switch
                checked={selected.buttonWidth !== "Normal"}
                onChange={(checked) =>
                  updateElement(selected.uuid, {
                    buttonWidth: checked ? "Full" : "Normal",
                  })
                }
                checkedChildren="Full"
                unCheckedChildren="Normal"
              />
            </div>
          </>
        )}

        {selected.type === "switch" && (
          <>
            <Input
              className="mt-4"
              addonBefore="Texte ON (checked)"
              value={selected.checkedChildren}
              onChange={(e) =>
                updateElement(selected.uuid, {checkedChildren: e.target.value})
              }
              placeholder="Texte ON (checked)"
            />

            <Input
              className="mt-4"
              addonBefore="Texte OFF (unchecked)"
              value={selected.unCheckedChildren}
              onChange={(e) =>
                updateElement(selected.uuid, {unCheckedChildren: e.target.value})
              }
              placeholder="Texte OFF (unchecked)"
            />
          </>
        )}

        {selected.type === "head" && (
          <div className="mt-4 space-y-4">
            <div>
              <label className="block font-medium mb-1">Titre</label>
              <Input
                value={selected.title}
                onChange={(e) => updateElement(selected.uuid, {title: e.target.value})}
              />
            </div>
            <div>
              <label className="block font-medium mb-1">Description</label>
              <Input
                value={selected.description}
                onChange={(e) => updateElement(selected.uuid, {description: e.target.value})}
              />
            </div>
            <div>
              <label className="block font-medium mb-1">Alignement</label>
              <Select
                value={selected.align}
                onChange={(value) => updateElement(selected.uuid, {align: value})}
                options={[
                  {label: "Gauche", value: "left"},
                  {label: "Centré", value: "center"},
                  {label: "Droite", value: "right"},
                ]}
                style={{width: "100%"}}
              />
            </div>
          </div>
        )}

        {selected.type === "number" && (
          <>
            <Input
              className="mt-4"
              addonBefore="Min"
              type="number"
              value={selected.min ?? ""}
              onChange={(e) =>
                updateElement(selected.uuid, {
                  min: e.target.value ? parseFloat(e.target.value) : undefined,
                })
              }
            />
            <Input
              className="mt-4"
              addonBefore="Max"
              type="number"
              value={selected.max ?? ""}
              onChange={(e) =>
                updateElement(selected.uuid, {
                  max: e.target.value ? parseFloat(e.target.value) : undefined,
                })
              }
            />
          </>
        )}

        {selected.type === "phone" && (
          <>
            <Input
              className="mt-4"
              min={10}
              addonBefore="Longeur"
              type="number"
              value={selected.max ?? ""}
              onChange={(e) =>
                updateElement(selected.uuid, {
                  max: e.target.value ? parseFloat(e.target.value) : undefined,
                })
              }
            />
          </>
        )}

        {selected.type === "radio" && (
          <div className="mt-4">
            <label className="block font-medium mb-1">Options</label>
            <div className="space-y-2">
              {(selected.options || []).map((opt: any, index: number) => (
                <div key={index} className="flex flex-col gap-2">
                  <Input
                    addonBefore="Label"
                    value={opt.label}
                    onChange={(e) => handleOptionChange(index, "label", e.target.value)}
                  />
                  <Input
                    addonBefore="Value"
                    value={opt.value}
                    onChange={(e) => handleOptionChange(index, "value", e.target.value)}
                  />
                </div>
              ))}
            </div>
            <div className="mt-4">
              <h3 className="font-semibold">Orientation </h3>
              <Switch
                checked={selected.orientation !== "horizontal"}
                onChange={(checked) =>
                  updateElement(selected.uuid, {
                    orientation: checked ? "vertical" : "horizontal",
                  })
                }
                checkedChildren="Vertical"
                unCheckedChildren="Horizontal"
              />
            </div>
          </div>
        )}

        {selected?.type === 'fieldset' && (
          <div className="mt-4">
            <Title level={5}>Champs du groupe</Title>
            {selected.children?.map((child, index) => (
              <Card key={child.uuid} size="small" style={{marginBottom: '0.5rem'}}>
                <div className="mt-4">
                  <Input
                    value={child.label}
                    placeholder="Label"
                    onChange={(e) => updateChildLabel(index, e.target.value)}
                  />
                </div>
                <div className="mt-4">
                  <Input
                    value={child.placeholder}
                    placeholder="Placeholder"
                    onChange={(e) => updateChildPlaceholder(index, e.target.value)}
                  />
                </div>
                <div className="mt-4">
                  <Select
                    style={{width: '50%'}}
                    value={child.type}
                    onChange={(value) => updateChildType(index, value)}
                    options={[
                      {label: 'Texte', value: 'input'},
                      {label: 'Date', value: 'date'},
                      {label: 'Nombre', value: 'number'},
                    ]}
                  />
                </div>
                {child.type === 'number' && (
                  <div className="mt-4" style={{display: 'flex', gap: '1rem'}}>
                    <InputNumber
                      placeholder="Min"
                      value={child.min}
                      onChange={(value) => updateChildMin(index, value as number)}
                    />
                    <InputNumber
                      placeholder="Max"
                      value={child.max}
                      onChange={(value) => updateChildMax(index, value as number)}
                    />
                  </div>
                )}

                <div className="mt-4 mb-4">
                  <Checkbox
                    checked={child.required}
                    onChange={(e) => updateChildRequired(index, e.target.checked)}
                  >
                    Requis
                  </Checkbox>
                  <Button danger icon={<DeleteOutlined/>} onClick={() => removeChild(index)}></Button>
                </div>
              </Card>
            ))}
            <Button type="dashed" onClick={addChild}>+ Ajouter un champ</Button>
          </div>
        )}


        {["select", "checkbox"].includes(selected.type) && (
          <div className="mt-4">
            <label className="block font-medium mb-1">Options</label>
            <div className="space-y-2">
              {(selected.options || []).map((opt: any, index: number) => (
                <div key={index} className="flex flex-col gap-2">
                  <Input
                    addonBefore="Label"
                    value={opt.label}
                    onChange={(e) => handleOptionChange(index, "label", e.target.value)}
                  />
                  <Input
                    addonBefore="Value"
                    value={opt.value}
                    onChange={(e) => handleOptionChange(index, "value", e.target.value)}
                  />
                  <Button
                    icon={<DeleteOutlined/>}
                    danger
                    size="small"
                    onClick={() => handleRemoveOption(index)}
                  >
                    Supprimer
                  </Button>
                </div>
              ))}
              <Button type="dashed" onClick={handleAddOption}>
                + Ajouter une option
              </Button>
            </div>

            {selected.type !== "select" && (
              <div className="mt-4">
                <h3 className="font-semibold">Orientation </h3>
                <Switch
                  checked={selected.orientation !== "horizontal"}
                  onChange={(checked) =>
                    updateElement(selected.uuid, {
                      orientation: checked ? "vertical" : "horizontal",
                    })
                  }
                  checkedChildren="Vertical"
                  unCheckedChildren="Horizontal"
                />
              </div>
            )}

            {selected.type === "select" && (
              <div className="mt-4">
                <Checkbox
                  checked={selected.multiple}
                  onChange={(e) =>
                    updateElement(selected.uuid, {
                      multiple: e.target.checked,
                    })
                  }
                >
                  Autoriser la sélection multiple
                </Checkbox>
                <div className="mt-2">
                  <Switch
                    checked={selected.orientation === "horizontal"}
                    onChange={(checked) =>
                      updateElement(selected.uuid, {
                        orientation: checked ? "horizontal" : "vertical",
                      })
                    }
                    checkedChildren="Horizontal"
                    unCheckedChildren="Vertical"
                  />
                </div>
              </div>
            )}
          </div>
        )}

        {
          selected.type !== "checkbox" &&
          selected.type !== "radio" &&
          selected.type !== "head" &&
          selected.type !== "divider" &&
          selected.type !== "file" &&
          selected.type !== "image" &&
          selected.type !== "fieldset" &&
          selected.type !== "switch" &&
          selected.type !== "signature" &&
          selected.type !== "submit" &&
          (
            <Input
              className="mt-4"
              addonBefore="Placeholder"
              value={selected.placeholder}
              onChange={(e) =>
                updateElement(selected.uuid, {
                  placeholder: e.target.value,
                })
              }
            />
          )}

        {
          selected.type !== "head" &&
          selected.type !== "divider" &&
          selected.type !== "fieldset" &&
          selected.type !== "submit" &&
          (
            <div className="mt-4">
              <Checkbox
                checked={selected.required}
                onChange={(e) =>
                  updateElement(selected.uuid, {
                    required: e.target.checked,
                  })
                }
              >
                Requis
              </Checkbox>
            </div>
          )}
      </div>
    </Card>
  );
}
