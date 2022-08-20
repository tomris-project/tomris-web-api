
import _ from "lodash";
import React, { ForwardRefRenderFunction, useEffect, useId, useImperativeHandle, useRef, useState } from "react";
import { FormFeedback, FormGroup } from "reactstrap"
import ReactSelect from "react-select"
import { PublicBaseSelectProps } from "react-select/base/dist/react-select.cjs"
import { ActionMeta, OptionsOrGroups, GroupBase } from "react-select/dist/declarations/src/index"
import classNames from "classnames"
import { iLayoutTypeProps } from "../../hocs/withLayout";
import { iLabel, WithLabel } from "../../hocs/withLabel";
import { BaseControllerValueRef, BaseProps, ControllerClassType, ControllerType, ValidResponse } from "../../utility/baseRef";
import { Validator } from "../../utility/validator";
import { WithController } from "../../hocs/withController";


export interface Options {
  value: any
  label: string
  data?: Options[] | any
}

export interface SelectProps extends iLabel, iLayoutTypeProps, BaseProps<Options, ISelectRef> {
  defaultValue?: Options
  disabled?: boolean
  isClearable?: boolean
  isSearchable?: boolean
  isMulti?: boolean
  options?: OptionsOrGroups<Options, GroupBase<Options>>
  onChange?: (newValue: Options, actionMeta: ActionMeta<Options>) => void
  onBlur?: React.FocusEventHandler<HTMLInputElement>
}

export interface ISelectRef extends BaseControllerValueRef<Options, SelectProps> {

}

export const Select = WithController<SelectProps, ISelectRef>(WithLabel<SelectProps, ISelectRef>(React.forwardRef<ISelectRef, SelectProps>((props: SelectProps, ref: React.ForwardedRef<ISelectRef>) => {
  let [stateValue, setStated] = useState<Options>(props.defaultValue);
  let [hidden, setHidden] = useState(props.hidden ?? false);
  let [validText, setValidText] = useState<string>("");
  let [valid, setValid] = useState<boolean>(true);
  let [disabled, setDisabled] = useState(props.disabled ?? false);
  // let [notvisible, setNotvisible] = useState(props.notvisible ?? false);

  const setValue = (value: Options, key: string) => {
    if (key !== "setData") {
      if (value == null) {
        innerRef.current.clearValue();
      } else {
        innerRef.current.setValue(value);
      }
    }
    stateValue = value;
    setStated(stateValue);
    return true;
  }
  let innerRef = useRef<any>(null);
  const thatFnc: ISelectRef = {
    getValue: () => stateValue,
    setValue: setValue,
    clear: () => setValue(null, null),
    isHide: () => hidden,
    setHide: (val: boolean = !hidden) => setHidden(val),
    getProps: () => props as any,
    isDisable: () => disabled,
    setDisable: (val) => setDisabled(val),
    controllerClass: ControllerClassType.Input,
    type: ControllerType.Select,
    isValid: () => {
      let valid = Validator.ValidCheck(props.onValid, thatFnc, setValid, setValidText);
      return valid;
    }
  }
  props.controller?.register(thatFnc)


  useImperativeHandle(ref, () => (thatFnc));
  const propNew = _.omit(props, ["setHiddenLabel", "spacer", "onValid"]);
  const customStyles = {
    control: (provided: any, state: any) => ({
      ...provided,
      // background: '#fff',
      borderColor: valid == true ? provided.borderColor : "red",//'#9e9e9e' ,
      minHeight: '30px',
      height: '31px',
      boxShadow: state.isFocused ? null : null,
    }),

    valueContainer: (provided: any, state: any) => ({
      ...provided,
      height: '30px',
      padding: '0 6px'
    }),

    input: (provided: any, state: any) => ({
      ...provided,
      margin: '0px',
    }),
    indicatorSeparator: (state: any) => ({
      display: 'none',
    }),
    indicatorsContainer: (provided: any, state: any) => ({
      ...provided,
      height: '30px',
    }),
  };
  if (stateValue != null)
    useEffect(() => {
      thatFnc.setValue(stateValue);
    })
  return <>
    <ReactSelect {...propNew}
      className={classNames("react-select")}
      id={props.id}
      inputId={props.id}
      instanceId={props.id}

      placeholder={props.label}
      styles={customStyles}
      name={props.id}
      options={props.options}
      ref={innerRef}
      onChange={(e: any, b) => {
        thatFnc.setValue(e, "setData");
        props.onChange?.(e, b);
        try {
          thatFnc.isValid?.();
        } catch (error) {
        }
      }} />
    <FormFeedback style={{ display: (valid == true ? undefined : "block") }} itemID={props.id} valid={valid == true ? undefined : false}>{validText}</FormFeedback>
  </>;
})))