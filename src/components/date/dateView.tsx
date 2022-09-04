
import _ from "lodash";
import Flatpickr from "react-flatpickr";
import { Turkish } from "flatpickr/dist/l10n/tr"


import { iLayoutTypeProps } from "../../hocs/withLayout";
import { iLabel, WithLabel } from "../../hocs/withLabel";
import { BaseControllerValueRef, BaseProps, ControllerClassType, ControllerType, ValidResponse } from "../../utility/baseRef";
import React, { useEffect, useImperativeHandle, useRef, useState } from "react";
import { Validator } from "../../utility/validator";
import { WithController } from "../../hocs/withController";
import { Button, ButtonGroup, FormFeedback, InputGroup } from "reactstrap";
import { Icon, IconName } from "../icon/icon";
import { BaseDate } from "../../utility/BaseDate";

export enum DateType { "date" = 1, "datetime" = 2, "time" = 3 }
export type DateTypeValue = Date | string | { StartDate: Date |string, StopDate: Date |string }
export interface IDateRef extends BaseControllerValueRef<DateTypeValue, DateProps> { }
export interface DateProps extends iLabel, iLayoutTypeProps, BaseProps<DateTypeValue, IDateRef>, Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type' | 'defaultValue' | 'onChange'|'ref'> {
  type?: DateType | "date" | "datetime" | "time";
  mode?: "time" | "single" | "range"
  defaultValue?: DateTypeValue
  bsSize?: 'lg' | 'sm';
  id: string;
  tag?: React.ElementType;
  innerRef?: React.Ref<HTMLInputElement | HTMLTextAreaElement>; 
  ref?: React.ForwardedRef<IDateRef>
  plaintext?: boolean;
  enableSeconds?: boolean;
  isHideClearButton?: boolean;
  isOpenButtonHide?: boolean;
  onChange?: (selectedDates: Date[], dateStr: string, instance: any,changeObj:string,value : DateTypeValue) => void
}


export const DateView = WithController<DateProps, IDateRef>(WithLabel<DateProps, IDateRef>(React.forwardRef<IDateRef, DateProps>((props: DateProps, ref?: React.ForwardedRef<IDateRef>) => {

  let typeText: any = props.type;
  if (_.isInteger(typeText)) {
    typeText = DateType[typeText].toString();
  }
  let datetime = "d.m.Y H:i";
  let enableTime = true;
  let noCalendar = false;
  let mode = props.mode ?? "single";
  let defaultValue = props.defaultValue;
  switch (typeText) {
    case "time":
      datetime = "H:i";
      noCalendar = true;
      // mode = "time";
      if (props.enableSeconds == true) {
        datetime = "H:i:S";
      }
      break;
    case "datetime":
      datetime = "d.m.Y H:i";
      if (props.enableSeconds == true) {
        datetime = "d.m.Y H:i:S";
      }
      if (defaultValue != null && _.isString(defaultValue))
        defaultValue = new Date(defaultValue as any);
      break;
    case "date":
    default:
      datetime = "d.m.Y";
      enableTime = false;
      break;
  }

  let [state, setState] = useState<DateTypeValue>(defaultValue);
  let [hidden, setHidden] = useState(props.hidden ?? false);
  let [render, setRender] = useState(false);
  let [validText, setValidText] = useState<string>("");
  let [valid, setValid] = useState<boolean>(true);
  let [disabled, setDisabled] = useState(props.disabled ?? false);
  // let [notvisible, setNotvisible] = useState(props.notvisible ?? false);

  const getFlatpickr = (value: DateTypeValue,parentType:string=""): Date | string | number | (Date | string | number)[] => {
    
    if (value == null)
      return null;
    if(typeText=="time" && mode=="range" && parentType!="")
    {
      return (value as any)[parentType]
    }else if (typeText == "time" || _.isDate(value)) {
      return value as any
    } else {
      return [(value as any).StartDate, (value as any).StopDate];
    }

  }
  const setFlatpickr = (dates: Date[], dateStr: string, parrentType: string = "") => {
    switch (typeText) {
      case "time":
        if (mode == "range") {  
          if (state == null)
            state = { StartDate: null, StopDate: null }; 
          let cnt={...state as { StartDate: any, StopDate: any }};
          (cnt as any)[parrentType] = dateStr
          if(!_.isEmpty( cnt.StartDate) && !_.isEmpty(cnt.StopDate))
          {  
           
            if(BaseDate.Method.CompareTimeIsAfter( cnt.StartDate,cnt.StopDate,true))
            {
              if(parrentType=="StartDate")
              {
                innerRef.current.flatpickr.clear();
              }else
              { 
                innerRefRange.current.flatpickr.clear();
              }
              return;
            } 
          } 
          (state as any)[parrentType] = dateStr==""?null:dateStr;

          thatFnc.setValue(state, "SETVIEW");
        } else {
          thatFnc.setValue(dateStr, "SETVIEW");
        }
        break;
      case "datetime":
      case "date":
      default:
        if (dates.length > 0) {
          if (dates.length == 1)
            thatFnc.setValue(dates[0], "SETVIEW");
          if (dates.length == 2)
            thatFnc.setValue({ StartDate: dates[0], StopDate: dates[1] }, "SETVIEW");
        } else
          thatFnc.setValue(null, "SETVIEW");
        break;
    }
  }
  const setValue = (value: DateTypeValue, ext: string) => {
    state = value;
    setState(state);
    if (ext !== "SETVIEW") {
      render = !render;
      setRender(render)
    }
    return true;
  }
  let innerRef = useRef<Flatpickr>(null);
  let innerRefRange = useRef<Flatpickr>(null);
  const thatFnc: IDateRef = {
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
  if (typeText == "time" && mode == "range") {
    return (<>
      <div key={render ? "FlatpickrTRUE" : "FlatpickrFALSE"} style={{ display: "flex", flex: 1 }}>
        <InputGroup size="sm" hidden={hidden}>
          <Flatpickr height={28} readOnly={false} id={props.id + "Flatpickr1"} hidden={hidden} disabled={disabled} placeholder={props.placeholder} className={`form-control form-control-sm ` + (valid == false ? "is-invalid" : "")} ref={innerRef} options={{
            "locale": Turkish,
            enableTime: enableTime,
            clickOpens: (props.isOpenButtonHide ?? false) == true,
            noCalendar: noCalendar,
            dateFormat: datetime,
            enableSeconds: props.enableSeconds ?? false,
            allowInput: true,
            mode: mode,
            defaultDate: getFlatpickr(state,'StartDate'),
            weekNumbers: true,
            onChange: function (selectedDates, dateStr, instance) {
              setFlatpickr(selectedDates, dateStr, 'StartDate')
              props.onChange?.(selectedDates, dateStr, instance, 'StartDate',thatFnc.getValue());
            }
          }} />
          <Flatpickr height={28} readOnly={false} id={props.id + "Flatpickr2"} hidden={hidden} disabled={disabled} placeholder={props.placeholder} className={`form-control form-control-sm ` + (valid == false ? "is-invalid" : "")} ref={innerRefRange} options={{
            "locale": Turkish,
            enableTime: enableTime,
            clickOpens: (props.isOpenButtonHide ?? false) == true,
            noCalendar: noCalendar,
            dateFormat: datetime,
            enableSeconds: props.enableSeconds ?? false,
            allowInput: true,
            mode: mode,
            defaultDate: getFlatpickr(state, 'StopDate'),
            weekNumbers: true,
            onChange: function (selectedDates, dateStr, instance) {
              setFlatpickr(selectedDates, dateStr, 'StopDate')
              props.onChange?.(selectedDates, dateStr, instance, 'StopDate',thatFnc.getValue());
            }
          }} />
          {/* <Button id={props.id + "_btnOpen"} size="sm" disabled={disabled} outline
            onClick={() => { innerRef.current.flatpickr.toggle(); }}
            hidden={props.isOpenButtonHide == true}
            style={{ height: 31, borderTopLeftRadius: 0, borderBottomLeftRadius: 0, paddingTop: 0, paddingBottom: 0, zIndex: "auto" }}>
            <Icon iconName={IconName.Calendar} />
          </Button> */}
          <Button id={props.id + "btnClear"} size="sm" disabled={disabled} hidden={props.isHideClearButton} outline style={{ height: 31, paddingTop: 0, paddingBottom: 0, zIndex: "auto" }} onClick={() => {
            innerRef.current.flatpickr.clear();
            innerRefRange.current.flatpickr.clear();
            setState(null);
            props.onChange?.(null, null, null, null,thatFnc.getValue());
          }}><Icon iconName={"X"} /></Button>

        </InputGroup>
      </div>
      <FormFeedback style={{ display: (valid == true ? undefined : "block") }} itemID={props.id} valid={valid == true ? undefined : false}>{validText}</FormFeedback>
    </>)
  } else
    return (<>
      <div key={render ? "FlatpickrTRUE" : "FlatpickrFALSE"} style={{ display: "flex", flex: 1 }}>
        <InputGroup size="sm" hidden={hidden}>
          <Flatpickr height={28} readOnly={false} id={props.id + "Flatpickr"} hidden={hidden} disabled={disabled} placeholder={props.placeholder} className={`form-control form-control-sm ` + (valid == false ? "is-invalid" : "")} ref={innerRef} options={{
            "locale": Turkish,
            enableTime: enableTime,
            clickOpens: (props.isOpenButtonHide ?? false) == true,
            noCalendar: noCalendar,
            dateFormat: datetime,
            enableSeconds: props.enableSeconds ?? false,
            allowInput: true,
            mode: mode,
            defaultDate: getFlatpickr(state),
            weekNumbers: true,
            onChange: function (selectedDates, dateStr, instance) {
              setFlatpickr(selectedDates, dateStr) 
              props.onChange?.(selectedDates, dateStr, instance,null,thatFnc.getValue());
            }
          }} />
          <Button id={props.id + "_btnOpen"} size="sm" disabled={disabled} outline
            onClick={() => { innerRef.current.flatpickr.toggle(); }}
            hidden={props.isOpenButtonHide == true}
            style={{ height: 31, borderTopLeftRadius: 0, borderBottomLeftRadius: 0, paddingTop: 0, paddingBottom: 0, zIndex: "auto" }}>
            <Icon iconName={IconName.Calendar} />
          </Button>
          <Button id={props.id + "btnClear"} size="sm" disabled={disabled} hidden={props.isHideClearButton} outline style={{ height: 31, paddingTop: 0, paddingBottom: 0, zIndex: "auto" }} onClick={() => {
            innerRef.current.flatpickr.clear(); setState(null);  //props.onChange?.(null, null, null); 
          }}><Icon iconName={"X"} /></Button>

        </InputGroup>
      </div>
      <FormFeedback style={{ display: (valid == true ? undefined : "block") }} itemID={props.id} valid={valid == true ? undefined : false}>{validText}</FormFeedback>
    </>)
})))