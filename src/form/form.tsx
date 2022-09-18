import React, { ReactNode, useEffect, useImperativeHandle, useMemo, useRef, useState } from "react";
import { BaseControllerValueRef, ControllerClassType, ControllerType, ScreenControllerType } from "../utility/baseRef";
import { iLayout, View } from "../hocs/withLayout";
import { Alert, Card, CardBody, Col } from "reactstrap";
import { ScreenControllerAction, ScreenRef } from "../screen";
import { WithScreenController } from "../hocs/withController";
import { IInputNumberRef } from "../component";
export interface FormRef extends ScreenControllerAction<iFormProps> {

  getControllers: () => Record<string, ObjectRefs>;
  setValue: (Data: any) => void

  getHiddenData: () => any
  setHiddenData: (data: any) => void
}

interface ObjectRefs {
  objectName: string,
  controllerClass: ControllerClassType
  type: ControllerType
  event: BaseControllerValueRef<any, any> | null
}
export interface iFormProps extends iLayout {
  name: string
  children: ReactNode | React.ReactNode[] | JSX.Element | JSX.Element[]
  onLoad?: (form: FormRef) => void
  alert?: boolean
  screencontroller?: ScreenRef
  ref?: React.ForwardedRef<FormRef>
}
interface iFormPropsInside extends iFormProps {
  loadFormEvent: (ref: FormRef) => void
}
export const FormView = WithScreenController<iFormProps, FormRef>(React.forwardRef<FormRef, iFormProps>((propsdata: iFormProps, ref: React.ForwardedRef<FormRef>) => {
  const props = propsdata as iFormPropsInside;
  let [refs] = useState<Record<string, ObjectRefs>>(Object.create({}));
  let [hiddenData, setHiddenData] = useState<any>(Object.create({}));
  const [open, SetOpen] = useState(false);
  let [alertText, SetAlertText] = useState<string[]>([]);
  const getBaseController = (name?: string): BaseControllerValueRef<any, any> => {

    let keys = Object.keys(refs);
    for (let index = 0; index < keys.length; index++) {
      let t = keys[index];
      if (t == (name ?? t)) {
        return refs[t].event as BaseControllerValueRef<any, any>;
      }
    }
    return null;
  }
  const getValue = (): any => {
    let Data: any = {};
    let keys = Object.keys(refs);
    for (let index = 0; index < keys.length; index++) {
      let t = keys[index];
      if (refs[t].controllerClass == ControllerClassType.Input) {
        Data[t] = refs[t].event.getValue();
      }
    }
    return Data;
  }
  const setValue = (Data: any) => {
    //  let Data: any = {};
    let keys = Object.keys(Data);
    for (let index = 0; index < keys.length; index++) {
      try {
        let t = keys[index];
        if (refs[t] != null && refs[t].controllerClass == ControllerClassType.Input) {

          refs[t].event.setValue(Data[t]);
        }
      } catch (error) {

      }
    }
  }
  let [FomRef] = useState<FormRef>({
    register: (props,name:string=null) => {
      name = props.getProps().id??name
      refs[name] = { controllerClass: props.controllerClass, event: props, objectName: name, type: props.type };
    },
    getHiddenData: () => hiddenData,
    setHiddenData: (data) => { hiddenData = data; setHiddenData(data) },
    type: ScreenControllerType.Form,
    isController: () => true,
    getControllers: () => refs as any,
    getProps: () => props,
    getController: (name?) => getBaseController(name),
    getBaseController: getBaseController,
    getNumberInputController: (name?) => getBaseController(name) as IInputNumberRef,
    getValue: getValue,
    setValue: setValue,
    isValid: () => {
      let status: boolean = true;
      alertText = [];
      Object.keys(refs).map(key => {
        if (refs[key].controllerClass == ControllerClassType.Input) {
          let t = refs[key];
          let valid = t.event.isValid?.();
          if (valid != null && valid.IsValid == false) {
            status = false;
            if ((valid.ValidText ?? "").length > 0)
              alertText.push(valid.ValidText);
          }
        }
      })
      SetAlertText(alertText);
      if (props.alert == true) {
        SetOpen(!status);
      }
      return status;
    },
    getValidText: () => alertText,
    clear: () => {
      Object.keys(refs).map(key => {
        try {
          refs[key]?.event?.clear?.();
        } catch (error) {

        }
      })
    },
  });
  const recursive = (props: any) => {
    let childs = React.Children.map(props.children, (child, index) => {
      if (!React.isValidElement(child)) {
        return child
      }
      try {
        let c: any = child as any;
        let propData = { ...c.props };
        if (c.type != null && c.type.IsController === true) {
          propData.controller = FomRef
        }
        if (propData.children != null) {
          propData.children = recursive(propData);
        }
        if (c.type != null && c.type.IsController === true) {
          propData.ref = c.ref == null ? useRef<any>() : c.ref
        }

        c = React.cloneElement(c, propData);
        return c
      } catch (error) {
        console.log(error)
        return child;
      }

    })

    return childs;
  }
  // let [childs] = useState(recursive(props));
  let childs = recursive(props);
  useImperativeHandle(ref, () => (FomRef));
  props.loadFormEvent?.(FomRef)
  props.screencontroller?.register(FomRef);
  useEffect(() => {
    props.onLoad?.(FomRef);
  })
  return (
    <Card>
      <CardBody>
        <Col>
          <Alert fade toggle={(e) => { SetOpen(false) }} isOpen={open} color="danger">{alertText.map((t, index) => <p key={"key" + index.toString()}>{t}</p>)}</Alert>
          <View responsive={props.responsive} responsiveSize={props.responsiveSize} spacer={props.spacer}>{childs}</View>
        </Col>
      </CardBody>
    </Card>);
}))
export interface iForm extends FormRef {
  View: (props: iFormProps, ref?: React.ForwardedRef<FormRef>) => JSX.Element
}
export const useForm = () => {

  let useForm: iForm = Object.create({});


  const loadFormEvent = (ref: FormRef) => {
    if (ref != null) {
      let keys = Object.keys(ref)
      for (let index = 0; index < keys.length; index++) {
        (useForm as any)[keys[index]] = (ref as any)[keys[index]];
      }
    }
  }

  const enhanced = WithScreenController(React.forwardRef((props: iFormProps, ref: React.ForwardedRef<FormRef>) => {
    const propData = { ...props, loadFormEvent: loadFormEvent };
    return <FormView {...propData} ref={ref} />
  }))
  useForm.View = enhanced;
  return useState(useForm)[0]
}