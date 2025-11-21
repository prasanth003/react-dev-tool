import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group";
import { ArrowUpDown, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, Search } from "lucide-react";

import {
  type ColumnDef,
  type ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  type SortingState,
  useReactTable,
} from "@tanstack/react-table"

import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import type { ComponentData } from "@/shared/types";
import { formatDuration, timeAgo } from "@/shared/utility";

const columns: ColumnDef<ComponentData>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          className="text-[12px] font-mono"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Component Name
          <ArrowUpDown className="size-3" />
        </Button>
      )
    },
    cell: ({ row }) => (
      <div className="capitalize text-[12px] text-left pl-4 min-w-150 font-mono">{row.getValue("name")}</div>
    ),
  },
  {
    accessorKey: "renderCount",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          className="text-[12px] font-mono"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Render Count
          <ArrowUpDown className="size-3" />
        </Button>
      )
    },
    cell: ({ row }) => {
      const value = row.getValue("renderCount") as number
      const color =
        value > 100
          ? "text-red-500"
          : value > 50
            ? "text-orange-400"
            : "text-green-400"
      return (
        <div className={`text-[12px] text-left pl-4 font-medium font-mono ${color}`}>
          {value}
        </div>
      )
    }
  },
  {
    accessorKey: "totalRenderDuration",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          className="text-[12px] font-mono"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Render Duration
          <ArrowUpDown className="size-3" />
        </Button>
      )
    },
    cell: ({ row }) => {
      const duration = row.getValue("totalRenderDuration") as number
      const seconds = duration / 1000
      const color =
        seconds > 1
          ? "text-red-500"
          : seconds > 0.5
            ? "text-orange-400"
            : ""

      return (
        <div className={`text-[12px] text-left pl-4 font-mono font-medium ${color}`}>
          {formatDuration(duration)}
        </div>
      )
    },
  },
  {
    accessorKey: "averageRenderTime",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          className="text-[12px] font-mono"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Avg Time
          <ArrowUpDown className="size-3" />
        </Button>
      )
    },
    cell: ({ row }) => {
      const duration = row.getValue("averageRenderTime") as number
      return (
        <div className="text-[12px] text-left pl-4 font-mono font-medium">
          {formatDuration(duration)}
        </div>
      )
    },
  },
  {
    accessorKey: "slowestRender",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          className="text-[12px] font-mono"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Max Time
          <ArrowUpDown className="size-3" />
        </Button>
      )
    },
    cell: ({ row }) => {
      const duration = row.getValue("slowestRender") as number
      const seconds = duration / 1000
      const color =
        seconds > 1
          ? "text-red-500"
          : seconds > 0.5
            ? "text-orange-400"
            : ""

      return (
        <div className={`text-[12px] text-left pl-4 font-mono font-medium ${color}`}>
          {formatDuration(duration)}
        </div>
      )
    },
  },
  {
    accessorKey: "timestamp",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          className="text-[12px] font-mono"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Last Rendered
          <ArrowUpDown className="size-3" />
        </Button>
      )
    },
    cell: ({ row }) => {
      const ts = row.getValue("timestamp") as number
      return (
        <div className="text-[12px] text-left pl-4 font-mono text-muted-foreground">
          {timeAgo(ts)}
        </div>
      )
    },
  }
]

type Props = {
  data: ComponentData[];
  onHoverComponent?: (componentId: string | null) => void;
  onUnhoverComponent?: () => void;
}

export function ComponentTable({ data = [], onHoverComponent, onUnhoverComponent }: Props) {

  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])

  const handleMouseEnter = (id: string) => {
    onHoverComponent?.(id);
  };

  const handleMouseLeave = () => {
    onUnhoverComponent?.();
  };


  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    state: {
      sorting,
      columnFilters
    },
  });

  return (

    <>

      <div className="flex items-center justify-between border-b border-[#cccccc1f]  text-sm text-primary font-medium">

        <InputGroup className="font-mono border-0 text-[10px]">
          <InputGroupInput
            placeholder="Search component name..."
            className="text-[12px]"
            value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
            onChange={(e) => table.getColumn("name")?.setFilterValue(e.target.value)}
          />
          <InputGroupAddon>
            <Search className="size-3" />
          </InputGroupAddon>
          <InputGroupAddon align="inline-end">{table.getRowCount()} results</InputGroupAddon>
        </InputGroup>

      </div>

      <div className="h-[calc(100vh-170px)] min-h-36 overflow-y-auto overflow-x-hidden">

        <Table className="w-full border-collapse">

          <TableHeader className="sticky top-0 bg-background z-10 shadow-sm">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id} className="bg-background">
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>

          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  onMouseEnter={() => handleMouseEnter(row.id)}
                  onMouseLeave={() => handleMouseLeave()}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell
                      key={cell.id}
                      className="text-[12px] whitespace-nowrap"
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center text-muted-foreground"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>

      </div>

      <div className="flex items-center justify-end space-x-2 py-2 border-t border-[#cccccc1f]">
        <div className="flex-1 text-xs text-muted-foreground pl-2">
          Page {table.getState().pagination.pageIndex + 1} of{" "}
          {table.getPageCount()}
        </div>
        <div className="space-x-1 pr-2">
          <Button
            variant="outline"
            className="h-8 w-8 p-0"
            onClick={() => table.setPageIndex(0)}
            disabled={!table.getCanPreviousPage()}
          >
            <span className="sr-only">Go to first page</span>
            <ChevronsLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            className="h-8 w-8 p-0"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            <span className="sr-only">Go to previous page</span>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            className="h-8 w-8 p-0"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            <span className="sr-only">Go to next page</span>
            <ChevronRight className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            className="h-8 w-8 p-0"
            onClick={() => table.setPageIndex(table.getPageCount() - 1)}
            disabled={!table.getCanNextPage()}
          >
            <span className="sr-only">Go to last page</span>
            <ChevronsRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

    </>

  );
}
