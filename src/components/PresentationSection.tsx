const PresentationSection = () => {
  return (
    <div className="flex flex-col items-center justify-center gap-4 my-10 bg-slate-100 p-10 rounded-xl">
      <h3 className="text-4xl font-bold text-slate-500 bg-gradient-to-r from-blue-500 via-red-500 to-indigo-500 bg-clip-text text-transparent">
        Bienvenue
      </h3>
      <p className="text-lg text-slate-500 w-full text-center">
        L’Association des Guinéens à Marseille (GAM) est une association mixte à
        but non lucratif qui a pour objectif de regrouper, informer et
        accompagner les Guinéens vivant à Marseille et ses environs. Elle œuvre
        principalement dans l’accueil des nouveaux arrivants, l’aide
        administrative, l’intégration sociale et universitaire, ainsi que dans
        la valorisation de la culture guinéenne à travers des événements et des
        actions solidaires. GAM agit aussi comme un réseau de soutien entre
        étudiants, jeunes professionnels et familles guinéennes installées dans
        la région.
      </p>
    </div>
  );
};

export default PresentationSection;
