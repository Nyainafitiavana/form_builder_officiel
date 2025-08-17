"use client";

import {useFormContext} from "@/context/FormContext";
import FormLabel from "@/components/FormLabel";
import {ArrowUpOutlined, ArrowDownOutlined, DeleteOutlined, InboxOutlined, PlusOutlined} from "@ant-design/icons";
import {
  Button,
  Card,
  Checkbox,
  Col,
  DatePicker, Divider,
  Form,
  Input,
  InputNumber,
  Modal,
  Radio,
  Row,
  Select,
  TimePicker, Upload, UploadFile, Image, UploadProps,
  Switch,
  Flex
} from "antd";
import {useRouter} from "next/navigation";
import React, {useState} from "react";
import Dragger from "antd/es/upload/Dragger";
import Title from "antd/es/typography/Title";
import SignatureCanvas from "react-signature-canvas";

type GetBase64Fn = (file: File) => Promise<string>;

export default function FormCanvas() {
  const {
    elements,
    form,
    selectedUuid,
    selectElement,
    removeElement,
    moveElement,
    saveToLocalStorage,
  } = useFormContext();

  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const router = useRouter();
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState<string>('');
  const [fileList, setFileList] = useState<UploadFile[]>([]);

  const handleSaveConfirmed = () => {
    saveToLocalStorage(); // call of context method
    setShowConfirmModal(false);
    // router.push("/"); // redirect to from list
  };

  const getBase64: GetBase64Fn = (file: File): Promise<string> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = error => reject(error);
    });

  const handlePreview = async (file: UploadFile) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj as File);
    }
    setPreviewImage(file.url || (file.preview as string));
    setPreviewOpen(true);
  };

  const handleChange: UploadProps['onChange'] = ({ fileList: newFileList }) => {
    setFileList(newFileList);
  };

  const uploadButton = (
    <button style={{ border: 0, background: 'none' }} type="button">
      <PlusOutlined />
      <div style={{ marginTop: 8 }}>Upload</div>
    </button>
  );


  return (
    <Card className="rounded p-4 overflow-y-auto
             min-h-[300px] md:min-h-[400px] lg:min-h-[800px] max-h-[80vh]"
          title={<Title level={5}>{form.name}</Title>}
    >
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
                          icon={<ArrowUpOutlined/>}
                          size="small"
                          className="border-gray-300"
                          disabled={index === 0}
                          onClick={() => moveElement(el.uuid, "up")}
                        />
                      </Col>
                      <Col>
                        <Button
                          icon={<ArrowDownOutlined/>}
                          size="small"
                          className="border-gray-300"
                          disabled={index === elements.length - 1}
                          onClick={() => moveElement(el.uuid, "down")}
                        />
                      </Col>
                      <Col>
                        <Button
                          icon={<DeleteOutlined/>}
                          danger
                          size="small"
                          onClick={() => removeElement(el.uuid)}
                        />
                      </Col>
                    </Row>

                    {/* Champs dynamiques */}
                    <Row>
                      <Col span={24}>
                        {el.type === "divider" && <Divider />}

                        {el.type === "head" && (
                          <div
                            className={`w-full my-4 text-${el.align}`}
                          >
                            <h2 className="text-2xl font-bold">{el.title}</h2>
                            <p className="text-gray-600">{el.description}</p>
                          </div>
                        )}

                        {el.type === "input" && (
                          <Form.Item>
                            <FormLabel label={el.label} required={el.required}/>
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
                            <FormLabel label={el.label} required={el.required}/>
                            <Input.TextArea
                              name={el.name}
                              placeholder={el.placeholder}
                              required={el.required}
                              className="w-full"
                            />
                          </Form.Item>
                        )}

                        {el.type === "email" && (
                          <Form.Item>
                            <FormLabel label={el.label} required={el.required}/>
                            <Input
                              name={el.name}
                              placeholder={el.placeholder}
                              required={el.required}
                              className="w-full"
                            />
                          </Form.Item>
                        )}

                        {el.type === "checkbox" && (
                          <Form.Item>
                            <FormLabel label={el.label} required={el.required}/>
                            <Checkbox.Group
                              key={el.uuid}
                              name={el.name}
                              options={(el.options || []).map((opt) =>
                                typeof opt === "string" ? {label: opt, value: opt} : opt
                              )}
                              className={el.orientation === "horizontal" ? "flex flex-row gap-4" : "flex flex-col gap-1"}
                            />
                          </Form.Item>
                        )}

                        {el.type === "radio" && (
                          <Form.Item>
                            <FormLabel label={el.label} required={el.required}/>
                            <Radio.Group name={el.name}>
                              <div
                                className={el.orientation === "horizontal" ? "flex flex-row gap-4" : "flex flex-col gap-1"}>
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
                            <FormLabel label={el.label} required={el.required}/>
                            <DatePicker name={el.name} className="w-full"/>
                          </Form.Item>
                        )}

                        {el.type === "number" && (
                          <Form.Item>
                            <FormLabel label={el.label} required={el.required}/>
                            <InputNumber
                              style={{width: "100%"}}
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
                            <FormLabel label={el.label} required={el.required}/>
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

                        {el.type === 'time' && (
                          <Form.Item>
                            <FormLabel label={el.label} required={el.required}/>
                            <TimePicker/>
                          </Form.Item>
                        )}

                        {el.type === 'phone' && (
                          <Form.Item>
                            <FormLabel label={el.label} required={el.required}/>
                            <Input showCount maxLength={el.max} placeholder={el.placeholder || ''}/>
                          </Form.Item>
                        )}

                        {el.type === "file" && (
                          <Form.Item>
                            <FormLabel label={el.label} required={el.required} />
                            <Dragger
                              name={el.name}
                              multiple
                              beforeUpload={() => false}
                              listType="text"
                            >
                              <p className="ant-upload-drag-icon">
                                <InboxOutlined />
                              </p>
                              <p className="ant-upload-text">Cliquez ou glissez un fichier ici</p>
                              <p className="ant-upload-hint">
                                Vous pouvez sélectionner plusieurs fichiers. Les données sensibles sont interdites.
                              </p>
                            </Dragger>
                          </Form.Item>
                        )}

                        {el.type === "image" && (
                          <Form.Item>
                            <FormLabel label={el.label} required={el.required} />
                            <Upload
                              listType="picture-circle"
                              fileList={fileList}
                              onPreview={handlePreview}
                              onChange={handleChange}
                              beforeUpload={() => false} // avoid automatic upload
                            >
                              {fileList.length >= 8 ? null : uploadButton}
                            </Upload>
                            <Image
                              wrapperStyle={{ display: 'none' }} // skip the automatic preview
                              preview={{
                                visible: previewOpen,
                                onVisibleChange: (visible) => setPreviewOpen(visible),
                                afterOpenChange: (visible) => !visible && setPreviewImage(''),
                              }}
                              src={previewImage}
                            />
                          </Form.Item>
                        )}

                        {el.type === 'fieldset' && (
                          <Card title={el.label} style={{ marginTop: '20px', marginBottom: '1rem' }}>
                            {el.children?.map((child, index) => (
                              <Form.Item key={child.uuid}>
                                <FormLabel label={child.label} required={child.required} />
                                {child.type === "input" && (
                                  <Input placeholder={child.placeholder || ""} />
                                )}
                                {child.type === "date" && (
                                  <DatePicker className="w-full" placeholder={child.placeholder || ""} />
                                )}
                                {child.type === "number" && (
                                  <InputNumber
                                    style={{width: '50%'}}
                                    placeholder={child.placeholder || ""}
                                    min={child.min} max={child.max} />
                                )}
                              </Form.Item>
                            ))}
                          </Card>
                        )}

                        {el.type === 'switch' && (
                          <Form.Item
                            key={el.uuid}
                            name={el.name}
                            valuePropName="checked"
                          >
                            <FormLabel label={el.label} required={el.required} />
                            <Switch
                              checkedChildren={el.checkedChildren}
                              unCheckedChildren={el.unCheckedChildren}
                            />
                          </Form.Item>
                        )}

                        {el.type === 'submit' && (
                          <Form.Item key={el.uuid}>
                              <Button block={el.buttonWidth === 'Full'} type="primary" htmlType="submit" style={{ marginTop: "20px" }}>
                                {el.buttonText || 'Soumettre'}
                              </Button>
                          </Form.Item>
                        )}

                        {el.type === 'signature' && (
                          <Form.Item
                            key={el.uuid}
                          >
                            <FormLabel label={el.label} required={el.required} />
                            <div className="p-2">
                              <SignatureCanvas
                                ref={(ref) => {
                                  if (ref) el.ref = ref; // stocker la référence dans l’élément pour futur traitement
                                }}
                                penColor="black"
                                canvasProps={{
                                  width: 300,
                                  height: 200,
                                  className: "sigCanvas border",
                                }}
                              />
                              <div className=" mt-2 text-sm text-gray-500">
                                <Button onClick={() => el.ref?.clear()} size="small">
                                  Effacer
                                </Button>
                              </div>
                            </div>
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
              <Button block color="cyan" variant="solid" onClick={() => setShowConfirmModal(true)}>
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
