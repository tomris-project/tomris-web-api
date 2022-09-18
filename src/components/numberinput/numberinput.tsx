
import _ from "lodash";
import React, { ForwardRefRenderFunction, useEffect, useId, useImperativeHandle, useRef, useState } from "react";
import { FormFeedback, FormGroup, Input as InputBASE, InputGroup, Label } from "reactstrap"
import { iLayoutTypeProps } from "../../hocs/withLayout";
import { iLabel, WithLabel } from "../../hocs/withLabel";
import { BaseControllerValueRef, BaseProps, ControllerClassType, ControllerType, ValidResponse } from "../../utility/baseRef";
import { Validator } from "../../utility/validator";
import { WithController } from "../../hocs/withController";

import NumberFormat, { type NumberFormatProps, type NumberFormatValues, type SourceInfo } from 'react-number-format';
import { ISelectRef, Select } from "../select";

export interface NumberInputType {
  Start?: number,
  Stop?: number,
  value?: number,
  currency?: string
}
export interface InputNumberProps extends iLabel, iLayoutTypeProps, BaseProps<NumberInputType, IInputNumberRef>//,  NumberFormat<number> 
{
  defaultValue?: NumberInputType
  currencyOptions?: string | string[]
  bsSize?: 'lg' | 'sm';
  mode?: "input" | "range"
  type?: "currency" | "number";
  className?: string
  disabled?: boolean
  id: string;
  //ref?: React.ForwardedRef<IInputNumberRef>;    
  onChange?: (values: NumberFormatValues, sourceInfo: SourceInfo, getVal: NumberInputType) => void
  onBlur?: React.FocusEventHandler<HTMLInputElement>
  onKeyUp?: React.KeyboardEventHandler<HTMLInputElement>
}

export interface IInputNumberRef extends BaseControllerValueRef<NumberInputType, InputNumberProps> {
  setCurrency: (props: string) => void
  setCurrencyOptions: (props: string | string[]) => void
  getCurrency: () => string
}

export const InputNumber = WithController<InputNumberProps, IInputNumberRef>(WithLabel<InputNumberProps, IInputNumberRef>(React.forwardRef<IInputNumberRef, InputNumberProps>((props: InputNumberProps, ref: React.ForwardedRef<IInputNumberRef>): JSX.Element => {
  let [state, setState] = useState<NumberInputType>(props.defaultValue ?? { value: props.defaultValue?.value, Start: props.defaultValue?.Start, Stop: props.defaultValue?.Stop, currency: props.defaultValue?.currency });
  let [hidden, setHidden] = useState(props.hidden ?? false);
  let [validText, setValidText] = useState<string>("");
  let [valid, setValid] = useState<boolean>(true);
  //let [currency, setCurrency] = useState(props.currency);
  let [currencyOptions, setCurrencyOptions] = useState<string[]>(props.currencyOptions == null ? (state.currency != null ? [state.currency] : []) : _.isArray(props.currencyOptions) ? props.currencyOptions : [props.currencyOptions]);
  let [disabled, setDisabled] = useState(props.disabled ?? false);
  const selectRef = useRef<ISelectRef>(null);

  let innerRef = useRef<NumberFormat<unknown>>(null);
  let innerRangeRef = useRef<NumberFormat<unknown>>(null);
  let getInputRef = useRef<any>(null);
  let getInputRefRange = useRef<any>(null);
  const getStateSetData = (value: number) => {
    let formatVal = (innerRef.current as any).formatAsNumber(value?.toString())
    return { value: formatVal, numAsString: value?.toString(), mounted: true }
  }
  const setValue = (value: NumberInputType, ext: string, type: string = "") => {
    if (ext == "setValue") {
      if (props.mode == "range") {
        (state as any)[type] = value.value;
        state.currency = value.currency;
        if (state.Start != null && state.Stop != null && state.Start >= state.Stop) {
          (state as any)[type] = null;
          if (type == "Start") {
            innerRef.current.setState(getStateSetData(null));
          }
          if (type == "Stop") {
            innerRangeRef.current.setState(getStateSetData(null));
          }
        }
      } else {
        state = value;
      }
      setState(state);

    } else if (props.mode == "range") {
      state = value;
      setState(state);
      innerRef.current.setState(getStateSetData(value.Start));
      innerRangeRef.current.setState(getStateSetData(value.Stop));
    } else {
      if (_.isNumber(value)) {
        value = { value: value } as any;
      }

      state = value;
      setState(state);
      innerRef.current.setState(getStateSetData(value.value));
    }

    state.currency = value.currency;
    if (currencyOptions.map(t => t == state.currency).length == 0) {
      currencyOptions.push(state.currency);
    }

    if (state.currency != null)
      selectRef.current.setValue({ label: state.currency, value: state.currency });

    return true;
  }
  const thatFnc: IInputNumberRef = {
    getValue: () => { 
      if(props.type=="number" && props.mode=="input")
      {
        return state.value as any
      }
      return state; 
    },
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
      if (selectRef.current != null) {
        selectRef.current.setValid?.(valid.IsValid)
      }
      return valid;
    },
    getCurrency: () => state.currency,
    setCurrency: (x) => {
      state.currency = x; //render();
      setValue(state, "");
    },
    setCurrencyOptions: (x) => {
      setCurrencyOptions(x == null ? null : _.isArray(x) ? x : [x])
      if (_.isArray(x)) {
        if (x.filter(t => t == state.currency).length == 0) {
          state.currency = x[0];
        }
      } else {
        if (x != state.currency) {
          state.currency = x;
        }
      }
    }
  }
  props.controller?.register(thatFnc)
  useImperativeHandle(ref, () => (thatFnc));
  const propNew: any = _.omit(props, ["defaultValue", "spacer", "type", "onValid", "onChange", "curreny", 'currencyOptions', 'isLabelHidden', 'bsSize', 'mode']);
  useEffect(() => {
    thatFnc.isValid?.();
  })
  return <>
    <InputGroup style={{ display: "flex", borderColor: valid != true ? "red" : undefined }} key={props.id}>
      <NumberFormat
        {...propNew} defaultValue={props.mode == "range" ? state.Start : state.value}
        id={props.id} //ref={innerRef}  
        getInputRef={getInputRef}
        ref={innerRef}
        className={"form-control " + ((props.bsSize ?? "sm") == "sm" ? " form-control-sm " : " ") + (props.className ?? "")}
        style={{ textAlign: "right", borderColor: valid != true ? "red" : undefined }}
        decimalSeparator={','}
        thousandSeparator={'.'}
        onValueChange={(e, s) => {
          try {
            setValue({ value: e.floatValue, currency: state.currency }, "setValue", props.mode == "range" ? "Start" : "value");
          } catch (e) { }
          props.onChange?.(e, s, thatFnc.getValue());
        }}
        onBlur={(e: any) => {
          try {
            thatFnc.isValid?.();
          } catch (error) {

          }
          props.onBlur?.(e);
        }}
      />
      {props.mode == "range" && (
        <NumberFormat
          {...propNew} defaultValue={state.Stop}
          id={props.id + "range"} //ref={innerRef}  
          getInputRef={getInputRefRange}
          ref={innerRangeRef}
          className={"form-control " + ((props.bsSize ?? "sm") == "sm" ? " form-control-sm " : " ") + (props.className ?? "")}
          style={{ textAlign: "right", borderColor: valid != true ? "red" : undefined }}
          decimalSeparator={','}
          thousandSeparator={'.'}
          onValueChange={(e, s) => {
            try {
              setValue({ value: e.floatValue, currency: state.currency }, "setValue", "Stop");
            } catch (e) { }
            props.onChange?.(e, s, thatFnc.getValue());
          }}
          onBlur={(e: any) => {
            try {
              thatFnc.isValid?.();
            } catch (error) {

            }
            props.onBlur?.(e);
          }}
        />
      )}
      {
        state.currency != null && state.currency.length > 0 && (currencyOptions.length == 1) && (
          <Label key={props.id + state.currency} disabled size="sm" className="form-control form-control-sm"
            style={{
              width: "max-content", float: "right", textAlign: "right", flex: "unset",
              borderRightColor: valid == false ? "red" : undefined,
              borderTopColor: valid == false ? "red" : undefined,
              borderBottomColor: valid == false ? "red" : undefined,
            }}>{state.currency}</Label>
        )
      }
      {
        (currencyOptions.length > 1) && (
          <Select ref={selectRef} feedBackBorder={"right"} id={props.id + "curreny"} options={currencyOptions.map(t => { return { label: t, value: t } })} defaultValue={{ label: state.currency ?? "", value: state.currency ?? "" }}
            onChange={(e) => {
              state.currency = e.value
              if (e.value != null) thatFnc.setValue(state, "setValue");
            }
            } />)
      }
    </InputGroup>
    <FormFeedback style={{ display: (valid == true ? undefined : "block") }}>{validText}</FormFeedback>
  </>;
}))) 