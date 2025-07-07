"use client";

import React from "react";

interface Props {
  label: string;
  required?: boolean;
}

export default function FormLabel({ label, required }: Props) {
  return (
    <label className="block font-semibold mb-1">
      {label}
      {required && <span className="text-red-500 ml-1">*</span>}
    </label>
  );
}
