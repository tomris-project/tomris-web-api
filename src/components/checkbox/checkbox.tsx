
import _ from "lodash";
import React, { useImperativeHandle, useRef, useState } from "react";
import { FormFeedback, FormGroup, Input as CheckboxBASE } from "reactstrap"
import { iLayoutTypeProps } from "../../hocs/withLayout";
import { iLabel, WithLabel } from "../../hocs/withLabel";
import { BaseControllerValueRef, BaseProps, ControllerClassType, ControllerType, ValidResponse } from "../../utility/baseRef";
import { Validator } from "../../utility/validator";
import { WithController } from "../../hocs/withController";

export interface CheckboxProps extends iLabel, iLayoutTypeProps, BaseProps<boolean, ICheckboxRef>, Omit<React.InputHTMLAttributes<HTMLInputElement>, 'defaultValue'|'type'|'defaultChecked'> {

  bsSize?: 'lg' | 'sm';
  id: string;
  defaultValue?: boolean;
}

export interface ICheckboxRef extends BaseControllerValueRef<boolean, CheckboxProps> {

}

export const Checkbox = WithController<CheckboxProps, ICheckboxRef>(WithLabel<CheckboxProps, ICheckboxRef>(React.forwardRef<ICheckboxRef, CheckboxProps>((props: CheckboxProps, ref: React.ForwardedRef<ICheckboxRef>) => {
  let [state, setState] = useState<boolean>(props.defaultValue as boolean);
  let [hidden, setHidden] = useState(props.hidden ?? false);
  let [validText, setValidText] = useState<string>("");
  let [valid, setValid] = useState<boolean>(true);
  let [disabled, setDisabled] = useState(props.disabled ?? false);
  // let [notvisible, setNotvisible] = useState(props.notvisible ?? false);

  const setValue = (value: boolean, ext: string) => {
    if (innerRef.current != null && ext != "setValue")
      innerRef.current.checked = value;
    state = value;
    setState(state);
    return true;
  }
  let innerRef = useRef<HTMLInputElement>(null);
  const thatFnc: ICheckboxRef = {
    getValue: () => state,
    setValue: setValue,
    clear: () => setValue(null, null),
    isHide: () => hidden,
    setHide: (val: boolean = !hidden) => setHidden(val),
    getProps: () => props as any,
    isDisable: () => disabled,
    setDisable: (val) => setDisabled(val),
    controllerClass: ControllerClassType.Input,
    type: ControllerType.Checkbox,
    isValid: () => {
      let valid = Validator.ValidCheck(props.onValid, thatFnc, setValid, setValidText);
      return valid;
    }
  }

  props.controller?.register(thatFnc)


  useImperativeHandle(ref, () => (thatFnc));
  const propNew :any = _.omit(props, ["setHiddenLabel", "spacer", "onValid", "defaultValue", "defaultChecked"]);
  return <>
    <CheckboxBASE
      {...propNew}
       invalid={valid == true ? undefined : true}
      defaultChecked={state}
      hidden={hidden}
      innerRef={innerRef}
      style={{display:"flex",minWidth:"30px", height:"30px"}}
      bsSize={propNew.bsSize ?? "sm"}
      type={"switch"}
      onChange={(e) => {
        thatFnc.setValue(e.target.checked, "setValue");
        props.onChange?.(e);
        try {
          thatFnc.isValid?.();
        } catch (error) {

        } 
      }}
      />
    <FormFeedback valid={valid == true ? undefined : false}>{validText}</FormFeedback>
  </>;
})))