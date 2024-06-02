import MenuEntriesNavigation from "./MenuEntriesNavigation";
import MenuEntriesSettings from "./MenuEntriesSettings";
import MenuEntriesUser from "./MenuEntriesUser";
import MenuEntriesUtility from "./MenuEntriesUtility";

const menuNavigationItems = [
  "home",
  "photos",
  "blog",
  "projects",
  "about",
  "design",
  "management",
];

export default function MenuEntriesLayout() {
  return (
    <div className="h-full w-full overflow-y-auto px-6 md:px-8 py-8">
      <div className="rounded-full w-full bg-light bg-opacity-80 shadow-lg px-4 py-4 mt-6 mb-14 flex items-center">
        <MenuEntriesUser />
      </div>
      <div className="rounded-2xl w-full bg-light bg-opacity-80 shadow-lg px-6 py-4 my-6 text-lg md:text-xl grid grid-cols-1 gap-4">
        {menuNavigationItems.map((item, index) => (
          <MenuEntriesNavigation
            key={item}
            item={item as NavigationKey}
            hasBorder={index !== menuNavigationItems.length - 1}
          />
        ))}
      </div>

      <div className="rounded-2xl w-full bg-light bg-opacity-80 shadow-lg px-6 py-4 my-6 text-lg md:text-xl grid grid-cols-1 gap-4">
        <MenuEntriesSettings />
      </div>

      <div className="rounded-2xl w-full bg-light bg-opacity-80 shadow-lg px-6 py-0 my-6 text-lg md:text-xl">
        <MenuEntriesUtility />
      </div>
    </div>
  );
}
