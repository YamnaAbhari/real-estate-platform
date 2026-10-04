export default function PropertyCardSkeleton() {
  return (
    <div className="w-full bg-white rounded-2xl overflow-hidden shadow-md border border-gray-100 animate-pulse">
      {/* ================= IMAGE ================= */}
      <div className="relative w-full h-52 bg-gray-200">
        {/* Heart skeleton */}
        <div className="absolute top-3 left-3 w-10 h-10 rounded-full bg-gray-300" />

        {/* Price skeleton */}
        <div className="absolute bottom-2 left-2 w-28 h-9 rounded-xl bg-gray-300" />
      </div>

      {/* ================= CONTENT ================= */}
      <div className="p-5">
        {/* Property Type + Views */}
        <div className="flex items-center justify-between pb-4 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded bg-gray-200" />
            <div className="w-20 h-4 rounded bg-gray-200" />
          </div>

          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded bg-gray-200" />
            <div className="w-16 h-4 rounded bg-gray-200" />
          </div>
        </div>

        {/* ================= LOCATION ================= */}
        <div className="flex items-center gap-2 py-4 border-b border-gray-100">
          <div className="w-5 h-5 rounded bg-gray-200 shrink-0" />

          <div className="flex items-center gap-2 w-full">
            <div className="w-16 h-4 rounded bg-gray-200" />
            <div className="w-2 h-4 rounded bg-gray-200" />
            <div className="w-20 h-4 rounded bg-gray-200" />
            <div className="w-2 h-4 rounded bg-gray-200" />
            <div className="w-16 h-4 rounded bg-gray-200" />
          </div>
        </div>

        {/* ================= FEATURES ================= */}
        <div className="grid grid-cols-3 divide-x divide-x-reverse divide-gray-100 py-5">
          {/* Feature 1 */}
          <div className="flex flex-col items-center gap-2 px-2">
            <div className="w-5 h-5 rounded bg-gray-200" />
            <div className="w-14 h-3 rounded bg-gray-200" />
            <div className="w-10 h-4 rounded bg-gray-200" />
          </div>

          {/* Feature 2 */}
          <div className="flex flex-col items-center gap-2 px-2">
            <div className="w-5 h-5 rounded bg-gray-200" />
            <div className="w-16 h-3 rounded bg-gray-200" />
            <div className="w-10 h-4 rounded bg-gray-200" />
          </div>

          {/* Feature 3 */}
          <div className="flex flex-col items-center gap-2 px-2">
            <div className="w-5 h-5 rounded bg-gray-200" />
            <div className="w-12 h-3 rounded bg-gray-200" />
            <div className="w-14 h-4 rounded bg-gray-200" />
          </div>
        </div>

        {/* ================= BUTTON ================= */}
        <div className="w-full h-12 rounded-xl bg-gray-200" />
      </div>
    </div>
  );
}