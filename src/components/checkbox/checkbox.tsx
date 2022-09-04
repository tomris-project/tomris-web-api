
import _ from "lodash";
import React, { useEffect, useImperativeHandle, useRef, useState } from "react";
import { FormFeedback, FormGroup, Input as CheckboxBASE } from "reactstrap"
import { iLayoutTypeProps } from "../../hocs/withLayout";
import { iLabel, WithLabel } from "../../hocs/withLabel";
import { BaseControllerValueRef, BaseProps, ControllerClassType, ControllerType, ValidResponse } from "../../utility/baseRef";
import { Validator } from "../../utility/validator";
import { WithController } from "../../hocs/withController";

export interface CheckboxProps extends iLabel, iLayoutTypeProps, BaseProps<boolean | null, ICheckboxRef>, Omit<React.InputHTMLAttributes<HTMLInputElement>, 'defaultValue' | 'type' | 'defaultChecked' | 'onChange'> {

  bsSize?: 'lg' | 'sm';
  id: string;
  defaultValue?: boolean | null;
  indeterminate?: boolean
  onChange?: (state: boolean | null) => void

}

export interface ICheckboxRef extends BaseControllerValueRef<boolean | null, CheckboxProps> {

}

export const Checkbox = WithController<CheckboxProps, ICheckboxRef>(WithLabel<CheckboxProps, ICheckboxRef>(React.forwardRef<ICheckboxRef, CheckboxProps>((props: CheckboxProps, ref: React.ForwardedRef<ICheckboxRef>) => {
  let [state, setState] = useState<boolean | null>(props.defaultValue as boolean | null);

  const getStartNum = () => {
    if (state == null && props.indeterminate) {
      return 2;
    } else {
      return state == true ? 1 : 0;
    }
  }
  let [numstate, Setnumstate] = useState<number>(getStartNum());
  let [hidden, setHidden] = useState(props.hidden ?? false);
  let [validText, setValidText] = useState<string>("");
  let [valid, setValid] = useState<boolean>(true);
  let [disabled, setDisabled] = useState(props.disabled ?? false);

  let max: number = 1;
  if (props.indeterminate == true) {
    max = 2;
  } 
  const setValue = (value: boolean | null, ext: string) => {  
    state = value;
    numstate = getStartNum();
    setState(state);
    Setnumstate(numstate);
    ViewStateSet()
    return true; 
  }

  const getValue = (): boolean | null => {
    if (numstate == 0)
      return false;
    if (numstate == 1)
      return true;
    if (numstate == 2)
      return null;
  }
  let innerRef = useRef<HTMLInputElement>(null);
  const thatFnc: ICheckboxRef = {
    getValue: getValue,
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

  const ClickState = () => {
    if ((numstate) >= max) {
      numstate = -1;
    }
    numstate += 1;
    ViewStateSet()
  }
  const ViewStateSet = () => {
    innerRef.current.checked = numstate == 1;
    if (numstate == 2) {
      innerRef.current.indeterminate = true;
    }
    Setnumstate(numstate)
  }

  props.controller?.register(thatFnc)

  useEffect(() => {
    ViewStateSet()
  })

  useImperativeHandle(ref, () => (thatFnc));
  const propNew: any = _.omit(props, ["setHiddenLabel", "spacer", "onValid", "defaultValue", "defaultChecked", "isLabelHidden", "indeterminate","responsiveSize"]);
  return <>
    <CheckboxBASE
      {...propNew}
      invalid={valid == true ? undefined : true}
      height={20}
      hidden={hidden}
      innerRef={innerRef}
      disabled={disabled}
      style={{ display: "flex", minWidth: "30px", height: 24, maxHeight: 24, padding: 0, margin: 0, ...props.style }}
      bsSize={propNew.bsSize ?? "sm"}
      type={"checkbox"}
      className=""
      onClick={(e) => {
        ClickState();
        props.onChange?.(getValue());
        try {
          thatFnc.isValid?.();
        } catch (error) {

        }
      }}
      onChange={(e) => {
        // console.log("checkbox",e.target.checked)
        // thatFnc.setValue(e.target.checked, "setValue");

      }}
    />
    <FormFeedback valid={valid == true ? undefined : false}>{validText}</FormFeedback>
  </>;
})))