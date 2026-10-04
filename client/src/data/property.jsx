import { FaBed, FaBuilding, FaRulerCombined } from "react-icons/fa";

export const types = {
  apartment: "آپارتمان",
  villa: "ویلا",
  land: "زمین",
  office: "دفتر",
  shop: "مغازه",
  warehouse: "انبار",
};

export const propertyType = [
  {
    label: "آپارتمان",
    value: "apartment",
  },
  {
    label: "ویلا",
    value: "villa",
  },
  {
    label: "دفتر",
    value: "office",
  },
  {
    label: "مغازه",
    value: "shop",
  },
  {
    label: "زمین",
    value: "land",
  },
  {
    label: "انبار",
    value: "warehouse",
  },
];

export const bedroomsCount = [
  {
    label: "1",
    value:1,
  },
  {
    label: "2",
    value: 2,
  },
  {
    label: "3",
    value: 3,
  },
  {
    label: "4",
    value: 4,
  },
  {
    label: "+5",
    value: 5,
  }
];

export const getPropertyFeature = (propertyType, bedrooms) => {
  if (propertyType === "apartment" || propertyType === "villa") {
    return {
      icon: <FaBed className="text-gold text-[20px]" />,
      title: "اتاق خواب",
      value: bedrooms || "—",
    };
  }

  switch (propertyType) {
    case "office":
      return {
        icon: <FaBuilding className="text-gold text-[20px]" />,
        title: "طبقات",
        value: "4 طبقه",
      };

    case "shop":
      return {
        icon: <FaRulerCombined className="text-gold text-[20px]" />,
        title: "عرض ملک",
        value: "8 متر",
      };

    case "land":
      return {
        icon: <FaBuilding className="text-gold text-[20px]" />,
        title: "کاربری",
        value: "مسکونی",
      };

    case "warehouse":
      return {
        icon: <FaBuilding className="text-gold text-[20px]" />,
        title: "ارتفاع",
        value: "6 متر",
      };

    default:
      return {
        icon: <FaBed className="text-gold text-[20px]" />,
        title: "اتاق خواب",
        value: "—",
      };
  }
};
