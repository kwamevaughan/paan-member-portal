import Image from 'next/image';

export default function AgencyLogosGrid() {
  // Sample agency logos - replace with your actual logos
  const agencyLogos = [
    {
      id: 1,
      name: 'Agency 1',
      logo: '/assets/images/logos/Deloitte.png',
    },
    {
      id: 2,
      name: 'Agency 2',
      logo: '/assets/images/logos/Airbnb.png',
    },
    {
      id: 3,
      name: 'Agency 3',
      logo: '/assets/images/logos/AsusTek-black-logo 1.png',
    },
    {
      id: 4,
      name: 'Agency 4',
      logo: '/assets/images/logos/Coca-Cola_logo.svg 1.png',
    },
    {
      id: 5,
      name: 'Agency 5',
      logo: '/assets/images/logos/Elaraby-group-logo 1.png',
    },
    {
    id: 6,
    name: 'Agency 2',
    logo: '/assets/images/logos/FSD-Africa-Logo 1.png',
    },
    {
    id: 7,
    name: 'Agency 1',
    logo: '/assets/images/logos/Heineken_logo.svg 1.png',
    },
    {
    id: 8,
    name: 'Agency 2',
    logo: '/assets/images/logos/Hewlett_Packard_Enterprise-Logo.wine 1.png',
    },
    {
    id: 9,
    name: 'Agency 3',
    logo: '/assets/images/logos/kenya-airways-thumb 1.png',
    },
    {
    id: 10,
    name: 'Agency 4',
    logo: '/assets/images/logos/logo-ecobank 1.png',
    },
    {
    id: 11,
    name: 'Agency 5',
    logo: '/assets/images/logos/logo-ecobank 2.png',
    },
    {
    id: 12,
    name: 'Agency 2',
    logo: '/assets/images/logos/Logo-pwc 1.png',
    },
    {
    id: 13,
    name: 'Agency 3',
    logo: '/assets/images/logos/OX_HL_C_RGB 1.png',
    },
    {
    id: 14,
    name: 'Agency 4',
    logo: '/assets/images/logos/google.png',
    },
    {
    id: 15,
    name: 'Agency 5',
    logo: '/assets/images/logos/Qatar_Airways_logo.svg 1.png',
    },
    {
    id: 16,
    name: 'Agency 4',
    logo: '/assets/images/logos/totalenergies-logo-png_seeklogo-405344 1.png',
    },
    {
    id: 17,
    name: 'Agency 5',
    logo: '/assets/images/logos/Uber_logo_2018 1.png',
    },
    {
    id: 18,
    name: 'Agency 2',
    logo: '/assets/images/logos/Vodacom-Logo.wine 1.png',
    },
    {
    id: 19,
    name: 'Agency 3',
    logo: '/assets/images/logos/Volkswagen-logo-2015-1920x1080 1.png',
    },
    {
    id: 20,
    name: 'Agency 4',
    logo: '/assets/images/logos/White-UK-aid-logo-with-strap 1.png',
    },
  ];

  return (
    <section className=" w-full  py-14">
      <div className="mx-auto max-w-6xl">
        <h2 className="text-3xl font-normal capitalize text-center mb-2 text-gray-800">
            Serving the world's greatest brands
        </h2>
        <h3 className="text-xl font-extralight text-center text-gray-800 pb-4">PAAN agencies have proudly served many of the world's most heralded brands.</h3>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 items-center justify-items-center">
          {agencyLogos.map((agency) => (
            <div
              key={agency.id}
              className="w-32 aspect-[3/2] relative group hover:-translate-y-2 transition-all duration-500 ease-in-out"
            >
              <Image
                src={agency.logo}
                alt={agency.name}
                fill
                className="object-contain p-2 filter grayscale group-hover:grayscale-0 transition-all duration-300 ease-in-out"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
} 