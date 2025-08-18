import { PoleCard } from "@/components/PoleCard";

const PoleSection = () => {
  const poles = [
    {
      image: "/images/e-pole.jpg",
      title: "EVENEMENTIEL",
    },
    {
      image: "/images/aa-pole.jpg",
      title: "DEMARCHE ADMINISTRATIVE",
    },
    {
      image: "/images/mr-pole.jpg",
      title: "MISE EN RELATION",
    },
  ];
  return (
    <div className="flex flex-col items-center justify-center gap-6 my-15">
      <h3 className="text-3xl font-bold text-slate-500 bg-gradient-to-r from-blue-500 via-red-500 to-indigo-500 bg-clip-text text-transparent">
        Nos pôles d&apos;activités
      </h3>
      {/* <h1 className="text-4xl font-bold">Nos pôles</h1> */}
      <div className="flex flex-wrap gap-6 justify-center">
        {poles.map((pole) => (
          <PoleCard key={pole.title} image={pole.image} title={pole.title} />
        ))}
      </div>
    </div>
  );
};

export default PoleSection;
