import MenuEntriesNavigation from "./MenuEntriesNavigation";
import MenuEntriesSettings from "./MenuEntriesSettings";
import MenuEntriesUser from "./MenuEntriesUser";
import MenuEntriesUtility from "./MenuEntriesUtility";

export default function MenuEntriesLayout() {
  return (
    <div className="h-full w-full overflow-y-auto px-6 md:px-8 py-8">
      <div className="rounded-full w-full bg-widget-40 shadow-lg px-4 py-4 mt-6 mb-14 border-primary border-0.8 border-opacity-20 flex items-center">
        <MenuEntriesUser />
      </div>
      <div className="rounded-2xl w-full bg-widget-40 shadow-lg px-6 py-0 my-6 text-lg md:text-xl border-primary border-0.8 border-opacity-20">
        {[
          "home",
          "photos",
          "blog",
          "projects",
          "about",
          "management",
          "design",
        ].map((item) => (
          <MenuEntriesNavigation key={item} item={item as NavigationKey} />
        ))}
      </div>

      <div className="rounded-2xl w-full bg-widget-40 shadow-lg px-6 py-0 my-6 text-lg md:text-xl border-primary border-0.8 border-opacity-20">
        <MenuEntriesSettings />
      </div>

      <div className="rounded-2xl w-full bg-widget-40 shadow-lg px-6 py-0 my-6 text-lg md:text-xl border-primary border-0.8 border-opacity-20">
        <MenuEntriesUtility />
      </div>
    </div>
  );
}
