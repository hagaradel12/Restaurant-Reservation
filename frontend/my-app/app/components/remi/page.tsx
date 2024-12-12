import Link from "next/link"; 
import React from "react";
import Image from "next/image"
const Remi = () => {
  return ( 
    <div><Image
    src="/img/remi.png" 
    alt="Restaurant Logo"
    width={128} 
    height={128} 
    className="w-32 h-auto mb-4 "
  />
      </div>
  );
};
export default Remi;