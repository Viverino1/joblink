"use client";

import { UploadIcon } from "lucide-react";
import { useState, useRef } from "react";
import { cn } from "@/lib/utils";

interface FileUploadProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'value'> {
  className?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  value?: File;
}

export const FileUpload = ({ className, onChange, value, ...props }: FileUploadProps) => {
  const [dragActive, setDragActive] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const [fileName, setFileName] = useState<string>(value?.name || "");

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFileName(e.dataTransfer.files[0].name);
      if (onChange && inputRef.current) {
        const fakeEvent = {
          target: Object.assign(inputRef.current, {
            files: e.dataTransfer.files,
          }),
        } as React.ChangeEvent<HTMLInputElement>;
        onChange(fakeEvent);
      }
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      setFileName(e.target.files[0].name);
      if (onChange) {
        onChange(e);
      }
    }
  };

  return (
    <div className={cn("flex flex-col items-center justify-center w-full", className)}>
      <div
        className={cn(
          "flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-card/30 hover:bg-card/50 transition-colors",
          dragActive ? "border-primary" : "border-border",
          className
        )}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
      >
        <UploadIcon className="w-6 h-6 text-foreground/60" />
        <p className="mt-2 text-sm text-foreground/60">
          {fileName ? fileName : "Drag and drop or click to upload"}
        </p>
      </div>
      <input
        {...props}
        className="hidden"
        ref={inputRef}
        type="file"
        onChange={handleChange}
      />
    </div>
  );
};