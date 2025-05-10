'use client';

import { useRef, useState } from 'react';
import {
  PromptInput,
  PromptInputAction,
  PromptInputActions,
  PromptInputTextarea,
} from '@/components/ui/prompt-input';
import { Button } from '@/components/ui/button';
import { Paperclip, X, Send, Square } from 'lucide-react';

export function PromptInputWithPdf() {
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const uploadInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = () => {
    if (input.trim() || files.length > 0) {
      setIsLoading(true);
      console.log('提交内容:', { text: input, files });
      // 模拟提交过程
      setTimeout(() => {
        setIsLoading(false);
        setInput('');
        setFiles([]);
      }, 2000);
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const newFiles = Array.from(event.target.files).filter(
        file => file.type === 'application/pdf'
      );

      if (newFiles.length > 0) {
        setFiles(prev => [...prev, ...newFiles]);
      }
    }

    // 重置input的值，允许选择相同的文件
    if (uploadInputRef.current) {
      uploadInputRef.current.value = '';
    }
  };

  const handleRemoveFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <PromptInput
      value={input}
      onValueChange={setInput}
      isLoading={isLoading}
      onSubmit={handleSubmit}
      className="w-full"
    >
      {files.length > 0 && (
        <div className="flex flex-wrap gap-2 pb-2">
          {files.map((file, index) => (
            <div
              key={index}
              className="bg-secondary flex items-center gap-2 rounded-lg px-3 py-1.5 text-sm"
            >
              <Paperclip className="size-4" />
              <span className="max-w-[120px] truncate">{file.name}</span>
              <button
                onClick={() => handleRemoveFile(index)}
                className="hover:bg-secondary/50 rounded-full p-1"
                type="button"
              >
                <X className="size-3.5" />
              </button>
            </div>
          ))}
        </div>
      )}

      <PromptInputTextarea placeholder="输入你想总结的内容..." />

      <PromptInputActions className="flex items-center justify-between gap-2 pt-2">
        <PromptInputAction tooltip="上传PDF文件">
          <label
            htmlFor="pdf-upload"
            className="hover:bg-secondary-foreground/10 flex h-8 w-8 cursor-pointer items-center justify-center rounded-full"
          >
            <input
              ref={uploadInputRef}
              type="file"
              accept=".pdf,application/pdf"
              multiple
              onChange={handleFileChange}
              className="hidden"
              id="pdf-upload"
            />
            <Paperclip className="text-primary size-5" />
          </label>
        </PromptInputAction>

        <PromptInputAction tooltip={isLoading ? '停止生成' : '发送消息'}>
          <Button
            variant="default"
            size="icon"
            className="h-8 w-8 rounded-full"
            onClick={handleSubmit}
            disabled={!input.trim() && files.length === 0}
          >
            {isLoading ? <Square className="size-4 fill-current" /> : <Send className="size-4" />}
          </Button>
        </PromptInputAction>
      </PromptInputActions>
    </PromptInput>
  );
}
