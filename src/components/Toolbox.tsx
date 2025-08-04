"use client";
import {Card} from "antd";
import { useFormContext } from "@/context/FormContext";
import Title from "antd/es/typography/Title";
import {
  AppstoreOutlined,
  CalendarOutlined, CheckCircleOutlined,
  CheckSquareOutlined, ClockCircleOutlined,
  EditOutlined,
  NumberOutlined, PhoneOutlined,
  PlusOutlined
} from "@ant-design/icons";

export default function Toolbox() {
  const { addElement } = useFormContext();
  const ToolboxCard = ({ icon: Icon, label, onClick }: any) => (
    <Card
      onClick={onClick}
      hoverable
      className="flex items-center justify-center h-24 cursor-pointer transition-all duration-200 hover:shadow-lg bg-neutral-900 text-white"
    >
      <div className="flex flex-col items-center justify-center">
        <Icon className="text-xl mb-1" />
        <span className="text-xs text-center">{label}</span>
      </div>
    </Card>
  );

  return (
    <Card className="space-y-2 rounded shadow p-4 overflow-y-auto
             min-h-[300px] md:min-h-[400px] lg:min-h-[800px] max-h-[80vh]"
          variant="outlined" title={<Title level={5}>Ajouter un champ</Title>}>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
        <ToolboxCard icon={PlusOutlined} label="Input" onClick={() => addElement("input")} />
        <ToolboxCard icon={NumberOutlined} label="Number" onClick={() => addElement("number")} />
        <ToolboxCard icon={EditOutlined} label="Textarea" onClick={() => addElement("textarea")} />
        <ToolboxCard icon={CheckSquareOutlined} label="Choix multiples" onClick={() => addElement("checkbox")} />
        <ToolboxCard icon={CheckCircleOutlined} label="Choix unique" onClick={() => addElement("radio")} />
        <ToolboxCard icon={CalendarOutlined} label="Date" onClick={() => addElement("date")} />
        <ToolboxCard icon={ClockCircleOutlined} label="Heure" onClick={() => addElement("time")} />
        <ToolboxCard icon={PhoneOutlined} label="Téléphone" onClick={() => addElement("phone")} />
        <ToolboxCard
          icon={AppstoreOutlined}
          label="Select"
          onClick={() => addElement("select")}
        />
      </div>

    </Card>
  );
}
