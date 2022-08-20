import React, { ReactNode, useEffect, useImperativeHandle, useMemo, useRef, useState } from "react";
import { BaseControllerValueRef, ControllerClassType, ControllerType, ScreenControllerType } from "../utility/baseRef";
import { iLayout, View } from "../hocs/withLayout";
import { Alert } from "reactstrap";
import { ScreenControllerAction, ScreenRef } from "../screen";
import { WithScreenController } from "../hocs/withController";
export interface FormRef extends ScreenControllerAction<iFormProps> {
  
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
}
export const FormView = WithScreenController<iFormProps, FormRef>(React.forwardRef<FormRef, iFormProps>((props: iFormProps, ref: React.ForwardedRef<FormRef>) => {
  let [refs] = useState<Record<string, ObjectRefs>>(Object.create({}));
  const [open, SetOpen] = useState(false);
  let [alertText, SetAlertText] = useState<string[]>([]);
  const getBaseController = (name?: string): BaseControllerValueRef<any, any> => {
    Object.keys(refs).map(t => {
      if (t == (name ?? t)) {
        return refs[t].event as BaseControllerValueRef<any, any>;
      }
    })
    return null;
  }
  const getValues = (): any => {
    let Data: any = {};
    Object.keys(refs).map(t => {
      if (refs[t].controllerClass == ControllerClassType.Input) {
        Data[t] = refs[t].event.getValue();
      }
    })
    return Data;
  }
  let [FomRef] = useState<FormRef>({
    register: (props) => {
      let name = props.getProps().id
      refs[name] = { controllerClass: props.controllerClass, event: props, objectName: name, type: props.type };
    },
    type: ScreenControllerType.Form,
    getProps: () => props,
    getController: (name?) => getBaseController(name),
    getBaseController: getBaseController,
    getValues: getValues,
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
      let c: any = child as any;
      let propData = { ...c.props };
      if (propData.children != null) {
        propData.children = recursive(propData);
      }
      if (c.type != null && c.type.IsController === true) {
        propData.controller = FomRef
        propData.ref = c.ref == null ? useRef<any>() : c.ref
      }
      c = React.cloneElement(c, propData);
      return c;
    })

    return childs;
  }
  let [childs] = useState(recursive(props));
  useImperativeHandle(ref, () => (FomRef));
  props.screencontroller?.register(FomRef);
  useEffect(() => {
    props.onLoad?.(FomRef);
  })
  return (<div>
    <Alert fade toggle={(e) => { SetOpen(false) }} isOpen={open} color="danger">{alertText.map((t, index) => <p key={"key" + index.toString()}>{t}</p>)}</Alert>
    <View responsive={props.responsive} responsiveSize={props.responsiveSize} spacer={props.spacer}>{childs}</View>
  </div>);
}))
export interface iForm extends FormRef {
  View: (props: iFormProps) => JSX.Element
}
export const useForm = () => {

  let ref = useRef<FormRef>(null);
  const enhanced = WithScreenController(React.forwardRef((props: iFormProps, refs: React.ForwardedRef<FormRef>) => {
    useEffect(() => {
      ref.current = (refs as React.MutableRefObject<FormRef>).current;
    }, [refs])
    return <FormView {...props} ref={refs} />
  }))

  let useForm: iForm = Object.create({});

  useEffect(() => {
    if (ref.current != null) {
      let keys = Object.keys(ref.current)
      for (let index = 0; index < keys.length; index++) {
        (useForm as any)[keys[index]] = (ref.current as any)[keys[index]];
      }
    }

  }, [ref.current]);

  useForm.View = enhanced;
  return useState(useForm)[0] 
}