"use client";

import { bulkDeleteTransactions } from "@/actions/accounts";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { categoryColors } from "@/data/category";
import useFetch from "@/hooks/use-fetch";
import { format } from "date-fns";
import {
  ChevronDown,
  ChevronUp,
  Clock,
  MoreHorizontal,
  RefreshCcw,
  Search,
  Trash,
  X,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useMemo } from "react";
import { useState } from "react";
import { BarLoader } from "react-spinners";
import { toast } from "sonner";

const RECURRING_INTERVALS = {
  DAILY: "Daily",
  WEEKLY: "Weekly",
  MONTHLY: "Monthly",
  YEARLY: "Yearly",
};

export function TransactionTable({ transactions }) {
  const router = useRouter();
  const [selectIds, setSelectIds] = useState([]);
  const [sortConfig, setSortConfig] = useState({
    feild: "date",
    direction: "desc",
  });


  const handleSort = (feild) => {
    setSortConfig({
      feild,
      direction:
        sortConfig.feild === feild
          ? sortConfig.direction === "asc"
            ? "desc"
            : "asc"
          : "desc",
    });
  };

  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [recuringFilter, setRecuringFilter] = useState("");

  const {
    loading:deleteLoading,
    fn:deleteFn,
    data:deleted,
  } = useFetch(bulkDeleteTransactions);




  const filteredAndSortedTransactions = useMemo(() => {
    let result = [...transactions];

    // apply search filter
    if(search){
      const searchLower = search.toLowerCase();
      result = result.filter((transactions) => transactions.description?.toLowerCase().includes(searchLower))
    }

    // apply recurring filter 
    if(recuringFilter){
      result = result.filter((transaction) => {
        if (recuringFilter === "recurring") return transaction.isRecurring;
        return !transaction.isRecurring;
      });
    }


    // apply type filter
    if(typeFilter){
      result = result.filter((transaction) => transaction.type === typeFilter)
    }


    // apply sorting
    result.sort((a,b) => {
      let comparision = 0

      switch (sortConfig.feild){
        case "date":
          comparision= new Date(a.date) - new Date(b.date);
          break;

        case "amount":
          comparision = a.amount - b.amount;
          break;
        default:
          comparision = 0
      }
      return sortConfig.direction === "asc" ? comparision : -comparision
    })




    return result

  }, [transactions,search,typeFilter,recuringFilter,sortConfig])





  const handleSelect = (id) => {
    if (selectIds.includes(id)) {
      setSelectIds(selectIds.filter((item) => item !== id));
    } else {
      setSelectIds([...selectIds, id]);
    }
  };

  const handleSelectAll = () => {
    if (selectIds.length === transactions.length) {
      setSelectIds([]);
    } else {
      setSelectIds(transactions.map((item) => item.id));
    }
  };

  const handleBulkDelete = async () => {
    if (
      !window.confirm(
        "Are you sure you want to delete these transactions?")
      ) {
      return;
    }

    deleteFn(selectIds);
  };
  

 useEffect(() => {
  if (deleted && !deleteLoading) {
    toast.success("Transactions deleted successfully");
    router.refresh();  // Ensure UI updates
  }
}, [deleted, deleteLoading]);


 const handleClearFilters = () => {
    setSearch("");
    setTypeFilter("");
    setRecuringFilter("");
    setSelectIds([]);
  };

  return (
    <section className=" max-w-7xl mx-auto space-y-4">
      {
        deleteLoading && (
          <BarLoader className="mt-4" width={"100%"} color="#9333ea" />
        )
      }
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            className="pl-8"
            placeholder="Search Transaction.."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="flex gap-2">
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger>
              <SelectValue placeholder="All Types" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="INCOME">Income</SelectItem>
              <SelectItem value="EXPENSE">Expense</SelectItem>
            </SelectContent>
          </Select>


          <Select value={recuringFilter} onValueChange={(value) => setRecuringFilter(value)}>
            <SelectTrigger className="w-[190px]">
              <SelectValue placeholder="All Transactions" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="recurring">Recurring Only</SelectItem>
              <SelectItem value="non-recurring">Non-Recurring Only</SelectItem>
            </SelectContent>
          </Select>



          {
            selectIds.length > 0 && (
              <div className="flex items-center gap-2">
              <Button variant="destructive" size="sm" onClick={handleBulkDelete}>
                <Trash className="mr-2 h-4 w-4"/>
                Delete ({selectIds.length})
              </Button>
            </div>
            )
          }

          {
            (search || typeFilter || recuringFilter) && (
              <Button size="sm" onClick={handleClearFilters} title="Clear Filters">
                <X className="h-4 w-4"/>
              </Button>
            )
          }
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[50px]">
                <Checkbox
                  checked={selectIds.length === transactions.length}
                  onCheckedChange={handleSelectAll}
                />
              </TableHead>
              <TableHead
                className="cursor-pointer"
                onClick={() => handleSort("date")}
              >
                <div className="flex items-center">
                  Date{" "}
                  {sortConfig.feild === "date" &&
                  sortConfig.direction === "asc" ? (
                    <ChevronUp className="ml-2 h-4 w-4" />
                  ) : (
                    <ChevronDown className="ml-2 h-4 w-4" />
                  )}
                </div>
              </TableHead>
              <TableHead>Description</TableHead>
              <TableHead
                className="cursor-pointer"
                onClick={() => handleSort("category")}
              >
                <div className="flex items-center">
                  Category{" "}
                  
                </div>
              </TableHead>
              <TableHead
                className="cursor-pointer text-right"
                onClick={() => handleSort("amount")}
              >
                <div className="flex items-center justify-end">
                  Amount{" "}
                  {sortConfig &&
                  sortConfig.feild === "amount" &&
                  sortConfig.direction === "asc" ? (
                    <ChevronUp className="ml-2 h-4 w-4" />
                  ) : (
                    <ChevronDown className="ml-2 h-4 w-4" />
                  )}
                </div>
              </TableHead>
              <TableHead>Recurring</TableHead>
              <TableHead className="w-[50px]" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredAndSortedTransactions.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="h-24 text-center">
                  No results.
                </TableCell>
              </TableRow>
            ) : (
              filteredAndSortedTransactions.map((transaction) => (
                <TableRow key={transaction.id}>
                  <TableCell className="font-medium">
                    <Checkbox
                      onCheckedChange={() => handleSelect(transaction.id)}
                      checked={selectIds.includes(transaction.id)}
                    />
                  </TableCell>
                  <TableCell>
                    {format(new Date(transaction.date), "PP")}
                  </TableCell>
                  <TableCell>{transaction.description}</TableCell>
                  <TableCell className="capitalize">
                    <span
                      style={{
                        background: categoryColors[transaction.category],
                        color: "white",
                      }}
                      className="px-2 py-1 rounded-md text-sm"
                    >
                      {transaction.category}
                    </span>
                  </TableCell>
                  <TableCell
                    className="text-right font-medium"
                    style={{
                      color: transaction.type === "EXPENSE" ? "red" : "green",
                    }}
                  >
                    {transaction.type === "EXPENSE" ? "-" : "+"}$
                    {transaction.amount.toFixed(2)}
                  </TableCell>
                  <TableCell className="text-left">
                    {transaction.isRecurring ? (
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger>
                            <Badge
                              variant="outline"
                              className="gap-1 bg-purple-100 text-purple-700 hover:bg-purple-200"
                            >
                              <RefreshCcw className="w-4 h-4" />
                              {
                                RECURRING_INTERVALS[
                                  transaction.recurringInterval
                                ]
                              }
                            </Badge>
                          </TooltipTrigger>
                          <TooltipContent>
                            <div className="text-sm">
                              <div className="font-medium">Next Date</div>
                              <div>
                                {format(
                                  new Date(transaction.nextRecurringDate),
                                  "PP"
                                )}
                              </div>
                            </div>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    ) : (
                      <Badge variant="outline" className="gap-1">
                        <Clock className="w-4 h-4" />
                        One-Time
                      </Badge>
                    )}
                  </TableCell>

                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="w-8 h-8 p-0">
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <DropdownMenuItem
                          className="cursor-pointer"
                          onClick={() => {
                            router.push(
                              `/transaction/create?edit=${transaction.id}`
                            );
                          }}
                        >
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          className="text-red-600 cursor-pointer"
                          onClick={() => deleteFn([transaction.id])}
                        >
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </section>
  );
}
