
import _ from "lodash";
import { Button as ButtonBASE } from "reactstrap"
import { iLayoutTypeProps } from "../../hocs/withLayout";
import { iLabel, WithLabel } from "../../hocs/withLabel";
import { Icon, IconProps } from "../icon/icon";
import React, { useImperativeHandle, useState } from "react";
import { BaseControllerActionRef, BaseProps, ControllerClassType, ControllerType } from "../../utility/baseRef";

export type ButtonCollor = "primary" | "secondary" | "success" | "info" | "warning" | "danger" | "link";
 
export interface ButtonProps extends Omit<iLabel, 'id'>, iLayoutTypeProps, Omit<BaseProps<IButtonRef, ButtonProps>, ''>, Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'id'> {
  label?: string
  outline?: boolean;
  active?: boolean;
  block?: boolean;
  color?: ButtonCollor;
  tag?: React.ElementType;
  innerRef?: React.Ref<HTMLButtonElement>;
  close?: boolean;
  icon?: IconProps,
  iconPosition?: "left" | "right"
}
export interface IButtonRef extends BaseControllerActionRef<ButtonProps> {
  hiddens: boolean
}
export const Button = WithLabel<ButtonProps, IButtonRef>(React.forwardRef((props: ButtonProps, ref: React.ForwardedRef<IButtonRef>) => {

  const [hidden, setHidden] = useState(props.hidden ?? false);
  // const [notvisible, setVisible] = useState(props.notvisible ?? false);
  const [disable, setDisabled] = useState(props.disabled ?? false);
  const [blocking, setBlocking] = useState(props.blocking ?? false);
  const thatFnc: IButtonRef = {
    isHide: () => hidden,
    hiddens: hidden,
    setHide: (val: boolean) => {
      setHidden(val);
    },
    type: ControllerType.Input,
    controllerClass: ControllerClassType.Action,
    isDisable: () => disable,
    getProps: () => {
      return props as any
    },
    setDisable: (val) => {
      setDisabled(val)
    },
    isBlock: () => blocking,
    setBlock: (val) => {
      setBlocking(val);
    },
  }

  useImperativeHandle(ref, () => (thatFnc));


  const propsNew = _.omit(props, ["setHiddenLabel", "spacer", "responsive","isLabelHidden","iconPosition"])
  return (
    <ButtonBASE hidden={hidden} {...propsNew} color={props.color ?? "primary"} size={"sm"} style={{ alignContent: "flex-end", alignItems: "flex-end", verticalAlign: "bottom", alignTracks: "end", alignSelf: "end",...propsNew.style }}>
      {(props.icon != null && (props.iconPosition ?? "left") == "left" && (<Icon {...props.icon} />))}
      {" "}{props.label}{" "}
      {(props.icon != null && props.iconPosition == "right" && (<Icon {...props.icon} />))}
    </ButtonBASE>)
}), false)