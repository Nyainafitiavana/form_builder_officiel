"use client";

import React, { useMemo, useState } from "react";
import {
  Modal,
  Button,
  Form,
  Input,
  InputNumber,
  DatePicker,
  TimePicker,
  Select,
  Checkbox,
  Radio as AntRadio,
  Switch,
  Upload,
  Divider,
  message,
} from "antd";
import { DesktopOutlined, TabletOutlined, MobileOutlined } from "@ant-design/icons";
import { useFormContext } from "@/context/FormContext";
import { FormElement } from "@/interfaces/Form.interface";

type Device = "desktop" | "tablet" | "mobile";

export default function PreviewModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { form } = useFormContext();
  const [device, setDevice] = useState<Device>("desktop");

  const containerWidth = useMemo(() => {
    switch (device) {
      case "tablet":
        return 768;
      case "mobile":
        return 375;
      default:
        return 1024;
    }
  }, [device]);

  function buildRules(el: FormElement) {
    const rules: any[] = [];
    if (el.required) rules.push({ required: true, message: "Ce champ est requis" });
    if (el.type === "email") rules.push({ type: "email", message: "Adresse e-mail invalide" });
    if (el.type === "number") {
      if (typeof el.min === "number") rules.push({ type: "number", min: el.min, message: `Valeur min : ${el.min}` });
      if (typeof el.max === "number") rules.push({ type: "number", max: el.max, message: `Valeur max : ${el.max}` });
    }
    return rules;
  }

  function renderField(el: FormElement) {
    const name = el.name || el.uuid;
    const rules = buildRules(el);

    switch (el.type) {
      case "head":
        return (
          <div key={el.uuid} style={{ margin: "12px 0" }}>
            <h2 className="text-2xl font-bold">{el.title}</h2>
            {el.description && <p className="text-gray-600">{el.description}</p>}
          </div>
        );

      case "divider":
        return (
          <div key={el.uuid} style={{ margin: "12px 0" }}>
            <Divider />
          </div>
        );

      case "input":
      case "email":
      case "phone":
        return (
          <Form.Item key={el.uuid} name={name} label={el.label} rules={rules}>
            <Input placeholder={el.placeholder || ""} />
          </Form.Item>
        );

      case "textarea":
        return (
          <Form.Item key={el.uuid} name={name} label={el.label} rules={rules}>
            <Input.TextArea placeholder={el.placeholder || ""} rows={4} />
          </Form.Item>
        );

      case "select":
        return (
          <Form.Item key={el.uuid} name={name} label={el.label} rules={rules}>
            <Select
              placeholder={el.placeholder || ""}
              mode={el.multiple ? "multiple" : undefined}
              options={(el.options || []).map((o) => ({ label: o.label, value: o.value }))}
            />
          </Form.Item>
        );

      case "checkbox":
        return (
          <Form.Item key={el.uuid} name={name} label={el.label} rules={rules}>
            <Checkbox.Group options={(el.options || []).map((o) => ({ label: o.label, value: o.value }))} />
          </Form.Item>
        );

      case "radio":
        return (
          <Form.Item key={el.uuid} name={name} label={el.label} rules={rules}>
            <AntRadio.Group options={(el.options || []).map((o) => ({ label: o.label, value: o.value }))} />
          </Form.Item>
        );

      case "date":
        return (
          <Form.Item key={el.uuid} name={name} label={el.label} rules={rules}>
            <DatePicker style={{ width: "100%" }} />
          </Form.Item>
        );

      case "time":
        return (
          <Form.Item key={el.uuid} name={name} label={el.label} rules={rules}>
            <TimePicker style={{ width: "100%" }} />
          </Form.Item>
        );

      case "number":
        return (
          <Form.Item key={el.uuid} name={name} label={el.label} rules={rules}>
            <InputNumber style={{ width: "100%" }} min={el.min} max={el.max} />
          </Form.Item>
        );

      case "switch":
        return (
          <Form.Item key={el.uuid} name={name} label={el.label} valuePropName="checked">
            <Switch checkedChildren={el.checkedChildren} unCheckedChildren={el.unCheckedChildren} />
          </Form.Item>
        );

      case "file":
      case "image":
        return (
          <Form.Item key={el.uuid} name={name} label={el.label} rules={rules}>
            <Upload
              listType={el.type === "image" ? "picture-card" : "text"}
              beforeUpload={() => false} // désactive l'upload réel en mode preview
              showUploadList={{
                showRemoveIcon: true,
                showPreviewIcon: el.type === "image",
              }}
              onPreview={(file) => {
                // preview image
                if (el.type === "image" && file.thumbUrl) {
                  const img = new Image();
                  img.src = file.thumbUrl;
                  const w = window.open("");
                  w?.document.write(img.outerHTML);
                }
              }}
            >
              {el.type === "image" ? (
                <div>
                  <div style={{ marginTop: 8 }}>Upload</div>
                </div>
              ) : (
                <Button>Choisir un fichier</Button>
              )}
            </Upload>
          </Form.Item>
        );

      case "signature":
        return (
          <Form.Item key={el.uuid} label={el.label}>
            <div style={{ height: 120, border: "1px dashed #ddd", borderRadius: 6, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <span style={{ color: "#888" }}>Signature (aperçu)</span>
            </div>
          </Form.Item>
        );

      case "submit":
        return (
          <Form.Item key={el.uuid}>
            <Button type="primary" htmlType="submit">
              {el.buttonText || "Envoyer"}
            </Button>
          </Form.Item>
        );

      case "fieldset":
        return (
          <div key={el.uuid} style={{ padding: 12, border: "1px solid #eee", borderRadius: 6, marginBottom: 12 }}>
            {el.label && <h4>{el.label}</h4>}
            {(el.children || []).map((child) => renderField(child))}
          </div>
        );

      default:
        return (
          <Form.Item key={el.uuid} name={name} label={el.label}>
            <Input placeholder={el.placeholder || ""} />
          </Form.Item>
        );
    }
  }

  return (
    <Modal open={open} onCancel={onClose} footer={null} width={Math.min(1200, containerWidth + 160)}>
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", marginBottom: 12 }}>
        <Button
          type={device === "desktop" ? "primary" : "default"}
          icon={<DesktopOutlined />}
          onClick={() => setDevice("desktop")}
          style={{ marginRight: 8 }}
        />
        <Button
          type={device === "tablet" ? "primary" : "default"}
          icon={<TabletOutlined />}
          onClick={() => setDevice("tablet")}
          style={{ marginRight: 8 }}
        />
        <Button
          type={device === "mobile" ? "primary" : "default"}
          icon={<MobileOutlined />}
          onClick={() => setDevice("mobile")}
        />
      </div>

      <div
        style={{
          width: containerWidth,
          margin: "0 auto",
          padding: 16,
          borderRadius: 8,
          border: "1px solid #f0f0f0",
          maxHeight: "70vh",
          overflowY: "auto",
        }}
      >
        {form?.name && <h3 style={{ marginTop: 0 }}>{form.name}</h3>}
        {form?.description && <p style={{ color: "#666" }}>{form.description}</p>}

        <Form layout="vertical" onFinish={(values) => { console.log("Preview values:", values); message.success("Ceci est une preview — pas d'enregistrement"); }}>
          {(form?.elements || [])
            .slice()
            .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
            .map((el) => renderField(el))}
        </Form>
      </div>
    </Modal>
  );
}
