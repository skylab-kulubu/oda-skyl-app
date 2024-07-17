import React from 'react'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHouse
} from "@fortawesome/free-solid-svg-icons";

export default function Navigator() {
  return (
    <div>
    
    <a
      href="http://yildizskylab.com"
      className="absolute p-8 tracking-[0.25rem] text-xl sm:-rotate-90 left-0 sm:left-6 sm:top-11 top-2 font-bebasNeue text-[#eadaff] hover:text-[#27a68e] transition-colors duration-300 "
    >
      SKY LAB
    </a>

  <a href='/' className="block sm:hidden absolute right-0 top-2 p-8 text-[#eadaff] text-2xl">
  <FontAwesomeIcon icon={faHouse} />
  </a>

    <a
      href="/"
      className="absolute p-10 cursor-pointer tracking-[0.25rem] text-xl -rotate-90 left-0 bottom-16 font-bebasNeue text-[#eadaff] hover:text-[#27a68e] transition-colors duration-300  hidden sm:block"
    >
      ANA SAYFA
    </a>
    
    </div>
  )
}
