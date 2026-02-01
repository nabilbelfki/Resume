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

type MonacoPosition = {
  lineNumber: number;
  column: number;
};

type MonacoModel = {
  getLineCount: () => number;
  getLineContent: (lineNumber: number) => string;
};

type MonacoEditor = {
  dispose: () => void;
  onDidChangeModelContent: (cb: () => void) => void;
  onDidFocusEditorText: (cb: () => void) => void;
  onDidBlurEditorText: (cb: () => void) => void;
  onDidChangeCursorPosition: (cb: (e: { position: MonacoPosition }) => void) => void;
  onKeyDown: (cb: (e: { keyCode: number; preventDefault: () => void }) => void) => void;
  getValue: () => string;
  setValue: (value: string) => void;
  getModel: () => MonacoModel | null;
  getPosition: () => MonacoPosition;
  focus: () => void;
};

type MonacoNamespace = {
  editor: {
    create: (el: HTMLElement, options: Record<string, unknown>) => MonacoEditor;
    setModelLanguage: (model: MonacoModel, language: Language) => void;
  };
  KeyCode: {
    UpArrow: number;
    DownArrow: number;
    Backspace: number;
  };
};

interface CodeProps {
  initialCode?: string;
  initialLanguage?: Language;
  editable?: boolean;
  onFocus?: () => void;
  onBlur?: (code: string) => void;
  onArrowUp?: () => void;
  onDelete?: () => void;
  onArrowDown?: () => void;
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
  onArrowUp = () => {},
  onArrowDown = () => {},
  onDelete = () => {},
}) => {
  const [code, setCode] = useState(initialCode);
  const [language, setLanguage] = useState<Language>(initialLanguage);
  const [isCopied, setIsCopied] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isMonacoReady, setIsMonacoReady] = useState(false);
  const editorRef = useRef<MonacoEditor | null>(null);
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

    const windowWithMonaco = window as unknown as {
      monaco?: MonacoNamespace;
      require?: {
        config: (cfg: { paths: Record<string, string> }) => void;
        (deps: string[], cb: (monacoModule: MonacoNamespace) => void): void;
      };
    };

    let editor: MonacoEditor | null = null;
    let loadTimeout: ReturnType<typeof setTimeout>;

    const initMonaco = async () => {
      try {
        // Check if Monaco is already loaded
        if (windowWithMonaco.monaco) {
          createEditor(windowWithMonaco.monaco);
          return;
        }

        // Set timeout for loading
        loadTimeout = setTimeout(() => {
          console.error('Monaco Editor loading timeout');
          setIsLoading(false);
        }, 10000);

        // Check if require is already available
        if (windowWithMonaco.require) {
          windowWithMonaco.require(['vs/editor/editor.main'], (monacoModule: MonacoNamespace) => {
            clearTimeout(loadTimeout);
            createEditor(monacoModule);
          });
          return;
        }

        // Load Monaco Editor from CDN
        const script = document.createElement('script');
        script.src = 'https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.45.0/min/vs/loader.min.js';
        script.onload = () => {
          windowWithMonaco.require?.config({ 
            paths: { 
              'vs': 'https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.45.0/min/vs' 
            } 
          });
          
          windowWithMonaco.require?.(['vs/editor/editor.main'], (monacoModule: MonacoNamespace) => {
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

    const createEditor = (monacoModule: MonacoNamespace) => {
      const monacoInstance = monacoModule;
      windowWithMonaco.monaco = monacoInstance;
      
      if (!containerRef.current) {
        setIsLoading(false);
        return;
      }

      try {
        editor = monacoInstance.editor.create(containerRef.current, {
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

        const monacoEditor = editor;
        if (!monacoEditor) {
          setIsLoading(false);
          return;
        }

        editorRef.current = monacoEditor;

        // Handle content changes with debouncing
        let changeTimeout: NodeJS.Timeout;
        monacoEditor.onDidChangeModelContent(() => {
          clearTimeout(changeTimeout);
          changeTimeout = setTimeout(() => {
            const value = monacoEditor.getValue();
            setCode(value);
          }, 100);
        });

        // Handle focus events
        monacoEditor.onDidFocusEditorText(() => {
          onFocus();
        });

        monacoEditor.onDidBlurEditorText(() => {
          onBlur(monacoEditor.getValue());
        });

        // Handle keydown events for arrow key navigation
        monacoEditor.onKeyDown((e) => {
          const position = monacoEditor.getPosition();
          const model = monacoEditor.getModel();
          if (!model) return;
          const lineCount = model.getLineCount();
          
          // Arrow Up at first line
          if (e.keyCode === monacoInstance.KeyCode.UpArrow && position.lineNumber === 1) {
            onArrowUp();
            e.preventDefault();
          }
          
          // Arrow Down at last line
          if (e.keyCode === monacoInstance.KeyCode.DownArrow && position.lineNumber === lineCount) {
            onArrowDown();
            e.preventDefault();
          }

          // Backspace when editor is empty
          if (e.keyCode === monacoInstance.KeyCode.Backspace) {
            const currentValue = monacoEditor.getValue();
            console.log("Editor Content", currentValue);
            const isEditorEmpty = currentValue === '';
            
            if (isEditorEmpty) {
              onDelete();
              e.preventDefault();
            }
          }
        });

        // Force focus after creation
        setTimeout(() => {
          if (editable) {
            monacoEditor.focus();
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
  }, [cleanup, code, editable, language, onArrowDown, onArrowUp, onBlur, onDelete, onFocus]);

  // Handle language changes
  useEffect(() => {
    const windowWithMonaco = window as unknown as { monaco?: MonacoNamespace };
    if (editorRef.current && isMonacoReady && windowWithMonaco.monaco) {
      try {
        const model = editorRef.current.getModel();
        if (model) {
          windowWithMonaco.monaco.editor.setModelLanguage(model, language);
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
