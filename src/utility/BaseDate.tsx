
import _ from 'lodash';
import Moment from 'moment';



export const BaseDate = {
    Moment: Moment,
    Format: {
        View: {
            date: "DD.MM.YYYY",
            datetime: "DD.MM.YYYY H:mm:ss",
            time: "H:mm:ss"
        },
        Db: {
            date: "YYYY.MM.DD",
            datetime: "YYYY.MM.DD H:mm:ss",
            time: "H:mm:ss"
        }
    },
    Method: {
        /**
         * StartTime StopTimedan Sonra Mi?
         * @param StartTime Baslangic zamani
         * @param StopTime Bitis zamani
         * @param isEquals Esit mi
         * @returns true:false
         */
        CompareTimeIsAfter: (StartTime: string, StopTime: string, isEquals: boolean = true) : boolean=> {
            let StartTimeQ = new Date("2000-01-01 " + StartTime);
            let StopTimeQ = new Date("2000-01-01 " + StopTime);
            if (StartTimeQ.getTime() > StopTimeQ.getTime() || (isEquals == true && StartTimeQ.getTime() == StopTimeQ.getTime())) {
                return true;
            }
            return false;
        },
        /**
         * SQL  insideValue BETWEEN StartTime AND  StopTime
         * @param insideValue data
         * @param StartTime StartTime
         * @param StopTime StopTime
         * @param isEquals Esit Dahil mi
         * @returns true:false
         */
        isBetweenCompareTimeIsAfter: (insideValue:string,StartTime: string, StopTime: string, isEquals: boolean = true) : boolean=> {
           
            return BaseDate.Method.CompareTimeIsAfter(insideValue,StartTime,isEquals) && BaseDate.Method.CompareTimeIsAfter(StopTime,insideValue,isEquals)
        }
    },
    ViewText: (param: string | Date | any, type: "date" | "datetime" | "time" = "date") => {
        if (param == null)
            return '';
        if (Moment.isDate(param)) {
            return Moment(param).format((BaseDate.Format.View as any)[type])
        } else if (type == "time" && _.isString(param) && (param as string).length <= 8) {
            let paramtype = (param as string).split(/:/gi)
            paramtype.map((t, index) => {
                paramtype[index] = t.padStart(2, '0');
            })
            param = paramtype.join(':')
            return param;
        } else {
            return param;
        }
    },
    getDb: (param: any, type: "date" | "datetime" | "time" = "date") => {
        if (param == null)
            return '';
        if (Moment.isDate(param)) {
            return Moment(param).format((BaseDate.Format.Db as any)[type])
        } else {
            return param;
        }
    }
}