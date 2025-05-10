export default function Loading() {
  // Stack uses React Suspense, which will render this page while user data is being fetched.
  // See: https://nextjs.org/docs/app/api-reference/file-conventions/loading
  return (
    <div className="flex justify-center items-center min-h-[70vh]">
      <div className="flex flex-col items-center">
        <div className="relative w-24 h-24">
          <div className="absolute top-0 w-full h-full border-4 border-blue-200 rounded-full animate-pulse"></div>
          <div className="absolute top-0 w-full h-full border-t-4 border-blue-600 rounded-full animate-spin"></div>
        </div>
        <p className="mt-6 text-xl font-medium text-gray-700">加载中...</p>
      </div>
    </div>
  );
}
