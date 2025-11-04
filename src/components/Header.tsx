import HeaderBrand from "./HeaderBrand";
import HeaderNavigation from "./HeaderNavigation";

export default function Header() {
  return (
    <>
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <HeaderBrand />
      </div>
      <div className="sticky top-2 z-50">
        <HeaderNavigation />
      </div>
    </>
  );
}
