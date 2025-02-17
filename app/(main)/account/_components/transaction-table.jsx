"use client";

import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { categoryColors } from "@/data/category";
import { format } from "date-fns";
import { Clock, RefreshCcw } from "lucide-react";



const RECURRING_INTERVALS = {
  DAILY: "Daily",
  WEEKLY: "Weekly",
  MONTHLY: "Monthly",
  YEARLY: "Yearly",
};

export function TransactionTable({ transactions }) {
  const filteredAndSortedTransactions = transactions;
  const handleSort = () => {};

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[50px]">
              <Checkbox />
            </TableHead>
            <TableHead
              className="cursor-pointer"
              onClick={() => handleSort("date")}
            >
              <div className="flex items-center">Date</div>
            </TableHead>
            <TableHead>Description</TableHead>
            <TableHead
              className="cursor-pointer"
              onClick={() => handleSort("category")}
            >
              <div className="flex items-center">Category</div>
            </TableHead>
            <TableHead
              className="cursor-pointer text-right"
              onClick={() => handleSort("amount")}
            >
              <div className="flex items-center justify-end">Amount</div>
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
                  <Checkbox />
                </TableCell>
                <TableCell>{format(new Date(transaction.date), "PP")}</TableCell>
                <TableCell>{transaction.description}</TableCell>
                <TableCell className="capitalize">
                  <span style={{ 
                    background: categoryColors[transaction.category],
                    color: "white",
                   }}
                   className="px-2 py-1 rounded-md text-sm"
                   >
                  {transaction.category}
                  </span>
                </TableCell>
                <TableCell className="text-right font-medium"
                style={{
                  color: transaction.type === "EXPENSE" ? "red" : "green",
                }}
                >
                  {transaction.type === "EXPENSE" ? "-" : "+"}$
                  {transaction.amount.toFixed(2)}</TableCell>
                <TableCell className="text-left">
                  {transaction.isRecurring ? (
                    <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger>
                      <Badge variant="outline" className="gap-1 bg-purple-100 text-purple-700 hover:bg-purple-200">
                      <RefreshCcw className="w-4 h-4" />
                      {RECURRING_INTERVALS[transaction.recurringInterval]}
                      </Badge>
                      </TooltipTrigger>
                      <TooltipContent>
                        <div className="text-sm">
                          <div className="font-medium">
                            Next Date
                          </div>
                          <div>
                            {format(new Date(transaction.nextRecurringDate), "PP")}
                          </div>
                        </div>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                  ) : (
                    <Badge variant="outline" className="gap-1">
                      <Clock className="w-4 h-4" />
                      One-Time</Badge>
                  )}</TableCell>
                <TableCell />
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
