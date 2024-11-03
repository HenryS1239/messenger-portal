import { SEVERITIES } from "@/app/constants";
import moment from "moment";

const formatter = {
  toDisplayDatetime: (value: any, empty: string = "") => {
    return !!value ? moment(value).format("YYYY-MM-DD HH:mm") : empty;
  },
  toDisplayChatDatetime: (value: any, empty: string = "") => {
    return !!value ? moment(value).format("DD/MM/YY HH:mm") : empty;
  },
  toDisplayDate: (value: any, empty: string = "") => {
    return !!value ? moment(value).format("YYYY-MM-DD") : empty;
  },
  toISODateRange: (value: any) => {
    return !!value ? [formatter.toISODate(value[0].startOf("days")), formatter.toISODate(value[1].endOf("days"))].join(",") : null;
  },
  toISODate: (value: any) => {
    return !!value ? value.toISOString() : null;
  },
  toSimplifiedDayMonth: (value: any) => {
    return !!value ? moment(value).format("DD MMM") : null;
  },
  toDisplayFormDate: (value: any, empty: string = "") => {
    return !!value ? moment(value).utc() : empty;
  },
  toDisplayDateMonthName: (value: any, empty: string = "") => {
    return !!value ? moment(value).format("DD MMM YYYY") : empty;
  },
  toDisplayFormatPrice: (value: any, empty: string = "") => {
    return !!value || value === 0 ? value.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",") : empty;
  },
  toDisplaySeverity: (severity: string) => {
    switch (severity) {
      case SEVERITIES.NOTICE:
        return "Notice";
      case SEVERITIES.ERROR:
        return "Error";
      case SEVERITIES.DEBUG:
        return "Debug";
      case SEVERITIES.INFO:
        return "Info";
      case SEVERITIES.ALERT:
        return "Alert";
      case SEVERITIES.CRITICAL:
        return "Critical";
      case SEVERITIES.EMERGENCY:
        return "Emergency";
      case SEVERITIES.WARNING:
        return "Warning";
      default:
        return severity;
    }
  },
};

export default formatter;
