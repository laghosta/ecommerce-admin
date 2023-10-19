import prismadb from "@/lib/prismadb";
import CategoryForm from "./components/category-form";

const CategoryPage = async ({
  params,
}: {
  params: { storeId: string; categoryId: string };
}) => {
  let category;
  try {
    category = await prismadb.category.findUnique({
      where: {
        id: params.categoryId,
      },
    });
  } catch (err) {
    console.log(err);
    category = null;
  }

  const billboards = await prismadb.billboard.findMany({
    where: {
      storeId: params.storeId,
    },
  });

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <CategoryForm billboards={billboards} initialData={category} />
      </div>
    </div>
  );
};

export default CategoryPage;
