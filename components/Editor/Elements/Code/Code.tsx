import React, { useState, useRef, useEffect, useCallback } from 'react';
import styles from './Code.module.css';

type Language = 
  | 'javascript'
  | 'typescript'
  | 'python'
  | 'java'
  | 'css'
  | 'html'
  | 'json'
  | 'markdown';

interface CodeProps {
  initialCode?: string;
  initialLanguage?: Language;
  editable?: boolean;
  onFocus?: () => void;
  onBlur?: (code: string) => void;
}

const supportedLanguages = [
  { value: 'javascript', label: 'JavaScript' },
  { value: 'typescript', label: 'TypeScript' },
  { value: 'python', label: 'Python' },
  { value: 'java', label: 'Java' },
  { value: 'css', label: 'CSS' },
  { value: 'html', label: 'HTML' },
  { value: 'json', label: 'JSON' },
  { value: 'markdown', label: 'Markdown' },
] as const;

const Code: React.FC<CodeProps> = ({
  initialCode = 'function hello() {\n  console.log("Hello, World!");\n}',
  initialLanguage = 'javascript',
  editable = true,
  onFocus = () => {},
  onBlur = () => {},
}) => {
  const [code, setCode] = useState(initialCode);
  const [language, setLanguage] = useState<Language>(initialLanguage);
  const [isCopied, setIsCopied] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isMonacoReady, setIsMonacoReady] = useState(false);
  const editorRef = useRef<any>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const isInitializedRef = useRef(false);

  // Cleanup function
  const cleanup = useCallback(() => {
    if (editorRef.current) {
      try {
        editorRef.current.dispose();
        editorRef.current = null;
      } catch (error) {
        console.error('Error disposing editor:', error);
      }
    }
  }, []);

  useEffect(() => {
    // Prevent multiple initializations
    if (isInitializedRef.current) return;
    isInitializedRef.current = true;

    let monaco: any;
    let editor: any;
    let loadTimeout: NodeJS.Timeout;

    const initMonaco = async () => {
      try {
        // Check if Monaco is already loaded
        if ((window as any).monaco) {
          createEditor((window as any).monaco);
          return;
        }

        // Set timeout for loading
        loadTimeout = setTimeout(() => {
          console.error('Monaco Editor loading timeout');
          setIsLoading(false);
        }, 10000);

        // Check if require is already available
        if ((window as any).require) {
          (window as any).require(['vs/editor/editor.main'], (monacoModule: any) => {
            clearTimeout(loadTimeout);
            createEditor(monacoModule);
          });
          return;
        }

        // Load Monaco Editor from CDN
        const script = document.createElement('script');
        script.src = 'https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.45.0/min/vs/loader.min.js';
        script.onload = () => {
          (window as any).require.config({ 
            paths: { 
              'vs': 'https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.45.0/min/vs' 
            } 
          });
          
          (window as any).require(['vs/editor/editor.main'], (monacoModule: any) => {
            clearTimeout(loadTimeout);
            createEditor(monacoModule);
          });
        };
        
        script.onerror = () => {
          clearTimeout(loadTimeout);
          console.error('Failed to load Monaco Editor script');
          setIsLoading(false);
        };

        document.head.appendChild(script);

      } catch (error) {
        clearTimeout(loadTimeout);
        console.error('Failed to initialize Monaco Editor:', error);
        setIsLoading(false);
      }
    };

    const createEditor = (monacoModule: any) => {
      monaco = monacoModule;
      (window as any).monaco = monaco;
      
      if (!containerRef.current) {
        setIsLoading(false);
        return;
      }

      try {
        editor = monaco.editor.create(containerRef.current, {
          value: code,
          language: language,
          theme: 'vs-dark',
          fontSize: 14,
          lineHeight: 21,
          fontFamily: 'Monaco, "Cascadia Code", "Roboto Mono", Consolas, "Courier New", monospace',
          readOnly: !editable,
          minimap: { enabled: false },
          scrollBeyondLastLine: false,
          automaticLayout: true,
          wordWrap: 'on',
          lineNumbers: 'on',
          glyphMargin: false,
          folding: true,
          lineDecorationsWidth: 0,
          lineNumbersMinChars: 3,
          renderLineHighlight: 'line',
          contextmenu: true,
          mouseWheelZoom: false,
          smoothScrolling: false,
          cursorBlinking: 'blink',
          cursorStyle: 'line',
          insertSpaces: true,
          tabSize: 2,
          detectIndentation: true,
          trimAutoWhitespace: true,
          scrollbar: {
            vertical: 'visible',
            horizontal: 'visible',
            useShadows: false,
            verticalHasArrows: false,
            horizontalHasArrows: false,
            alwaysConsumeMouseWheel: false,
          },
        });

        editorRef.current = editor;

        // Handle content changes with debouncing
        let changeTimeout: NodeJS.Timeout;
        editor.onDidChangeModelContent(() => {
          clearTimeout(changeTimeout);
          changeTimeout = setTimeout(() => {
            const value = editor.getValue();
            setCode(value);
          }, 100);
        });

        // Handle focus events
        editor.onDidFocusEditorText(() => {
          onFocus();
        });

        editor.onDidBlurEditorText(() => {
          onBlur(editor.getValue());
        });

        // Force focus after creation
        setTimeout(() => {
          if (editor && editable) {
            editor.focus();
          }
        }, 100);

        setIsMonacoReady(true);
        setIsLoading(false);

      } catch (error) {
        console.error('Failed to create Monaco Editor instance:', error);
        setIsLoading(false);
      }
    };

    initMonaco();

    return cleanup;
  }, []);

  // Handle language changes
  useEffect(() => {
    if (editorRef.current && isMonacoReady && (window as any).monaco) {
      try {
        const model = editorRef.current.getModel();
        if (model) {
          (window as any).monaco.editor.setModelLanguage(model, language);
        }
      } catch (error) {
        console.error('Failed to change language:', error);
      }
    }
  }, [language, isMonacoReady]);

  // Handle initial code changes
  useEffect(() => {
    if (editorRef.current && isMonacoReady) {
      try {
        const currentValue = editorRef.current.getValue();
        if (initialCode !== currentValue) {
          editorRef.current.setValue(initialCode);
        }
      } catch (error) {
        console.error('Failed to set initial code:', error);
      }
    }
  }, [initialCode, isMonacoReady]);

  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setLanguage(e.target.value as Language);
  };

  const handleCopy = async () => {
    try {
      const textToCopy = editorRef.current ? editorRef.current.getValue() : code;
      await navigator.clipboard.writeText(textToCopy);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  const handleRefocus = () => {
    if (editorRef.current && editable) {
      editorRef.current.focus();
    }
  };

  return (
    <div className={styles.container}>
      {/* Toolbar */}
      <div className={styles.toolbar}>
        <div className={styles.toolbarLeft}>
          <select
            value={language}
            onChange={handleLanguageChange}
            className={styles.languageSelect}
            disabled={!editable || isLoading}
          >
            {supportedLanguages.map((lang) => (
              <option key={lang.value} value={lang.value}>
                {lang.label}
              </option>
            ))}
          </select>
          
          {isLoading && (
            <span className={styles.loadingText}>Loading editor...</span>
          )}
          
          {!isLoading && !isMonacoReady && (
            <span className={styles.errorText}>Failed to load editor</span>
          )}
        </div>

        <div className={styles.toolbarRight}>
          <button 
            onClick={handleCopy} 
            disabled={isLoading}
            className={`${styles.copyButton} ${isCopied ? styles.copyButtonSuccess : ''}`}
          >
            {isCopied ? 'Copied!' : 'Copy'}
          </button>
        </div>
      </div>

      {/* Monaco Editor Container */}
      <div className={styles.editorWrapper}>
        {isLoading && (
          <div className={styles.loadingOverlay}>
            <div className={styles.loadingContent}>
              <div className={styles.spinner}></div>
              Loading Monaco Editor...
            </div>
          </div>
        )}
        
        {!isLoading && !isMonacoReady && (
          <div className={styles.errorOverlay}>
            <div className={styles.errorContent}>
              <div className={styles.errorIcon}>⚠️</div>
              Failed to load Monaco Editor
              <br />
              <button 
                onClick={() => window.location.reload()} 
                className={styles.reloadButton}
              >
                Reload Page
              </button>
            </div>
          </div>
        )}
        
        <div 
          ref={containerRef} 
          className={styles.editorContainer}
          onClick={handleRefocus}
        />
      </div>
    </div>
  );
};

export default Code;