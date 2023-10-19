import prismadb from "@/lib/prismadb";
import SizeForm from "./components/size-form";

const ColorPage = async ({ params }: { params: { colorId: string } }) => {
  let color;
  try {
    color = await prismadb.color.findUnique({
      where: {
        id: params.colorId,
      },
    });
  } catch (err) {
    console.log(err);
    color = null;
  }

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <SizeForm initialData={color} />
      </div>
    </div>
  );
};

export default ColorPage;
