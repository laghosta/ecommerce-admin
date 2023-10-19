"use client";
import React, { useState } from "react";
import { BillboardColumn } from "@/app/(dashboard)/[storeId]/(routes)/billboards/components/columns";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Copy, Edit, MoreHorizontal, Trash } from "lucide-react";
import toast from "react-hot-toast";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";
import AlertModal from "@/components/modals/alert-modal";
import { SizeColumn } from "@/app/(dashboard)/[storeId]/(routes)/sizes/components/columns";
import { ColorColumn } from "@/app/(dashboard)/[storeId]/(routes)/colors/components/columns";

interface CellActionProps {
  data: ColorColumn;
}

const CellAction: React.FC<CellActionProps> = ({ data }) => {
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const params = useParams();
  const onCopy = () => {
    navigator.clipboard.writeText(data.id);
    toast.success("Size Id copied to clipboard! ");
  };

  const onUpdate = () => {
    router.push(`/${params.storeId}/colors/${data.id}`);
  };

  const onDelete = async () => {
    try {
      setLoading(true);
      await axios.delete(`/api/${params.storeId}/colors/${data.id}`);
      router.refresh();
      toast.success("Color deleted successfully!");
    } catch (err) {
      console.log(err);
      toast.error("Something went wrong!");
    } finally {
      setLoading(false);
      setOpen(false);
    }
  };

  return (
    <>
      <AlertModal
        isOpen={open}
        onClose={() => setOpen(false)}
        loading={loading}
        onConfirm={onDelete}
      />
      <DropdownMenu>
        <DropdownMenuTrigger disabled={loading} asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="w-4 h-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuItem
            disabled={loading}
            onClick={onCopy}
            className="cursor-pointer"
          >
            <Copy className="mr-2 h-4 w-4" />
            Copy Id
          </DropdownMenuItem>
          <DropdownMenuItem
            disabled={loading}
            onClick={onUpdate}
            className="cursor-pointer"
          >
            <Edit className="mr-2 h-4 w-4" />
            Update
          </DropdownMenuItem>
          <DropdownMenuItem
            disabled={loading}
            onClick={() => setOpen(true)}
            className="cursor-pointer"
          >
            <Trash className="mr-2 h-4 w-4" />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};

export default CellAction;
