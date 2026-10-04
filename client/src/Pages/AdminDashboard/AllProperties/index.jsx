import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import FetchData from "../../../Utils/FetchData";
import DashboardPropertyCard from "../../../Components/DashboardPropertyCard";


export default function AllProperties() {
  const { token } = useSelector((state) => state.auth);

  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) return;

    const getAllProperties = async () => {
      try {
        setLoading(true);

        const result = await FetchData("properties", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (result.success) {
          setProperties(result.data);
        }
      } catch (error) {
        console.log("GET ALL PROPERTIES ERROR:", error);
      } finally {
        setLoading(false);
      }
    };

    getAllProperties();
  }, [token]);

  if (loading) {
    return (
      <div
        dir="rtl"
        className="flex min-h-[400px] items-center justify-center font-iranYekan text-gray-500"
      >
        در حال دریافت املاک...
      </div>
    );
  }

  return (
    <div dir="rtl" className="p-6">
      <div className="mb-6">
        <h1 className="font-alibaba text-2xl font-bold text-dark-blue">
          همه املاک
        </h1>

        <p className="mt-1 font-iranYekan text-sm text-gray-500">
          {properties.length} ملک ثبت شده
        </p>
      </div>

      {properties.length === 0 ? (
        <div className="rounded-2xl bg-white p-10 text-center font-iranYekan text-gray-500 shadow-sm">
          ملکی برای نمایش وجود ندارد
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {properties.map((property) => (
            <DashboardPropertyCard
              key={property._id}
              property={property}
            />
          ))}
        </div>
      )}
    </div>
  );
}