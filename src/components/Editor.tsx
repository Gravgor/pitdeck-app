//@ts-nocheck
'use client';

import { useEffect, useRef } from 'react';
import EditorJS from '@editorjs/editorjs';
import Header from '@editorjs/header';
import List from '@editorjs/list';
import Image from '@editorjs/image';
import Code from '@editorjs/code';
import Link from '@editorjs/link';
import Quote from '@editorjs/quote';

interface EditorProps {
  onChange?: (value: any) => void;
  defaultValue?: any;
  className?: string;
}

export function Editor({ onChange, defaultValue, className }: EditorProps) {
  const editorRef = useRef<EditorJS>();
  const holderRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!holderRef.current) return;

    const editor = new EditorJS({
      holder: holderRef.current,
      tools: {
        header: {
          class: Header,
          config: {
            levels: [2, 3, 4],
            defaultLevel: 2
          }
        },
        list: List,
        image: {
          class: Image,
          config: {
            uploader: {
              uploadByFile: async (file: File) => {
                // Implement your image upload logic here
                const formData = new FormData();
                formData.append('file', file);

                const response = await fetch('https://api.pitdeck.app/api/upload', {
                  method: 'POST',
                  body: formData
                });

                const data = await response.json();

                return {
                  success: 1,
                  file: {
                    url: data.url
                  }
                };
              }
            }
          }
        },
        code: Code,
        linkTool: Link,
        quote: Quote
      },
      data: defaultValue,
      onChange: async () => {
        const content = await editor.save();
        onChange?.(content);
      },
      placeholder: 'Start writing your post...'
    });

    editorRef.current = editor;

    return () => {
      editor.destroy();
    };
  }, [onChange, defaultValue]);

  return <div ref={holderRef} className={className} />;
} 