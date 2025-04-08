import { mergeRefs } from "@chakra-ui/react";
import { useCallback, useId, useRef, useState } from "react";

type EventOrValue = React.ChangeEvent<HTMLInputElement> | string | number;

function isInputEvent(value: any): value is { target: HTMLInputElement } {
  return value && typeof value === "object" && "target" in value;
}

export interface UseRadioGroupProps {
  value?: string;
  defaultValue?: string;
  onChange?(nextValue: string): void;
  isDisabled?: boolean;
  isFocusable?: boolean;
  name?: string;
  isNative?: boolean;
}

export function useRadioGroup(props: UseRadioGroupProps = {}) {
  const {
    onChange: onChangeProp,
    value: valueProp,
    defaultValue,
    name: nameProp,
    isDisabled,
    isFocusable,
    isNative,
    ...htmlProps
  } = props;

  const [valueState, setValue] = useState<string | number>(defaultValue || "");
  const isControlled = typeof valueProp !== "undefined";
  const value = isControlled ? valueProp : valueState;

  const ref = useRef<any>(null);

  const focus = useCallback(() => {
    const rootNode = ref.current;
    if (!rootNode) return;

    let query = `input:not(:disabled):checked`;
    const firstEnabledAndCheckedInput = rootNode.querySelector(query) as HTMLElement;

    if (firstEnabledAndCheckedInput) {
      firstEnabledAndCheckedInput.focus();
      return;
    }

    query = `input:not(:disabled)`;
    const firstEnabledInput = rootNode.querySelector(query) as HTMLElement;
    firstEnabledInput?.focus();
  }, []);

  const uuid = useId();
  const fallbackName = `radio-${uuid}`;
  const name = nameProp || fallbackName;

  const onChange = useCallback(
    (eventOrValue: EventOrValue) => {
      const nextValue = isInputEvent(eventOrValue) ? eventOrValue.target.value : eventOrValue;

      if (!isControlled) {
        setValue(nextValue);
      }

      onChangeProp?.(String(nextValue));
    },
    [onChangeProp, isControlled]
  );

  const getRootProps = useCallback(
    (props = {}, forwardedRef = null) => ({
      ...props,
      ref: mergeRefs(forwardedRef, ref),
      role: "radiogroup"
    }),
    []
  );

  const getRadioProps = useCallback(
    (props: any = {}, ref = null) => {
      const checkedKey = isNative ? "checked" : "isChecked";
      return {
        ...props,
        ref,
        name,
        [checkedKey]: value != null ? props.value === value : undefined,
        onChange(event: React.ChangeEvent<HTMLInputElement>) {
          props.onChange?.(event);
          onChange(event);
        },
        "data-radiogroup": true
      };
    },
    [isNative, name, onChange, value]
  );

  // New getItemProps that combines radio props with container props
  const getItemProps = useCallback(
    (props: any = {}, ref = null) => {
      const { value, children, ...rest } = props;
      return {
        ...rest,
        children,
        value,
        ref,
        // Spread radio props onto the input element
        inputProps: getRadioProps({ value }, ref)
      };
    },
    [getRadioProps]
  );

  return {
    getRootProps,
    getRadioProps,
    getItemProps, // New method
    name,
    ref,
    focus,
    setValue,
    value,
    onChange,
    isDisabled,
    isFocusable,
    htmlProps
  };
}
