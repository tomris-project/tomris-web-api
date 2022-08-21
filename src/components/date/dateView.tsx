
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

export enum DateType { "date" = 1, "datetime" = 2, "time" = 3 }
export type DateTypeValue = Date | string | { StartDate: Date, StopDate: Date }
export interface IDateRef extends BaseControllerValueRef<DateTypeValue, DateProps> { }
export interface DateProps extends iLabel, iLayoutTypeProps, BaseProps<DateTypeValue, IDateRef>, Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type' | 'defaultValue'> {
  type?: DateType | "date" | "datetime" | "time";
  mode?: "time" | "single" | "range"
  defaultValue?: DateTypeValue
  bsSize?: 'lg' | 'sm';
  id: string;
  tag?: React.ElementType;
  innerRef?: React.Ref<HTMLInputElement | HTMLTextAreaElement>;
  plaintext?: boolean;
  enableSeconds?: boolean;
  isClearButton?: boolean;
  isOpenButtonHide?: boolean;
}


export const DateView = WithController<DateProps, IDateRef>(WithLabel<DateProps, IDateRef>(React.forwardRef<IDateRef, DateProps>((props: DateProps, ref: React.ForwardedRef<IDateRef>) => {
  let [state, setState] = useState<DateTypeValue>(props.defaultValue);
  let typeText: any = props.type;
  if (_.isInteger(typeText)) {
    typeText = DateType[typeText].toString();
  }
  let datetime = "d.m.Y H:i";
  let enableTime = true;
  let noCalendar = false;
  let mode = props.mode ?? "single";
  switch (typeText) {
    case "time":
      datetime = "H:i";
      noCalendar = true;
      mode = "time";
      if (props.enableSeconds == true) {
        datetime = "H:i:S";
      }
      break;
    case "datetime":
      datetime = "d.m.Y H:i";
      if (props.enableSeconds == true) {
        datetime = "d.m.Y H:i:S";
      }
      break;
    case "date":
    default:
      datetime = "d.m.Y";
      enableTime = false;
      break;
  }


  let [hidden, setHidden] = useState(props.hidden ?? false);
  let [render, setRender] = useState(false);
  let [validText, setValidText] = useState<string>("");
  let [valid, setValid] = useState<boolean>(true);
  let [disabled, setDisabled] = useState(props.disabled ?? false);
  // let [notvisible, setNotvisible] = useState(props.notvisible ?? false);

  const getFlatpickr = (value: DateTypeValue): Date | string | number | (Date | string | number)[] => {
    if (value == null)
      return null;
    if (typeText == "time" || _.isDate(value)) {
      return value as any
    } else {
      return [(value as any).StartDate, (value as any).StopDate];
    }

  }
  const setFlatpickr = (dates: Date[], dateStr: string) => {
    switch (typeText) {
      case "time":
        thatFnc.setValue(dateStr, "SETVIEW");
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
  return (<>
    <div key={render ? "FlatpickrTRUE" : "FlatpickrFALSE"} style={{ display: "flex" }}>
      <InputGroup size="sm" hidden={hidden}>
        <Flatpickr height={28} readOnly={false} id={props.id+"Flatpickr"} hidden={hidden} disabled={disabled} placeholder={props.placeholder} className={`form-control form-control-sm ` + (valid == false ? "is-invalid" : "")} ref={innerRef} options={{
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
          }
        }} />
        <Button id={props.id + "_btnOpen"} size="sm" disabled={disabled} outline
          onClick={() => { innerRef.current.flatpickr.toggle(); }}
          hidden={props.isOpenButtonHide == true}
          style={{ height: 31, borderTopLeftRadius: 0, borderBottomLeftRadius: 0, paddingTop: 0, paddingBottom: 0 }}>
          <Icon iconName={IconName.Calendar} />
        </Button>
        <Button id={props.id + "btnClear"} size="sm" disabled={disabled} hidden={props.isClearButton} outline style={{ height: 31, paddingTop: 0, paddingBottom: 0 }} onClick={() => { innerRef.current.flatpickr.clear(); setState(null); }}><Icon iconName={"X"} /></Button>
      </InputGroup>
    </div>
    <FormFeedback style={{ display: (valid == true ? undefined : "block") }} itemID={props.id} valid={valid == true ? undefined : false}>{validText}</FormFeedback>
  </>)
})))