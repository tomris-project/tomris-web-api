import React, { ReactNode, useEffect, useImperativeHandle, useMemo, useRef, useState } from "react";
import { BaseControllerValueRef, ControllerClassType, ControllerType, ScreenControllerType } from "../utility/baseRef";
import { iLayout, View } from "../hocs/withLayout";
import { Alert } from "reactstrap"; 
export interface ScreenRef {
  register: (props: ScreenControllerAction<any>) => void
  getController: <T, P>(name?: string) => BaseControllerValueRef<T, P>
  getBaseController: (name?: string) => BaseControllerValueRef<any, any>
  getValues: () => any
  isValid: () => boolean
  clear: () => void
}


export interface ScreenControllerAction<T> {
  register: (props: BaseControllerValueRef<any, any>) => void
  getController: <T, P>(name?: string) => BaseControllerValueRef<T, P>
  getBaseController: (name?: string) => BaseControllerValueRef<any, any>
  getValues: () => any
  getProps: () => T
  isValid: () => boolean
  getValidText: () => string[]
  clear: () => void
  type: ScreenControllerType 

}

interface ObjectRefs {
  objectName: string 
  type: ScreenControllerType
  event: ScreenControllerAction<any> | null
}
export interface iScreenProps extends iLayout {
  screencode:string
  children: ReactNode | React.ReactNode[] | JSX.Element | JSX.Element[]
  onLoad?: (Screen: ScreenRef) => void
  alert?: boolean
}
export const ScreenView = React.forwardRef<ScreenRef, iScreenProps>((props: iScreenProps, ref: React.ForwardedRef<ScreenRef>) => {
  let [refs] = useState<Record<string, ObjectRefs>>(Object.create({}));
  const [open, SetOpen] = useState(false);
  let [alertText, SetAlertText] = useState<string[]>([]);
  const getBaseController = (name?: string): BaseControllerValueRef<any, any> => {
    Object.keys(refs).map(t => {
      if (t == (name ?? t)) {
        return refs[t].event as ScreenControllerAction<any>;
      }
    })
    return null;
  }
  const getValues = (): any => {
    let Data: any = {};
    Object.keys(refs).map(t => {
      if (refs[t].type == ScreenControllerType.Form) {
        Data[t] = refs[t].event.getValues();
      }
    })
    return Data;
  }
  let [ScreenRef] = useState<ScreenRef>({
    register: (props) => {
      let name = props.getProps().name
      refs[name] = {   event: props, objectName: name, type: props.type };
    },
    getController: (name?) => getBaseController(name),
    getBaseController: getBaseController,
    getValues: getValues,
    isValid: () => {
      let status: boolean = true;
      alertText = [];
      Object.keys(refs).map(key => { 
          let t = refs[key];
          let valid = t.event.isValid?.();
          if(valid===false)
          { 
            let validText=t.event.getValidText();
            alertText.push(...validText);
          } 
      })
      if ((props.alert??true) == true) {
        SetAlertText(alertText);
        SetOpen(!status);
      }
      return status;
    },
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
      if (c.type != null && c.type.IsScreenController === true) {
        console.log("ScreenRef",ScreenRef)
        propData.screencontroller = ScreenRef
        propData.ref = c.ref == null ? useRef<any>() : c.ref
      }
      c = React.cloneElement(c, propData);
      return c;
    })

    return childs;
  }



  let [childs] = useState(recursive(props));

  console.log(childs);
  useImperativeHandle(ref, () => (ScreenRef));
  useEffect(() => {
    props.onLoad?.(ScreenRef);
  })
  return (<div> 
    <Alert fade toggle={(e) => { SetOpen(false) }} isOpen={open} color="danger">{alertText.map((t, index) => <p key={"key" + index.toString()}>{t}</p>)}</Alert>
    <View responsive={props.responsive} responsiveSize={props.responsiveSize} spacer={props.spacer}>{childs}</View>
  </div>);
})
export interface iScreen extends ScreenRef {
  View: (props: iScreenProps) => JSX.Element
}
export const useScreen = () => {

  let ref = useRef<ScreenRef>(null);
  const enhanced = (props: iScreenProps) => {
    return <ScreenView {...props} ref={ref} />
  }

  let useScreen: iScreen = Object.create({});

  useEffect(() => {
    if (ref.current != null) {
      let keys = Object.keys(ref.current)
      for (let index = 0; index < keys.length; index++) {
        (useScreen as any)[keys[index]] = (ref.current as any)[keys[index]];
      }
    }

  }, [ref.current]);

  useScreen.View = enhanced;
  return useState(useScreen)[0]

}