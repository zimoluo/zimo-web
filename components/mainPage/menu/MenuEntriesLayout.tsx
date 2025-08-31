import MenuEntriesNavigation from "./MenuEntriesNavigation";
import MenuEntriesSettings from "./MenuEntriesSettings";
import MenuEntriesUser from "./MenuEntriesUser";
import MenuEntriesUtility from "./MenuEntriesUtility";

export const menuNavigationItems = [
  "home",
  "photos",
  "blog",
  "projects",
  "about",
  "design",
  "themeMaker",
  "notebook",
  "management",
];

export default function MenuEntriesLayout() {
  return (
    <div className="h-full w-full overflow-y-auto p-4 rounded-[2rem]">
      <div className="rounded-full w-full bg-light bg-opacity-65 shadow-lg px-2 py-2 mt-8 flex items-center backdrop-blur-sm">
        <MenuEntriesUser />
      </div>

      <div className="rounded-3xl w-full bg-light bg-opacity-65 shadow-lg backdrop-blur-sm px-6 py-4 mt-12 text-lg grid grid-cols-1 gap-4">
        {menuNavigationItems.map((item, index) => (
          <MenuEntriesNavigation
            key={item}
            item={item as NavigationKey}
            hasBorder={index !== menuNavigationItems.length - 1}
          />
        ))}
      </div>

      <div className="rounded-3xl w-full bg-light bg-opacity-65 shadow-lg backdrop-blur-sm px-6 pt-4 pb-6 mt-6 text-lg grid grid-cols-1 gap-4">
        <MenuEntriesSettings />
      </div>

      <div className="rounded-3xl w-full bg-light bg-opacity-65 shadow-lg backdrop-blur-sm px-6 py-0 mt-6 text-lg">
        <MenuEntriesUtility />
      </div>
    </div>
  );
}
