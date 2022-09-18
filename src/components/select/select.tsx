
import _ from "lodash";
import React, { ForwardRefRenderFunction, useEffect, useId, useImperativeHandle, useRef, useState } from "react";
import { FormFeedback, FormGroup, Label } from "reactstrap"
import ReactSelect from "react-select"
import { PublicBaseSelectProps } from "react-select/base/dist/react-select.cjs"
import { ActionMeta, OptionsOrGroups, GroupBase } from "react-select/dist/declarations/src/index"
import classNames from "classnames"
import { iLayoutTypeProps } from "../../hocs/withLayout";
import { iLabel, WithLabel } from "../../hocs/withLabel";
import { BaseControllerValueRef, BaseProps, ControllerClassType, ControllerType, ValidResponse } from "../../utility/baseRef";
import { Validator } from "../../utility/validator";
import { WithController } from "../../hocs/withController";
import { Input } from "reactstrap";
export interface Options {
  value: any
  label: string
  data?: Options[] | any
}

export type OptionsData = OptionsOrGroups<Options, GroupBase<Options>>

export interface SelectProps extends iLabel, iLayoutTypeProps, BaseProps<Options, ISelectRef> {
  id: string
  defaultValue?: Options
  disabled?: boolean
  isClearable?: boolean
  isSearchable?: boolean
  isMulti?: boolean
  options?: OptionsData
  onChange?: (newValue: Options, actionMeta: ActionMeta<Options>) => void
  onBlur?: React.FocusEventHandler<HTMLInputElement>
  feedBackBorder?: "right" | "both" | "left"
  noBorder?: boolean
  returntype?: "object" | "value" | "data"
}
export interface SelectAndRadioProps extends SelectProps {
  radiogroup?: string
  isradio?: true
  position?: "vertical" | "horizontal"
}


export interface ISelectRef extends BaseControllerValueRef<Options, SelectProps> {

  setValid?: (val: boolean) => void
}

export const Select = WithController<SelectProps, ISelectRef>(WithLabel<SelectProps, ISelectRef>(React.forwardRef<ISelectRef, SelectProps>((props: SelectAndRadioProps, ref: React.ForwardedRef<ISelectRef>) => {
  let [stateValue, setStated] = useState<Options>(props.defaultValue);
  let [hidden, setHidden] = useState(props.hidden ?? false);
  let [validText, setValidText] = useState<string>("");
  let [valid, setValided] = useState<boolean>(true);
  let [validForce, setValidForce] = useState<boolean>(false);
  let [disabled, setDisabled] = useState(props.disabled ?? false);
  // let [notvisible, setNotvisible] = useState(props.notvisible ?? false);

  let [letRadio] = useState<Record<any, any>>(Object.create({}));
  const isRadio = () => props.isradio == true && (props.options==null ||  props.options?.length < 6);
  const setValue = (value: Options, key: string) => {
    try {
      if (isRadio()) {
        if (letRadio[value.value] != null) {
          letRadio[value.value].current.checked = true;
        }

      } else { 
        if (key !== "setData") {
          if(props.returntype=="value")
          {
           let x:any[]=  props.options.filter((t : any)=>t.value==value)
           if(x.length>0)
           {
            value=x[0];
           }
          }
          if (value == null) {
            innerRef.current.clearValue();
          } else {
            innerRef.current.setValue(value);
          }
        }
      }
      stateValue = value;
      setStated(stateValue);
    } catch (error) {

    }
    return true;
  }
  let innerRef = useRef<any>(null);
  const thatFnc: ISelectRef = {
    getValue: () => {
      if (props.returntype == "value" && stateValue != null) { return stateValue.value }
      if (props.returntype == "data" && stateValue != null) { return stateValue.data }
      return stateValue
    },
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
      if (validForce == false) {
        let valid = Validator.ValidCheck(props.onValid, thatFnc, setValided, setValidText);
        return valid;
      } else {
        setValided(valid);
      }
    },
    setValid: (val) => {
      validForce = true;
      valid = val;
      setValided(val);
      setValidForce(true);
      thatFnc.setValue(stateValue);
    },
  }
  props.controller?.register(thatFnc)


  useImperativeHandle(ref, () => (thatFnc));
  const propNew = _.omit(props, ["setHiddenLabel", "spacer", "onValid"]);
  const customStyles = {
    control: (provided: any, state: any) => ({
      ...provided,
      borderColor: valid == false && (props.feedBackBorder !== "right") ? "red" : provided.borderColor,//'#9e9e9e' ,
      borderRightColor: valid == false && props.feedBackBorder == "right" ? "red" : provided.borderColor,
      borderTopColor: valid == false && props.feedBackBorder == "right" ? "red" : provided.borderColor,
      borderBottomColor: valid == false && props.feedBackBorder == "right" ? "red" : provided.borderColor,
      borderTopLeftRadius: (props.feedBackBorder == "right" || props.feedBackBorder == "both") ? 0 : provided.borderTopLeftRadius,
      borderBottomLeftRadius: (props.feedBackBorder == "right" || props.feedBackBorder == "both") ? 0 : provided.borderBottomLeftRadius,
      borderTopRightRadius: (props.feedBackBorder == "left" || props.feedBackBorder == "both") ? 0 : provided.borderTopLeftRadius,
      borderBottomRightRadius: (props.feedBackBorder == "left" || props.feedBackBorder == "both") ? 0 : provided.borderBottomLeftRadius,
      minHeight: '30px',
      height: '31px',
      boxShadow: state.isFocused ? null : null,
      borderWidth: (props.noBorder == true) ? 0 : provided.borderWidth

    }),

    valueContainer: (provided: any, state: any) => ({
      ...provided,
      height: '30px', 
      padding: '0 6px'
    }),

    input: (provided: any, state: any) => ({
      ...provided,
      margin: '0px',
      borderWidth: (props.noBorder == true) ? 0 : provided.borderWidth
    }),
    indicatorSeparator: (state: any) => ({
      display: 'none',
    }),
    indicatorsContainer: (provided: any, state: any) => ({
      ...provided,
      height: '30px',
    }),
    menu:(base:any)=> ({...base,zIndex:4})
  };
  try { 
      useEffect(() => {
        thatFnc.setValue(stateValue);
        thatFnc.isValid?.();
      }, [stateValue])
  } catch (error) {

  }

  if (isRadio()) {

    let groupName = props.id + "" + (props.controller?.getProps().name);
    let style: any = null;
    let div: any = { paddingLeft: 40, flex: 1 };
    if ((propNew.position ?? "vertical") == "horizontal" && props.options?.length < 3) {
      style = { display: "flex", overflow: "auto", whiteSpace: "nowrap" };
      div = { paddingLeft: 40, flex: 1 };
    }
    const propsRadio: any = _.omit({ ...propNew }, ['options', 'radiogroup', 'isradio', 'defaultValue', 'type', 'Label', 'onChange', 'isClearable', 'isSearchable', 'isMulti', 'onBlur', 'disabled', 'controller', 'feedBackBorder'])
    return <>
      <FormGroup check={true} disabled={disabled} style={{ ...style }}>
        {(props.options??[] as any[]).map((row, index) => {
          letRadio[row.value] = useRef(null);
          return (<div key={props.id + "_" + index.toString()} style={div}>
            <Label check for={props.id + "_" + index.toString()}>
              <Input type="radio" {...propsRadio} id={props.id + "_" + index.toString()} innerRef={letRadio[row.value]} name={groupName} title={row.label} onChange={(e) => {
                thatFnc.setValue(row, "setData"); props.onChange?.(row, { action: "select-option", option: row });
                try {
                  thatFnc.isValid?.();
                } catch (error) {
                }
              }
              } />{row.label}</Label></div>)
        })}
      </FormGroup>
      <FormFeedback style={{ display: (valid == true ? undefined : "block") }} itemID={props.id} valid={valid == true ? undefined : false}>{validText}</FormFeedback>
    </>
  } else {
    return <>
      <ReactSelect {...propNew}
        className={"react-select"}
        id={props.id}
        inputId={props.id}
        instanceId={props.id}
        key={props.id}
        classNamePrefix={props.id}
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
  }
})))