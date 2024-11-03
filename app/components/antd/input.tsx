import { InputProps } from "antd/es/input";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { Form, Input, Tag } from "antd";
import debounce from "lodash/debounce";
import { LoadingOutlined } from "@ant-design/icons";
import dynamic from "next/dynamic";
import "react-quill/dist/quill.snow.css";
import "suneditor/dist/css/suneditor.min.css"; 

interface DebounceSearchInputProps extends InputProps {
  fetchValue: (search: string) => Promise<any>;
  debounceTimeout?: number;
  resultDisplayKey?: string;
  onResult?: (result: any) => void;
}

interface DebounceLiveInputProps extends InputProps {
  checkValue: (
    value: string
  ) => Promise<{ ok: boolean; message: string; error?: any }>;
  debounceTimeout?: number;
  resultDisplayKey?: string;
  onResult?: (result: any) => void;
}

export function LiveValidateInput({
  checkValue,
  debounceTimeout = 800,
  onChange,
  ...props
}: DebounceLiveInputProps) {
  const ref = useRef(false);

  const [value, setValue] = useState<any>(props.value);
  const [result, setResult] = useState<{
    ok: boolean;
    loading: boolean;
    error?: any;
    value?: string;
    message?: string;
  }>({ ok: false, loading: false });

  const fetchOptions = (value: string) => {
    if (!value) {
      return;
    }
    fetchRef.current += 1;
    const fetchId = fetchRef.current;
    reset();
    setResult({ ...result, loading: true });
    checkValue(value)
      .then((rs) => {
        if (fetchId !== fetchRef.current) {
          // ignore previous call result
          return;
        }
        setResult({
          value,
          ok: rs.ok,
          message: rs?.message,
          error: rs?.error,
          loading: false,
        });
      })
      .catch((err) => {
        setResult({
          value,
          ok: false,
          message: err.message,
          error: err,
          loading: false,
        });
      });
  };

  const reset = () => {
    setResult({
      ok: false,
      loading: false,
    });
  };

  const fetchRef = useRef(0);

  const debounceFetcher = useMemo(
    () => debounce(fetchOptions, debounceTimeout),
    [checkValue, debounceTimeout]
  );
  const nowFetcher = useMemo(() => debounce(fetchOptions, 300), [checkValue]);

  useEffect(() => {
    if (ref.current && onChange) {
      if (result.ok) {
        onChange({ target: { value } } as any);
      } else {
        onChange({ target: { value: null } } as any);
      }
    }
  }, [result]);

  useEffect(() => {
    if (!!props.value && props.value !== value) {
      setValue(props.value);
    }
  }, [props.value]);

  useEffect(() => {
    if (!ref.current) {
      ref.current = true;
    }
  });

  const showMessage = result.error ?? (!result.ok ? result.message : null); // only show message when not ok or error
  const hasFeedback = !!result.error || !!result.value;
  const help = showMessage && (
    <span style={{ marginTop: 8 }} color={!result.ok ? "red" : "green"}>
      {showMessage}
    </span>
  );

  const validateStatus = result.loading
    ? "validating"
    : hasFeedback
    ? result.error || !result.ok
      ? "error"
      : "success"
    : undefined;

  return (
    <Form.Item
      style={{ marginBottom: 0 }}
      help={help}
      hasFeedback={hasFeedback}
      validateStatus={validateStatus}
    >
      <Input
        {...props}
        onPressEnter={async () => {
          if (value) {
            if (onChange) {
              onChange({ target: { value } } as any);
            }
            setResult({ ...result, loading: true });
            nowFetcher(value);
          }
        }}
        disabled={result.loading}
        value={value}
        onChange={(e) => {
          const value = e.target.value;
          if (!value) {
            reset();
          } else {
            debounceFetcher(value);
          }
          setValue(value);
        }}
      />
    </Form.Item>
  );
}

export function LiveSearchPickInput({
  fetchValue,
  debounceTimeout = 800,
  resultDisplayKey = "name",
  onResult,
  onChange,
  ...props
}: DebounceSearchInputProps) {
  const [ready, setReady] = useState<boolean>(false);

  const [value, setValue] = useState<any>(null);
  const [result, setResult] = useState<{
    loading: boolean;
    data?: any;
    error?: any;
    value?: string;
    message?: string;
  }>({ loading: false });

  const fetchRef = useRef(0);

  const reset = () => {
    setResult({
      loading: false,
    });
  };

  const debounceFetcher = useMemo(() => {
    const loadOptions = (value: string) => {
      if (!value) {
        return;
      }
      fetchRef.current += 1;
      const fetchId = fetchRef.current;

      reset();

      setResult({ ...result, loading: true });
      fetchValue(value)
        .then((rs) => {
          if (fetchId !== fetchRef.current) {
            // for fetch callback order
            return;
          }
          setResult({
            data: rs,
            message: !rs ? "New Company" : "",
            loading: false,
          });
          if (rs) {
            setValue(rs?.[resultDisplayKey]);
          }
        })
        .catch((err) => {
          setResult({ message: err.message, error: err, loading: false });
        });
    };
    return debounce(loadOptions, debounceTimeout);
  }, [fetchValue, debounceTimeout]);

  useEffect(() => {
    if (ready) {
      if (onResult) {
        onResult(result.data);
      }

      if (onChange) {
        onChange(result.data);
      }
    }
  }, [result]);

  useEffect(() => {
    setReady(true);
  });

  const hasFeedback = !!result.error || !!result.message;

  const help =
    result.error || result.message ? (
      <Tag style={{ marginTop: 8 }} color={!!result.error ? "red" : "green"}>
        {result.error ?? result.message}
      </Tag>
    ) : null;

  return (
    <Form.Item
      style={{ marginBottom: 0 }}
      help={help}
      hasFeedback={hasFeedback}
      validateStatus={result.error ? "error" : "success"}
    >
      <Input
        {...props}
        disabled={result.loading}
        value={value}
        onChange={(e) => {
          const value = e.target.value;
          if (!value) {
            reset();
          } else {
            debounceFetcher(value);
          }
          setValue(value);
        }}
        suffix={
          result.loading && (
            <LoadingOutlined style={{ color: "rgba(0,0,0,.45)" }} />
          )
        }
      />
    </Form.Item>
  );
}

const SunEditor = dynamic(() => import("suneditor-react"), {
  ssr: false,
});

type TextEditorInputProps = {
  value?: string;
  onChange: any;
  disable?: boolean;
  height?: string;
  width?: string;
  autoFocus?: boolean;
};

const TextEditor = (props: TextEditorInputProps) => {
  const { value = "", onChange, height, width, autoFocus, disable } = props;
  return (
    <SunEditor
      setContents={value}
      onChange={onChange}
      disable={disable}
      height={height}
      width={width}
      autoFocus={autoFocus}
    />
  );
};
export default TextEditor;
