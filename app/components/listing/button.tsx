import { Button, Tooltip } from "antd";

type IButton = {
  tooltipMsg: string;
  onClick?: any;
  icon?: any;
  style?: any;
  isDisabled?: boolean;
  additionalProps?: any;
  href?: string;
};

export const ListingButton: React.FC<IButton> = (props) => {
  return (
    <Tooltip placement="top" title={props.tooltipMsg}>
      <Button
        type="link"
        icon={props.icon}
        disabled={props.isDisabled}
        href={props.href}
        onClick={props.onClick}
        style={props.style}
        {...props.additionalProps}
      ></Button>
    </Tooltip>
  );
};
