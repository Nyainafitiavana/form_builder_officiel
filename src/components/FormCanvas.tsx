"use client";

import { useFormContext } from "@/context/FormContext";
import FormLabel from "@/components/FormLabel";
import { ArrowUpOutlined, ArrowDownOutlined, DeleteOutlined } from "@ant-design/icons";
import {Button, Card, Checkbox, Col, DatePicker, Form, Input, InputNumber, Modal, Radio, Row, Select} from "antd";
import {useRouter} from "next/navigation";
import {useState} from "react";

export default function FormCanvas() {
  const {
    elements,
    selectedUuid,
    selectElement,
    removeElement,
    moveElement,
    saveToLocalStorage,
  } = useFormContext();

  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const router = useRouter();

  const handleSaveConfirmed = () => {
    saveToLocalStorage(); // call of context method
    setShowConfirmModal(false);
    router.push("/"); // redirect to from list
  };

  return (
      <Card className="rounded p-4 overflow-y-auto
             min-h-[300px] md:min-h-[400px] lg:min-h-[800px] max-h-[80vh]">
        <Row>
          <Col span={24}>
            <Row gutter={[0, 16]}>
              {[...elements]
                .sort((a, b) => a.order - b.order)
                .map((el, index) => (
                  <Col span={24} key={el.uuid}>
                    <Card
                      className={`relative cursor-pointer transition-all duration-200 ${
                        selectedUuid === el.uuid
                          ? "border-blue-500"
                          : "border-gray-300"
                      }`}
                      onClick={() => selectElement(el.uuid)}
                    >
                      <Row
                        className="absolute top-2 right-2 z-10"
                        gutter={8}
                        onClick={(e) => e.stopPropagation()}
                        wrap={false}
                        justify="end"
                      >
                        <Col>
                          <Button
                            icon={<ArrowUpOutlined />}
                            size="small"
                            className="border-gray-300"
                            disabled={index === 0}
                            onClick={() => moveElement(el.uuid, "up")}
                          />
                        </Col>
                        <Col>
                          <Button
                            icon={<ArrowDownOutlined />}
                            size="small"
                            className="border-gray-300"
                            disabled={index === elements.length - 1}
                            onClick={() => moveElement(el.uuid, "down")}
                          />
                        </Col>
                        <Col>
                          <Button
                            icon={<DeleteOutlined />}
                            danger
                            size="small"
                            onClick={() => removeElement(el.uuid)}
                          />
                        </Col>
                      </Row>

                      {/* Champs dynamiques */}
                      <Row>
                        <Col span={24}>
                          {el.type === "input" && (
                            <Form.Item>
                              <FormLabel label={el.label} required={el.required} />
                              <Input
                                name={el.name}
                                placeholder={el.placeholder}
                                required={el.required}
                                className="w-full"
                              />
                            </Form.Item>
                          )}

                          {el.type === "textarea" && (
                            <Form.Item>
                              <FormLabel label={el.label} required={el.required} />
                              <Input.TextArea
                                name={el.name}
                                placeholder={el.placeholder}
                                required={el.required}
                                className="w-full"
                              />
                            </Form.Item>
                          )}

                          {el.type === "checkbox" && (
                            <Form.Item>
                              <FormLabel label={el.label} required={el.required} />
                              <Checkbox.Group
                                name={el.name}
                                options={(el.options || []).map((opt) =>
                                  typeof opt === "string" ? { label: opt, value: opt } : opt
                                )}
                                className={el.orientation === "horizontal" ? "flex flex-row gap-4" : "flex flex-col gap-1"}
                              />
                            </Form.Item>
                          )}

                          {el.type === "radio" && (
                            <Form.Item>
                              <FormLabel label={el.label} required={el.required} />
                              <Radio.Group name={el.name}>
                                <div className={el.orientation === "horizontal" ? "flex flex-row gap-4" : "flex flex-col gap-1"}>
                                  {(el.options || []).map((opt) => {
                                    const value = typeof opt === "string" ? opt : opt.value;
                                    const label = typeof opt === "string" ? opt : opt.label;
                                    return (
                                      <Radio key={value} value={value}>
                                        {label}
                                      </Radio>
                                    );
                                  })}
                                </div>
                              </Radio.Group>
                            </Form.Item>
                          )}

                          {el.type === "date" && (
                            <Form.Item>
                              <FormLabel label={el.label} required={el.required} />
                              <DatePicker name={el.name} className="w-full" />
                            </Form.Item>
                          )}

                          {el.type === "number" && (
                            <Form.Item>
                              <FormLabel label={el.label} required={el.required} />
                              <InputNumber
                                style={{ width: "100%" }}
                                name={el.name}
                                placeholder={el.placeholder}
                                required={el.required}
                                min={el.min}
                                max={el.max}
                              />
                            </Form.Item>
                          )}

                          {el.type === "select" && (
                            <Form.Item>
                              <FormLabel label={el.label} required={el.required} />
                              <Select
                                showSearch
                                mode={el.multiple ? "multiple" : undefined}
                                className="w-full"
                                placeholder={el.placeholder || ""}
                                options={(el.options || []).map((opt) => ({
                                  label: opt,
                                  value: opt,
                                }))}
                              />
                            </Form.Item>
                          )}
                        </Col>
                      </Row>
                    </Card>
                  </Col>
                ))}
            </Row>

            {/* Bouton Sauvegarde */}
            <Row justify="end" className="mt-4">
              <Col>
                <Button type="primary" onClick={() => setShowConfirmModal(true)}>
                  Sauvegarder
                </Button>
              </Col>
            </Row>

            {/* Modal de confirmation */}
            <Modal
              open={showConfirmModal}
              onCancel={() => setShowConfirmModal(false)}
              onOk={handleSaveConfirmed}
              okText="Oui, sauvegarder"
              cancelText="Annuler"
              title="Confirmation"
            >
              <p>Voulez-vous vraiment sauvegarder ce formulaire ?</p>
            </Modal>
          </Col>
        </Row>
      </Card>
  );
}
