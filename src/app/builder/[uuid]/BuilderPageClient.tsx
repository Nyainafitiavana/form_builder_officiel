"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { FormInterface } from "@/interfaces/Form.interface";
import { FormProvider } from "@/context/FormContext";
import Toolbox from "@/components/Builder/Toolbox";
import FormCanvas from "@/components/Builder/FormCanvas";
import PropertiesPanel from "@/components/Builder/PropertiesPanel";
import {Col, Layout, Row} from "antd";
import {Content} from "antd/es/layout/layout";

export default function BuilderPageClient({ uuid }: { uuid: string }) {
  const [form, setForm] = useState<FormInterface | null>(null);
  const router = useRouter();

  // Load form from localStorage
  useEffect(() => {
    const forms: FormInterface[] = JSON.parse(localStorage.getItem("forms") || "[]");
    const found = forms.find((f) => f.uuid === uuid);
    if (!found) {
      alert("Form not found");
      router.push("/");
    } else {
      setForm(found);
    }
  }, [uuid, router]);

  if (!form) return <div>Loading...</div>;

  return (
    <FormProvider form={form}>
      <Layout style={{ minHeight: "100vh", padding: 24 }}>
        <Content>
          <Row gutter={[16, 16]}>
            <Col xs={24} lg={5}>
              <Toolbox />
            </Col>
            <Col xs={24} lg={14}>
              <FormCanvas />
            </Col>
            <Col xs={24} lg={5}>
              <PropertiesPanel />
            </Col>
          </Row>
        </Content>
      </Layout>
    </FormProvider>
  );
}
