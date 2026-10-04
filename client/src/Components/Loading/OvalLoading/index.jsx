import { Oval } from "react-loader-spinner";

export default function OvalLoading({
  size = 24,
  color = "#ffffff",
  secondaryColor = "#ffffff",
  strokeWidth = 4,
}) {
  return (
    <Oval
      height={size}
      width={size}
      color={color}
      visible={true}
      ariaLabel="loading"
      secondaryColor={secondaryColor}
      strokeWidth={strokeWidth}
      strokeWidthSecondary={strokeWidth}
    />
  );
}