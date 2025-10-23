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
    <div className="h-full w-full overflow-y-auto pr-4 pl-[clamp(1rem,calc(100vw-488px),2rem)] pb-9 select-none">
      <div className="rounded-full w-full bg-light bg-opacity-80 shadow-xl p-2 mt-14 mb-8 flex items-center h-16 border border-highlight-light border-opacity-15">
        <MenuEntriesUser />
      </div>

      <div className="rounded-[2rem] w-full bg-light bg-opacity-80 shadow-xl px-6 py-4 mb-4 text-lg grid grid-cols-2 gap-4 border border-highlight-light border-opacity-15">
        {menuNavigationItems.map((item, index) => (
          <MenuEntriesNavigation
            key={item}
            item={item as NavigationKey}
            hasBorder={false}
          />
        ))}
      </div>

      <MenuEntriesSettings cornerRadius="2rem" />

      <div className="rounded-[2rem] w-full bg-light bg-opacity-80 shadow-xl px-6 py-0 text-lg border border-highlight-light border-opacity-15">
        <MenuEntriesUtility />
      </div>
    </div>
  );
}
