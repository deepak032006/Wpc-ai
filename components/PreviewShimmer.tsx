export default function PreviewShimmer() {
  return (
    <div className="w-full mx-auto max-w-4xl p-6 animate-pulse">
      {/* Header Section */}
      <div className="flex justify-between items-start mb-6 border-b border-gray-300 pb-6">
        <div className="flex items-center justify-start gap-3">
          <div className="w-25 h-25 rounded-lg bg-gray-200"></div>
          <div className="flex flex-col gap-2">
            <div className="h-6 w-48 bg-gray-200 rounded"></div>
            <div className="h-4 w-72 bg-gray-200 rounded"></div>
          </div>
        </div>
        <div className="w-6 h-6 bg-gray-200 rounded"></div>
      </div>

      <div className="bg-white">
        {/* Job Description Section */}
        <section className="mb-6">
          <div className="h-5 w-32 bg-gray-200 rounded mb-2"></div>
          <div className="space-y-2">
            <div className="h-4 w-full bg-gray-200 rounded"></div>
            <div className="h-4 w-full bg-gray-200 rounded"></div>
            <div className="h-4 w-3/4 bg-gray-200 rounded"></div>
          </div>
        </section>

        {/* Pay Section */}
        <section className="mb-6">
          <div className="h-5 w-16 bg-gray-200 rounded mb-2"></div>
          <div className="h-4 w-64 bg-gray-200 rounded"></div>
        </section>

        {/* Benefits Section */}
        <section className="mb-6">
          <div className="h-5 w-24 bg-gray-200 rounded mb-2"></div>
          <div className="space-y-2">
            <div className="h-4 w-48 bg-gray-200 rounded"></div>
            <div className="h-4 w-56 bg-gray-200 rounded"></div>
            <div className="h-4 w-40 bg-gray-200 rounded"></div>
            <div className="h-4 w-32 bg-gray-200 rounded"></div>
            <div className="h-4 w-52 bg-gray-200 rounded"></div>
          </div>
        </section>

        {/* Work Location Section */}
        <section className="mb-8">
          <div className="h-5 w-32 bg-gray-200 rounded mb-2"></div>
          <div className="h-4 w-40 bg-gray-200 rounded"></div>
        </section>
      </div>
    </div>
  );
}