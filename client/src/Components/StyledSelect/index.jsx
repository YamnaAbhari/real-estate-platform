import Select from "react-select";

const customStyles = {
  control: (base) => ({
    ...base,
    height: 48,
    borderRadius: 12,
    borderColor: "#e5e7eb",
    backgroundColor: "#f9fafb",
    fontFamily: "alibaba",
    fontSize: 14,
    boxShadow: "none",
    "&:hover": { borderColor: "#cba36f" },
  }),
  menuPortal: (base) => ({
    ...base,
    zIndex: 9999,
  }),
  menu: (base) => ({
    ...base,
    borderRadius: 12,
    overflow: "hidden",
    zIndex: 9999,
  }),
  option: (base, state) => ({
    ...base,
    fontFamily: "alibaba",
    fontSize: 14,
    backgroundColor: state.isFocused ? "#cba36f20" : "white",
    color: "#0e1431",
    cursor: "pointer",
  }),
};

export default function StyledSelect({
  options,
  value,
  name='',
  onChange,
  className = "flex-1",
  noSwiping = true,
  ...rest
}) {
  const select = (
    <Select
  options={options}
  name={name}
  value={options.find((o) => o.value === value)}
  onChange={(selected) =>
    onChange({
      target: { name, value: selected.value },
    })
  }
  menuPlacement="bottom"
  menuPortalTarget={document.body}
  menuPosition="absolute"
  classNamePrefix="react-select"
  styles={customStyles}
  {...rest}
/>
  );


  if (noSwiping) {
    return <div className={`swiper-no-swiping ${className}`}>{select}</div>;
  }

  return <div className={className}>{select}</div>;
}