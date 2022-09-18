import React, { ReactNode, useEffect, useImperativeHandle, useMemo, useRef, useState } from "react";
import { BaseControllerValueRef, ControllerClassType, ControllerType, ScreenControllerType } from "../utility/baseRef";
import { iLayout, View } from "../hocs/withLayout";
import { Alert, ButtonGroup, Card, CardBody, Col, Collapse, Nav, Navbar, NavbarBrand, NavbarToggler, NavItem, NavLink, Row } from "reactstrap";
import { IInputNumberRef } from "../component";
import { IDataTableRef } from "../components/datatable";
import { Button } from "../components/button";
import { IconName } from "../components/icon/icon";
export interface ScreenRef {
  register: (props: ScreenControllerAction<any> | IDataTableRef) => void
  getController: <T, P>(name?: string) => ScreenControllerAction<any>
  getBaseController: (name?: string) => ScreenControllerAction<any>
  getValue: () => any
  isValid: () => boolean
  clear: () => void
}


export interface ScreenControllerAction<T> {
  register: (props: BaseControllerValueRef<any, any>,name?:string) => void
  getController: <T, P>(name?: string) => BaseControllerValueRef<any, any>
  getBaseController: (name?: string) => BaseControllerValueRef<any, any>
  getNumberInputController: (name?: string) => IInputNumberRef
  getValue: () => any
  getProps: () => T
  isController: () => boolean
  isValid?: () => boolean
  getValidText?: () => string[]
  clear: () => void
  type: ScreenControllerType

}

interface ObjectRefs {
  objectName: string
  type: ScreenControllerType
  event: IDataTableRef | ScreenControllerAction<any> | null
}
export interface iScreenProps extends iLayout {
  screencode: string
  children: ReactNode | React.ReactNode[] | JSX.Element | JSX.Element[]
  onLoad?: (Screen: ScreenRef) => void
  alert?: boolean
}
export const ScreenView = React.forwardRef<ScreenRef, iScreenProps>((props: iScreenProps, ref: React.ForwardedRef<ScreenRef>) => {
  let [refs] = useState<Record<string, ObjectRefs>>(Object.create({}));
  const [open, SetOpen] = useState(false);
  let [alertText, SetAlertText] = useState<string[]>([]);
  const getBaseController = (name?: string): ScreenControllerAction<any> => {
    let keys = Object.keys(refs);
    for (let index = 0; index < keys.length; index++) {
      let t = keys[index];
      if (t == (name ?? t)) {
        return refs[t].event as ScreenControllerAction<any>;
      }
    }
    return null;
  }
  const getValue = (): any => {
    let Data: any = {};
    let keys = Object.keys(refs);
    for (let index = 0; index < keys.length; index++) {
      let t = keys[index];
      if (refs[t].type == ScreenControllerType.Form || refs[t].type == ScreenControllerType.DataTable) {
        Data[t] = refs[t].event.getValue();
      }
    }
    return Data;
  }
  let [ScreenRef] = useState<ScreenRef>({
    register: (props) => {
      let name = props.getProps().name
      refs[name] = { event: props, objectName: name, type: props.type as ScreenControllerType };
    },
    getController: (name?) => getBaseController(name),
    getBaseController: getBaseController,
    getValue: getValue,
    isValid: () => {
      let status: boolean = true;
      alertText = [];
      Object.keys(refs).map(key => {
        let t = refs[key] as any;
        let valid = t.event?.isValid?.();
        if (valid === false) {
          let validText = t.event.getValidText();
          alertText.push(...validText);
        }
      })
      if ((props.alert ?? true) == true) {
        SetAlertText(alertText);
        SetOpen(!status);
      }
      return status;
    },
    clear: () => {
      Object.keys(refs).map(key => {
        try {
          (refs[key]?.event as any)?.clear?.();
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
      let c: any = child as any;
      let propData = { ...c.props };
      if (propData.children != null) {
        propData.children = recursive(propData);
      }
      if (c.type != null && c.type.IsScreenController === true) {
        //console.log("ScreenRef",ScreenRef)
        propData.screencontroller = ScreenRef
        propData.ref = c.ref == null ? useRef<any>() : c.ref
      }
      c = React.cloneElement(c, propData);
      return c;
    })

    return childs;
  }



  //let [childs] = useState(recursive(props));
  let childs = recursive(props);

  useImperativeHandle(ref, () => (ScreenRef));
  useEffect(() => {
    props.onLoad?.(ScreenRef);
  })
  const [collapsed, setCollapsed] = useState(true);

  const toggleNavbar = () => setCollapsed(!collapsed);
  return (
    <div>
      <Navbar style={{ border: "1px solid #dadada", borderRadius: 5 }}>
        <Row>
          <Col md="11" xl="11" xxl="11" sm="11" xs="11" lg="11" >
            <ButtonGroup className="me-auto" style={{ marginTop: "3px" }}>
              <Button color="link" isLabelHidden id="Save" icon={{ iconName: IconName.Save }} />
            </ButtonGroup>
            {/* <Collapse isOpen={!collapsed} navbar>
                <Nav navbar>
                  <NavItem>
                    <NavLink href="/components/">Components</NavLink>
                  </NavItem>
                  <NavItem>
                    <NavLink href="https://github.com/reactstrap/reactstrap">
                      GitHub
                    </NavLink>
                  </NavItem>
                </Nav>
              </Collapse> */}
          </Col>
          <Col md="1" xl="1" xxl="1" sm="1" xs="1" lg="1">
            <div className="d-block d-sm-none d-md-none d-lg-none d-xl-none d-xxl-none">
              <NavbarToggler style={{ float: "right" }} onClick={toggleNavbar} className="btn-sm" />
            </div>
          </Col>
        </Row>
      </Navbar>
      <div style={{
        marginTop: 10
      }}>
        <Alert fade toggle={(e) => { SetOpen(false) }} isOpen={open} color="danger">{alertText.map((t, index) => <p key={"key" + index.toString()}>{t}</p>)}</Alert>
        <View responsive={props.responsive} responsiveSize={props.responsiveSize} spacer={props.spacer} classext="mb-2">{childs}</View>
      </div>
    </div>
  );
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