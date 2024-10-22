 import { responsiveFontSize } from 'react-native-responsive-dimensions';
import { s, vs, ms, mvs } from 'react-native-size-matters';

export const scale = (number) => {
    return s(number)
}

export  const verticalscale= (number) =>{
    return vs(number)
}
export const moderartescale = (number,factor) =>{
    return ms(number,factor)
}
export  const fonstSizeDynamic = (number) =>{
    return responsiveFontSize(number)
}

