import Image from "next/image";
import { Icon } from "@iconify/react";

export function TestimonialQuote({ quote, author, image }) {
  return (
   
<div className="relative top-20 mt-6 lg:mt-0">
  <div className="bg-paan-blue p-4 sm:p-6 lg:p-8 rounded-xl shadow-md hover:shadow-none transition-all duration-300 relative z-10">
    {/* Quote Icon - Smaller size */}
    <div className="absolute -top-4 sm:-top-6 lg:-top-8 left-2 sm:left-3 z-20">
      <Icon
        icon="gridicons:quote"
        className="text-white/50 sm:w-12 sm:h-12 lg:w-16 lg:h-16"
      />
    </div>

    {/* Circle - Bottom Right - Smaller */}
    <div className="absolute -bottom-1 sm:-bottom-2 lg:-bottom-3 -right-1 w-4 h-4 sm:w-6 sm:h-6 lg:w-8 lg:h-8 bg-paan-red rounded-full z-20"></div>

    <div className="space-y-3 sm:space-y-4 py-4 sm:py-6 lg:py-8">
      {/* Quote Text - Smaller font */}
      <p className="text-paan-dark-blue text-sm sm:text-base leading-relaxed">
        PAAN has enabled us to access new business opportunities across Africa
        and has also played a pivotal role in upskilling our teams through
        training programs & webinars tailored to agencies
      </p>

      {/* Author Info - Smaller spacing */}
      <div className="flex items-center space-x-3 pt-2 sm:pt-3">
        <div className="flex-shrink-0">
          <Image
            src="/assets/images/kester-muhanji.png"
            width={40}
            height={40}
            alt="Kester Muhanji"
            className="rounded-full ring-2 ring-white/20 sm:w-12 sm:h-12"
          />
        </div>
        <div>
          <h4 className="font-bold text-paan-dark-blue text-sm sm:text-base">
            Kester Muhanji
          </h4>
          <p className="text-paan-dark-blue text-xs sm:text-sm">
            CEO, Aquila East Africa
          </p>
        </div>
      </div>
    </div>
  </div>

  {/* Decorative Elements - Smaller */}
  <div className="absolute -top-2 -right-2 w-12 h-12 sm:w-16 sm:h-16 lg:w-20 lg:h-20 bg-white/10 rounded-full blur-xl"></div>
  <div className="absolute -bottom-3 -left-3 w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 bg-paan-blue/30 rounded-full blur-2xl"></div>
    </div>
  );
}

export default TestimonialQuote;
