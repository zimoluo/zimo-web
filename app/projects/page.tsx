import HeaderText from "@/components/mainPage/HeaderText";

export default async function ProjectsPage() {
  return (
    <>
      <HeaderText
        title="Machina et Artes, Manus Dei Hominum."
        subtitle="Light emits from the power of creation."
      />
    </>
  );
}

export const revalidate = 24;
