const LoadingSkeleton = () => {
  const items = Array(2).fill(null);

  return (

      <div className="container px-6 py-10 mx-auto animate-pulse">




        <div className="grid grid-cols-1 gap-8 mt-8 xl:mt-12 xl:gap-12 sm:grid-cols-2 xl:grid-cols-4 lg:grid-cols-3">
          {items.map((_, index) => (
            <div key={index} className="w-full">
              <div className="w-full h-64  rounded-lg bg-[#444]"></div>
              <h1 className="w-56 h-2 mt-4 bg-[#333]"></h1>
              <p className="w-24 h-2 mt-4 bg-[#333]"></p>
            </div>
          ))}
        </div>
      </div>
  );
};

export default LoadingSkeleton;
