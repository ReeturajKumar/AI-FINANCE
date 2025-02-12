"use client";

import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "../ui/drawer";
import { accountSchema } from "@/app/lib/schema";
import Input_ from "postcss/lib/input";
import { Input } from "../ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Switch } from "../ui/switch";

const CreateAccountDrawer = ({ children }) => {
  const [open, setOpen] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset,
  } = useForm({
    resolver: zodResolver(accountSchema),
    defaultValues: {
      name: "",
      type: "CURRENT",
      balance: "",
      isDefault: false,
    },
  });

  // const {
  //   loading: createAccountLoading,
  //   fn: createAccountFn,
  //   error,
  //   data: newAccount,
  // } = useFetch(createAccount);

  // const onSubmit = async (data) => {
  //   await createAccountFn(data);
  // };

  // useEffect(() => {
  //   if (newAccount) {
  //     toast.success("Account created successfully");
  //     reset();
  //     setOpen(false);
  //   }
  // }, [newAccount, reset]);

  // useEffect(() => {
  //   if (error) {
  //     toast.error(error.message || "Failed to create account");
  //   }
  // }, [error]);
  return (
    <Drawer>
      <DrawerTrigger>{children}</DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Create Account</DrawerTitle>
        </DrawerHeader>

        <div className="px-4 pb-4">
          <form className="space-y-4">
            <div className="space-y-2">
              <label
                htmlFor="name"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Account Name
              </label>
              <Input
                id="name"
                placeholder="e.g., Main Checking"
                {...register("name")}
              />
              {errors.name && (
                <p className="text-sm text-red-500">{errors.name.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <label
                htmlFor="type"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Account TYpe
              </label>
              <Select
                onValueChange={(value) => {
                  setValue("type", value);
                }}
                defaultValue={watch("type") || "CURRENT"}
              >
                <SelectTrigger id="type">
                  <SelectValue placeholder="Select Account Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="light">Current</SelectItem>
                  <SelectItem value="dark">Saving</SelectItem>
                </SelectContent>
              </Select>

              {errors.type && (
                <p className="text-sm text-red-500">{errors.type.message}</p>
              )}
            </div>


            <div className="space-y-2">
              <label
                htmlFor="balance"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Initial Balance
              </label>
              <Input  
                id="balance"
                type="number"
                step="0.01"
                placeholder="0.00"
                {...register("balance")}
              />
              {errors.balance && (
                <p className="text-sm text-red-500">{errors.balance.message}</p>
              )}
            </div>


            <div className="flex items-center space-x-2 justify-between rounded-lg border p-3">
             <div>
             <label
                htmlFor="isDefault"
                className="text-sm font-medium cursor-pointer"
              >
               Set as Default
              </label>
              <p className="text-sm text-muted-foreground">This account will be the default account for all transactions</p>
             </div>
              <Switch id="isDefault"
              onCheckedChange={(checked) => {
                setValue("isDefault", checked);
              }}
              checked={watch("isDefault")}
              />
            </div>
          </form>
        </div>
      </DrawerContent>
    </Drawer>
  );
};

export default CreateAccountDrawer;
