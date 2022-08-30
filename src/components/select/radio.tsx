
import React from "react";
import { WithController } from "../../hocs/withController";
import { WithLabel } from "../../hocs/withLabel";
import { ISelectRef, Select, SelectProps } from "./select";

export interface RadioProps extends SelectProps { 
  position?:"vertical"|"horizontal"
}
export interface IRadioRef extends ISelectRef {

}


export const Radio = WithController<RadioProps, IRadioRef>(React.forwardRef<IRadioRef, RadioProps>((props: RadioProps, ref: React.ForwardedRef<IRadioRef>) => {
  const propsNew = { ...props, isradio: true };
  return <Select {...propsNew} ref={ref} />
}))