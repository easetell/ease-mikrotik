import React from "react";
import Link from "next/link";
import Image from "next/image";

const HeaderTitle = () => {
  return (
    <>
      <div className="hidden xl:block">
        <div>
          <Link className="block flex-shrink-0 lg:hidden" href="/">
            <Image
              className="h-6 w-6 rounded-md"
              width={400}
              height={400}
              src="/images/logo/trans-2.png"
              alt="Logo"
            />
          </Link>
        </div>
      </div>
    </>
  );
};

export default HeaderTitle;
