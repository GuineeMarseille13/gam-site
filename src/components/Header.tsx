import HeaderBrand from "./HeaderBrand";
import HeaderNavigation from "./HeaderNavigation";

export default function Header() {
  return (
    <>
      <div className="container mx-auto px-4">
        <HeaderBrand />
      </div>
      <div className="sticky top-2 z-50">
        <HeaderNavigation />
      </div>
    </>
  );
}
