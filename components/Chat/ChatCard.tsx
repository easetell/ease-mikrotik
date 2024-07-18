import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useUser } from "@clerk/nextjs";

const ChatCard = () => {
  const [users, setUsers] = useState<any[]>([]);
  const { user } = useUser();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch("/api/users");
        const data = await response.json();
        setUsers(data);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchUsers();
  }, []);

  return (
    <div className="col-span-12 rounded-[10px] bg-white py-6 shadow-1 dark:bg-gray-dark dark:shadow-card xl:col-span-4">
      <h4 className="mb-5.5 px-7.5 text-body-2xlg font-bold text-dark dark:text-white">
        Users
      </h4>

      <div>
        {users.map((user) => (
          <Link
            href={`/chat/${user.id}`}
            key={user.id}
            className="flex items-center gap-4.5 px-7.5 py-3 hover:bg-gray-1 dark:hover:bg-dark-2"
          >
            <div className="relative h-14 w-14 rounded-full">
              <Image
                width={56}
                height={56}
                src={user.imageUrl || "/images/user/default.png"}
                alt="User"
                style={{ width: "auto", height: "auto" }}
                className="relative h-14 w-14 rounded-full"
              />
              <span
                className={`absolute bottom-0 right-0 h-3.5 w-3.5 rounded-full border-2 border-white dark:border-dark-2 ${user.lastActiveAt ? "bg-green" : "bg-red-light"}`}
              ></span>
            </div>

            <div className="flex flex-1 items-center justify-between">
              <div>
                <h5 className="font-medium text-dark dark:text-white">
                  {user.firstName} {user.lastName}
                </h5>
                <p className="text-dark-3 dark:text-dark-6">{user.email}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default ChatCard;
