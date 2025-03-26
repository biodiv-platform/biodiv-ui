export type EventOrValue = React.ChangeEvent<HTMLInputElement> | string | number;

export interface UseCheckboxGroupProps {
  /**
   * The value of the checkbox group
   */
  value?: Array<string | number>;
  /**
   * The initial value of the checkbox group
   */
  defaultValue?: Array<string | number>;
  /**
   * The callback fired when any children Checkbox is checked or unchecked
   */
  onChange?(value: Array<string | number>): void;
  /**
   * If `true`, all wrapped checkbox inputs will be disabled
   *
   * @default false
   */
  isDisabled?: boolean;
}

export const isObject = (v: any): v is Record<string, any> =>
  v != null && typeof v === "object" && !Array.isArray(v);

import { useCallbackRef, useControllableState } from "@chakra-ui/react";
// import { isObject } from "@chakra-ui/utils"
import { useCallback } from "react";

function isInputEvent(value: any): value is { target: HTMLInputElement } {
  return value && isObject(value) && isObject(value.target);
}

/**
 * React hook that provides all the state management logic
 * for a group of checkboxes.
 *
 * It is consumed by the `CheckboxGroup` component
 *
 * @see Docs https://v2.chakra-ui.com/docs/hooks/use-checkbox-group
 * @see WAI-ARIA https://www.w3.org/WAI/ARIA/apg/patterns/checkbox/
 */
export function useCheckboxGroup(props: UseCheckboxGroupProps = {}) {
  const { defaultValue, value: valueProp, onChange, isDisabled } = props;

  const onChangeProp = useCallbackRef(onChange);

  const [value, setValue] = useControllableState({
    value: valueProp,
    defaultValue: defaultValue || [],
    onChange: onChangeProp,
  });

  const handleChange = useCallback(
    (eventOrValue: EventOrValue) => {
      if (!value) return;

      const checked = isInputEvent(eventOrValue)
        ? eventOrValue.target.checked
        : !value.includes(eventOrValue);

      const selectedValue = isInputEvent(eventOrValue) ? eventOrValue.target.value : eventOrValue;

      const nextValue = checked
        ? [...value, selectedValue]
        : value.filter((v) => String(v) !== String(selectedValue));

      setValue(nextValue);
    },
    [setValue, value]
  );

  const getCheckboxProps = useCallback(
    (props: Record<string, any> = {}) => {
      const checkedKey = "checked";
      return {
        ...props,
        [checkedKey]: value.some((val) => String(props.value) === String(val)),
        onChange: handleChange,
      };
    },
    [handleChange, value]
  );

  return {
    value,
    isDisabled,
    onChange: handleChange,
    setValue,
    getCheckboxProps,
  };
}

export type UseCheckboxGroupReturn = ReturnType<typeof useCheckboxGroup>;
