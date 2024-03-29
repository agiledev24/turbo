"use client";
import { createUser, getUserCredits } from "@/lib/dynamodb";
import { useUserCreditsStore } from "@/lib/store";
import { usePrivy } from "@privy-io/react-auth";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarTrigger,
} from "./ui/menubar";

const NavBar: React.FC = () => {
  const { user, logout } = usePrivy();
  const router = useRouter();
  const pathname = usePathname();
  const {
    userImageCredits,
    userVideoCredits,
    setUserImageCredits,
    setUserVideoCredits,
  } = useUserCreditsStore();

  const handleLogout = async () => {
    await logout();
  };

  const handleHomeClick = async () => {
    console.log(pathname);
    if (pathname === "/") {
      router.refresh();
    } else {
      router.push("/");
    }
  };

  useEffect(() => {
    if (user) {
      const fetchUserCredits = async () => {
        await createUser(user.id);
        const res = await getUserCredits(user.id);
        await setUserImageCredits(res?.imageCredits);
        await setUserVideoCredits(res?.videoCredits);
      };
      fetchUserCredits();
    }
  }, [user]);

  return (
    <div className="w-full">
      <nav className="flex flex-col items-center justify-between px-4 mb-28 sm:flex-row">
        {user && <h1 className="mb-4 text-lg font-bold sm:mb-0">VPM ⚡️</h1>}

        <div className="flex flex-col gap-4 mx-auto sm:flex-row sm:items-center sm:gap-8">
          {user ? (
            <div className="gap-4 sm:flex sm:flex-row sm:items-center md:pr-[62px]">
              <Menubar>
                <MenubarMenu>
                  <MenubarTrigger onClick={handleHomeClick}>
                    Home
                  </MenubarTrigger>
                </MenubarMenu>

                <MenubarMenu>
                  <MenubarTrigger>
                    <Link href={`/gallery`}>My Gallery</Link>
                  </MenubarTrigger>
                </MenubarMenu>

                <MenubarMenu>
                  <MenubarTrigger>Profile</MenubarTrigger>
                  <MenubarContent>
                    <div className="text-sm text-muted-foreground px-2 py-1.5 flex justify-between w-full">
                      <div>Your image credits</div>
                      <div>{userImageCredits}</div>
                    </div>
                    <div className="text-sm text-muted-foreground px-2 py-1.5 flex justify-between w-full">
                      <div>Your video credits</div>
                      <div>{userVideoCredits}</div>
                    </div>
                    <MenubarItem
                      onClick={() =>
                        router.push(
                          process.env.NEXT_PUBLIC_CREDIT_PAYMENT_GATEWAY_URL!
                        )
                      }
                    >
                      Buy More Credits
                    </MenubarItem>

                    <MenubarSeparator />
                    <MenubarItem onClick={handleLogout}>Logout</MenubarItem>
                  </MenubarContent>
                </MenubarMenu>
              </Menubar>
            </div>
          ) : (
            <div className="text-5xl">⚡️</div>
          )}
        </div>
      </nav>
    </div>
  );
};

export default NavBar;