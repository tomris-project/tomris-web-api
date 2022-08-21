
import _ from "lodash";
import React, { ForwardRefRenderFunction, useId, useImperativeHandle, useRef, useState } from "react";
import { FormFeedback, FormGroup, Input as InputBASE } from "reactstrap"
import { iLayoutTypeProps } from "../../hocs/withLayout";
import { iLabel, WithLabel } from "../../hocs/withLabel";
import { BaseControllerValueRef, BaseProps, ControllerClassType, ControllerType, ValidResponse } from "../../utility/baseRef";
import { Validator } from "../../utility/validator";
import { WithController } from "../../hocs/withController";
export type InputType = 'text' | 'textarea' | 'button' | 'password' | 'color';

export interface InputProps extends iLabel, iLayoutTypeProps, BaseProps<string, IInputRef>, React.InputHTMLAttributes<HTMLInputElement> {
  type?: InputType;
  bsSize?: 'lg' | 'sm';
  id: string;
  tag?: React.ElementType;
  innerRef?: React.Ref<HTMLInputElement | HTMLTextAreaElement>;
  plaintext?: boolean;
  addon?: boolean;
  //ref?: React.ForwardedRef<IInputFunctionsRef>

}

export interface IInputRef extends BaseControllerValueRef<string, InputProps> {

}

export const Input = WithController<InputProps, IInputRef>(WithLabel<InputProps, IInputRef>(React.forwardRef<IInputRef, InputProps>((props: InputProps, ref: React.ForwardedRef<IInputRef>) => {
  let [state, setState] = useState<string>(props.defaultValue as string);
  let [hidden, setHidden] = useState(props.hidden ?? false);
  let [validText, setValidText] = useState<string>("");
  let [valid, setValid] = useState<boolean>(true);
  let [disabled, setDisabled] = useState(props.disabled ?? false);
  // let [notvisible, setNotvisible] = useState(props.notvisible ?? false);

  const setValue = (value: string, ext: string) => {
    if (innerRef.current != null && ext != "setValue")
      innerRef.current.value = value;
    state = value;
    setState(state);
    return true;
  }
  let innerRef = useRef<HTMLInputElement>(null);
  const thatFnc: IInputRef = {
    getValue: () => state,
    setValue: setValue,
    clear: () => setValue(null, null),
    isHide: () => hidden,
    setHide: (val: boolean = !hidden) => setHidden(val),
    getProps: () => props as any,
    isDisable: () => disabled,
    setDisable: (val) => setDisabled(val),
    controllerClass: ControllerClassType.Input,
    type: ControllerType.Input,
    isValid: () => {
      let valid = Validator.ValidCheck(props.onValid, thatFnc, setValid, setValidText);
      return valid;
    }
  }

  props.controller?.register(thatFnc)


  useImperativeHandle(ref, () => (thatFnc));
  const propNew = _.omit(props, ["setHiddenLabel", "spacer", "onValid"]);
  return <>
    <InputBASE {...propNew} invalid={valid == true ? undefined : true} autoComplete={props.type == "password" ? "one-time-code" : "off"} defaultValue={state} hidden={hidden} innerRef={innerRef} bsSize={propNew.bsSize ?? "sm"}
      onChange={(e) => {
        try {
          thatFnc.setValue(e.target.value, "setValue"); 
        } catch (e) { }
        props.onChange?.(e);
      }}
      onBlur={(e) => {
        try {
          thatFnc.isValid?.();
        } catch (error) {

        }
        props.onBlur?.(e);
      }} />
    <FormFeedback valid={valid == true ? undefined : false}>{validText}</FormFeedback>
  </>;
})))